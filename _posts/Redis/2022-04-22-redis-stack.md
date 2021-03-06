---
title: "๐ [Redis] ์๋ก ์ถ์๋ Redis Stack์ ๋ํด ์์๋ณด์"
excerpt: "์ถ์๋ ์ง ํ ๋ฌ๋ ๋ฐ๋ํ Redis Stack์ ์ฌ์ฉํด๋ณด์"

categories:
  - Redis
tags:
  - [Redis, RedisStack]

toc: true
toc_sticky: true

date: 2022-04-22
last_modified_at: 2022-04-22
---
2022๋ 3์ 23์ ์ถ์๋ ๋ฐ๋๋ฐ๋ํ Redis Stack์ ๋ํด์ ์์๋ณด์ โจ๏ธ

Redis Stack์ ์์ ํ ๊ฐ๋ฐ์ ๊ฒฝํ์ ์ ๊ณตํ๊ธฐ ์ํด ์ต์  ๋ฐ์ดํฐ ๋ชจ๋ธ๊ณผ ์ฒ๋ฆฌ ์์ง์ ์ถ๊ฐํ๋ **Redis์ ํ์ฅ**์ด๋ค. Redis Stack์ ๊ฐ๋ฐ์๊ฐ ๋ฐ๋ฆฌ์ด ์ด๋ด์ ์์ ์ ์ผ๋ก ์์ฒญ์ ์ฒ๋ฆฌํ  ์ ์๋ ๋ฐฑ์๋ ๋ฐ์ดํฐ ํ๋ซํผ์ ์ฌ์ฉํ์ฌ ์ค์๊ฐ ์ ํ๋ฆฌ์ผ์ด์์ ๊ตฌ์ถํ  ์ ์๋๋ก ๋ง๋ค์ด์ก๋ค. Redis Stack์ ์ต์  ๋ฐ์ดํฐ ๋ชจ๋ธ ๋ฐ ๋ฐ์ดํฐ ์ฒ๋ฆฌ ๋๊ตฌ(๋ฌธ์, ๊ทธ๋ํ, ๊ฒ์ ๋ฐ ์๊ณ์ด)๋ก Redis๋ฅผ ํ์ฅํ์ฌ ์ด๋ฅผ ์ํํ๋ค.

Redis Stack์ Redis๋ฅผ *RedisJSON, RedisSearch, RedisGraph, RedisTimeSeries* ๋ฐ *RedisBloom*๊ณผ ๊ฒฐํฉํ์๋ค. ๋ํ Redis ๋ฐ์ดํฐ๋ฅผ ์ดํดํ๊ณ  ์ต์ ํํ๊ธฐ ์ํ ์๊ฐํ ๋๊ตฌ์ธ *RedisInsight*๋ ํฌํจ๋์ด ์๋ค.

ํ์ง๋ง Redis Stack์ Redis๋ฅผ ๋์ฒดํ  ์ ์๋ค. Redis Stack์ ์คํํ  ์ค๋น๊ฐ ๋๋ฉด **Redis ๋ณต์  ๋งค์ปค๋์ฆ(Redis replication mechanism)**์ ์ฌ์ฉํ๊ฑฐ๋ **RDB ๋๋ AOF ํ์ผ์ ๋ก๋ํ์ฌ ๋ฐ์ดํฐ๋ฅผ ์ฝ๊ฒ ๋ง์ด๊ทธ๋ ์ด์** ํ  ์ ์๋ค.

![image](https://user-images.githubusercontent.com/73830753/164727408-9de5456d-0cac-4882-a1af-c21f64d9ccff.png)


## Docker์์ Redis Stack ์คํ

Docker๋ฅผ ์ฌ์ฉํ์ฌ Redis Stack์ ์์ํ๋ ค๋ฉด ๋จผ์  Docker ์ด๋ฏธ์ง๋ฅผ ์ ํํด์ผ ํ๋ค.

`redis/redis-stack` ์ด๋ฏธ์ง๋ Redis Stack ์๋ฒ์ RedisInsight๋ฅผ ๋ชจ๋ ํฌํจํ๋ค. ์ด ์ปจํ์ด๋๋ ํฌํจ๋ `RedisInsight` ๋ฅผ ์ฌ์ฉํ์ฌ ๋ฐ์ดํฐ๋ฅผ ์๊ฐํํ  ์ ์์ผ๋ฏ๋ก ๋ก์ปฌ ๊ฐ๋ฐ์ ๊ฐ์ฅ ์ ํฉํ๋ค.

`redis/redis-stack-server` ์ด๋ฏธ์ง๋ Redis Stack ์๋ฒ๋ง ์ ๊ณตํ๋ค. ์ด ์ปจํ์ด๋๋ ํ๋ก๋์ ๋ฐฐํฌ์ ๊ฐ์ฅ ์ ํฉํ๋ค.

๋๋  `redis/redis-stack` ๋์ปค ์ด๋ฏธ์ง๋ฅผ ์ ํํด ๋ณด๊ฒ ๋ค. 

## Redis Replication

์์์ โRedis Stack์ Redis๋ฅผ ๋์ฒดํ  ์ ์๋คโ๋ผ๊ณ  ํ์๋ค. ๋๋ ๊ธฐ์กด์ ๊ตฌ์ฑํ๋ Redis๋ฅผ **Redis ๋ณต์  ๋งค์ปค๋์ฆ(Redis replication mechanism)**์ ์ฌ์ฉํ์ฌ Redis Stack์ ์ฐ๊ฒฐํด๋ณผ ๊ฒ์ด๋ค. Replication์ Redis์ ๋ฐ์ดํฐ๋ฅผ ๊ฑฐ์ ์ค์๊ฐ์ผ๋ก ๋ค๋ฅธ Redis ๋ธ๋์ ๋ณต์ฌํ๋ ์์์ด๋ค. 

๊ธฐ๋ณธ์ ์ผ๋ก Redis Stack Docker ์ปจํ์ด๋๋ Redis์ฉ ๋ด๋ถ ๊ตฌ์ฑ ํ์ผ์ ์ฌ์ฉํ์ง๋ง ๋ก์ปฌ ๊ตฌ์ฑ ํ์ผ๋ก๋ Redis๋ฅผ ์์ํ  ์ ์๋ค.

๋๋ redis-stack์ด๋ผ๋ ๋๋ ํ ๋ฆฌ๋ฅผ ๋ง๋ค๊ณ  ๊ทธ ์์ `local-redis-stack.conf` ๋ผ๋ ํ์ผ์ ๋ง๋ค์ด ์ฃผ์๋ค. 

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

์์ฒ๋ผ redis-stack์ ์ด ์ํ๋ port ๋ฒํธ๋ฅผ ์์ฑํ๊ณ  `replicaof masterhost masterport` ๋ฅผ ํตํด ์ํ๋ master์ ์ฐ๊ฒฐํ๋ฉด ๋๋ค. masterhost์ masterport๋ถ๋ถ์๋ ๋ณต์ ๋ฅผ ์ํ๋ ๋ง์คํฐ์ ํธ์คํธ์ ํฌํธ ๋ฒํธ๋ฅผ ๊ฐ๊ฐ ์์ฑํ๋ฉด ๋๋ค.  `repl-timeout` ํ๋ผ๋ฏธํฐ๋ ๋ง์คํฐ ์๋ฒ์ ๋ณต์  ์๋ฒ๊ฐ์ ์ฐ๊ฒฐ์ด ๋๊ฒผ๋ค๊ณ  ์ธ์ํ๋ ์๊ฐ์ด๋ค. ๋ณต์  ์๋ฒ๋ `repl-ping-replica-period` ๊ฐ๊ฒฉ์ผ๋ก ping์ ๋ณด๋ด๋๋ฐ, timeout ์๊ฐ ๋์ ์๋ต์ด ์๊ฑฐ๋ ๋ง์คํฐ ๋ก๋ถํฐ timeout ์๊ฐ ๋์ ๋ฐ์ดํฐ๊ฐ ์ค์ง ์์ผ๋ฉด ๋ง์คํฐ์์ ์ฐ๊ฒฐ์ด ๋ค์ด๋ ๊ฒ์ผ๋ก ์ธ์ํ๋ค.

```sql
$ docker run -v `pwd`/local-redis-stack.conf:/redis-stack.conf -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

conf ํ์ผ์ ์์ฑํ ๋ค์ ๋ง๋  redis-stack ๋๋ ํ ๋ฆฌ ์์์ ์ ๋ช๋ น์ด๋ฅผ ์คํํ๋ค. 

```sql
11:S 22 Apr 2022 01:42:33.897 * MASTER <-> REPLICA sync: Finished with success
```

๊ทธ๋ผ ํฐ๋ฏธ๋์ ๋ญ๊ฐ ๋ง์ด ๋จ๋ฉด์ ๋ด๋ ค๊ฐ๋๋ฐ ์์ฒ๋ผ Finished with success๊ฐ ๋ง์ง๋ง์ผ๋ก ๋์ค๋ฉด ์ฑ๊ณต์ ์ผ๋ก ์ฐ๊ฒฐ๋ ๊ฒ์ด๋ค.

## RedisInsight

RedisInsight๋ Redis ๋ฐ์ดํฐ๋ฅผ ์๊ฐํํ๊ณ  ์ต์ ํํ์ฌ ์ค์๊ฐ ์ ํ๋ฆฌ์ผ์ด์ ๊ฐ๋ฐ์ ๊ทธ ์ด๋ ๋๋ณด๋ค ์ฝ๊ณ  ์ฌ๋ฏธ์๊ฒ ๋ง๋๋ ๊ฐ๋ ฅํ ๋๊ตฌ์ด๋ค. `redis/redis-stack` ์ด๋ฏธ์ง๋ Redis Stack ์๋ฒ์ RedisInsight๋ฅผ ๋ชจ๋ ํฌํจํ๋ค. ์ฐ๋ฆฌ๊ฐ ์์์ ๋์ปค ๋จผํ์ด๋๋ฅผ ๋์ธ ๋ 8001๋ก port๋ฅผ ์ด์ด์ฃผ์์ผ๋ฏ๋ก `http://localhost:8001`๋ก ์ ์ํ๋ฉด RedisInsight๋ฅผ ๋ณผ ์ ์๋ค.

Redis์ RedisStack์ด ์ ์ฐ๊ฒฐ๋์๋์ง ํ์ธํด ๋ณด๊ธฐ ์ํด ์ฐ๊ฒฐํ master์ ๋ฐ์ดํฐ๋ฅผ ๋ฃ์ด๋ณด๊ฒ ๋ค.

![image](https://user-images.githubusercontent.com/73830753/164727488-b962ac7e-7a60-4797-8e90-84c1a3919efb.png)

์์ฒ๋ผ replicaof๋ก ์ฐ๊ฒฐํ `127.0.0.1 7000` ๋ก ๋ฐ์ดํฐ๋ฅผ ๋ฃ์ด๋ณด๋ฉด 


![image](https://user-images.githubusercontent.com/73830753/164727647-9b07b7b1-bcc0-44b9-bde4-b58396e8caa1.png)

์์ฒ๋ผ RedisInsight์์ ๋ค์ด๊ฐ ๋ฐ์ดํฐ๋ฅผ ํ์ธํ  ์ ์๋ค. ๐โจ

์ด๋ฒ ๊ธ์์๋ Redis Stack๊ณผ ๊ธฐ์กด Redis๋ฅผ Replication์ ํตํด ์ฐ๊ฒฐํด๋ณด์๋ค. ์์ง ๋์จ ์ง ์ผ๋ง ์๋์ ์ด๋ป๊ฒ ๋ ์ ํ์ฉํ  ์ ์์ ์ง ๋ชจ๋ฅด๊ฒ ์ง๋ง ์ฒ์ฒํ ์ฐ๊ตฌํด ๋ด์ผ๊ฒ ๋ค..

---

### <์ฐธ๊ณ >

[Hello, Redis Stack - Redis](https://redis.com/blog/introducing-redis-stack/)

[Introduction to Redis Stack - Redis Developer Hub](https://developer.redis.com/create/redis-stack)

[redis repl-timeout parameter](http://redisgate.kr/redis/configuration/param_repl-timeout.php)