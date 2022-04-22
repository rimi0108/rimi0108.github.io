---
title: "🍒 [Redis] 새로 출시된 Redis Stack에 대해 알아보자"
excerpt: "출시된 지 한 달된 따끈한 Redis Stack을 사용해보자"

categories:
  - Redis
tags:
  - [Redis, RedisStack]

toc: true
toc_sticky: true

date: 2022-04-22
last_modified_at: 2022-04-22
---
2022년 3월 23에 출시된 따끈따끈한 Redis Stack에 대해서 알아보자 ♨️

Redis Stack은 완전한 개발자 경험을 제공하기 위해 최신 데이터 모델과 처리 엔진을 추가하는 **Redis의 확장**이다. Redis Stack은 개발자가 밀리초 이내에 안정적으로 요청을 처리할 수 있는 백엔드 데이터 플랫폼을 사용하여 실시간 애플리케이션을 구축할 수 있도록 만들어졌다. Redis Stack은 최신 데이터 모델 및 데이터 처리 도구(문서, 그래프, 검색 및 시계열)로 Redis를 확장하여 이를 수행한다.

Redis Stack은 Redis를 *RedisJSON, RedisSearch, RedisGraph, RedisTimeSeries* 및 *RedisBloom*과 결합하였다. 또한 Redis 데이터를 이해하고 최적화하기 위한 시각화 도구인 *RedisInsight*도 포함되어 있다.

하지만 Redis Stack은 Redis를 대체할 수 없다. Redis Stack을 실행할 준비가 되면 **Redis 복제 매커니즘(Redis replication mechanism)**을 사용하거나 **RDB 또는 AOF 파일을 로드하여 데이터를 쉽게 마이그레이션** 할 수 있다.

![image](https://user-images.githubusercontent.com/73830753/164727408-9de5456d-0cac-4882-a1af-c21f64d9ccff.png)


## Docker에서 Redis Stack 실행

Docker를 사용하여 Redis Stack을 시작하려면 먼저 Docker 이미지를 선택해야 한다.

`redis/redis-stack` 이미지는 Redis Stack 서버와 RedisInsight를 모두 포함한다. 이 컨테이너는 포함된 `RedisInsight` 를 사용하여 데이터를 시각화할 수 있으므로 로컬 개발에 가장 적합하다.

`redis/redis-stack-server` 이미지는 Redis Stack 서버만 제공한다. 이 컨테이너는 프로덕션 배포에 가장 적합하다.

나는  `redis/redis-stack` 도커 이미지를 선택해 보겠다. 

## Redis Replication

위에서 ‘Redis Stack은 Redis를 대체할 수 없다’라고 하였다. 나는 기존에 구성했던 Redis를 **Redis 복제 매커니즘(Redis replication mechanism)**을 사용하여 Redis Stack에 연결해볼 것이다. Replication은 Redis의 데이터를 거의 실시간으로 다른 Redis 노드에 복사하는 작업이다. 

기본적으로 Redis Stack Docker 컨테이너는 Redis용 내부 구성 파일을 사용하지만 로컬 구성 파일로도 Redis를 시작할 수 있다.

나는 redis-stack이라는 디렉토리를 만들고 그 안에 `local-redis-stack.conf` 라는 파일을 만들어 주었다. 

```sql
$ mkdir redis-stack && cd redis-stack
```

```sql
# local-redis-stack.conf
port 6379
replicaof 127.0.0.1 7000
repl-ping-replica-period 10
repl-timeout 60
```

위처럼 redis-stack을 열 원하는 port 번호를 작성하고 `replicaof masterhost masterport` 를 통해 원하는 master에 연결하면 된다. masterhost와 masterport부분에는 복제를 원하는 마스터의 호스트와 포트 번호를 각각 작성하면 된다.  `repl-timeout` 파라미터는 마스터 서버와 복제 서버간에 연결이 끊겼다고 인식하는 시간이다. 복제 서버는 `repl-ping-replica-period` 간격으로 ping을 보내는데, timeout 시간 동안 응답이 없거나 마스터 로부터 timeout 시간 동안 데이터가 오지 않으면 마스터와의 연결이 다운된 것으로 인식한다.

```sql
$ docker run -v `pwd`/local-redis-stack.conf:/redis-stack.conf -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

conf 파일을 작성한 다음 만든 redis-stack 디렉토리 안에서 위 명령어를 실행한다. 

```sql
11:S 22 Apr 2022 01:42:33.897 * MASTER <-> REPLICA sync: Finished with success
```

그럼 터미널에 뭐가 많이 뜨면서 내려가는데 위처럼 Finished with success가 마지막으로 나오면 성공적으로 연결된 것이다.

## RedisInsight

RedisInsight는 Redis 데이터를 시각화하고 최적화하여 실시간 애플리케이션 개발을 그 어느 때보다 쉽고 재미있게 만드는 강력한 도구이다. `redis/redis-stack` 이미지는 Redis Stack 서버와 RedisInsight를 모두 포함한다. 우리가 위에서 도커 먼테이너를 띄울 때 8001로 port를 열어주었으므로 `http://localhost:8001`로 접속하면 RedisInsight를 볼 수 있다.

Redis와 RedisStack이 잘 연결되었는지 확인해 보기 위해 연결한 master에 데이터를 넣어보겠다.

![image](https://user-images.githubusercontent.com/73830753/164727488-b962ac7e-7a60-4797-8e90-84c1a3919efb.png)

위처럼 replicaof로 연결한 `127.0.0.1 7000` 로 데이터를 넣어보면 


![image](https://user-images.githubusercontent.com/73830753/164727647-9b07b7b1-bcc0-44b9-bde4-b58396e8caa1.png)

위처럼 RedisInsight에서 들어간 데이터를 확인할 수 있다. 😉✨

이번 글에서는 Redis Stack과 기존 Redis를 Replication을 통해 연결해보았다. 아직 나온 지 얼마 안되서 어떻게 더 잘 활용할 수 있을 지 모르겠지만 천천히 연구해 봐야겠다..

---

### <참고>

[Hello, Redis Stack - Redis](https://redis.com/blog/introducing-redis-stack/)

[Introduction to Redis Stack - Redis Developer Hub](https://developer.redis.com/create/redis-stack)

[redis repl-timeout parameter](http://redisgate.kr/redis/configuration/param_repl-timeout.php)