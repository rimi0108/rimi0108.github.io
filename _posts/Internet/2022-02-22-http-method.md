---
title: "[HTTP 갉아먹기(2)] HTTP Method"
excerpt: "HTTP Method에 대해 알아보자"

categories:
  - Internet
tags:
  - [HTTP]

toc: true
toc_sticky: true

date: 2022-02-22
last_modified_at: 2022-02-22
---

## 🚀 HTTP Method란?

- HTTP는 request Method를 정의하여 주어진 resource에 수행하길 원하는 행동을 나타낸다.
    
![스크린샷 2022-02-16 오전 10 13 54](https://user-images.githubusercontent.com/73830753/155130716-8bee37cb-75e8-464d-8861-bcb1042acf4d.png)

위 사진은 필자의 깃허브 블로그 메인 페이지를 로드했을 때 크롬 개발자 도구의 네트워크 탭에서 확인할 수 있는 모습이다.  `Request URL` 이 존재하고 그 밑에 `Request Method` 가 `GET` 으로 되어있는 것을 확인할 수 있다. 

위에서 HTTP는 request Method를 정의하여 주어진 resource에 수행하길 원하는 행동을 나타낸다고 하였는데, 위 사진에서는 필자의 깃허브 블로그 resource를 `GET` 해와라! 라는 요청을 보내고 있는 것이다. 한 마디로, `GET` 이라는 request Method를 정의하여 깃허브 블로그 메인 페이지의 resource를 가져오라는 행동을 나타내고 있는 것이다.

## HTTP Method의 종류

- `GET`
    
    특정 resource를 읽어오는 데 사용된다. 즉, **서버의 resource를 읽어오는 요청**이다.
    
    ex ) 만약 가계부 서비스가 존재한다고 하면  `GET` 요청으로  moneybook/1 라고 보냈을 때 1번에 해당하는 가계부의 resource를 읽어올 수 있다. 요청에 대한 응답 결과는 response Body에 담겨져 온다. request Body는 존재하지 않는다.
    
    <img width="405" alt="스크린샷 2022-02-16 오전 10 42 04" src="https://user-images.githubusercontent.com/73830753/155131169-05a53be6-2f63-424a-ae2e-448082694907.png">

    
- `HEAD`
    
    `GET` 메서드의 request와 동일한 response를 요구하지만, response Body를 포함하지 않는다. resource를 받지 않고 오직 찾기만 원할 때, response의 status code를 확인할 때, 서버의 response header를 봄으로써 resource가 수정 되었는지 확인할 때 쓰인다.
    
- `POST`
    
    resource를 새로 생성한다. 
    
    ex ) request Body에 요청 내용을 담아서 보낸다. 요청 결과에 따른 결과가 response Body에 담겨서 응답이 온다.
    
    <img width="443" alt="스크린샷 2022-02-16 오전 10 44 26" src="https://user-images.githubusercontent.com/73830753/155131296-101af257-894c-4683-b595-c6627be5ad61.png">

    
- `PUT`
    
    resource가 존재한다면 해당 resource를 update하고 존재하지 않는다면 resource를 새로 생성한다.
    
- `DELETE`
    
    특정 resource를 삭제한다.
    
    ex) 만약 moneybook/1 을 `DELETE` Method 로 보냈을 때 해당되는 가계부는 삭제되고 요청에 대한 응답이 response Body에 담겨서 온다.
    
    <img width="462" alt="스크린샷 2022-02-16 오전 10 49 38" src="https://user-images.githubusercontent.com/73830753/155131397-b1621fc2-de80-4f47-87fe-932760e1b209.png">

    
- `CONNECT`
    
    client가 Proxy를 통해서 서버와 SSL 통신을 하고자 할 때 사용된다.
    
- `OPTIONS`
    
    웹 서버에서 지원되는 Method의 종류를 확인할 경우 사용한다.
    
- `PATCH`
    
    resource의 부분만을 수정하는 데 쓰인다. `PUT` 과 유사하게 resource를 update 할 때 쓰이지만 `PUT` 의 경우 resource 전체를 갱신한다는 의미지만 `PATCH` 는 해당 resource의 일부만을 수정하는데 쓰인다.
    
    ## HTTP 메서드의 속성
    
    HTTP 메서드의 속성에는 **안전(Safe Methods)**, **멱등(Idempotent Methods)**, **캐시가능(Cacheable Methods)** 이 있다.
    
    ![Untitled](https://user-images.githubusercontent.com/73830753/155131478-bd1b5fa3-098d-4962-a269-2fe288b2b83d.png)
    
    ### 안전(Safe Methods)
    
    HTTP 메서드가 서버의 상태를 바꾸지 않으면 그 메서드는 **안전**하다고 말한다. `GET` , `HEAD` , `OPTIONS` 같은 읽기 작업만 수행하는 메서드는 안전하다. 하지만 `POST` , `PUT` , `DELETE` 메서드 같은 서버의 상태를 바꾸는 메서드는 안전하지 않다고 말한다.
    
    ### 멱등(Idempotent Methods)
    
    동일한 요청을 보낼 때 한 번 보냈을 때와 여러 번 보냈을 때에 동일한 응답이 오고, 서버의 상태도 동일할 때 해당 HTTP 메서드는 **멱등성**을 가졌다고 말한다.
    
    `GET` 메서드로 아무리 많이 요청을 보내도, 같은 효과를 지니며 서버에서 돌아오는 응답은 같다. 따라서 `GET` 메서드는 멱등하다.
    
    ```python
    GET /moneybook/1 HTTP/1.1
    GET /moneybook/1 HTTP/1.1
    GET /moneybook/1 HTTP/1.1
    GET /moneybook/1 HTTP/1.1
    ```
    
    `POST` 메서드로 요청을 여러번 보내면 요청 마다 여러 열을 추가하게 된다. 요청마다 같은 효과를 지니지 않으므로 `POST` 메서드는 멱등하지 않다.
    
    ```python
    POST /moneybook HTTP/1.1
    POST /moneybook HTTP/1.1   -> Adds a 2nd row
    POST /moneybook HTTP/1.1   -> Adds a 3rd row
    ```
    
    `DELETE` 메서드에 대한 response 상태는 응답마다 달라질 수 있지만, 그럼에도 멱등성을 가진다.
    
    ```python
    DELETE /moneybook/1 HTTP/1.1   -> Returns 200 if idX exists
    DELETE /moneybook/1 HTTP/1.1   -> Returns 404 as it just got deleted
    DELETE /moneybook/1 HTTP/1.1   -> Returns 404
    ```
    
    ### 캐시 가능(Cacheable)
    
    캐시 가능한 응답(cacheable response)은 캐싱할 수 있는 HTTP 응답으로, 나중에 검색하여 사용하기 위해 요청을 서버에 저장한다. 하지만 모든 HTTP 응답이 캐시가 가능한 것은 아니다.
    
    ---
    
    ### <참고>
    
    - [https://dinding.tistory.com/41](https://dinding.tistory.com/41)
    - [https://irostub.github.io/web/idempotent/#http-메서드의-속성](https://irostub.github.io/web/idempotent/#http-%EB%A9%94%EC%84%9C%EB%93%9C%EC%9D%98-%EC%86%8D%EC%84%B1)
    - [https://developer.mozilla.org/ko/docs/Web/HTTP/Methods](https://developer.mozilla.org/ko/docs/Web/HTTP/Methods)
    - [https://kyun2da.dev/CS/http-메소드와-상태코드/](https://kyun2da.dev/CS/http-%EB%A9%94%EC%86%8C%EB%93%9C%EC%99%80-%EC%83%81%ED%83%9C%EC%BD%94%EB%93%9C/)