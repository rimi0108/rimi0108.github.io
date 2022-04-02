---
title: "📗 [Django] Django Custom Command"
excerpt: "Django Custom Command를 만들고 사용해보자!"

categories:
  - Django
tags:
  - [TIL, Python]

toc: true
toc_sticky: true

date: 2021-11-11
last_modified_at: 2021-11-13
---

Django Management Command는 `python manage.py shell`, `python manage.py migrate` 와 같이 우리가 장고를 사용할 때 자주 사용하는 명령어를 말한다. 우리는 이 Django Command를 Custom하여 원하는 동작을 원하는 명령어로 커스텀하여 만들어 줄 수 있다.

## custom command 만들기

원하는 app 폴더 밑에 management 폴더를 만들고 그 밑에 commands 폴더를 만든다.

```
앱이름/management/commands
```

이런 구조가 되어야 한다.

폴더를 만들었으면 commands 폴더 밑에 원하는 명령어 이름으로 파일을 생성한다. 만약 `python manage.py insert_data_to_db` 라는 커스텀 command를 만들고 싶으면 `insert_data_to_db.py`라는 파일을 만들면 된다.

```python
# 앱이름/management/commands/insert_data_to_db.py
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

클래스 이름은 Command로 만들어주고 BaseCommand를 받아온다. 밑 help 변수에는 만들 command의 용도를 설명하면 된다. (이름은 꼭 Command여야 한다.)

add_arguments 함수에 parser을 받아 함수 아래 `parser.add_argument(받을 인수, 타입)` 을 적는다.

handle이라는 함수에 add_arguments에서 받은 인수를 변수에 넣어준다. 나는 name과 c_id(회사 id), language_id를 받았다.
받은 인수를 model에 저장하고 save 해준다.

```
python manage.py insert_data_to_db 이름 회사id 언어id
```

를 manage.py가 있는 경로에서 실행하면

```
Successfully make company name 이름
```

data가 db에 잘 들어간 것을 확인할 수 있다.

참 신기하다! ㅎㅎ
