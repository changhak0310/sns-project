# 로그인 상태 관리 명세

## 1. 로그인 상태 변수 및 함수 정의

로그인 훅과 컴포넌트는 아래 변수와 함수를 공통 계약으로 사용한다.

### A. 타입 정의

#### I. 공통 타입

<a id="type-user"></a>

##### a. `User`

```ts
type User = {
  id: number;
  email: string;
  name: string;
  username: string;
  avatarUrl: string;
  accessToken: string;
};
```


### B. 상태 변수 정의

| 변수명 | 타입 | 설명 | 초기값 | 사용 컴포넌트 |
| --- | --- | --- | --- | --- |
| `email` | `string` | 사용자가 입력한 이메일 | `""` | `LoginForm`, `EmailInputField` |
| `password` | `string` | 사용자가 입력한 비밀번호 | `""` | `LoginForm`, `PasswordInputField` |
| `emailError` | `string` | 이메일 입력 필드의 실시간 검증 메시지 | `""` | `LoginForm`, `EmailInputField` |
| `passwordError` | `string` | 비밀번호 입력 여부의 실시간 검증 메시지 | `""` | `LoginForm`, `PasswordInputField` |
| `formError` | `string` | 로그인 요청 실패 시 폼 영역에 보여줄 메시지 | `""` | `LoginForm`, `LoginErrorMessage` |
| `isFormValid` | `boolean` | 이메일 형식이 유효하고 비밀번호가 비어 있지 않은지 여부 | `false` | `LoginForm`, `LoginSubmitButton` |
| `isLoading` | `boolean` | 로그인 요청 진행 여부 | `false` | `LoginForm`, `LoginSubmitButton` |
| `loginUser` | <a href="#type-user"><code>User</code></a> \| null | 로그인 성공 시 저장할 사용자 정보, 값이 있으면 성공 상태로 판단한다 | `null` | `LoginForm` |

### C. 함수 정의

| 함수명 | 시그니처 | 역할 | 사용 컴포넌트 |
| --- | --- | --- | --- |
| `setEmail()` | `(value: string) => void` | 이메일 입력값을 변경하고 실시간 검증과 이전 로그인 결과 상태 초기화를 실행한다. | `LoginForm`, `EmailInputField` |
| `setPassword()` | `(value: string) => void` | 비밀번호 입력값을 변경하고 실시간 검증과 이전 로그인 결과 상태 초기화를 실행한다. | `LoginForm`, `PasswordInputField` |
| `login()` | `() => Promise<void>` | 폼이 유효할 때 로그인 요청을 실행한다. | `LoginForm`, `LoginSubmitButton` |
| `resetLoginState()` | `() => void` | 로그인 상태와 검증 메시지를 초기값으로 되돌린다. | `LoginForm` |

## 2. 데이터 흐름

```text
A. 컴포넌트 -> B. 훅 -> C. 서비스 -> D. 레포지토리 -> E. 서버
```
참조 - [layer.md](../layout/layer.md)

### A. 컴포넌트

로그인 화면 컴포넌트는 아래 구조로 고정한다.
  
#### I. 컴포넌트 구조

```text
LoginPage
  -> LoginForm
    -> EmailInputField
    -> PasswordInputField
    -> LoginSubmitButton
    -> LoginErrorMessage
```

#### II. 컴포넌트 타입

<a id="type-login-field-props"></a>

##### a. `LoginFieldProps`

```ts
type LoginFieldProps = {
  value: string;
  fieldErrorMessage?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};
```

<a id="type-login-submit-button-props"></a>

##### b. `LoginSubmitButtonProps`

```ts
type LoginSubmitButtonProps = {
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
};
```

<a id="type-login-error-message-props"></a>

##### c. `LoginErrorMessageProps`

```ts
type LoginErrorMessageProps = {
  message: string;
};
```

#### III. 컴포넌트 정의

| 컴포넌트명 | 역할 | 사용하는 Hook | 받는 props | 이벤트에서 호출하는 함수 | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `LoginPage` | 로그인 화면 진입 페이지 | 없음 | 없음 | 없음 | 없음 |
| `LoginForm` | 로그인 폼 조합과 제출 처리 | `useLogin()` | 없음 | `onSubmit -> login()` | `email`, `password`, `emailError`, `passwordError`, `formError`, `isFormValid`, `isLoading`, `loginUser` |
| `EmailInputField` | 이메일 입력 필드와 실시간 에러 메시지 출력 | 없음 | <a href="#type-login-field-props"><code>LoginFieldProps</code></a> | `onChange -> setEmail(value)` | `email`, `emailError` |
| `PasswordInputField` | 비밀번호 입력 필드와 실시간 에러 메시지 출력 | 없음 | <a href="#type-login-field-props"><code>LoginFieldProps</code></a> | `onChange -> setPassword(value)` | `password`, `passwordError` |
| `LoginSubmitButton` | 로그인 제출 버튼, `isFormValid = false` 또는 `isLoading = true`일 때 비활성화 | 없음 | <a href="#type-login-submit-button-props"><code>LoginSubmitButtonProps</code></a> | `onClick -> login()` | `isFormValid`, `isLoading` |
| `LoginErrorMessage` | 로그인 요청 실패 폼 메시지 출력 | 없음 | <a href="#type-login-error-message-props"><code>LoginErrorMessageProps</code></a> | 없음 | `formError` |

### B. 훅

훅은 기능 단위로 나누어 정의한다.

#### I. 훅 타입

<a id="type-login-state"></a>

##### a. `LoginState`

```ts
type LoginState = {
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
  formError: string;
  isFormValid: boolean;
  isLoading: boolean;
  loginUser: User | null;
};
```

<a id="type-login-actions"></a>

##### b. `LoginActions`

```ts
type LoginActions = {
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  login: () => Promise<void>;
  resetLoginState: () => void;
};
```

<a id="type-use-login-return"></a>

##### c. `UseLoginReturn`

```ts
type UseLoginReturn = LoginState & LoginActions;
```

#### II. useLogin

##### a. 훅 요약

| 항목 | 내용 |
| --- | --- |
| 훅명 | `useLogin()` |
| 역할 | 로그인 UI 상태 관리, 입력값 실시간 검증, 로그인 버튼 활성화 상태 관리, 로그인 요청 실행, 로그인 결과 상태 관리, 로그인 사용자 정보 관리, 로그인 상태 초기화 |
| 호출 Service | `loginService.validateEmail(email)`, `loginService.validatePassword(password)`, `loginService.login(email, password)` |

##### b. 상태

| 변수 명 | 범위 | 초기 값 | 역할 |
| --- | --- | --- | --- |
| `email` | `public` | `""` | 로그인 UI 상태 관리 |
| `password` | `public` | `""` | 로그인 UI 상태 관리 |
| `emailError` | `public` | `""` | 입력 필드 에러 상태 관리 |
| `passwordError` | `public` | `""` | 입력 필드 에러 상태 관리 |
| `formError` | `public` | `""` | 로그인 결과 상태 관리 |
| `isFormValid` | `public` | `false` | 로그인 버튼 활성화 상태 관리 |
| `isLoading` | `public` | `false` | 로그인 요청 실행 |
| `loginUser` | `public` | `null` | 로그인 사용자 정보 관리 |

##### c. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 service | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `setEmail()` | `public` | `value: string` | `void` | <code>loginService.validateEmail(email: string): boolean</code> | `email`, `emailError`, `formError`, `isFormValid`, `loginUser` |
| `setPassword()` | `public` | `value: string` | `void` | <code>loginService.validatePassword(password: string): boolean</code> | `password`, `passwordError`, `formError`, `isFormValid`, `loginUser` |
| `login()` | `public` | 없음 | `Promise<void>` | <code>loginService.login(email: string, password: string): Promise&lt;<a href="#type-login-result">LoginResult</a>&gt;</code> | `isLoading`, `formError`, `loginUser` |
| `resetLoginState()` | `public` | 없음 | `void` | 없음 | `email`, `password`, `emailError`, `passwordError`, `formError`, `isFormValid`, `isLoading`, `loginUser` |

##### d. 동작 규칙

- `setEmail()`
  - `email` 값을 갱신한다.
  - `loginService.validateEmail(email)`를 호출해 `emailError`를 갱신한다.
  - 이전 로그인 결과 상태를 초기화하기 위해 `formError = ""`, `loginUser = null`로 갱신한다.
  - `email`과 `password`가 모두 유효하면 `isFormValid = true`, 아니면 `false`로 유지한다.
- `setPassword()`
  - `password` 값을 갱신한다.
  - `loginService.validatePassword(password)`를 호출해 `passwordError`를 갱신한다.
  - 이전 로그인 결과 상태를 초기화하기 위해 `formError = ""`, `loginUser = null`로 갱신한다.
  - `email`과 `password`가 모두 유효하면 `isFormValid = true`, 아니면 `false`로 유지한다.
- `login()`
  - `isFormValid = false`이면 로그인 요청을 진행하지 않는다.
  - 시작 시 `isLoading = true`, `formError = ""`, `loginUser = null`
  - 실행 중 `loginService.login(email, password)`를 호출한다.
- `resetLoginState()`
  - 로그인 상태와 검증 메시지를 모두 초기값으로 되돌린다.

##### e. 상태 갱신 규칙

| 상황 | 상태 갱신 |
| --- | --- |
| 이메일 입력 변경 | `email`, `emailError`, `formError = ""`, `isFormValid`, `loginUser = null` |
| 비밀번호 입력 변경 | `password`, `passwordError`, `formError = ""`, `isFormValid`, `loginUser = null` |
| 성공 | `loginUser = data`, `formError = ""` |
| 실패 | `loginUser = null`, `formError = message` |
| 종료 | `isLoading = false` |
| 초기화 | `email = ""`, `password = ""`, `emailError = ""`, `passwordError = ""`, `formError = ""`, `isFormValid = false`, `isLoading = false`, `loginUser = null` |

### C. 서비스

서비스는 기능 단위로 나누어 정의한다.

#### I. 서비스 타입

<a id="type-login-result"></a>

##### a. `LoginResult`

```ts
type LoginResult =
  | {
      success: true;
      data: User;
    }
  | {
      success: false;
      message: string;
    };
```

#### II. `loginService`

##### a. 서비스 요약

| 항목 | 내용 |
| --- | --- |
| 서비스명 | `loginService` |
| 역할 | 입력값 검증, 로그인 비즈니스 로직 수행, 레포지토리 호출, 최종 결과 반환 |
| 호출 Repository | `authRepository.login(email, password)` |

##### b. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 대상 | 실패 메시지 | 역할 |
| --- | --- | --- | --- | --- | --- | --- |
| `login()` | `public` | `email: string`, `password: string` | <code>Promise&lt;<a href="#type-login-result">LoginResult</a>&gt;</code> | <code>authRepository.login(email: string, password: string): Promise&lt;<a href="#type-login-api-response">LoginApiResponse</a>&gt;</code> | `이메일 또는 비밀번호가 올바르지 않습니다.`<br>`서버 오류가 발생했습니다.`<br>`네트워크 오류가 발생했습니다. 다시 시도해주세요.` | 로그인 성공/실패 결과를 반환한다. |
| `validateEmail()` | `public` | `email: string` | `boolean` | 없음 | `이메일 형식과 맞지 않음` | 실시간 입력 검증과 로그인 실행 전 이메일 형식 검증에 사용한다. |
| `validatePassword()` | `public` | `password: string` | `boolean` | 없음 | `비밀번호를 입력해주세요` | 실시간 입력 검증과 로그인 실행 전 비밀번호 입력 여부 검증에 사용한다. |

##### c. 동작 규칙

- `login()`
  - 시작 시 `validateEmail(email)`를 호출한다.
  - `validateEmail()` 또는 `validatePassword()` 결과가 `false`이면 로그인 요청을 진행하지 않는다.
- `validateEmail()`
  - 정규식은 `const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;`
    - 이메일은 `@`를 포함해야 한다.
    - 도메인 형식을 만족해야 한다.
    - 공백은 허용하지 않는다.
  - 이메일 검증이 통과하면 다음으로 `validatePassword(password)`를 호출한다.
- `validatePassword()`
  - 비밀번호 값이 비어 있는지 확인한다.
  - 두 검증이 모두 통과하면 `authRepository.login(email, password)`를 호출한다.

##### d. 반환 규칙

- `login()`

| 상황 | 반환값 |
| --- | --- |
| 로그인 성공 | `success: true`, <code>data: <a href="#type-user">User</a></code> |
| 로그인 실패 | `success: false`, `message: string` |

- `validateEmail()`

| 상황 | 반환값 |
| --- | --- |
| 이메일 형식 불일치 | `false` |
| 이메일 형식 일치 | `true` |
    
- `validatePassword()`

| 상황 | 반환값 |
| --- | --- |
| 비밀번호 누락 | `false` |
| 비밀번호 값 존재 | `true` |

### D. 레포지토리

레포지토리는 기능 단위로 나누어 정의한다.

#### I. API 타입

<a id="type-login-api-response"></a>

##### a. `LoginApiResponse`

```ts
type LoginApiResponse = LoginResult;
```

#### II. `authRepository`

##### a. 레포지토리 요약

| 항목 | 내용 |
| --- | --- |
| 레포지토리명 | `authRepository` |
| 역할 | API 요청 전송, 서버 응답 수신, 응답 데이터를 서비스 계층에 전달 |
| 호출 API | `POST /api/auth/login` |

##### b. 함수

| 함수 명 | 받는 props | return 값 | 호출하는 API | 역할 |
| --- | --- | --- | --- | --- |
| `login()` | `email: string`, `password: string` | <code>Promise&lt;<a href="#type-login-api-response">LoginApiResponse</a>&gt;</code> | `POST /api/auth/login` | 로그인 API 요청 후 응답 결과를 반환한다. |

##### c. 요청 규칙

| 항목 | 내용 |
| --- | --- |
| Method | `POST` |
| URL | `/api/auth/login` |
| 요청 본문 | `email`, `password` |

##### d. 동작 규칙

- `login()`
  - `email`, `password`를 요청 바디에 담는다.
  - `POST /api/auth/login`으로 요청을 전송한다.
  - 서버 응답을 <a href="#type-login-api-response"><code>LoginApiResponse</code></a> 형태로 반환한다.

##### e. 반환 규칙

| 상황 | 반환값 |
| --- | --- |
| 로그인 성공 | `success: true`, <code>data: <a href="#type-user">User</a></code> |
| 로그인 실패 | `success: false`, `message: string` |

### E. 서버

#### I. 로그인 API

##### a. API 요약

| 항목 | 내용 |
| --- | --- |
| API 이름 | 로그인 API |
| Method | `POST` |
| URL | `/api/auth/login` |
| 요청 본문 | `email`, `password` |
| 처리 | 이메일과 비밀번호를 검증하고 로그인 성공/실패 결과를 판단한다. |
| Response | `success`, `data` 또는 `message` |

##### b. 요청 본문 예시

```json
{
  "email": "user@example.com",
  "password": "1234"
}
```

##### c. 응답 예시

###### 1. 성공 응답 예시

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "username": "honggildong",
    "avatarUrl": "https://example.com/avatar.png",
    "accessToken": "jwt-token"
  }
}
```

###### 2. 실패 응답 예시

```json
{
  "success": false,
  "message": "이메일 또는 비밀번호가 올바르지 않습니다."
}
```

###### 3. 서버 에러 응답 예시

```json
{
  "success": false,
  "message": "서버 오류가 발생했습니다."
}
```
