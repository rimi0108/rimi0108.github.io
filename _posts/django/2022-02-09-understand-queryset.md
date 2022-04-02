---
title: "📗 [Django] QuerySet 이해하기 - Lazy Loading, Caching, Eager Loading"
excerpt: "Django QuerySet에 대해 알아보자"

categories:
  - Django
tags:
  - [QuerySet, Django]

toc: true
toc_sticky: true

date: 2022-02-09
last_modified_at: 2022-02-09
---

## 💤 ORM은 게으르다 (Lazy Loading)

```python
# models.py

from django.db import models

class Blog(models.Model):
    name = models.CharField(max_length=100)
    tagline = models.TextField()

    def __str__(self):
        return self.name

class Author(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()

    def __str__(self):
        return self.name

class Entry(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE)
    headline = models.CharField(max_length=255)
    body_text = models.TextField()
    pub_date = models.DateField()
    mod_date = models.DateField(default=date.today)
    authors = models.ManyToManyField(Author)
    number_of_comments = models.IntegerField(default=0)
    number_of_pingbacks = models.IntegerField(default=0)
    rating = models.IntegerField(default=5)

    def __str__(self):
        return self.headline
```

이런 모델을 만들어 데이터베이스에 `migrate` 했다고 가정해보자. 

```bash
>>> from blog.models import Blog
>>> blog = Blog.objects.filter(name="Beatles Blog")
>>> print(blog)
```

위와 같이 Blog 객체를 filtering 하는 Query문을 날린다면 database hits는 몇 번 일어날까? 정답은 `1번` 이다. 마지막 줄 `print(blog)` 에서만 db hits가 일어나는 것이다. *Django ORM*은 QuerySet이 평가(evaluated)될 때까지 실제로 데이터베이스에 접근해 쿼리를 실행하지 않는다.

### QuerySet이 평가(evaluated)되는 시점

내부적으로, QuerySet은 데이터베이스에 hitting 되지 않고 필터링되고, 슬라이싱 될 수 있다. queryset을 평가하기 전까지 데이터베이스 활동은 실제로 수행되지 않는다.

### 어떨 때 queryset을 평가하는가?

- **반복 (Iteration)**

```python
for b in Blog.objects.all():
	print(b)
```

- **슬라이싱 (Slicing)**

```python
blogs = Blog.objects.all()[::2]
```

*step parameter*를 쓸 때 평가됨

- **Picking / Caching**
- **repr()**

```python
blogs = repr(Blog.objects.all())
```

- **len()**

```python
blogs = len(Blog.objects.all())
```

- **list()**

```python
blogs = list(Blog.objects.all())
```

- **bool()**

```python
if Blog.objects.filter(name="Rim's Blog"):
	print("This is Rim's blog!")
```

## 📦 Caching

각 QuerySet에는 데이터베이스 접근을 최소화하기 위한 **캐시**가 포함되어 있다. 이 작동 방식을 이해하면 효율적인 코드를 작성할 수 있다.

QuerySet이 처음 평가될 때, 데이터베이스 쿼리가 발생한다. Django는 쿼리의 결과를 캐시에 저장하고 요청된 결과를 반환한다. QuerySet의 다음 평가는 캐시에 저장된 결과를 **재사용**한다.

😈 **캐싱을 적용하지 않았을 때**

```python
for blog in Blog.objects.all(): # 데이터베이스 쿼리
    print(blog.name)

for blog in Blog.objects.all(): # 데이터베이스 다시 쿼리
    print(blog.tagline)
```

위 코드는 두 개의 QuerySet이 평가된다.

```python
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog"; args=(); alias=default
Beatles Blog
Rim's Blog
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog"; args=(); alias=default
All the latest Beatles news.
This is the Rim's blog.
```

이 때 캐싱을 이용하면 데이터베이스 쿼리문을 줄일 수 있다.

😇 **캐싱을 적용했을 때**

```python
blogs = Blog.objects.all() # 데이터베이스 쿼리

for blog in blogs: # 캐시 사용  
	print(blog.name)

for blog in blogs: # 캐시 사용
	print(blog.tagline)
```

```python
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog"; args=(); alias=default
Beatles Blog
Rim's Blog
All the latest Beatles news.
This is the Rim's blog.
```

위 처럼 queryset이 평가될 때 캐시에 query의 결과를 저장하기 때문에 쿼리문이 한 번만 날아가는 것을 확인할 수 있다.

### QuerySet이 캐시되지 않을 때

QuerySet이 항상 결과를 캐시하는 것은 아니다. slice나 index로 queryset을 제한하면 캐시가 되지 않는다.

```python
blogs = Blog.objects.all()

print(blogs[0]) # 데이터베이스 쿼리
print(blogs[0]) # 데이터베이스 다시 쿼리
```

```python
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog" LIMIT 1; args=(); alias=default
Beatles Blog
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog" LIMIT 1; args=(); alias=default
Beatles Blog
```

위처럼 queyset object에서 특정 인덱스를 반복적으로 가져오면 매번 데이터베이스를 쿼리한다.

```python
blogs = Blog.objects.all()

for blog in blogs: # 데이터베이스 쿼리
	print(blog)

print(blogs[0]) # 캐시 사용
print(blogs[0]) # 캐시 사용
```

```python
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog"; args=(); alias=default
Beatles Blog
Rim's Blog
Beatles Blog
Beatles Blog
```

그러나 위처럼 queryset이 이미 평가된 경우, 캐시를 사용할 수 있다.

## 🚅 EagerLoading (Reslove N+1 Problem)

ORM은 게으르기 때문에 기본적으로 Lazy Loading 전략을 택한다 😪. 하지만 **Eager Loading** 을 이용하면 즉시 데이터를 가져올 수 있다.

### N+1 Problem

```python
class ExampleView(View):
    def get(self, request):
        entrys = Entry.objects.all()

        blog_name_list = [entry.blog for entry in entrys]

        return HttpResponse(blog_name_list)
```

```python
(0.000) SELECT "blog_entry"."id", "blog_entry"."blog_id", "blog_entry"."headline", "blog_entry"."body_text", "blog_entry"."pub_date", "blog_entry"."mod_date", "blog_entry"."number_of_comments", "blog_entry"."number_of_pingbacks", "blog_entry"."rating" FROM "blog_entry"; args=(); alias=default
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog" WHERE "blog_blog"."id" = 2 LIMIT 21; args=(2,); alias=default
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog" WHERE "blog_blog"."id" = 2 LIMIT 21; args=(2,); alias=default
```

만약 Entry 모델의 모든 객체를 불러온 후 각 객체의 속성 blog를 가져오게 되면 blog는 Blog 모델과 Foreignkey를 통해서 연결된 속성이기 때문에 Blog 객체를 검사하는 query문이 *for문이 돌아갈 때마다 데이터베이스에 날아가게 된다*. 

이렇게 일일이 query문을 보내는 이유는 ORM의 특징인 Lazy Loading 때문이다. ORM은 Entry의 모든 객체를 검사하는 query문을 보내고 for 문 안에서 entry의 blog 정보를 찾는다. 하지만 첫번째 query문에서 원하는 정보를 찾지 못하면 다시 query문을 보내어 원하는 정보를 찾게된다. **ORM은 필요할 때마다 query문을 보내기 때문이다.** 

이 추가 query문은 객체를 검사할 때마다 날아가기 때문에 객체의 수가 늘어나면 더 많은 query문이 날아가게 된다.

```python
(0.000) SELECT "blog_entry"."id", "blog_entry"."blog_id", "blog_entry"."headline", "blog_entry"."body_text", "blog_entry"."pub_date", "blog_entry"."mod_date", "blog_entry"."number_of_comments", "blog_entry"."number_of_pingbacks", "blog_entry"."rating" FROM "blog_entry"; args=(); alias=default
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog" WHERE "blog_blog"."id" = 2 LIMIT 21; args=(2,); alias=default
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog" WHERE "blog_blog"."id" = 2 LIMIT 21; args=(2,); alias=default
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog" WHERE "blog_blog"."id" = 1 LIMIT 21; args=(1,); alias=default
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog" WHERE "blog_blog"."id" = 2 LIMIT 21; args=(2,); alias=default
```

위처럼 2개의 Entry 객체를 추가하여 넣었더니 두 개의 추가 query문이 더 생겨났다. 만약 100개, 1000개의 객체가 데이터베이스에 존재한다면, query문의 갯수도 똑같이 늘어나 서버 실행 속도는 느려질 것이다. 🤢

### QuerySet의 구성요소

```python
# 실제 django.db.models.query.py에 있는 QuerySet의 구성요소

from django.db.model.sql import Query # Query()는 개발자가 정의한 QuerySet을 읽어서 실제 SQL을 생성해주는 구현제이다. 

class QuerySet:
	query: Query = Query() # 메인 쿼리
	_result_cache: List[Dict[Any, Any]] = dict() # SQL의 수행결과를 여기 저장해놓고 재사용한다. (QuerySet Cache)
																							 # QuerySet 호출 시 이 프로퍼티에 저장된 데이터가 없으면 SQL을 호출해서 데이터를 가져온다.
	_prefetch_related_lookups: Tuple[str] = () # prefetch_related을 이 프로퍼티에 저장한다.
																						 # 추가 쿼리셋
```

위의 N+1 Problem에서 확인했던 것처럼 QuerySet은 1개의 쿼리와 0 ~ N개의 추가쿼리(셋)으로 구성되어 있다. 위는 실제 QuerySet이 작동하는 코드이다. 메인쿼리와 추가 쿼리셋으로 이루어져 있는 것을 볼 수 있다.

### ✔️ select_related() & prefetch_related()

Eager Loading을 수행하기 위한 옵션인 seleted_related와 prefetch_related에 대해 알아보자. 

**1) select_related()**

`select_related`는 join문을 통해서 데이터를 즉시 로딩한다. 위에서 수행한 `N+1 Problem`이 발생한 코드를 `select_related`를 통해서 추가 쿼리가 발생하지 않도록 수정을 할 수 있다.

```python
class BlogDetailView(View):
    def get(self, request):
        entrys = Entry.objects.all().select_related("blog")

        blog_name_list = [entry.blog for entry in entrys]

        return HttpResponse(blog_name_list)
```

```python
(0.000) SELECT "blog_entry"."id", "blog_entry"."blog_id", "blog_entry"."headline", "blog_entry"."body_text", "blog_entry"."pub_date", "blog_entry"."mod_date", "blog_entry"."number_of_comments", "blog_entry"."number_of_pingbacks", "blog_entry"."rating", "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_entry" INNER JOIN "blog_blog" ON ("blog_entry"."blog_id" = "blog_blog"."id"); args=(); alias=default
```

위와 같이 추가 쿼리가 발생했던 속성 blog를 `select_related`를 통해 가져오면 추가 쿼리가 발생하지 않는 것을 볼 수 있다. `INNER JOIN`을 사용하여 blog 테이블을 entry 테이블과 함께 불러와 추가 쿼리가 발생하지 않도록 해주는 것이다.

**2) prefetch_related()**

```python
class BlogDetailView(View):
    def get(self, request):
        entrys = Entry.objects.prefetch_related("blog").all()

        blog_name_list = [entry.blog for entry in entrys]

        return HttpResponse(blog_name_list)
```

```python
(0.000) SELECT "blog_entry"."id", "blog_entry"."blog_id", "blog_entry"."headline", "blog_entry"."body_text", "blog_entry"."pub_date", "blog_entry"."mod_date", "blog_entry"."number_of_comments", "blog_entry"."number_of_pingbacks", "blog_entry"."rating" FROM "blog_entry"; args=(); alias=default
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog" WHERE "blog_blog"."id" IN (1, 2); args=(1, 2); alias=default
```

`prefetch_related`를 사용하면 하나의 추가 쿼리문이 더 날아가게된다. 이렇게 `prefetch_related`는 추가 쿼리를 통해서 참조하고 있는 테이블의 정보를 전부 가져오게 된다.

### 🤔 그럼 select_related()와 prefetch_related 중 어떤 것을 쓰면 좋을까?

`select_related`는 `foreignkey` 및 1:1 관계에서 사용되도록 제한된다. 그에 반해 `prefetch_related`는 다대다 관계 관계에서 사용될 수 있다.

```python
class BlogMainView(View):
    def get(self, request, blog_id):
        blog = Blog.objects.get(id=blog_id)
        entrys = Entry.objects.filter(blog_id=blog_id)
        results = [
            {
                "blog_name": blog.name,
                "blog_tagline": blog.tagline,
                "entry": [
                    {
                        "headline": entry.headline,
                        "body_text": entry.body_text,
                        "authors": [
                            {"author": entry_author.name}
                            for entry_author in entry.authors.all()
                        ],
                    }
                    for entry in entrys
                ],
            }
        ]

        return JsonResponse({"result": results}, status=200)
```

```python
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog" WHERE "blog_blog"."id" = 1 LIMIT 21; args=(1,); alias=default
(0.000) SELECT "blog_entry"."id", "blog_entry"."blog_id", "blog_entry"."headline", "blog_entry"."body_text", "blog_entry"."pub_date", "blog_entry"."mod_date", "blog_entry"."number_of_comments", "blog_entry"."number_of_pingbacks", "blog_entry"."rating" FROM "blog_entry" WHERE "blog_entry"."blog_id" = 1; args=(1,); alias=default
(0.000) SELECT "blog_author"."id", "blog_author"."name", "blog_author"."email" FROM "blog_author" INNER JOIN "blog_entry_authors" ON ("blog_author"."id" = "blog_entry_authors"."author_id") WHERE "blog_entry_authors"."entry_id" = 1; args=(1,); alias=default
(0.000) SELECT "blog_author"."id", "blog_author"."name", "blog_author"."email" FROM "blog_author" INNER JOIN "blog_entry_authors" ON ("blog_author"."id" = "blog_entry_authors"."author_id") WHERE "blog_entry_authors"."entry_id" = 2; args=(2,); alias=default
(0.000) SELECT "blog_author"."id", "blog_author"."name", "blog_author"."email" FROM "blog_author" INNER JOIN "blog_entry_authors" ON ("blog_author"."id" = "blog_entry_authors"."author_id") WHERE "blog_entry_authors"."entry_id" = 3; args=(3,); alias=default
```

위 코드를 보면 추가 query가 발생해 `N+1 Problem` 이 발생하고 있다. 

```python
class BlogMainView(View):
    def get(self, request, blog_id):
        blog = Blog.objects.get(id=blog_id)
        entrys = Entry.objects.prefetch_related("authors").filter(blog_id=blog_id)
        results = [
            {
                "blog_name": blog.name,
                "blog_tagline": blog.tagline,
                "entry": [
                    {
                        "headline": entry.headline,
                        "body_text": entry.body_text,
                        "authors": [
                            {"author": entry_author.name}
                            for entry_author in entry.authors.all()
                        ],
                    }
                    for entry in entrys
                ],
            }
        ]

        return JsonResponse({"result": results}, status=200)
```

```python
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog" WHERE "blog_blog"."id" = 1 LIMIT 21; args=(1,); alias=default
(0.000) SELECT "blog_entry"."id", "blog_entry"."blog_id", "blog_entry"."headline", "blog_entry"."body_text", "blog_entry"."pub_date", "blog_entry"."mod_date", "blog_entry"."number_of_comments", "blog_entry"."number_of_pingbacks", "blog_entry"."rating" FROM "blog_entry" WHERE "blog_entry"."blog_id" = 1; args=(1,); alias=default
(0.000) SELECT ("blog_entry_authors"."entry_id") AS "_prefetch_related_val_entry_id", "blog_author"."id", "blog_author"."name", "blog_author"."email" FROM "blog_author" INNER JOIN "blog_entry_authors" ON ("blog_author"."id" = "blog_entry_authors"."author_id") WHERE "blog_entry_authors"."entry_id" IN (1, 2, 3); args=(1, 2, 3); alias=default
```

`prefetch_related` 를 사용하면 쿼리의 수를 줄일 수 있다. 하지만 여기서 `select_related` 를 사용하면 에러가 발생한다. `select_related` 는 다대다 관계에서 사용할 수 없기 때문이다.

 

*🙋🏻‍♀️ : 그래서 어떤걸 사용하라고요.*

😅 결론 : 일대일관계나 정참조 관계에서는 `select_related` 를 사용하고, 다대다관계나 역참조 관계에서는 `prefetch_related` 를 사용하자. 만약 `select_related` 를 사용할 수 있는 상황이라면, query의 수가 하나 더 줄어드니 왠만하면 `select_related` 를 사용하는 것이 좋다!

---

### <참고>

- [https://docs.djangoproject.com/en/4.0/topics/db/queries/#querysets-are-lazy](https://docs.djangoproject.com/en/4.0/topics/db/queries/#querysets-are-lazy)
- [https://docs.djangoproject.com/en/4.0/ref/models/querysets/#when-querysets-are-evaluated](https://docs.djangoproject.com/en/4.0/ref/models/querysets/#when-querysets-are-evaluated)
- [https://docs.djangoproject.com/en/4.0/topics/db/queries/#caching-and-querysets](https://docs.djangoproject.com/en/4.0/topics/db/queries/#caching-and-querysets)
- [https://www.youtube.com/watch?v=EZgLfDrUlrk&t=113s](https://www.youtube.com/watch?v=EZgLfDrUlrk&t=113s)