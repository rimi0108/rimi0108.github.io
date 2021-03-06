---
title: "๐ [Django] QuerySet ์ดํดํ๊ธฐ - Lazy Loading, Caching, Eager Loading"
excerpt: "Django QuerySet์ ๋ํด ์์๋ณด์"

categories:
  - Django
tags:
  - [QuerySet, Django]

toc: true
toc_sticky: true

date: 2022-02-09
last_modified_at: 2022-02-09
---

## ๐คย ORM์ ๊ฒ์ผ๋ฅด๋ค (Lazy Loading)

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

์ด๋ฐ ๋ชจ๋ธ์ ๋ง๋ค์ด ๋ฐ์ดํฐ๋ฒ ์ด์ค์ `migrate` ํ๋ค๊ณ  ๊ฐ์ ํด๋ณด์. 

```bash
>>> from blog.models import Blog
>>> blog = Blog.objects.filter(name="Beatles Blog")
>>> print(blog)
```

์์ ๊ฐ์ด Blog ๊ฐ์ฒด๋ฅผ filtering ํ๋ Query๋ฌธ์ ๋ ๋ฆฐ๋ค๋ฉด database hits๋ ๋ช ๋ฒ ์ผ์ด๋ ๊น? ์ ๋ต์ `1๋ฒ` ์ด๋ค. ๋ง์ง๋ง ์ค `print(blog)` ์์๋ง db hits๊ฐ ์ผ์ด๋๋ ๊ฒ์ด๋ค. *Django ORM*์ QuerySet์ด ํ๊ฐ(evaluated)๋  ๋๊น์ง ์ค์ ๋ก ๋ฐ์ดํฐ๋ฒ ์ด์ค์ ์ ๊ทผํด ์ฟผ๋ฆฌ๋ฅผ ์คํํ์ง ์๋๋ค.

### QuerySet์ด ํ๊ฐ(evaluated)๋๋ ์์ 

๋ด๋ถ์ ์ผ๋ก, QuerySet์ ๋ฐ์ดํฐ๋ฒ ์ด์ค์ hitting ๋์ง ์๊ณ  ํํฐ๋ง๋๊ณ , ์ฌ๋ผ์ด์ฑ ๋  ์ ์๋ค. queryset์ ํ๊ฐํ๊ธฐ ์ ๊น์ง ๋ฐ์ดํฐ๋ฒ ์ด์ค ํ๋์ ์ค์ ๋ก ์ํ๋์ง ์๋๋ค.

### ์ด๋จ ๋ queryset์ ํ๊ฐํ๋๊ฐ?

- **๋ฐ๋ณต (Iteration)**

```python
for b in Blog.objects.all():
	print(b)
```

- **์ฌ๋ผ์ด์ฑ (Slicing)**

```python
blogs = Blog.objects.all()[::2]
```

*step parameter*๋ฅผ ์ธ ๋ ํ๊ฐ๋จ

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

## ๐ฆย Caching

๊ฐ QuerySet์๋ ๋ฐ์ดํฐ๋ฒ ์ด์ค ์ ๊ทผ์ ์ต์ํํ๊ธฐ ์ํ **์บ์**๊ฐ ํฌํจ๋์ด ์๋ค. ์ด ์๋ ๋ฐฉ์์ ์ดํดํ๋ฉด ํจ์จ์ ์ธ ์ฝ๋๋ฅผ ์์ฑํ  ์ ์๋ค.

QuerySet์ด ์ฒ์ ํ๊ฐ๋  ๋, ๋ฐ์ดํฐ๋ฒ ์ด์ค ์ฟผ๋ฆฌ๊ฐ ๋ฐ์ํ๋ค. Django๋ ์ฟผ๋ฆฌ์ ๊ฒฐ๊ณผ๋ฅผ ์บ์์ ์ ์ฅํ๊ณ  ์์ฒญ๋ ๊ฒฐ๊ณผ๋ฅผ ๋ฐํํ๋ค. QuerySet์ ๋ค์ ํ๊ฐ๋ ์บ์์ ์ ์ฅ๋ ๊ฒฐ๊ณผ๋ฅผ **์ฌ์ฌ์ฉ**ํ๋ค.

๐ย **์บ์ฑ์ ์ ์ฉํ์ง ์์์ ๋**

```python
for blog in Blog.objects.all(): # ๋ฐ์ดํฐ๋ฒ ์ด์ค ์ฟผ๋ฆฌ
    print(blog.name)

for blog in Blog.objects.all(): # ๋ฐ์ดํฐ๋ฒ ์ด์ค ๋ค์ ์ฟผ๋ฆฌ
    print(blog.tagline)
```

์ ์ฝ๋๋ ๋ ๊ฐ์ QuerySet์ด ํ๊ฐ๋๋ค.

```python
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog"; args=(); alias=default
Beatles Blog
Rim's Blog
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog"; args=(); alias=default
All the latest Beatles news.
This is the Rim's blog.
```

์ด ๋ ์บ์ฑ์ ์ด์ฉํ๋ฉด ๋ฐ์ดํฐ๋ฒ ์ด์ค ์ฟผ๋ฆฌ๋ฌธ์ ์ค์ผ ์ ์๋ค.

๐ย **์บ์ฑ์ ์ ์ฉํ์ ๋**

```python
blogs = Blog.objects.all() # ๋ฐ์ดํฐ๋ฒ ์ด์ค ์ฟผ๋ฆฌ

for blog in blogs: # ์บ์ ์ฌ์ฉ  
	print(blog.name)

for blog in blogs: # ์บ์ ์ฌ์ฉ
	print(blog.tagline)
```

```python
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog"; args=(); alias=default
Beatles Blog
Rim's Blog
All the latest Beatles news.
This is the Rim's blog.
```

์ ์ฒ๋ผ queryset์ด ํ๊ฐ๋  ๋ ์บ์์ query์ ๊ฒฐ๊ณผ๋ฅผ ์ ์ฅํ๊ธฐ ๋๋ฌธ์ ์ฟผ๋ฆฌ๋ฌธ์ด ํ ๋ฒ๋ง ๋ ์๊ฐ๋ ๊ฒ์ ํ์ธํ  ์ ์๋ค.

### QuerySet์ด ์บ์๋์ง ์์ ๋

QuerySet์ด ํญ์ ๊ฒฐ๊ณผ๋ฅผ ์บ์ํ๋ ๊ฒ์ ์๋๋ค. slice๋ index๋ก queryset์ ์ ํํ๋ฉด ์บ์๊ฐ ๋์ง ์๋๋ค.

```python
blogs = Blog.objects.all()

print(blogs[0]) # ๋ฐ์ดํฐ๋ฒ ์ด์ค ์ฟผ๋ฆฌ
print(blogs[0]) # ๋ฐ์ดํฐ๋ฒ ์ด์ค ๋ค์ ์ฟผ๋ฆฌ
```

```python
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog" LIMIT 1; args=(); alias=default
Beatles Blog
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog" LIMIT 1; args=(); alias=default
Beatles Blog
```

์์ฒ๋ผ queyset object์์ ํน์  ์ธ๋ฑ์ค๋ฅผ ๋ฐ๋ณต์ ์ผ๋ก ๊ฐ์ ธ์ค๋ฉด ๋งค๋ฒ ๋ฐ์ดํฐ๋ฒ ์ด์ค๋ฅผ ์ฟผ๋ฆฌํ๋ค.

```python
blogs = Blog.objects.all()

for blog in blogs: # ๋ฐ์ดํฐ๋ฒ ์ด์ค ์ฟผ๋ฆฌ
	print(blog)

print(blogs[0]) # ์บ์ ์ฌ์ฉ
print(blogs[0]) # ์บ์ ์ฌ์ฉ
```

```python
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog"; args=(); alias=default
Beatles Blog
Rim's Blog
Beatles Blog
Beatles Blog
```

๊ทธ๋ฌ๋ ์์ฒ๋ผ queryset์ด ์ด๋ฏธ ํ๊ฐ๋ ๊ฒฝ์ฐ, ์บ์๋ฅผ ์ฌ์ฉํ  ์ ์๋ค.

## ๐ย EagerLoading (Reslove N+1 Problem)

ORM์ ๊ฒ์ผ๋ฅด๊ธฐ ๋๋ฌธ์ ๊ธฐ๋ณธ์ ์ผ๋ก Lazy Loading ์ ๋ต์ ํํ๋ค ๐ช. ํ์ง๋ง **Eager Loading** ์ ์ด์ฉํ๋ฉด ์ฆ์ ๋ฐ์ดํฐ๋ฅผ ๊ฐ์ ธ์ฌ ์ ์๋ค.

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

๋ง์ฝ Entry ๋ชจ๋ธ์ ๋ชจ๋  ๊ฐ์ฒด๋ฅผ ๋ถ๋ฌ์จ ํ ๊ฐ ๊ฐ์ฒด์ ์์ฑ blog๋ฅผ ๊ฐ์ ธ์ค๊ฒ ๋๋ฉด blog๋ Blog ๋ชจ๋ธ๊ณผ Foreignkey๋ฅผ ํตํด์ ์ฐ๊ฒฐ๋ ์์ฑ์ด๊ธฐ ๋๋ฌธ์ Blog ๊ฐ์ฒด๋ฅผ ๊ฒ์ฌํ๋ query๋ฌธ์ด *for๋ฌธ์ด ๋์๊ฐ ๋๋ง๋ค ๋ฐ์ดํฐ๋ฒ ์ด์ค์ ๋ ์๊ฐ๊ฒ ๋๋ค*. 

์ด๋ ๊ฒ ์ผ์ผ์ด query๋ฌธ์ ๋ณด๋ด๋ ์ด์ ๋ ORM์ ํน์ง์ธ Lazy Loading ๋๋ฌธ์ด๋ค. ORM์ Entry์ ๋ชจ๋  ๊ฐ์ฒด๋ฅผ ๊ฒ์ฌํ๋ query๋ฌธ์ ๋ณด๋ด๊ณ  for ๋ฌธ ์์์ entry์ blog ์ ๋ณด๋ฅผ ์ฐพ๋๋ค. ํ์ง๋ง ์ฒซ๋ฒ์งธ query๋ฌธ์์ ์ํ๋ ์ ๋ณด๋ฅผ ์ฐพ์ง ๋ชปํ๋ฉด ๋ค์ query๋ฌธ์ ๋ณด๋ด์ด ์ํ๋ ์ ๋ณด๋ฅผ ์ฐพ๊ฒ๋๋ค. **ORM์ ํ์ํ  ๋๋ง๋ค query๋ฌธ์ ๋ณด๋ด๊ธฐ ๋๋ฌธ์ด๋ค.** 

์ด ์ถ๊ฐ query๋ฌธ์ ๊ฐ์ฒด๋ฅผ ๊ฒ์ฌํ  ๋๋ง๋ค ๋ ์๊ฐ๊ธฐ ๋๋ฌธ์ ๊ฐ์ฒด์ ์๊ฐ ๋์ด๋๋ฉด ๋ ๋ง์ query๋ฌธ์ด ๋ ์๊ฐ๊ฒ ๋๋ค.

```python
(0.000) SELECT "blog_entry"."id", "blog_entry"."blog_id", "blog_entry"."headline", "blog_entry"."body_text", "blog_entry"."pub_date", "blog_entry"."mod_date", "blog_entry"."number_of_comments", "blog_entry"."number_of_pingbacks", "blog_entry"."rating" FROM "blog_entry"; args=(); alias=default
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog" WHERE "blog_blog"."id" = 2 LIMIT 21; args=(2,); alias=default
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog" WHERE "blog_blog"."id" = 2 LIMIT 21; args=(2,); alias=default
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog" WHERE "blog_blog"."id" = 1 LIMIT 21; args=(1,); alias=default
(0.000) SELECT "blog_blog"."id", "blog_blog"."name", "blog_blog"."tagline" FROM "blog_blog" WHERE "blog_blog"."id" = 2 LIMIT 21; args=(2,); alias=default
```

์์ฒ๋ผ 2๊ฐ์ Entry ๊ฐ์ฒด๋ฅผ ์ถ๊ฐํ์ฌ ๋ฃ์๋๋ ๋ ๊ฐ์ ์ถ๊ฐ query๋ฌธ์ด ๋ ์๊ฒจ๋ฌ๋ค. ๋ง์ฝ 100๊ฐ, 1000๊ฐ์ ๊ฐ์ฒด๊ฐ ๋ฐ์ดํฐ๋ฒ ์ด์ค์ ์กด์ฌํ๋ค๋ฉด, query๋ฌธ์ ๊ฐฏ์๋ ๋๊ฐ์ด ๋์ด๋ ์๋ฒ ์คํ ์๋๋ ๋๋ ค์ง ๊ฒ์ด๋ค. ๐คข

### QuerySet์ ๊ตฌ์ฑ์์

```python
# ์ค์  django.db.models.query.py์ ์๋ QuerySet์ ๊ตฌ์ฑ์์

from django.db.model.sql import Query # Query()๋ ๊ฐ๋ฐ์๊ฐ ์ ์ํ QuerySet์ ์ฝ์ด์ ์ค์  SQL์ ์์ฑํด์ฃผ๋ ๊ตฌํ์ ์ด๋ค. 

class QuerySet:
	query: Query = Query() # ๋ฉ์ธ ์ฟผ๋ฆฌ
	_result_cache: List[Dict[Any, Any]] = dict() # SQL์ ์ํ๊ฒฐ๊ณผ๋ฅผ ์ฌ๊ธฐ ์ ์ฅํด๋๊ณ  ์ฌ์ฌ์ฉํ๋ค. (QuerySet Cache)
																							 # QuerySet ํธ์ถ ์ ์ด ํ๋กํผํฐ์ ์ ์ฅ๋ ๋ฐ์ดํฐ๊ฐ ์์ผ๋ฉด SQL์ ํธ์ถํด์ ๋ฐ์ดํฐ๋ฅผ ๊ฐ์ ธ์จ๋ค.
	_prefetch_related_lookups: Tuple[str] = () # prefetch_related์ ์ด ํ๋กํผํฐ์ ์ ์ฅํ๋ค.
																						 # ์ถ๊ฐ ์ฟผ๋ฆฌ์
```

์์ N+1 Problem์์ ํ์ธํ๋ ๊ฒ์ฒ๋ผ QuerySet์ 1๊ฐ์ ์ฟผ๋ฆฌ์ 0 ~ N๊ฐ์ ์ถ๊ฐ์ฟผ๋ฆฌ(์)์ผ๋ก ๊ตฌ์ฑ๋์ด ์๋ค. ์๋ ์ค์  QuerySet์ด ์๋ํ๋ ์ฝ๋์ด๋ค. ๋ฉ์ธ์ฟผ๋ฆฌ์ ์ถ๊ฐ ์ฟผ๋ฆฌ์์ผ๋ก ์ด๋ฃจ์ด์ ธ ์๋ ๊ฒ์ ๋ณผ ์ ์๋ค.

### โ๏ธย select_related() & prefetch_related()

Eager Loading์ ์ํํ๊ธฐ ์ํ ์ต์์ธ seleted_related์ prefetch_related์ ๋ํด ์์๋ณด์. 

**1) select_related()**

`select_related`๋ join๋ฌธ์ ํตํด์ ๋ฐ์ดํฐ๋ฅผ ์ฆ์ ๋ก๋ฉํ๋ค. ์์์ ์ํํ `N+1 Problem`์ด ๋ฐ์ํ ์ฝ๋๋ฅผ `select_related`๋ฅผ ํตํด์ ์ถ๊ฐ ์ฟผ๋ฆฌ๊ฐ ๋ฐ์ํ์ง ์๋๋ก ์์ ์ ํ  ์ ์๋ค.

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

์์ ๊ฐ์ด ์ถ๊ฐ ์ฟผ๋ฆฌ๊ฐ ๋ฐ์ํ๋ ์์ฑ blog๋ฅผ `select_related`๋ฅผ ํตํด ๊ฐ์ ธ์ค๋ฉด ์ถ๊ฐ ์ฟผ๋ฆฌ๊ฐ ๋ฐ์ํ์ง ์๋ ๊ฒ์ ๋ณผ ์ ์๋ค. `INNER JOIN`์ ์ฌ์ฉํ์ฌ blog ํ์ด๋ธ์ entry ํ์ด๋ธ๊ณผ ํจ๊ป ๋ถ๋ฌ์ ์ถ๊ฐ ์ฟผ๋ฆฌ๊ฐ ๋ฐ์ํ์ง ์๋๋ก ํด์ฃผ๋ ๊ฒ์ด๋ค.

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

`prefetch_related`๋ฅผ ์ฌ์ฉํ๋ฉด ํ๋์ ์ถ๊ฐ ์ฟผ๋ฆฌ๋ฌธ์ด ๋ ๋ ์๊ฐ๊ฒ๋๋ค. ์ด๋ ๊ฒ `prefetch_related`๋ ์ถ๊ฐ ์ฟผ๋ฆฌ๋ฅผ ํตํด์ ์ฐธ์กฐํ๊ณ  ์๋ ํ์ด๋ธ์ ์ ๋ณด๋ฅผ ์ ๋ถ ๊ฐ์ ธ์ค๊ฒ ๋๋ค.

### ๐คย ๊ทธ๋ผ select_related()์ prefetch_related ์ค ์ด๋ค ๊ฒ์ ์ฐ๋ฉด ์ข์๊น?

`select_related`๋ `foreignkey` ๋ฐ 1:1 ๊ด๊ณ์์ ์ฌ์ฉ๋๋๋ก ์ ํ๋๋ค. ๊ทธ์ ๋ฐํด `prefetch_related`๋ ๋ค๋๋ค ๊ด๊ณ ๊ด๊ณ์์ ์ฌ์ฉ๋  ์ ์๋ค.

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

์ ์ฝ๋๋ฅผ ๋ณด๋ฉด ์ถ๊ฐ query๊ฐ ๋ฐ์ํด `N+1 Problem` ์ด ๋ฐ์ํ๊ณ  ์๋ค. 

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

`prefetch_related` ๋ฅผ ์ฌ์ฉํ๋ฉด ์ฟผ๋ฆฌ์ ์๋ฅผ ์ค์ผ ์ ์๋ค. ํ์ง๋ง ์ฌ๊ธฐ์ `select_related` ๋ฅผ ์ฌ์ฉํ๋ฉด ์๋ฌ๊ฐ ๋ฐ์ํ๋ค. `select_related` ๋ ๋ค๋๋ค ๊ด๊ณ์์ ์ฌ์ฉํ  ์ ์๊ธฐ ๋๋ฌธ์ด๋ค.

 

*๐๐ปโโ๏ธย : ๊ทธ๋์ ์ด๋ค๊ฑธ ์ฌ์ฉํ๋ผ๊ณ ์.*

๐ย ๊ฒฐ๋ก  : ์ผ๋์ผ๊ด๊ณ๋ ์ ์ฐธ์กฐ ๊ด๊ณ์์๋ `select_related` ๋ฅผ ์ฌ์ฉํ๊ณ , ๋ค๋๋ค๊ด๊ณ๋ ์ญ์ฐธ์กฐ ๊ด๊ณ์์๋ `prefetch_related` ๋ฅผ ์ฌ์ฉํ์. ๋ง์ฝ `select_related` ๋ฅผ ์ฌ์ฉํ  ์ ์๋ ์ํฉ์ด๋ผ๋ฉด, query์ ์๊ฐ ํ๋ ๋ ์ค์ด๋๋ ์ ๋งํ๋ฉด `select_related` ๋ฅผ ์ฌ์ฉํ๋ ๊ฒ์ด ์ข๋ค!

---

### <์ฐธ๊ณ >

- [https://docs.djangoproject.com/en/4.0/topics/db/queries/#querysets-are-lazy](https://docs.djangoproject.com/en/4.0/topics/db/queries/#querysets-are-lazy)
- [https://docs.djangoproject.com/en/4.0/ref/models/querysets/#when-querysets-are-evaluated](https://docs.djangoproject.com/en/4.0/ref/models/querysets/#when-querysets-are-evaluated)
- [https://docs.djangoproject.com/en/4.0/topics/db/queries/#caching-and-querysets](https://docs.djangoproject.com/en/4.0/topics/db/queries/#caching-and-querysets)
- [https://www.youtube.com/watch?v=EZgLfDrUlrk&t=113s](https://www.youtube.com/watch?v=EZgLfDrUlrk&t=113s)