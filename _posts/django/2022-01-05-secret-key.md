---
title: "📗 [Django] Django-environ을 이용하여 SECRET_KEY 안전하게 보관하기"
excerpt: "SECRET_KEY를 안전하게 보관해보자"

categories:
  - Django
tags:
  - [secret_key]

toc: true
toc_sticky: true

date: 2022-01-05
last_modified_at: 2022-01-05
---

> 우리가 django 프로젝트를 git으로 추적하고 github에 올릴 때 올려서는 안되는 정보가 있습니다. 바로 SECRET_KEY 입니다.

```
django-admin startproject test_project
```

```
└── test_project
    ├── manage.py
    └── test_project
        ├── __init__.py
        ├── asgi.py
        ├── settings.py
        ├── urls.py
        └── wsgi.py
```

우리가 `django-admin startproject 프로젝트 이름` 명령어로 django project를 시작하면 django project의 기본 구조가 위와 같이 만들어 집니다.

프로젝트의 `settings.py` 파일에는 SECRET_KEY라는 git에 올라가서는 안되는 민감한 정보가 담긴 코드가 있습니다.

```python
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'my_secret_key'
```

위와 같은 SECRET_KEY를 git이 추적하지 못하게 설정해주어야 합니다. (SECRET_KEY인 my_secret_key는 임의로 설정해 주었습니다.)

우리는 `Django-environ`이라는 라이브러리로 이 SECRET_KEY를 따로 빼내어 관리할 수 있습니다.

## Django-environ

[Django-environ Docs](https://django-environ.readthedocs.io/en/latest/)

```
pip install django-environ
```

✔ 먼저 django-environ를 설치해줍니다.

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

✔ `settings.py` 파일에 들어가서 위 기존 코드를 밑의 코드로 변경해 줍니다. **기존 코드의 SECRET_KEY는 복사해서 잘 간직해주세요 (나중에 따로 `.env` 파일을 만들어 이사 시켜 줄겁니다.)**

```python
# settings.py
# ❗ 추가
import environ
import os

from pathlib import Path

# ❗ 추가
env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False)
)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# ❗ 추가
# Take environment variables from .env file
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# ❗ 변경
SECRET_KEY = env('SECRET_KEY')
```

✔ `settings.py` 코드를 위와 같이 수정해준 후 `.env` 파일을 루트 폴더 밑에 만들어줍니다.

```
.
├── .env
└── test_project
    ├── manage.py
    └── test_project
        ├── __init__.py
        ├── asgi.py
        ├── settings.py
        ├── urls.py
        └── wsgi.py
```

파일을 만들어주면 위와 같은 폴더 구조가 됩니다.

```python
# .env
DEBUG=on
# ❗ 기존 `settins.py` 파일에 있던 SECRET_KEY를 넣어주세요
SECRET_KEY=my_secret_key
DATABASE_URL=psql://user:un-githubbedpassword@127.0.0.1:8458/database
SQLITE_URL=sqlite:///my-local-sqlite.db
CACHE_URL=memcache://127.0.0.1:11211,127.0.0.1:11212,127.0.0.1:11213
REDIS_URL=rediscache://127.0.0.1:6379/1?client_class=django_redis.client.DefaultClient&password=ungithubbed-secret
```

✔ 만들어준 `.env` 파일에 위 코드를 넣어주고 SECRET_KEY 부분에 기존 `settings.py` 파일에 있던 SECRET_KEY를 넣어줍니다.

✔ 마지막으로 git이 `.env` 파일을 추적하지 못하도록 `.gitignore` 파일을 생성해 `.env` 파일을 넣어줍니다.

```python
# .gitignore

.env
```

위와 같이 `.gitignore` 파일에 원하는 파일명이나 폴더명을 적으면 git이 더이상 해당 파일이나 폴더를 추적하지 않게 됩니다. 우리는 SECRET_KEY라는 중요한 코드가 들어있는 `.env` 파일을 git이 추적하지 못하게 해주었습니다.

우리는 이제 SECRET_KEY를 안전하게 보관하게 되었습니다. 야호!
