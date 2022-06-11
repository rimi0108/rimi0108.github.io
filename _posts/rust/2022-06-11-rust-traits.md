---
title: "🦀 [Rust] Rust의 특징"
excerpt: "Rust의 특징에 대해 알아보자"

categories:
  - Rust
tags:
  - [Rust]

toc: true
toc_sticky: true

date: 2022-06-11
last_modified_at: 2022-06-11
---

<!-- ![image](https://user-images.githubusercontent.com/73830753/173180448-cdab95f7-37b1-4f13-9f31-a27d879b4cc9.png) -->

<p align="center"><img src="https://user-images.githubusercontent.com/73830753/173180448-cdab95f7-37b1-4f13-9f31-a27d879b4cc9.png" width="400" height="250"/></p>

[https://rustacean.net/](https://rustacean.net/)

러스트의 마스코트 Ferris (귀엽다)

## 1. 안전한 메모리 관리

Rust는 소유권(Ownership)과 수명(Lifetime)을 통해 안전하게 메모리를 관리한다.

### 소유권 (Ownership)

Rust에는 메모리를 관리하는 **소유권** 시스템이 포함되어 있다. 소유권 시스템은 러스트의 핵심 기능이다.

모든 프로그램은 실행하는 동안 컴퓨터의 메모리를 사용하는 방법을 관리해야 한다. 몇몇 언어들은 프로그램이 실행될 때 더이상 사용하지 않는 메모리를 끊임없이 찾는 *가비지 콜렉션*을 갖고 있다. 다른 언어들에서는 프로그래머가 직접 명시적으로 메모리를 할당하고 해제해야 한다. 하지만 러스트에서 메모리는 컴파일 타임에 컴파일러가 체크할 규칙들로 구성된 **소유권 시스템을 통해 관리**된다. 러스트는 **가비지 컬렉터 없이 메모리 안전성을 제공**한다.

```rust
// 이 함수는 힙 할당 메모리의 소유권을 가져온다.
fn destroy_box(c: Box<i32>) {
    println!("Destroying a box that contains {}", c);

    // 변수 c는 파괴되고 메모리는 해제된다.
}

fn main() {
    let x = 5u32;

    // x를 y로 복사했다. - 자원은 이동되지 않는다.
    let y = x;

    // 변수 x와 y의 값은 독립적으로 사용될 수 있다.
    println!("x is {}, and y is {}", x, y);

    let a = Box::new(5i32);

    println!("a contains: {}", a);

    // a가 b로 이동했다.
    let b = a;
    // a의 주소가 b로 이동되었다. (데이터 자체는 이동하지 않는다.)
    // a와 b 둘 다 동일한 힙 할당 데이터에 대한 포인터이지만 이제 "b"가 데이터를 소유한다.

    // 오류! "a"가 더 이상 힙 메모리를 소유하지 않으므로 데이터에 더 이상 액세스할 수 없다.
    //println!("a contains: {}", a);

		// destroy_box 함수에 b의 힙 할당 메모리의 소유권을 이전한다.
    destroy_box(b);

    // b의 소유권이 destroy_box 함수로 이동했으므로 에러가 발생한다.
    //println!("b contains: {}", b);
}
```

### 수명(Lifetime)

rust 변수의 수명은 생성될 때 시작되고 소멸될 때 끝난다.

```rust
// 각 변수의 생성 및 소멸을 나타내는 선이 아래에 설명되어 있다.
fn main() {
    let i = 3; // i의 수명(Lifetime)이 시작된다. ──────────────┐
    //                                                     │
    { //                                                   │
        let borrow1 = &i; // borrow1의 수명이 시작된다. ──┐│
        //                                                ││
        println!("borrow1: {}", borrow1); //              ││
    } // `borrow1가 소멸된다. ───────────────────────────┘│
    //                                                     │
    //                                                     │
    { //                                                   │
        let borrow2 = &i; // borrow2의 수명이 시작된다. ──┐│
        //                                                ││
        println!("borrow2: {}", borrow2); //              ││
    } // `borrow2가 소멸된다. ───────────────────────────┘│
    //                                                     │
}   // Lifetime ends. ─────────────────────────────────────┘
```

## 2. null을 허용하지 않는다

러스트는 `null` 특성을 가지고 있지 않다. 다른 많은 언어에서 `null` 이나 `nil` 을 사용하여 모델링하지만 Rust는 `null` 을 허용하지 않는다. _즉, Rust는 값이 선택적인 경우에 대해 명시적이다._

러스트에는 null이 없지만, 값의 존재 혹은 부재의 개념을 표현할 수 있는 *열거형*이 있다. 이 열거형은 `Option<T>` 이며, 다음과 같이 표준 라이브러리에 정의되어 있다.

```rust
enum Option<T> {
    Some(T),
    None,
}
```

`Option<T>` 은 위와 같이 `Some(T)` 또는 `None` 둘 중 하나로 지정 될 수 있으며 `None` 이 기존 프로그래밍 언어의 `null` 역할을 담당한다.

## 2. 명확한 에러 처리 (예외처리 x)

오류는 소프트웨어에 있어 매우 중요하다. Rust는 무언가 잘못되는 상황을 처리하기 위한 많은 기능을 가지고 있다. 많은 경우에, Rust는 오류 가능성을 인정하고 코드가 컴파일되기 전에 어떤 조치를 취하도록 요구한다. 이 요구 사항은 코드를 프로덕션에 배포하기 전에 오류를 발견하고 적절하게 처리하도록 함으로써 프로그램을 더욱 강력하게 만든다.
*Rust는 오류를 \*\*복구 가능한* 오류** 와 \***복구 불가능한* 오류\*\* 의 두 가지 주요 범주로 분류한다. *파일을 찾을 수 없음\* 오류와 같은 복구 가능한 오류 의 경우 사용자에게 문제를 보고하고 작업을 다시 시도하기를 원할 가능성이 클 때 사용한다. 복구할 수 없는 오류는 즉시 프로그램을 중지하고 싶을 때 사용한다.
대부분의 언어는 이러한 두 종류의 오류를 구분하지 않고 예외와 같은 메커니즘을 사용하여 동일한 방식으로 둘 다를 처리한다. **Rust에는 예외가 없다**. 대신 복구 가능한 오류 유형 `Result<T, E>`과 `panic!`프로그램에서 복구 불가능한 오류가 발생하면 실행을 중지하는 매크로가 있다.

## 3. 연관된 데이터들을 구조체로 다룬다

구조체(struct)는 사용자들이 연관된 여러 값들을 묶어서 의미있는 데이터 단위를 정의할 수 있게 한다. 객체 지향 언어를 사용해 본적이 있다면, 구조체(struct)는 객체의 데이터 속성 같은 것으로 보면 된다.

구조체는 튜플과 비슷하다. 튜플과 유사하게, 구조체의 구성요소들은 각자 다른 타입을 지닐 수 있다. 그러나 튜플과는 다르게 각 구성요소들은 명명할 수 있어 값이 의미하는 바를 명확하게 인지할 수 있다. 구조체는 각 구성요소들에 명명을 할 수 있다는 점 덕분에 튜플보다 유연하게 다룰 수 있다. 구조체의 특정 요소 데이터 명세를 기술하거나, 접근할 때 순서에 의존할 필요가 없기 때문이다.

구조체를 정의할 때는 `struct` 키워드를 먼저 입력하고 명명할 구조체명을 입력하면 된다. 구조체의 이름은 함께 묶이게 되는 구성요소들의 의미를 내포할 수 있도록 짓는 것이 좋다. 이후 중괄호 안에서는, 필드(field)라고 불리는 각 구성 요소들의 타입과 접근할 수 있는 이름을 정의한다.

```rust
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}
```

## 4. 컬렉션

러스트의 표준 라이브러리에는 *컬렉션*이라 불리는 여러 개의 매우 유용한 데이터 구조들이 포함되어 있다. 대부분의 다른 데이터 타입들은 하나의 특정한 값을 나타내지만, 컬렉션은 다수의 값을 담을 수 있다.

러스트 프로그램에는 굉장히 자주 사용되는 세 가지 컬렉션이 있다.

- 벡터(vector)

  - 여러 개의 값을 서로 붙어 있게 저장할 수 있도록 해준다.

  ```rust
  let v: Vec<i32> = Vec::new();

  let v2 = vec![1, 2, 3];
  ```

- 스트링(string)

  - 문자(character)의 모음이다.

  ```rust
  let mut s = String::new();
  ```

- 해쉬맵(hash map)

  - 어떤 값을 특정한 키와 연관지어 주도록 한다.
  - 이는 맵(map)이라 일컫는 좀 더 일반적인 데이터 구조의 특정한 구현 형태이다.

  ```rust
  use std::collections::HashMap;

  let mut scores = HashMap::new();

  scores.insert(String::from("Blue"), 10);
  scores.insert(String::from("Yellow"), 50);
  ```

이 외에도 많은 컬렉션이 존재한다.

---

### <참고>

- [https://rinthel.github.io/rust-lang-book-ko/foreword.html](https://rinthel.github.io/rust-lang-book-ko/foreword.html)
- [https://doc.rust-lang.org/rust-by-example/index.html](https://doc.rust-lang.org/rust-by-example/index.html)
