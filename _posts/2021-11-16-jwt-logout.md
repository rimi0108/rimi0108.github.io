---
title: "[Django] JWT로 로그아웃을 구현해보자"
excerpt: "json web token으로 django에서 logout을 구현해보자"

categories:
  - Django
tags:
  - [jwt, token]

toc: true
toc_sticky: true

date: 2021-11-17
last_modified_at: 2021-11-17
---

## JWT로 로그아웃 구현하기

> jwt 토큰으로 로그아웃을 할 수 있을까?

가계부 서비스에서 jwt를 사용하여 로그인 토큰을 발급하였다. 그런데 jwt 토큰으로 로그아웃을 하려니 어떻게 해야 할 지 모르겠어서 해결 방법을 찾아보려 한다.

### JWT 로그인

JWT 토큰의 작동방식은 이렇다.

1. 유저가 로그인을 한다.
2. db에서 유저정보를 조회한 뒤 유저정보가 일치하면 로그인과 동시에 JWT 토큰을 발급한다.
3. 토큰을 클라이언트에게 전달한다.
4. 클라이언트에서 api 요청을 할 때 토큰을 Authorization header에 담아서 보낸다.
5. 서버는 토큰을 decode하여 유저 정보를 획득한다.
6. db에 토큰에서 얻은 유저 정보와 일치하는 유저가 없을 시 에러를 반환하고 유저가 존재할 시 api 요청의 응답을 받을 수 있다.

그런데 여기서 유저가 로그인 후 서비스 이용을 하다 로그아웃을 하고 싶다면 어떻게 해야할까?

### JWT 로그아웃

https://medium.com/devgorilla/how-to-log-out-when-using-jwt-a8c7823e8a6

위 글에 따라 해결책을 찾아보려한다.

1. ❌ 내가 생각한 방법 👉
   로그아웃 시 토큰의 유효기간을 강제로 끝낼 수 있다면 로그아웃이 되지 않을까..?

   > “Okay, so let’s log out the user from the backend!” you would say. But hold down the horses. It’s not that simple with JWT. You cannot delete the session or cookie and get going. Actually, JWT serves a different purpose than a session and it is not possible to forcefully delete or invalidate an existing token.

   > "자, 이제 백엔드에서 사용자를 로그아웃시켜 보겠습니다!"라고 말합니다. 하지만 말들은 잡아두세요. JWT는 그렇게 간단하지 않아요. 세션 또는 쿠키를 삭제하고 계속할 수 없습니다. 실제로 JWT는 세션과 다른 용도로 사용되며 기존 토큰을 강제로 삭제하거나 무효화할 수 없습니다.

   JWT 토큰은 강제로 삭제하거나 무효화할 수 없다고 한다...😰

2. ❌ 토큰에 합리적인 만료 시간 설정

   로그아웃 대신 토큰을 짧게 지정하는 방법이 있을 것이다. 그런데 가계부 서비스를 이용하는 유저가 토큰 시간이 짧아 서비스를 이용할 때마다 로그아웃이 된다면 불편할 것 같다는 생각이 들었다.

3. ❌ 로그아웃 시 클라이언트 측에서 저장된 토큰 삭제
   이건 클라이언트 측에서 해야되는 일이므로 내가 할 수 있는 일이 없을 것 같다.

4. 💡 아직 시간이 남아 있는 더 이상 활성 토큰이 없는 DB를 보유하십시오. (번역이 좀 이상하지만..)

   토큰을 db에 저장하고 로그아웃 시 db에서 토큰을 삭제하여 서비스 이용시 삭제된 토큰인지 아닌지 판단하여 삭제된 토큰일 시 재 로그인을 시도한다.

   이 방법으로 한 번 해보겠다!

```python
class Token(models.Model):
    token = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = "tokens"
```

token을 저장할 db를 만들어준다. user를 foreignkey로 갖고 있게 한다.

```python
Token.objects.create(user_id=user.id, token=access_token)
```

로그인 시 발급된 토큰을 db에 저장해준다.

```python
class LogoutView(View):
    @log_in_confirm
    def post(self, request):
        user = request.user

        Token.objects.get(user_id=user.id).delete()

        return JsonResponse({"message": "LOGOUT_SUCCESS"}, status=200)
```

유저가 logout request를 보냈을 시, db에 저장된 토큰을 삭제한다. 여기서, `log_in_confirm`이라는 decorator을 사용하여 로그인한 유저만 요청을 보낼 수 있도록 한다.

```python
# utils.py
import jwt

from django.http import JsonResponse

from users.models import User, Token
from my_settings import SECRET_KEY, ALGORITHM


def log_in_confirm(func):
    def wrapper(self, request, *args, **kwargs):
        try:
            user_token = request.headers.get("Authorization", None)

            user = jwt.decode(user_token, SECRET_KEY, ALGORITHM)

            if not User.objects.filter(id=user["id"]).exists():
                return JsonResponse({"message": "INVALID_USER"}, status=401)

            if not Token.objects.filter(user_id=user["id"]).exists():
                return JsonResponse({"message": "INVALID_USER"})

            request.user = User.objects.get(id=user["id"])

            return func(self, request, *args, **kwargs)

        except jwt.InvalidSignatureError:
            return JsonResponse({"message": "JWT_SIGNATURE_ERROR"}, status=400)

        except jwt.DecodeError:
            return JsonResponse({"message": "JWT_DECODE_ERROR"}, status=400)

    return wrapper

```

위는 `log_in_confirm` decorator가 들어있는 `utils.py` 파일이다. 이 decorator는 login이 필요한 서비스를 유저가 이용할 때, header에 들어있는 token을 decode하여 user의 정보를 획득한 뒤 db안에 있는 유저와 비교해, 실제 유저인지 확인하는 기능을 한다.

```python
if not Token.objects.filter(user_id=user["id"]).exists():
                return JsonResponse({"message": "INVALID_USER"})
```

위 코드가 내가 새로 추가한 코드이다. 만약 decode한 토큰의 유저 정보에 해당하는 토큰이 token을 저장한 db에 없다면 `INVALID_USER` 에러를 반환한다.

여기서 다시 서비스를 이용하려면 재로그인을 하면 token이 다시 db에 저장되기 때문에 서비스를 정상적으로 이용할 수 있다.

_이게 맞는 방법인지는 모르겠지만! 로그아웃 구현 완료_

### <참고>

- https://medium.com/devgorilla/how-to-log-out-when-using-jwt-a8c7823e8a6
- https://okky.kr/article/870084
