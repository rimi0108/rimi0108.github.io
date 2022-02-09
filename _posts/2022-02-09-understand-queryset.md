---
title: "[Django] QuerySet 이해하기 - Lazy Loading, evaluated, Caching"
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

## 💤 QuerySet은 게으르다 (Lazy Loading)

```python
# models.py

from django.db import models

class Blog(models.Model):
    name = models.CharField(max_length=100)
    tagline = models.TextField()

    def __str__(self):
        return self.name
```

이런 모델을 만들어 데이터베이스에 `migrate` 했다고 가정해보자. 

```bash
>>> from blog.models import Blog
>>> blog = Blog.objects.filter(name="Beatles Blog")
>>> print(blog)
```

위와 같이 Blog 객체를 filtering 하는 Query문을 날린다면 database hits는 몇 번 일어날까? 정답은 `1번` 이다. 마지막 줄 `print(blog)` 에서만 db hits가 일어나는 것이다. *Django QuerySet*은 평가(evaluated)될 때까지 실제로 데이터베이스에 접근해 쿼리를 실행하지 않는다.

## ✔️ QuerySet이 평가(evaluated)되는 시점

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

## 📦 Caching and QuerySet

각 QuerySet에는 데이터베이스 접근을 최소화하기 위한 캐시가 포함되어 있다. 이 작동 방식을 이해하면 효율적인 코드를 작성할 수 있다.

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

---

_<참고>_

- [https://docs.djangoproject.com/en/4.0/topics/db/queries/#querysets-are-lazy](https://docs.djangoproject.com/en/4.0/topics/db/queries/#querysets-are-lazy)
- [https://docs.djangoproject.com/en/4.0/ref/models/querysets/#when-querysets-are-evaluated](https://docs.djangoproject.com/en/4.0/ref/models/querysets/#when-querysets-are-evaluated)
- [https://docs.djangoproject.com/en/4.0/topics/db/queries/#caching-and-querysets](https://docs.djangoproject.com/en/4.0/topics/db/queries/#caching-and-querysets)
