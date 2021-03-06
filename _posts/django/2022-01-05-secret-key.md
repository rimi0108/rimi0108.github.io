---
title: "๐ [Django] Django-environ์ ์ด์ฉํ์ฌ SECRET_KEY ์์ ํ๊ฒ ๋ณด๊ดํ๊ธฐ"
excerpt: "SECRET_KEY๋ฅผ ์์ ํ๊ฒ ๋ณด๊ดํด๋ณด์"

categories:
  - Django
tags:
  - [secret_key]

toc: true
toc_sticky: true

date: 2022-01-05
last_modified_at: 2022-01-05
---

> ์ฐ๋ฆฌ๊ฐ django ํ๋ก์ ํธ๋ฅผ git์ผ๋ก ์ถ์ ํ๊ณ  github์ ์ฌ๋ฆด ๋ ์ฌ๋ ค์๋ ์๋๋ ์ ๋ณด๊ฐ ์์ต๋๋ค. ๋ฐ๋ก SECRET_KEY ์๋๋ค.

```
django-admin startproject test_project
```

```
โโโ test_project
    โโโ manage.py
    โโโ test_project
        โโโ __init__.py
        โโโ asgi.py
        โโโ settings.py
        โโโ urls.py
        โโโ wsgi.py
```

์ฐ๋ฆฌ๊ฐ `django-admin startproject ํ๋ก์ ํธ ์ด๋ฆ` ๋ช๋ น์ด๋ก django project๋ฅผ ์์ํ๋ฉด django project์ ๊ธฐ๋ณธ ๊ตฌ์กฐ๊ฐ ์์ ๊ฐ์ด ๋ง๋ค์ด ์ง๋๋ค.

ํ๋ก์ ํธ์ `settings.py` ํ์ผ์๋ SECRET_KEY๋ผ๋ git์ ์ฌ๋ผ๊ฐ์๋ ์๋๋ ๋ฏผ๊ฐํ ์ ๋ณด๊ฐ ๋ด๊ธด ์ฝ๋๊ฐ ์์ต๋๋ค.

```python
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'my_secret_key'
```

์์ ๊ฐ์ SECRET_KEY๋ฅผ git์ด ์ถ์ ํ์ง ๋ชปํ๊ฒ ์ค์ ํด์ฃผ์ด์ผ ํฉ๋๋ค. (SECRET_KEY์ธ my_secret_key๋ ์์๋ก ์ค์ ํด ์ฃผ์์ต๋๋ค.)

์ฐ๋ฆฌ๋ `Django-environ`์ด๋ผ๋ ๋ผ์ด๋ธ๋ฌ๋ฆฌ๋ก ์ด SECRET_KEY๋ฅผ ๋ฐ๋ก ๋นผ๋ด์ด ๊ด๋ฆฌํ  ์ ์์ต๋๋ค.

## Django-environ

[Django-environ Docs](https://django-environ.readthedocs.io/en/latest/)

```
pip install django-environ
```

โ ๋จผ์  django-environ๋ฅผ ์ค์นํด์ค๋๋ค.

```python
# settings.py
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'my_secret_key'
```

โ `settings.py` ํ์ผ์ ๋ค์ด๊ฐ์ ์ ๊ธฐ์กด ์ฝ๋๋ฅผ ๋ฐ์ ์ฝ๋๋ก ๋ณ๊ฒฝํด ์ค๋๋ค. **๊ธฐ์กด ์ฝ๋์ SECRET_KEY๋ ๋ณต์ฌํด์ ์ ๊ฐ์งํด์ฃผ์ธ์ (๋์ค์ ๋ฐ๋ก `.env` ํ์ผ์ ๋ง๋ค์ด ์ด์ฌ ์์ผ ์ค๊ฒ๋๋ค.)**

```python
# settings.py
# โ ์ถ๊ฐ
import environ
import os

from pathlib import Path

# โ ์ถ๊ฐ
env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False)
)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# โ ์ถ๊ฐ
# Take environment variables from .env file
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# โ ๋ณ๊ฒฝ
SECRET_KEY = env('SECRET_KEY')
```

โ `settings.py` ์ฝ๋๋ฅผ ์์ ๊ฐ์ด ์์ ํด์ค ํ `.env` ํ์ผ์ ๋ฃจํธ ํด๋ ๋ฐ์ ๋ง๋ค์ด์ค๋๋ค.

```
.
โโโ .env
โโโ test_project
    โโโ manage.py
    โโโ test_project
        โโโ __init__.py
        โโโ asgi.py
        โโโ settings.py
        โโโ urls.py
        โโโ wsgi.py
```

ํ์ผ์ ๋ง๋ค์ด์ฃผ๋ฉด ์์ ๊ฐ์ ํด๋ ๊ตฌ์กฐ๊ฐ ๋ฉ๋๋ค.

```python
# .env
DEBUG=on
# โ ๊ธฐ์กด `settins.py` ํ์ผ์ ์๋ SECRET_KEY๋ฅผ ๋ฃ์ด์ฃผ์ธ์
SECRET_KEY=my_secret_key
DATABASE_URL=psql://user:un-githubbedpassword@127.0.0.1:8458/database
SQLITE_URL=sqlite:///my-local-sqlite.db
CACHE_URL=memcache://127.0.0.1:11211,127.0.0.1:11212,127.0.0.1:11213
REDIS_URL=rediscache://127.0.0.1:6379/1?client_class=django_redis.client.DefaultClient&password=ungithubbed-secret
```

โ ๋ง๋ค์ด์ค `.env` ํ์ผ์ ์ ์ฝ๋๋ฅผ ๋ฃ์ด์ฃผ๊ณ  SECRET_KEY ๋ถ๋ถ์ ๊ธฐ์กด `settings.py` ํ์ผ์ ์๋ SECRET_KEY๋ฅผ ๋ฃ์ด์ค๋๋ค.

โ ๋ง์ง๋ง์ผ๋ก git์ด `.env` ํ์ผ์ ์ถ์ ํ์ง ๋ชปํ๋๋ก `.gitignore` ํ์ผ์ ์์ฑํด `.env` ํ์ผ์ ๋ฃ์ด์ค๋๋ค.

```python
# .gitignore

.env
```

์์ ๊ฐ์ด `.gitignore` ํ์ผ์ ์ํ๋ ํ์ผ๋ช์ด๋ ํด๋๋ช์ ์ ์ผ๋ฉด git์ด ๋์ด์ ํด๋น ํ์ผ์ด๋ ํด๋๋ฅผ ์ถ์ ํ์ง ์๊ฒ ๋ฉ๋๋ค. ์ฐ๋ฆฌ๋ SECRET_KEY๋ผ๋ ์ค์ํ ์ฝ๋๊ฐ ๋ค์ด์๋ `.env` ํ์ผ์ git์ด ์ถ์ ํ์ง ๋ชปํ๊ฒ ํด์ฃผ์์ต๋๋ค.

์ฐ๋ฆฌ๋ ์ด์  SECRET_KEY๋ฅผ ์์ ํ๊ฒ ๋ณด๊ดํ๊ฒ ๋์์ต๋๋ค. ์ผํธ!
