---
title: "๐ [Django] Django Custom Command"
excerpt: "Django Custom Command๋ฅผ ๋ง๋ค๊ณ  ์ฌ์ฉํด๋ณด์!"

categories:
  - Django
tags:
  - [TIL, Python]

toc: true
toc_sticky: true

date: 2021-11-11
last_modified_at: 2021-11-13
---

Django Management Command๋ `python manage.py shell`, `python manage.py migrate` ์ ๊ฐ์ด ์ฐ๋ฆฌ๊ฐ ์ฅ๊ณ ๋ฅผ ์ฌ์ฉํ  ๋ ์์ฃผ ์ฌ์ฉํ๋ ๋ช๋ น์ด๋ฅผ ๋งํ๋ค. ์ฐ๋ฆฌ๋ ์ด Django Command๋ฅผ Customํ์ฌ ์ํ๋ ๋์์ ์ํ๋ ๋ช๋ น์ด๋ก ์ปค์คํํ์ฌ ๋ง๋ค์ด ์ค ์ ์๋ค.

## custom command ๋ง๋ค๊ธฐ

์ํ๋ app ํด๋ ๋ฐ์ management ํด๋๋ฅผ ๋ง๋ค๊ณ  ๊ทธ ๋ฐ์ commands ํด๋๋ฅผ ๋ง๋ ๋ค.

```
์ฑ์ด๋ฆ/management/commands
```

์ด๋ฐ ๊ตฌ์กฐ๊ฐ ๋์ด์ผ ํ๋ค.

ํด๋๋ฅผ ๋ง๋ค์์ผ๋ฉด commands ํด๋ ๋ฐ์ ์ํ๋ ๋ช๋ น์ด ์ด๋ฆ์ผ๋ก ํ์ผ์ ์์ฑํ๋ค. ๋ง์ฝ `python manage.py insert_data_to_db` ๋ผ๋ ์ปค์คํ command๋ฅผ ๋ง๋ค๊ณ  ์ถ์ผ๋ฉด `insert_data_to_db.py`๋ผ๋ ํ์ผ์ ๋ง๋ค๋ฉด ๋๋ค.

```python
# ์ฑ์ด๋ฆ/management/commands/insert_data_to_db.py
from django.core.management.base import BaseCommand
from apps.company_info.models import CompanyName

class Command(BaseCommand):
    help = 'insert data to company_names table'

    def add_arguments(self, parser):
        parser.add_argument('name', type=str)
        parser.add_argument('c_id_id', type=int)
        parser.add_argument('language_id', type=int)

    def handle(self, *args, **options):
        name = options['name']
        c_id = options['c_id_id']
        language_id = options['language_id']
        company_name = CompanyName(name=name, c_id=c_id, language_id=language_id)
        company_name.save()

        self.stdout.write('Successfully make company name "%s"' % name)
```

ํด๋์ค ์ด๋ฆ์ Command๋ก ๋ง๋ค์ด์ฃผ๊ณ  BaseCommand๋ฅผ ๋ฐ์์จ๋ค. ๋ฐ help ๋ณ์์๋ ๋ง๋ค command์ ์ฉ๋๋ฅผ ์ค๋ชํ๋ฉด ๋๋ค. (์ด๋ฆ์ ๊ผญ Command์ฌ์ผ ํ๋ค.)

add_arguments ํจ์์ parser์ ๋ฐ์ ํจ์ ์๋ `parser.add_argument(๋ฐ์ ์ธ์, ํ์)` ์ ์ ๋๋ค.

handle์ด๋ผ๋ ํจ์์ add_arguments์์ ๋ฐ์ ์ธ์๋ฅผ ๋ณ์์ ๋ฃ์ด์ค๋ค. ๋๋ name๊ณผ c_id(ํ์ฌ id), language_id๋ฅผ ๋ฐ์๋ค.
๋ฐ์ ์ธ์๋ฅผ model์ ์ ์ฅํ๊ณ  save ํด์ค๋ค.

```
python manage.py insert_data_to_db ์ด๋ฆ ํ์ฌid ์ธ์ดid
```

๋ฅผ manage.py๊ฐ ์๋ ๊ฒฝ๋ก์์ ์คํํ๋ฉด

```
Successfully make company name ์ด๋ฆ
```

data๊ฐ db์ ์ ๋ค์ด๊ฐ ๊ฒ์ ํ์ธํ  ์ ์๋ค.

์ฐธ ์ ๊ธฐํ๋ค! ใใ
