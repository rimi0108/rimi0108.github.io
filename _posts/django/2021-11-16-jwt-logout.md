---
title: "๐ [Django] JWT๋ก ๋ก๊ทธ์์์ ๊ตฌํํด๋ณด์"
excerpt: "json web token์ผ๋ก django์์ logout์ ๊ตฌํํด๋ณด์"

categories:
  - Django
tags:
  - [jwt, token]

toc: true
toc_sticky: true

date: 2021-11-17
last_modified_at: 2021-11-17
---

## JWT๋ก ๋ก๊ทธ์์ ๊ตฌํํ๊ธฐ

> jwt ํ ํฐ์ผ๋ก ๋ก๊ทธ์์์ ํ  ์ ์์๊น?

๊ฐ๊ณ๋ถ ์๋น์ค์์ jwt๋ฅผ ์ฌ์ฉํ์ฌ ๋ก๊ทธ์ธ ํ ํฐ์ ๋ฐ๊ธํ์๋ค. ๊ทธ๋ฐ๋ฐ jwt ํ ํฐ์ผ๋ก ๋ก๊ทธ์์์ ํ๋ ค๋ ์ด๋ป๊ฒ ํด์ผ ํ  ์ง ๋ชจ๋ฅด๊ฒ ์ด์ ํด๊ฒฐ ๋ฐฉ๋ฒ์ ์ฐพ์๋ณด๋ ค ํ๋ค.

### JWT ๋ก๊ทธ์ธ

JWT ํ ํฐ์ ์๋๋ฐฉ์์ ์ด๋ ๋ค.

1. ์ ์ ๊ฐ ๋ก๊ทธ์ธ์ ํ๋ค.
2. db์์ ์ ์ ์ ๋ณด๋ฅผ ์กฐํํ ๋ค ์ ์ ์ ๋ณด๊ฐ ์ผ์นํ๋ฉด ๋ก๊ทธ์ธ๊ณผ ๋์์ JWT ํ ํฐ์ ๋ฐ๊ธํ๋ค.
3. ํ ํฐ์ ํด๋ผ์ด์ธํธ์๊ฒ ์ ๋ฌํ๋ค.
4. ํด๋ผ์ด์ธํธ์์ api ์์ฒญ์ ํ  ๋ ํ ํฐ์ Authorization header์ ๋ด์์ ๋ณด๋ธ๋ค.
5. ์๋ฒ๋ ํ ํฐ์ decodeํ์ฌ ์ ์  ์ ๋ณด๋ฅผ ํ๋ํ๋ค.
6. db์ ํ ํฐ์์ ์ป์ ์ ์  ์ ๋ณด์ ์ผ์นํ๋ ์ ์ ๊ฐ ์์ ์ ์๋ฌ๋ฅผ ๋ฐํํ๊ณ  ์ ์ ๊ฐ ์กด์ฌํ  ์ api ์์ฒญ์ ์๋ต์ ๋ฐ์ ์ ์๋ค.

๊ทธ๋ฐ๋ฐ ์ฌ๊ธฐ์ ์ ์ ๊ฐ ๋ก๊ทธ์ธ ํ ์๋น์ค ์ด์ฉ์ ํ๋ค ๋ก๊ทธ์์์ ํ๊ณ  ์ถ๋ค๋ฉด ์ด๋ป๊ฒ ํด์ผํ ๊น?

### JWT ๋ก๊ทธ์์

https://medium.com/devgorilla/how-to-log-out-when-using-jwt-a8c7823e8a6

์ ๊ธ์ ๋ฐ๋ผ ํด๊ฒฐ์ฑ์ ์ฐพ์๋ณด๋ คํ๋ค.

1. โ ๋ด๊ฐ ์๊ฐํ ๋ฐฉ๋ฒ ๐
   ๋ก๊ทธ์์ ์ ํ ํฐ์ ์ ํจ๊ธฐ๊ฐ์ ๊ฐ์ ๋ก ๋๋ผ ์ ์๋ค๋ฉด ๋ก๊ทธ์์์ด ๋์ง ์์๊น..?

   > โOkay, so letโs log out the user from the backend!โ you would say. But hold down the horses. Itโs not that simple with JWT. You cannot delete the session or cookie and get going. Actually, JWT serves a different purpose than a session and it is not possible to forcefully delete or invalidate an existing token.

   > "์, ์ด์  ๋ฐฑ์๋์์ ์ฌ์ฉ์๋ฅผ ๋ก๊ทธ์์์์ผ ๋ณด๊ฒ ์ต๋๋ค!"๋ผ๊ณ  ๋งํฉ๋๋ค. ํ์ง๋ง ๋ง๋ค์ ์ก์๋์ธ์. JWT๋ ๊ทธ๋ ๊ฒ ๊ฐ๋จํ์ง ์์์. ์ธ์ ๋๋ ์ฟ ํค๋ฅผ ์ญ์ ํ๊ณ  ๊ณ์ํ  ์ ์์ต๋๋ค. ์ค์ ๋ก JWT๋ ์ธ์๊ณผ ๋ค๋ฅธ ์ฉ๋๋ก ์ฌ์ฉ๋๋ฉฐ ๊ธฐ์กด ํ ํฐ์ ๊ฐ์ ๋ก ์ญ์ ํ๊ฑฐ๋ ๋ฌดํจํํ  ์ ์์ต๋๋ค.

   JWT ํ ํฐ์ ๊ฐ์ ๋ก ์ญ์ ํ๊ฑฐ๋ ๋ฌดํจํํ  ์ ์๋ค๊ณ  ํ๋ค...๐ฐ

2. โ ํ ํฐ์ ํฉ๋ฆฌ์ ์ธ ๋ง๋ฃ ์๊ฐ ์ค์ 

   ๋ก๊ทธ์์ ๋์  ํ ํฐ์ ์งง๊ฒ ์ง์ ํ๋ ๋ฐฉ๋ฒ์ด ์์ ๊ฒ์ด๋ค. ๊ทธ๋ฐ๋ฐ ๊ฐ๊ณ๋ถ ์๋น์ค๋ฅผ ์ด์ฉํ๋ ์ ์ ๊ฐ ํ ํฐ ์๊ฐ์ด ์งง์ ์๋น์ค๋ฅผ ์ด์ฉํ  ๋๋ง๋ค ๋ก๊ทธ์์์ด ๋๋ค๋ฉด ๋ถํธํ  ๊ฒ ๊ฐ๋ค๋ ์๊ฐ์ด ๋ค์๋ค.

3. โ ๋ก๊ทธ์์ ์ ํด๋ผ์ด์ธํธ ์ธก์์ ์ ์ฅ๋ ํ ํฐ ์ญ์ 

   ์ด๊ฑด ํด๋ผ์ด์ธํธ ์ธก์์ ํด์ผ๋๋ ์ผ์ด๋ฏ๋ก ๋ด๊ฐ ํ  ์ ์๋ ์ผ์ด ์์ ๊ฒ ๊ฐ๋ค.

4. ๐ก ์์ง ์๊ฐ์ด ๋จ์ ์๋ ๋ ์ด์ ํ์ฑ ํ ํฐ์ด ์๋ DB๋ฅผ ๋ณด์ ํ์ญ์์ค. (๋ฒ์ญ์ด ์ข ์ด์ํ์ง๋ง..)

   ํ ํฐ์ db์ ์ ์ฅํ๊ณ  ๋ก๊ทธ์์ ์ db์์ ํ ํฐ์ ์ญ์ ํ์ฌ ์๋น์ค ์ด์ฉ์ ์ญ์ ๋ ํ ํฐ์ธ์ง ์๋์ง ํ๋จํ์ฌ ์ญ์ ๋ ํ ํฐ์ผ ์ ์ฌ ๋ก๊ทธ์ธ์ ์๋ํ๋ค.

   ์ด ๋ฐฉ๋ฒ์ผ๋ก ํ ๋ฒ ํด๋ณด๊ฒ ๋ค!

```python
class Token(models.Model):
    token = models.CharField(max_length=100)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    class Meta:
        db_table = "tokens"
```

token์ ์ ์ฅํ  db๋ฅผ ๋ง๋ค์ด์ค๋ค. ํ user๋ ํ๋์ ํ ํฐ๋ง ๊ฐ์ง ์ ์์ผ๋ฏ๋ก `OneToOneField`๋ก user ํ๋๋ฅผ ๊ตฌ์ฑํ์๋ค.

```python
Token.objects.create(user_id=user.id, token=access_token)
```

๋ก๊ทธ์ธ ์ ๋ฐ๊ธ๋ ํ ํฐ์ db์ ์ ์ฅํด์ค๋ค.

```python
class LogoutView(View):
    @log_in_confirm
    def post(self, request):
        user = request.user

        Token.objects.get(user_id=user.id).delete()

        return JsonResponse({"message": "LOGOUT_SUCCESS"}, status=200)
```

์ ์ ๊ฐ logout request๋ฅผ ๋ณด๋์ ์, db์ ์ ์ฅ๋ ํ ํฐ์ ์ญ์ ํ๋ค. ์ฌ๊ธฐ์, `log_in_confirm`์ด๋ผ๋ decorator์ ์ฌ์ฉํ์ฌ ๋ก๊ทธ์ธํ ์ ์ ๋ง ์์ฒญ์ ๋ณด๋ผ ์ ์๋๋ก ํ๋ค.

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

์๋ `log_in_confirm` decorator๊ฐ ๋ค์ด์๋ `utils.py` ํ์ผ์ด๋ค. ์ด decorator๋ login์ด ํ์ํ ์๋น์ค๋ฅผ ์ ์ ๊ฐ ์ด์ฉํ  ๋, header์ ๋ค์ด์๋ token์ decodeํ์ฌ user์ ์ ๋ณด๋ฅผ ํ๋ํ ๋ค db์์ ์๋ ์ ์ ์ ๋น๊ตํด, ์ค์  ์ ์ ์ธ์ง ํ์ธํ๋ ๊ธฐ๋ฅ์ ํ๋ค.

```python
if not Token.objects.filter(user_id=user["id"]).exists():
                return JsonResponse({"message": "INVALID_USER"})
```

์ ์ฝ๋๊ฐ ๋ด๊ฐ ์๋ก ์ถ๊ฐํ ์ฝ๋์ด๋ค. ๋ง์ฝ decodeํ ํ ํฐ์ ์ ์  ์ ๋ณด์ ํด๋นํ๋ ํ ํฐ์ด token์ ์ ์ฅํ db์ ์๋ค๋ฉด `INVALID_USER` ์๋ฌ๋ฅผ ๋ฐํํ๋ค.

์ฌ๊ธฐ์ ๋ค์ ์๋น์ค๋ฅผ ์ด์ฉํ๋ ค๋ฉด ์ฌ๋ก๊ทธ์ธ์ ํ๋ฉด token์ด ๋ค์ db์ ์ ์ฅ๋๊ธฐ ๋๋ฌธ์ ์๋น์ค๋ฅผ ์ ์์ ์ผ๋ก ์ด์ฉํ  ์ ์๋ค.

_์ด๊ฒ ๋ง๋ ๋ฐฉ๋ฒ์ธ์ง๋ ๋ชจ๋ฅด๊ฒ ์ง๋ง! ๋ก๊ทธ์์ ๊ตฌํ ์๋ฃ_

### <์ฐธ๊ณ >

- https://medium.com/devgorilla/how-to-log-out-when-using-jwt-a8c7823e8a6
- https://okky.kr/article/870084
