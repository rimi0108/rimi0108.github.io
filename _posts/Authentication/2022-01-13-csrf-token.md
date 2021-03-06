---
title: "🔐 [Authentication] CSRF, CSRF Token이란?"
excerpt: "CSRF와 CSRF Token이란 무엇일까?"

categories:
  - Authentication
tags:
  - [Token, CSRF]

toc: true
toc_sticky: true

date: 2022-01-13
last_modified_at: 2022-01-13
---

## CSRF

CSRF는 Cross-Site Request Forgery의 줄임말이다. 한국어로 번역하면 _사이트 간 요청 위조_ 라는 뜻인데, 웹 사이트 취약점 공격의 하나로, 사용자가 자신의 의지와는 무관하게 공격자가 의도한 행위(수정, 삭제, 등록 등)을 특정 웹사이트에 요청하게 하는 공격을 말한다.

이 공격은 특정 웹사이트가 사용자의 웹 브라우저를 신용하는 상태를 노린 것이다. 사용자가 웹사이트에 **로그인**한 상태에서 CSRF 공격 코드가 삽입된 페이지를 열면, 공격 대상이 되는 웹 사이트는 위조된 공격 명령이 믿을 수 있는 사용자로부터 발송된 것으로 판단하게 되어 공격에 노출된다. (😱 웹사이트 : 나는 우리 사용자를 믿었을 뿐인데..)

만약 사용자가 웹 사이트에 로그인한 상태로 CSRF 공격 링크를 이메일이나 게시판 등의 경로를 통해 열었다면 사용자의 의도와 상관없이 요청이 등록되거나, 삭제되거나, 수정될 수 있다. 이 때 웹 사이트는 로그인한 사용자를 신뢰하므로 이 요청이 신뢰하는 사용자가 보낸 것이라고 생각하고 이 요청을 수용하는 것이다.

### CSRF 공격 사례

2008년 옥션 개인정보 유출 사건

1. 옥션 관리자 중 한 명은 관리 권한을 가지고 회사 웹사이트에서 작업을 하던 중 메일을 조회한다.
2. 해커는 공격 태그가 들어간 이미지 코드가 담긴 이메일을 보낸다. 관리자는 이미지 크기가 0이므로 전혀 알지 못했다.
3. 관리자가 이메일을 열어볼 때, 이미지 파일을 받아오기 위해 URL이 열린다.
4. 해커가 원하는 대로 관리자의 이메일과 비밀번호가 변경된다.
5. 해커는 변경된 관리자의 이메일과 비밀번호를 이용하여 사이트의 정보를 빼낼 수 있었다. 🤯

## CSRF Token

이러한 CSRF 공격을 방지하기 위해 CSRF Token을 사용할 수 있다. CSRF Token은 랜덤한 수를 Session에 저장한다. 사용자 요청을 보낼 때마다 생성한 랜덤한 수(토큰)를 포함시켜서 전송한다. 서버에서는 사용자의 요청을 받을 때마다 세션에 저장된 토큰 값과 요청과 함께 전달된 토큰 값이 같은 지 검사한다.

1. 💻 서버 : 사용자가 CSRF 공격에 노출되지 않을 수 있도록 세션에 CSRF Token을 이용해 랜덤한 숫자(토큰)를 생성해서 저장해 놔야지. 사용자가 요청 보낼 때 세션에 저장된 토큰이랑 사용자가 요청이랑 같이 보낸 토큰이랑 같은 지 비교해서 공격 당하지 않도록 주의해야겠다.

2. 👶 사용자 : 서버야 나 토큰이랑 같이 요청 보냄!

3. 💻 서버 : 요청 받았음. 세션에 저장된 숫자랑 요청이랑 같이 보낸 숫자랑 같음. 너 통과 ㅎ 확인했으니까 폐기하고 다시 생성해야지

---

<참고>

https://ko.wikipedia.org/wiki/%EC%82%AC%EC%9D%B4%ED%8A%B8*%EA%B0%84*%EC%9A%94%EC%B2%AD\_%EC%9C%84%EC%A1%B0

https://sj602.github.io/2018/07/14/what-is-CSRF/
