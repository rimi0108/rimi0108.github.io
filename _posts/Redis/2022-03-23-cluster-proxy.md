---
title: "[Redis] Predixy를 이용하여 Cluster Proxy 구성하기"
excerpt: "Predixy를 이용하여 Cluster Proxy를 구성해보자. (+ HAProxy 삽질기)"

categories:
  - Redis
tags:
  - [Redis, Predixy, Cluster]

toc: true
toc_sticky: true

date: 2022-03-23
last_modified_at: 2022-03-23
---

Redis Cluster의 Cluster Client는 Cluster를 구성하는 모든 Redis와 **Network로 직접 연결**되어 있어야 한다는 특성을 갖고 있다. 즉 Redis Cluster의 각 Redis node들은 Cluster Client를 위한 End-point를 반드시 하나 이상 갖고 있어야 한다. 이러한 특징 때문에 Cluster를 구성하는 Redis node들의 개수 또는 Cluster Client의 개수가 늘어날수록 Network Connection은 기하급수적으로 늘어나게 된다. 이러한 문제점을 해결하기 위해서 **Cluster Proxy**를 사용해야 한다.

## Cluster Proxy란

> Cluster Proxy는 Proxy Client에게 일정한 End-point를 제공한다. Cluster Proxy에는 *corvus, predixy* 같은 애플리케이션이 있다. Cluster Proxy는 요청 Redirection 같은 Redis Cluster만을 위한 추가적인 동작이 필요하기 때문에 <span style="color: #EF5350">**HAProxy 같은 범용 Proxy를 Cluster Proxy로 이용하지 못한다**</span>. Redis Master - Slave의 HAProxy처럼 다수의 Cluster Proxy를 L4 Load Balancer 및 VRRP를 이용하여 Cluster Proxy의 HA를 보장하도록 구성하는 것이 좋다.
> 

나는 HAProxy를 Cluster Proxy로 이용했는데 데이터 통신이 안돼서 ~~외않되?~~ 한참 삽질하다 위같은 이유 때문에 안된다는 것을 알았다! 😶  오늘도 멍청 포인트 적립! (사수님이 안가르쳐 주셨으면 저기 땅끝까지 파고 있었을듯..?) 어쨌든, HAProxy 대신 위에 나와있는 [predixy](https://github.com/joyieldInc/predixy)를 Cluster Proxy로 사용해보겠다.

Cluster Proxy를 사용하면 여러 개의 Cluster node들에 직접 접근하지 않아도 **Proxy 포트 하나로 접근이 가능**하다. 위에 언급한 것처럼 Redis node들의 개수 또는 Cluster Client의 개수가 늘어날수록 Network Connection이 기하급수적으로 늘어나는 일을 막을 수 있는 것이다.

## Predixy 적용하기

1. predixy 레포를 clone 해와서 디렉토리 안으로 들어간다.

```
$ git clone https://github.com/joyieldInc/predixy.git 
$ cd predixy
```

2. make 명령어를 입력한다. 뭐가 밑에 막 뜰 것이다..

```
$ make
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c Crc16.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c HashFunc.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c Timer.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c Logger.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c LogFileSink.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c Alloc.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c Socket.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c ListenSocket.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c AcceptSocket.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c ConnectSocket.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c KqueueMultiplexor.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c Subscribe.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c Connection.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c AcceptConnection.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c ConnectConnection.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c Buffer.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c Command.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c Distribution.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c Enums.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c Reply.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c ConfParser.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c Conf.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c Auth.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c DC.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c LatencyMonitor.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c RequestParser.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c Request.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c ResponseParser.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c Response.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c Server.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c ServerGroup.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c ServerPool.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c ClusterNodesParser.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c ClusterServerPool.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c StandaloneServerPool.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c ConnectConnectionPool.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c Handler.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c Proxy.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -c main.cpp 
c++ -std=c++11 -Wall -w -g -O3 -D_PREDIXY_BACKTRACE_ -D_KQUEUE_ -o predixy Crc16.o HashFunc.o Timer.o Logger.o LogFileSink.o Alloc.o Socket.o ListenSocket.o AcceptSocket.o ConnectSocket.o KqueueMultiplexor.o Subscribe.o Connection.o AcceptConnection.o ConnectConnection.o Buffer.o Command.o Distribution.o Enums.o Reply.o ConfParser.o Conf.o Auth.o DC.o LatencyMonitor.o RequestParser.o Request.o ResponseParser.o Response.o Server.o ServerGroup.o ServerPool.o ClusterNodesParser.o ClusterServerPool.o StandaloneServerPool.o ConnectConnectionPool.o Handler.o Proxy.o main.o -static-libstdc++ -rdynamic -lpthread
```

3. predixy 소스들을 `/usr/local/bin` 폴더로 복사해주고 `predixy -h` 명령어를 입력했을 때 설명 문구가 나오면 설치에 성공한 것이다.

```
$ cp src/predixy /usr/local/bin
$ predixy -h
Usage: 
   predixy <conf-file> [options]
   predixy -h or --help
   predixy -v or --version

Options:
   --Name=name        set current service name
   --Bind=addr        set bind address, eg:127.0.0.1:7617, /tmp/predixy
   --WorkerThreads=N  set worker threads
```

4. conf 폴더에 들어가면 여러 기본 설정 파일들이 있다. 이 파일들을 자신이 원하는 설정으로 변경해주면 된다.

```reason
$ cd conf
```
<img width="311" alt="스크린샷 2022-03-23 오후 3 58 09" src="https://user-images.githubusercontent.com/73830753/159692984-222430dd-75a9-4a30-a817-30e5d0ef81f7.png">


여기서 `predixy.conf` 파일과 `cluster.conf` 파일을 변경해보자!

```
# predixy.conf

################################### GENERAL ####################################
## Predixy configuration file example

## Specify a name for this predixy service
## redis command INFO can get this
Name PredixyExample

## Specify listen address, support IPV4, IPV6, Unix socket
## Examples:
# Bind 127.0.0.1:7617
# Bind 0.0.0.0:7617
# Bind /tmp/predixy

# 변경!
## Default is 0.0.0.0:7617
Bind 0.0.0.0:7617

## Worker threads
WorkerThreads 4

## Memory limit, 0 means unlimited

## Examples:
# MaxMemory 100M
# MaxMemory 1G
# MaxMemory 0

## MaxMemory can change online by CONFIG SET MaxMemory xxx
## Default is 0
MaxMemory 0

## Close the connection after a client is idle for N seconds (0 to disable)
## ClientTimeout can change online by CONFIG SET ClientTimeout N
## Default is 0
ClientTimeout 300

## IO buffer size
## Default is 4096
# BufSize 4096

################################### LOG ########################################
## Log file path
## Unspecify will log to stdout
## Default is Unspecified
Log ./predixy.log

## LogRotate support

## 1d rotate log every day
## nh rotate log every n hours   1 <= n <= 24
## nm rotate log every n minutes 1 <= n <= 1440
## nG rotate log evenry nG bytes
## nM rotate log evenry nM bytes
## time rotate and size rotate can combine eg 1h 2G, means 1h or 2G roate a time

## Examples:
# LogRotate 1d 2G
# LogRotate 1d

## Default is disable LogRotate

## In multi-threads, worker thread log need lock,
## AllowMissLog can reduce lock time for improve performance
## AllowMissLog can change online by CONFIG SET AllowMissLog true|false
## Default is true
# AllowMissLog false

## LogLevelSample, output a log every N
## all level sample can change online by CONFIG SET LogXXXSample N
LogVerbSample 0
LogDebugSample 0
LogInfoSample 10000
LogNoticeSample 1
LogWarnSample 1
LogErrorSample 1

################################### AUTHORITY ##################################
Include auth.conf

# 변경!
################################### SERVERS ####################################
Include cluster.conf
# Include sentinel.conf
# Include try.conf

################################### DATACENTER #################################
## LocalDC specify current machine dc
# LocalDC bj

## see dc.conf
# Include dc.conf

################################### COMMAND ####################################
## Custom command define, see command.conf
#Include command.conf

################################### LATENCY ####################################
## Latency monitor define, see latency.conf
Include latency.conf
```

주석 처리 된 port를 활성화하고 `try.conf` 대신 `cluster.conf` 로 서버 설정을 바꾼다. 여기서 설정한 port 번호는 proxy에 접근할 수 있는 port 번호가 된다.

```
# cluster.conf

## redis cluster server pool define

##ClusterServerPool {
##    [Password xxx]                        #default no
##    [MasterReadPriority [0-100]]          #default 50
##    [StaticSlaveReadPriority [0-100]]     #default 0
##    [DynamicSlaveReadPriority [0-100]]    #default 0
##    [RefreshInterval number[s|ms|us]]     #default 1, means 1 second
##    [ServerTimeout number[s|ms|us]]       #default 0, server connection socket read/write timeout
##    [ServerFailureLimit number]           #default 10
##    [ServerRetryTimeout number[s|ms|us]]  #default 1
##    [KeepAlive seconds]                   #default 0, server connection tcp keepalive

##    Servers {
##        + addr
##        ...
##    }
##}

# 변경!
## Examples:
ClusterServerPool {
    MasterReadPriority 60
    StaticSlaveReadPriority 50
    DynamicSlaveReadPriority 50
    RefreshInterval 1
    ServerTimeout 1
    ServerFailureLimit 10
    ServerRetryTimeout 1
    Servers {
        + 127.0.0.1:6300
        + 127.0.0.1:6301
        + 127.0.0.1:6302
        + 127.0.0.1:6400
        + 127.0.0.1:6401
        + 127.0.0.1:6402
    }
}
```

`cluster.conf` 파일에서는 주석 처리되어있던 Examples 밑 코드를 주석을 풀고 활성화 시키면 된다.

```reason
Servers {
        + 127.0.0.1:6300
        + 127.0.0.1:6301
        + 127.0.0.1:6302
        + 127.0.0.1:6400
        + 127.0.0.1:6401
        + 127.0.0.1:6402
    }
}
```

요 부분에 host 번호:port 번호는 자신이 띄운 redis cluster node들의 주소를 적으면 된다. 이 글에서는 redis cluster에 대한 설명은 따로 하지 않겠다. 참고로 앞의 `+` 기호는 지우면 안된다!

5. predixy 실행

```
$ predixy conf/predixy.conf
```

위 명령어를 입력하여 오류가 뜨지 않는다면 성공한 것이다! 만약 오류가 뜬다면 현재 경로를 잘 확인하자.

```
$ redis-cli -p 7617
127.0.0.1:7617> info
# Proxy
Version:1.0.5
Name:PredixyExample
Bind:0.0.0.0:7617
RedisMode:proxy
SingleThread:false
WorkerThreads:4
Uptime:1648019761
UptimeSince:2022-03-23 16:16:01

# SystemResource
UsedMemory:135104
MaxMemory:0
MaxRSS:1879048192
UsedCpuSys:0.035
UsedCpuUser:0.021

# Stats
Accept:1
ClientConnections:1
TotalRequests:92
TotalResponses:91
TotalRecvClientBytes:57
TotalSendServerBytes:2060
TotalRecvServerBytes:40125
TotalSendClientBytes:174

# Servers
Server:127.0.0.1:6300
Role:slave
Group:f56d814caed9eb15c593df6cd6b1f63a1c393ea6
DC:
CurrentIsFail:0
Connections:4
Connect:4
Requests:20
Responses:20
SendBytes:464
RecvBytes:9084

Server:127.0.0.1:6301
Role:slave
Group:6a76e67f1866689a8ba588c0f51d2f53f0c54fda
DC:
CurrentIsFail:0
Connections:2
Connect:2
Requests:14
Responses:14
SendBytes:344
RecvBytes:7554

Server:127.0.0.1:6302
Role:master
Group:6065507d0a658150b2a1d279cd4970ff58981295
DC:
CurrentIsFail:0
Connections:3
Connect:3
Requests:14
Responses:14
SendBytes:320
RecvBytes:6060

Server:127.0.0.1:6400
Role:master
Group:f56d814caed9eb15c593df6cd6b1f63a1c393ea6
DC:
CurrentIsFail:0
Connections:2
Connect:2
Requests:11
Responses:11
SendBytes:260
RecvBytes:5295

Server:127.0.0.1:6401
Role:master
Group:6a76e67f1866689a8ba588c0f51d2f53f0c54fda
DC:
CurrentIsFail:0
Connections:3
Connect:3
Requests:13
Responses:13
SendBytes:292
RecvBytes:5307

Server:127.0.0.1:6402
Role:slave
Group:6065507d0a658150b2a1d279cd4970ff58981295
DC:
CurrentIsFail:0
Connections:4
Connect:4
Requests:17
Responses:17
SendBytes:380
RecvBytes:6825

# LatencyMonitor
LatencyMonitorName:all
<=          100                   37                2 100.00%
T            18                   37                2

LatencyMonitorName:get

LatencyMonitorName:set

LatencyMonitorName:blist
```

위에서 설정한 port로 redis-cli에 접근하여 info를 보면 연결한 redis cluster node들이 server로 잘 떠있는 것을 확인할 수 있다.

이제 자신의 프로젝트에서 redis url을 `redis://10.0.0.3:7617` 이렇게 설정해주고 통신하면 데이터들이 redis cluster로 잘 분산되어 샤딩되는 것을 확인할 수 있다. 👀  야호~

## Docker에서 Predixy 사용하기

만약에 Docker에서 Predixy를 띄워 사용하고 싶으신 분은 https://github.com/haandol/predixy 요기 다른 분이 올려놓으신 깃허브 참고 하시면 아주 도움이 될 것 같다!

*모두 모두 저처럼 삽질 하지 마시고 행.코 하세요 ㅎ*

---

### <참고>

- [https://haandol.github.io/2018/09/07/redis-cluster-predixy.html#fn:2](https://haandol.github.io/2018/09/07/redis-cluster-predixy.html#fn:2)
- [https://ssoco.tistory.com/18](https://ssoco.tistory.com/18)
- [https://co-de.tistory.com/m/25](https://co-de.tistory.com/m/25)