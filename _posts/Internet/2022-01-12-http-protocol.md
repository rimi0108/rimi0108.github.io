---
title: "[HTTP] HTTP Protocol이란?"
excerpt: "HTTP Protocol은 무엇일까?"

categories:
  - Internet
tags:
  - [HTTP]

toc: true
toc_sticky: true

date: 2022-01-12
last_modified_at: 2022-01-12
---

## Protocol?

프로토콜(protocol)은 우리가 컴퓨터와 컴퓨터끼리 통신 할 때 사용되는 **규약**같은 것이다.

## GET & POST

컴퓨터끼리 통신을 할 때, 보통 User는 Server에게 요청(Request)를 보내고 Server는 User가 보낸 요청(Request)에 응답(Response)을 보낸다.

이 때, 서버가 무엇을 응답 해줘야 하는 지 추가적인 정보가 필요한데 이 때 사용하는 것이 GET & POST이다.

### GET

User가 `https://example.com`이라는 주소로 요청을 보낸다고 가정했을 때, GET으로 요청을 보내면 보통 데이터를 조회하고 싶다는 요청이다.

많은 데이터 중 우리는 원하는 데이터를 조회하기 위해 `https://example.com/?param1=value1` 와 같이 추가적인 parameter를 넣어서 보내줄 수 있다.

### POST

POST는 User가 Server에 어떤 정보를 새로 만들거나(create), 수정할 때(update) 보통 사용한다.

POST로 요청을 보내면 추가적으로 BODY라는 곳에 데이터를 넣어서 요청을 하게된다.

만약 우리가 `https://example.com` 라는 주소에 POST로 요청을 보낸다면, 서버에 새로 만들고 싶은 데이터를 (예를 들어서 글을 작성한다거나, 댓글을 작성한다거나 하는 요청) 추가적으로 BODY에 담아서 BODY에 들어있는 데이터를 서버에 새로 만들거나 수정해 줘~ 하고 요청을 보내게 되는 것이다.

---

<참고>

- https://www.youtube.com/watch?v=TVBhPovyeLM
