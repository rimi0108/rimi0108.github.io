---
title: "인터넷은 어떻게 작동될까요?"
excerpt: "인터넷은 어떻게 작동될까?"

categories:
  - Internet
tags:
  - [internet]

toc: true
toc_sticky: true

date: 2022-02-05
last_modified_at: 2022-02-05
---

## 인터넷이 뭔데?

인터넷이란 우리가 사용하고 있는 한 대의 컴퓨터와 세계의 사람들이 사용하는 수많은 컴퓨터를 연결하는 통신망(network)이다. 만약 컴퓨터와 컴퓨터를 연결하는 이 통신망이 없다면 우리가 인터넷을 통해 거의 매일 사용하는 sns, 메일, 웹사이트들은 무용지물이 될 것이다. 😱


## 그래서 컴퓨터끼리 어떻게 연결되는데?

![image](https://user-images.githubusercontent.com/73830753/152638120-78965e3c-7e7e-48c9-ab44-46773654984a.png)


세상에 딱 두 개의 컴퓨터만 있다고 가정해 보자. 이 두 대의 컴퓨터는 유선 케이블이나 무선 네트워크 (wifi, bluetooth)를 통해 연결될 수 있다. 


![image](https://user-images.githubusercontent.com/73830753/152639150-44634a96-c3b6-4d96-ac84-572046a13e04.png)


하지만 두 대의 컴퓨터로는 지금 우리가 사용하는 인터넷 통신망이 형성될 수 없다!


![image](https://user-images.githubusercontent.com/73830753/152638241-d4f449a9-f1e5-4586-9458-746d732ce428.png)

세상에 존재하는 컴퓨터가 2대의 컴퓨터에서 10대의 컴퓨터로 늘어났다고 가정해보자. 케이블과 네트워크로 서로 컴퓨터가 연결된다고 한다면 아주 많은 케이블과 네트워크가 필요할 것이다. 이걸 간단하게 줄일 수 있는 방법이 없을까?

### 라우터를 사용하여 복잡한 네트워크를 간단하게 할 수 있다!

![image](https://user-images.githubusercontent.com/73830753/152639171-05eb7fc1-c1f1-425a-9b3c-ca27cfc2e9b4.png)

라우터라는 특수한 소형 컴퓨터를 사용한다면 복잡했던 그물망이 좀 더 간단해질 것이다. 


라우터는 서로 다른 네트워크 간 중계 역할을 해주는 장치이다. 라우터는 각 컴퓨터의 정보의 목적지를 올바르게 알고 도착하게 하는 역할을 한다. 이 라우터 덕분에 정보들은 복잡한 길을 거치지 않고 간단하게 목적지인 컴퓨터로 도달할 수 있다.

하지만 2 대의 컴퓨터와 마찬가지로 세상에는 10대의 컴퓨터만 존재하지 않는다 세계의 많은 사람들은 컴퓨터를 가지고 있고 서로 통신하고 있다. 어떻게 그것이 가능할까? 🤔

![image](https://user-images.githubusercontent.com/73830753/152638336-0f6e67cb-647c-4614-ae1d-67fcbb73d89f.png)

요 라우터도 역시 컴퓨터이기 때문에 라우터와 라우터 끼리의 연결이 가능하다. 한 개의 라우터로는 수 백, 수 천개의 컴퓨터의 연결이 불가능하겠지만 서로 연결된 많은 라우터가 있다면 그것이 가능해질 것이다. 

![image](https://user-images.githubusercontent.com/73830753/152638435-c9d7136c-e1de-499a-b1e2-fb4b7e034ff9.png)

위 그림처럼 라우터들은 서로 연결되어 수많은 컴퓨터를 네트워크로 연결한다. 이처럼 라우터를 이용해 수많은 컴퓨터를 네트워크로 연결하는 것이 가능해졌지만 우리가 sns를 이용해 손쉽게 만날 수 있는 다른 나라의 컴퓨터들까지 연결할 수는 없다. 

### 전화선을 사용하여 전 세계 사람들과 연결되다

![image](https://user-images.githubusercontent.com/73830753/152638554-cd655283-01ab-4dca-ad5f-3f88eb034a55.png)

https://kor.digiist.com/gadgets/what-is-difference-between-modem-8337357.html

하지만 전 세계적으로 이미 연결된 케이블을 사용한다면 가능해진다. 바로 우리가 매일 이용하고 있는 전화선이다. 이 전화선에 네트워크를 연결하기 위해서는 모뎀이라는 특수 장비가 필요하다. 모뎀은 네트워크 정보를 전화 시설에서 이용할 수 있는 정보로 바꿔준다.


![image](https://user-images.githubusercontent.com/73830753/152638737-c9b1b663-4941-42c7-9983-a354a7ff655b.png)

전화 시설은 먼 곳에 있는 네트워크로 도달하기 위해 ISP(Internet Service Provider, 우리나라에서 통신사 SKT, KT, LGU+ 같은 것)에 연결된다. ISP는 다른 ISP 라우터에도 연결이 가능하다. 최종적으로 네트워크 정보는 ISP 네트워크를 통해 다른 네트워크로 전송된다. 인터넷은 이런 네트워크들이 모여 작동된다. 

![image](https://user-images.githubusercontent.com/73830753/152639004-11019e03-8c76-41cf-9336-1b4b3ed559cd.png)

<참고>

https://developer.mozilla.org/ko/docs/Learn/Common_questions/How_does_the_Internet_work