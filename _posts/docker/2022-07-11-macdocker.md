---
title: "🐳 [Docker] Mac에서의 Docker 제한 사항들"
excerpt: "킹받네.."

categories:
  - Docker
tags:
  - [Docker]

toc: true
toc_sticky: true

date: 2022-07-01
last_modified_at: 2022-07-01
---

## MacOS에서는 docker0 브리지가 없다.

Mac용 Docker Desktop에서 네트워킹이 구현되는 방식 때문에 호스트에서 `docker0` 인터페이스를 볼 수 없다.

```bash
$ ifconfig docker0
ifconfig: interface docker0 does not exist
```

실제로 터미널에서 위 명령어를 입력하면 `docker0` 인터페이스가 존재하지 않는다고 나온다.

### 컨테이너에 ping할 수 없다.

Mac용 Docker Desktop은 트래픽을 컨테이너로 라우팅 할 수 없다.

```
$ ping 192.168.80.4
PING 192.168.80.4 (192.168.80.4): 56 data bytes
Request timeout for icmp_seq 0
Request timeout for icmp_seq 1
Request timeout for icmp_seq 2
Request timeout for icmp_seq 3
Request timeout for icmp_seq 4
Request timeout for icmp_seq 5
```

위처럼 로컬 터미널에서 도커 컨테이너 내부 ip로 ping을 보내면 timeout이 발생한다. (이거 mac아니면 다 되는 건가요..?)

### 컨테이너별 IP 주소 지정이 불가능하다.

macOS 호스트에서 도커(Linux) 브리지 네트워크에 연결할 수 없다. (킹받는다)
