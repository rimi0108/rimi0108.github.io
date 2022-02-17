---
title: "[Django] 코딩 스타일 "
excerpt: "Django 코드를 작성하는 스타일에 대해 알아보자"

categories:
  - Django
tags:
  - [Django]

toc: true
toc_sticky: true

date: 2022-02-17
last_modified_at: 2022-02-17
---

## 📍읽기 쉬운 코드 작성하기

- 축약적이거나 함축적인 변수명은 피한다.

```python
# bad
bal_s_d

# good
balance_sheet_decrease
```

짧게 씀으로써 몇 초 정도 타자 시간은 아낄 수 있을지 모르겠지만 😅 결국 그런 것들은 몇 시간 또는 며칠을 허비하게 되는 기술적 부채로 여러분에게 다가올 것이다. 그런 기술적 부채를 미리 막을 수 있다면 타자치는 데 몇 초 정도 시간을 더 써서 변수명을 길게 풀어 쓰는 편이 충분히 가치 있는 일일 것이다.

- 함수 인자의 이름들은 꼭 써준다.
- 클래스와 메서드를 문서화한다.
- 코드에 주석은 꼭 달도록 한다.
- 재사용 가능한 함수 또는 메서드 안에서 반복되는 코드들은 리팩터링을 해둔다.
- 함수와 메서드는 가능한 한 작은 크기를 유지한다. 어림잡아 스크롤 없이 읽을 수 있는 길이가 적합하다.

## PEP 8

[파이썬 공식 스타일 가이드](https://www.python.org/dev/peps/pep-0008/) (PEP 8) 에 따라 코드를 작성하자

- 들여쓰기에는 스페이스를 네 칸 이용한다.
- 최상위 함수와 클래스 선언 사이를 구분 짓기 위해 두 줄을 띄운다.
- 클래스 안에서 메서드들을 나누기 위해 한 줄을 띄운다

> PEP 8 가이드를 숙지하는 데 어려움을 겪는다면 타자와 동시에 자동으로 이 가이드를 확인해 주는 코드 편집기용 플러그인을 찾아서 이용하자
> 

## import

PEP 8은 임포트(import)를 할 때 다음과 같은 순서로 그룹을 지을 것을 제안하고 있다.

1. 표준 라이브러리 import
2. 연관 외부 라이브러리 import
3. 로컬 애플리케이션 또는 라이브러리에 한정된 import

```python
# 표준 라이브러리 import
from __future__ import absolute_import
from math import sqrt
from os.path import abspath
# 코어 장고 import
from django.db import models
from django.utils.translation import ugettext_lazy as _
# 서드 파티 앱 임포트
from django_extensions.db.models import TimeStampedModel
# 프로젝트 앱 임포트
from splits.models import BananaSplit
```

> import 문에 위처럼 주석을 달 필요는 없다. 예제의 주석들은 예제를 설명하기 위한 것일 뿐이다.

- **장고 프로젝트에서의 import 순서**
    1. 표준 라이브러리 import
    2. 코어 장고 import
    3. 장고와 무관한 외부 앱(서드 파티 앱) import
    4. 프로젝트 앱 import 

## 📍 명시적 성격의 상대 임포트 이용하기

코드를 작성할 때 코드들을 다른 곳으로 이동시키거나 이름을 변경하거나 버전을 나누는 등의 **재구성을 손쉽게 할 수 있도록 구성하는 것은 매우 중요한 일**이다.

파이썬에서는 명시적 성격의 상대 임포트(explicit relative import)를 통해 모듈의 패키지를 하드 코딩하거나 구조적으로 종속된 모듈을 어렵게 분리해야 하는 경우들을 피해 갈 수 있다. 장고 또한 파이썬의 한 패키지이므로 당연히 명시적 성격의 상대 임포트의 혜택을 볼 수 있다.

명시적 성격의 상대 임포트를 좀 더 쉽게 이해하기 위해 몇 가지 예를 들어보겠다.

*얼마나 많은 아이스크림을 먹었는지(와플콘, 슈가콘, 케이크콘 등 다양한 콘이 있다고 가정한다) 기록하는 장고 앱을 만들었다고 가정하고 그 중 한 부분을 인용해 보겠다.* 

불행히도 다음 코드를 보면 하드 코딩된 임포트 문을 포함하고 있다. 물론 이는 그다지 권하고 싶은 방법은 아니다.

```python
# cones/views.py
from django.views.generic import CreateView
# 절대 따라 하지 마시오 🙅🏻‍♀️
# 'cones' 패키지에 하드 코딩된
# 암묵적 상대 임포트가 이용되었다.
from cones.models import WaffleCone
from cones.forms import WaffleConeForm
from core.views import FoodMixin

class WaffleConeCreateView(FoodMixin, CreateView):
	model = WaffleCone
	form_class = WaffleConeForm
```

물론 ‘cone’ 앱 자체는 아이스크림 프로젝트에서 문제 없이 잘 작동한다. 하지만 하드 코딩된 임포트 문들은 이식성 면에서나 재사용성 면에서 문제가 된다. 

하드 코딩된 임포트 구문을 포함하고 있는 좋지 않은 예제를 명시적 성격의 상태 임포트를 이용한 예제로 바꿔 보자.

```python
# cones/views.py
from django.views.generic import CreateView

# 'cones' 패키지 명시적 상대 임포트
from .models import WaffleCone
from .forms import WaffleConeForm

# 'core' 패키지에서 절대 임포트
from core.views import FoodMixin

class WaffleConeCreateView(FoodMixin, CreateView):
    model = WaffleCone
    form_class = WaffleConeForm
```

### 임포트 타입과 용도

- 절대 import

```python
from core.views import FoodMixin
```

외부에서 임포트해서 현재 앱에서 이용할 때 사용한다.

- 명시적 상대 import

```python
from .models import WaffleCone
```

다른 모듈에서 임포트해서 현재 앱에서 이용할 때 사용한다.

- 암묵적 상대 import

```python
from models import WaffleCone
```

종종 다른 모듈에서 임포트해서 현재 앱에서 이용할 때 쓰지만 좋은 방법은 아니다.

## 📍 import * 는 피하자

**good 😇**

```python
from django import forms
from django.db import models 
```

**bad 😈**

```python
# 절대 따라 하지 마시오 🙅🏻‍♀️
from django.forms import *
from django.db.models import *
```

`import *`를 쓰지 말아야 하는 이유는 다른 파이썬 모듈의 이름공간들이 현재 우리가 작업하는 모듈의 이름공간에 추가로 로딩되거나 기존 것 위에 덮여 로딩되는 일을 막기 위해서다. 이럴 경우 전혀 예상치 못한 상황이 발생하거나 심각할 경우 큰 재앙이 야기되기도 한다. ☠️

`import *` 구문은 마치 아이스크림 가게에 아이스크림 콘 하나를 사러 와서 서른한 가지 맛 전부를 무료로 맛보게 해달라는 염치 없는 손님과 같다고 볼 수 있다. 한 두개 정도의 모듈만 이용하기 위해 전부 임포트할 필요는 없다.

~~즐겨 썼었는데 쓰지 말아야겠슴... !~~

## 📍 Django 코딩 스타일

이 내용은 공식 표준에서는 논의되지 않았더라도 프로젝트를 진행하면서 마주치는 Django 커뮤니티의 여러 코드에서 일반적으로 통용되는 사항들이다.

1. URL 패턴 이름에는 대시(-) 대신 밑줄(_)을 이용한다.
    
    *여기서 말하는 URL은 웹 브라우저에서 우리가 쓰는 진짜 URL 주소(`regex='^add-topping/$'`)가 아니라 **url()에 인자로 쓰이는 이름**을 말하는 것이다.*
    
    **bad 😈**
    
    ```python
    patterns = [
    	url(regex='^add/$',
    			view=views.add_topping,
    			name='add-topping'),
    ]
    ```
    
    **good 😇**
    
    ```python
    patterns = [
    	url(regex='^add/$',
    			view=views.add_topping,
    			name='add_topping'),
    ]
    ```
    
2. 템플릿 블록 이름에 대시 대신 밑줄을 사용한다.

## 📍 통합 개발 환경이나 텍스트 편집기에 종속되는 스타일의 코딩은 지양한다.

> *위에서 사용하는 코딩 스타일을 따르지 않더라도 일단 일관된 코딩 스타일을 정한 후 일관성 있게 따르는 것이 매우 중요하다. 여러 스타일이 섞여 있는 프로젝트의 경우 개발자가 실수할 확률이 더 높아질 뿐 아니라 개발이 더뎌지고 유지 보수에 상당한 애를 먹게 된다.*
> 

---

### <참고 서적>

- Two Scoops of Django