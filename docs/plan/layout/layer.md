# 3 Layers 아키텍처 기준

> 기준 문서: `docs/plan/layout/architecture.md`

## 1. 목적

이 문서는 웹 프론트엔드에서 사용하는 3 layers 아키텍처의 최소 기준만 정의한다.

이 문서에서 말하는 3 layers는 아래와 같이 본다.

- Presentation Layer: `컴포넌트 + 훅`
- Business Layer: `서비스`
- Data Access Layer: `레포지토리`

서버는 프론트엔드 외부 시스템이다.

## 2. 데이터 흐름

```text
컴포넌트 -> 훅 -> 서비스 -> 레포지토리 -> 서버
```

의존성은 한 방향으로만 흐른다.

- 컴포넌트는 훅을 사용한다.
- 훅은 서비스를 사용한다.
- 서비스는 레포지토리를 사용한다.
- 레포지토리는 서버와 통신한다.
- 아래 계층이 위 계층을 참조하면 안 된다.

## 3. 계층 정의

### 컴포넌트

- UI 렌더링과 사용자 이벤트 처리만 담당한다.
- 화면 구성, 버튼 클릭, 입력 필드 연결, props 전달까지만 맡는다.
- API 요청, 입력 검증, 응답 데이터 가공 로직을 직접 가지지 않는다.

### 훅

- 로그인 상태와 UI 상태 관리를 담당한다.
- 컴포넌트에 종속적인 상태, 로딩 상태, 에러 상태, 이벤트 핸들러 조합을 맡는다.
- 서비스 호출 결과를 화면에서 쓰기 좋은 상태로 묶는다.
- 서버 통신 세부 구현이나 비즈니스 규칙을 직접 가지지 않는다.

### 서비스

- 입력 검증과 비즈니스 로직 처리를 담당한다.
- 조건 분기, 규칙 검사, 요청 파라미터 조립, 응답 해석을 맡는다.
- 여러 레포지토리 호출이 필요하면 서비스에서 조합한다.
- UI 상태나 HTTP 클라이언트 세부 구현을 직접 가지지 않는다.

### 레포지토리

- API 요청과 응답 처리를 담당한다.
- HTTP 요청, 응답 파싱, 에러 정규화, DTO 매핑을 맡는다.
- 서버 엔드포인트가 바뀌어도 영향 범위가 이 계층에 모이도록 한다.
- 검증 규칙, 화면 상태, 사용자 흐름 분기를 직접 가지지 않는다.

### 서버

- 이메일/비밀번호 검증 후 인증 결과 반환 같은 실제 처리 주체다.
- 프론트엔드는 서버 내부 구현을 알 필요가 없다.

## 4. 웹 프론트엔드 기준 규칙

- 컴포넌트에서 레포지토리를 직접 호출하지 않는다.
- 훅에서 HTTP 요청 코드를 직접 작성하지 않는다.
- 서비스에서 React 상태를 직접 만들지 않는다.
- 레포지토리에서 비즈니스 규칙을 판단하지 않는다.
- URL에서 파생 가능한 상태는 전역 store에 중복 저장하지 않는다.
  - 이 기준은 `architecture.md`의 `redirectTo`, `activeTab`, `selectedShortcode`, `isOverlayOpen` 규칙과 동일하다.

## 5. 로그인 예시

```text
LoginForm(Component)
-> useLogin(Hook)
-> loginService(Service)
-> authRepository(Repository)
-> Auth Server
```

- `LoginForm`: 이메일/비밀번호 입력과 submit 이벤트 처리
- `useLogin`: 입력 상태, 제출 상태, 에러 상태 관리
- `loginService`: 입력 검증, 로그인 가능 여부 판단, 결과 해석
- `authRepository`: 로그인 API 요청과 응답 파싱
- `Server`: 인증 수행 후 성공/실패 결과 반환

## 6. 적용 기준

이 구조는 아래 조건에서 유효하다.

- 화면 로직과 API 로직을 분리하고 싶을 때
- 로그인, 게시물 작성, 저장, 팔로우처럼 규칙이 있는 화면이 많을 때
- 테스트 범위를 계층별로 나누고 싶을 때
- 서버 통신 방식을 바꿔도 UI 영향을 줄이고 싶을 때

반대로 단순 정적 화면이나 비즈니스 규칙이 거의 없는 화면에서는 과한 분리가 될 수 있다.

## 7. 참고

- Velog, [[3 layers architecture] 프론트엔드 프로젝트 구조를 어떻게 구성하고 있나요?](https://velog.io/%40fenjo/3-layers-architecture-%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EA%B5%AC%EC%A1%B0%EB%A5%BC-%EC%96%B4%EB%96%BB%EA%B2%8C-%EA%B5%AC%EC%84%B1%ED%95%98%EA%B3%A0-%EC%9E%88%EB%82%98%EC%9A%94)
- Martin Fowler, [Service Layer](https://martinfowler.com/eaaCatalog/serviceLayer.html)
- Martin Fowler, [Repository](https://martinfowler.com/eaaCatalog/repository.html)
- Deyan Dimitrov, [Layered architecture. What is layered architecture and when to use it?](https://ddimitrov.dev/2020/11/22/layered-architecture-what-is-layered-architecture-and-when-to-use-it/)
