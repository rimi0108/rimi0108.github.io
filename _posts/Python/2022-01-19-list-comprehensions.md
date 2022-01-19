---
title: "[Python] 리스트 내포(list comprehensions)"
excerpt: "Python list comprehensions"

categories:
  - Python
tags:
  - [list, python]

toc: true
toc_sticky: true

date: 2022-01-19
last_modified_at: 2022-01-19
---

프로그램을 만들때는 반복문을 사용하여 리스트를 재조합하는 경우가 많다.

```python
array = []

for i in range(10):
    array.append(i)

print(array)
```

```python
# 결과
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

위처럼 range로 반복하여 list array에 숫자를 차례대로 넣는 코드를 리스트 내포(list comprehensions)을 사용하면 한 줄로 줄일 수 있다.

```python
array = [i for i in range(10)]

print(array)
```

짠. 3줄이었던 코드가 한 줄로 줄었다.

```
리스트 이름 = [표현식 for 반복자 in 반복할 수 있는 것 ]
```

위와 같은 형태로 리스트 내포를 사용할 수 있다.

## if 구문 넣어서 리스트 내포 사용해보기

if 구문을 넣어 조건을 조합할 수도 있다.

```python
animals = ['사자', '토끼', '호랑이', '강아지', '고양이']

output = [animal for animal in animals if animal != '호랑이']

print(output)
```

```python
# 결과
['사자', '토끼', '강아지', '고양이']
```

호랑이는 뺀다는 조건 대로 호랑이는 빠진 list가 출력되었다.

```python
리스트 이름 = [표현식 for 반복자 in 반복할 수 있는 것 if 조건문]
```

if 구문을 포함한 리스트 내포는 위와 같은 형태로 사용한다.

---

<참고>

- 혼자 공부하는 파이썬 (도서)
