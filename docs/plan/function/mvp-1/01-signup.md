# 회원가입 명세

## 1. 상태 변수 및 함수 정의

회원가입 훅과 컴포넌트는 아래 변수와 함수를 공통 계약으로 사용한다.

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
| `username` | `string` | 사용자가 입력한 유저 이름 | `""` | `SignupForm`, `UsernameInputField` |
| `email` | `string` | 사용자가 입력한 이메일 | `""` | `SignupForm`, `EmailInputField` |
| `password` | `string` | 사용자가 입력한 비밀번호 | `""` | `SignupForm`, `PasswordInputField` |
| `confirmPassword` | `string` | 사용자가 재입력한 비밀번호 | `""` | `SignupForm`, `ConfirmPasswordInputField` |
| `usernameError` | `string` | 유저 이름 입력 필드의 실시간 검증 메시지 | `""` | `SignupForm`, `UsernameInputField` |
| `emailError` | `string` | 이메일 입력 필드의 실시간 검증 메시지 | `""` | `SignupForm`, `EmailInputField` |
| `passwordError` | `string` | 비밀번호 입력 필드의 실시간 검증 메시지 | `""` | `SignupForm`, `PasswordInputField` |
| `confirmPasswordError` | `string` | 비밀번호 재입력 필드의 실시간 검증 메시지 | `""` | `SignupForm`, `ConfirmPasswordInputField` |
| `formError` | `string` | 회원가입 요청 실패 시 폼 영역에 보여줄 메시지 | `""` | `SignupForm`, `SignupErrorMessage` |
| `isFormValid` | `boolean` | 유저 이름, 이메일, 비밀번호, 재입력 비밀번호가 모두 유효한지 여부 | `false` | `SignupForm`, `SignupSubmitButton` |
| `isLoading` | `boolean` | 회원가입 요청 진행 여부 | `false` | `SignupForm`, `SignupSubmitButton` |
| `signupUser` | <a href="#type-user"><code>User</code></a> \| null | 회원가입 성공 후 저장할 사용자 정보, 값이 있으면 성공 상태로 판단한다 | `null` | `SignupForm` |

### C. 함수 정의

| 함수명 | 시그니처 | 역할 | 사용 컴포넌트 |
| --- | --- | --- | --- |
| `setUsername()` | `(value: string) => void` | 유저 이름 입력값을 변경하고 실시간 검증과 이전 회원가입 결과 상태 초기화를 실행한다. | `SignupForm`, `UsernameInputField` |
| `setEmail()` | `(value: string) => void` | 이메일 입력값을 변경하고 실시간 검증과 이전 회원가입 결과 상태 초기화를 실행한다. | `SignupForm`, `EmailInputField` |
| `setPassword()` | `(value: string) => void` | 비밀번호 입력값을 변경하고 실시간 검증과 이전 회원가입 결과 상태 초기화를 실행한다. | `SignupForm`, `PasswordInputField` |
| `setConfirmPassword()` | `(value: string) => void` | 비밀번호 재입력 값을 변경하고 실시간 검증과 이전 회원가입 결과 상태 초기화를 실행한다. | `SignupForm`, `ConfirmPasswordInputField` |
| `signup()` | `() => Promise<void>` | 폼이 유효할 때 회원가입 요청을 실행한다. | `SignupForm`, `SignupSubmitButton` |
| `resetSignupState()` | `() => void` | 회원가입 상태와 검증 메시지를 초기값으로 되돌린다. | `SignupForm` |

## 목차

- `1. 상태 변수 및 함수 정의`
  - `A. 타입 정의`
  - `B. 상태 변수 정의`
  - `C. 함수 정의`
- `2. 데이터 흐름`
  - `A. 컴포넌트`
  - `B. 훅`
  - `C. 서비스`
  - `D. 레포지토리`
  - `E. 서버`
- `3. 디자인 참조`
  - `A. 디자인 참조 문서`

## 2. 데이터 흐름

```text
A. 컴포넌트 -> B. 훅 -> C. 서비스 -> D. 레포지토리 -> E. 서버
```
참조 - [function-md-guide.md](../function-md-guide.md), [layer.md](../../layout/layer.md)

### A. 컴포넌트

회원가입 화면 컴포넌트는 아래 구조로 고정한다.

#### I. 컴포넌트 구조

```text
SignupPage
  -> SignupForm
    -> UsernameInputField
    -> EmailInputField
    -> PasswordInputField
    -> ConfirmPasswordInputField
    -> SignupSubmitButton
    -> SignupErrorMessage
```

#### II. 컴포넌트 타입

<a id="type-signup-field-props"></a>

##### a. `SignupFieldProps`

```ts
type SignupFieldProps = {
  value: string;
  fieldErrorMessage?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};
```

<a id="type-signup-submit-button-props"></a>

##### b. `SignupSubmitButtonProps`

```ts
type SignupSubmitButtonProps = {
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
};
```

<a id="type-signup-error-message-props"></a>

##### c. `SignupErrorMessageProps`

```ts
type SignupErrorMessageProps = {
  message: string;
};
```

#### III. 컴포넌트 정의

| 컴포넌트명 | 역할 | 사용하는 Hook | 받는 props | 이벤트에서 호출하는 함수 | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `SignupPage` | 회원가입 화면 진입 페이지 | 없음 | 없음 | 없음 | 없음 |
| `SignupForm` | 회원가입 폼 조합과 제출 처리 | `useSignup()` | 없음 | `onSubmit -> signup()` | `username`, `email`, `password`, `confirmPassword`, `usernameError`, `emailError`, `passwordError`, `confirmPasswordError`, `formError`, `isFormValid`, `isLoading`, `signupUser` |
| `UsernameInputField` | 유저 이름 입력 필드와 실시간 에러 메시지 출력 | 없음 | <a href="#type-signup-field-props"><code>SignupFieldProps</code></a> | `onChange -> setUsername(value)` | `username`, `usernameError` |
| `EmailInputField` | 이메일 입력 필드와 실시간 에러 메시지 출력 | 없음 | <a href="#type-signup-field-props"><code>SignupFieldProps</code></a> | `onChange -> setEmail(value)` | `email`, `emailError` |
| `PasswordInputField` | 비밀번호 입력 필드와 실시간 에러 메시지 출력 | 없음 | <a href="#type-signup-field-props"><code>SignupFieldProps</code></a> | `onChange -> setPassword(value)` | `password`, `passwordError` |
| `ConfirmPasswordInputField` | 비밀번호 재입력 필드와 실시간 에러 메시지 출력 | 없음 | <a href="#type-signup-field-props"><code>SignupFieldProps</code></a> | `onChange -> setConfirmPassword(value)` | `confirmPassword`, `confirmPasswordError` |
| `SignupSubmitButton` | 회원가입 제출 버튼, `isFormValid = false` 또는 `isLoading = true`일 때 비활성화 | 없음 | <a href="#type-signup-submit-button-props"><code>SignupSubmitButtonProps</code></a> | `onClick -> signup()` | `isFormValid`, `isLoading` |
| `SignupErrorMessage` | 회원가입 요청 실패 폼 메시지 출력 | 없음 | <a href="#type-signup-error-message-props"><code>SignupErrorMessageProps</code></a> | 없음 | `formError` |

### B. 훅

훅은 기능 단위로 나누어 정의한다.

#### I. 훅 타입

<a id="type-signup-state"></a>

##### a. `SignupState`

```ts
type SignupState = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  usernameError: string;
  emailError: string;
  passwordError: string;
  confirmPasswordError: string;
  formError: string;
  isFormValid: boolean;
  isLoading: boolean;
  signupUser: User | null;
};
```

<a id="type-signup-actions"></a>

##### b. `SignupActions`

```ts
type SignupActions = {
  setUsername: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  signup: () => Promise<void>;
  resetSignupState: () => void;
};
```

<a id="type-use-signup-return"></a>

##### c. `UseSignupReturn`

```ts
type UseSignupReturn = SignupState & SignupActions;
```

#### II. useSignup

##### a. 훅 요약

| 항목 | 내용 |
| --- | --- |
| 훅명 | `useSignup()` |
| 역할 | 회원가입 UI 상태 관리, 입력값 실시간 검증, 회원가입 버튼 활성화 상태 관리, 회원가입 요청 실행, 회원가입 결과 상태 관리, 회원가입 사용자 정보 관리, 회원가입 상태 초기화 |
| 호출 Service | `signupService.validateUsername(username)`, `signupService.validateEmail(email)`, `signupService.validatePassword(password)`, `signupService.validateConfirmPassword(password, confirmPassword)`, `signupService.signup(username, email, password, confirmPassword)` |
| 자동 로그인 상태 저장 위치 | `signup()` 성공 후 전역 auth store 또는 session |

##### b. 상태

| 변수 명 | 범위 | 초기 값 | 역할 |
| --- | --- | --- | --- |
| `username` | `public` | `""` | 회원가입 UI 상태 관리 |
| `email` | `public` | `""` | 회원가입 UI 상태 관리 |
| `password` | `public` | `""` | 회원가입 UI 상태 관리 |
| `confirmPassword` | `public` | `""` | 회원가입 UI 상태 관리 |
| `usernameError` | `public` | `""` | 입력 필드 에러 상태 관리 |
| `emailError` | `public` | `""` | 입력 필드 에러 상태 관리 |
| `passwordError` | `public` | `""` | 입력 필드 에러 상태 관리 |
| `confirmPasswordError` | `public` | `""` | 입력 필드 에러 상태 관리 |
| `formError` | `public` | `""` | 회원가입 결과 상태 관리 |
| `isFormValid` | `public` | `false` | 회원가입 버튼 활성화 상태 관리 |
| `isLoading` | `public` | `false` | 회원가입 요청 실행 |
| `signupUser` | `public` | `null` | 회원가입 사용자 정보 관리 |

##### c. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 service | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `setUsername()` | `public` | `value: string` | `void` | <code>signupService.validateUsername(value: string): boolean</code> | `username`, `usernameError`, `formError`, `isFormValid`, `signupUser` |
| `setEmail()` | `public` | `value: string` | `void` | <code>signupService.validateEmail(value: string): boolean</code> | `email`, `emailError`, `formError`, `isFormValid`, `signupUser` |
| `setPassword()` | `public` | `value: string` | `void` | <code>signupService.validatePassword(value: string): boolean</code><br><code>signupService.validateConfirmPassword(password: string, confirmPassword: string): boolean</code> | `password`, `passwordError`, `confirmPasswordError`, `formError`, `isFormValid`, `signupUser` |
| `setConfirmPassword()` | `public` | `value: string` | `void` | <code>signupService.validateConfirmPassword(password: string, value: string): boolean</code> | `confirmPassword`, `confirmPasswordError`, `formError`, `isFormValid`, `signupUser` |
| `signup()` | `public` | 없음 | `Promise<void>` | <code>signupService.signup(username: string, email: string, password: string, confirmPassword: string): Promise&lt;<a href="#type-signup-result">SignupResult</a>&gt;</code> | `isLoading`, `formError`, `signupUser` |
| `resetSignupState()` | `public` | 없음 | `void` | 없음 | `username`, `email`, `password`, `confirmPassword`, `usernameError`, `emailError`, `passwordError`, `confirmPasswordError`, `formError`, `isFormValid`, `isLoading`, `signupUser` |

##### d. 동작 규칙

- `setUsername()`
  - `username` 값을 갱신한다.
  - `signupService.validateUsername(value)`를 호출해 `usernameError`를 갱신한다.
  - 이전 회원가입 결과 상태를 초기화하기 위해 `formError = ""`, `signupUser = null`로 갱신한다.
  - 모든 입력값이 유효하면 `isFormValid = true`, 아니면 `false`로 유지한다.
- `setEmail()`
  - `email` 값을 갱신한다.
  - `signupService.validateEmail(value)`를 호출해 `emailError`를 갱신한다.
  - 이전 회원가입 결과 상태를 초기화하기 위해 `formError = ""`, `signupUser = null`로 갱신한다.
  - 모든 입력값이 유효하면 `isFormValid = true`, 아니면 `false`로 유지한다.
- `setPassword()`
  - `password` 값을 갱신한다.
  - `signupService.validatePassword(value)`를 호출해 `passwordError`를 갱신한다.
  - `signupService.validateConfirmPassword(value, confirmPassword)`를 호출해 `confirmPasswordError`를 갱신한다.
  - 이전 회원가입 결과 상태를 초기화하기 위해 `formError = ""`, `signupUser = null`로 갱신한다.
  - 모든 입력값이 유효하면 `isFormValid = true`, 아니면 `false`로 유지한다.
- `setConfirmPassword()`
  - `confirmPassword` 값을 갱신한다.
  - `signupService.validateConfirmPassword(password, value)`를 호출해 `confirmPasswordError`를 갱신한다.
  - 이전 회원가입 결과 상태를 초기화하기 위해 `formError = ""`, `signupUser = null`로 갱신한다.
  - 모든 입력값이 유효하면 `isFormValid = true`, 아니면 `false`로 유지한다.
- `signup()`
  - `isFormValid = false`이면 회원가입 요청을 진행하지 않는다.
  - 시작 시 `isLoading = true`, `formError = ""`, `signupUser = null`
  - 실행 중 `signupService.signup(username, email, password, confirmPassword)`를 호출한다.
  - 성공 시 `signupUser = data`로 갱신하고 전역 auth store 또는 session에 사용자 정보를 저장한다.
- `resetSignupState()`
  - 회원가입 상태와 검증 메시지를 모두 초기값으로 되돌린다.

##### e. 상태 갱신 규칙

| 상황 | 상태 갱신 |
| --- | --- |
| 유저 이름 입력 변경 | `username`, `usernameError`, `formError = ""`, `isFormValid`, `signupUser = null` |
| 이메일 입력 변경 | `email`, `emailError`, `formError = ""`, `isFormValid`, `signupUser = null` |
| 비밀번호 입력 변경 | `password`, `passwordError`, `confirmPasswordError`, `formError = ""`, `isFormValid`, `signupUser = null` |
| 비밀번호 재입력 변경 | `confirmPassword`, `confirmPasswordError`, `formError = ""`, `isFormValid`, `signupUser = null` |
| 성공 | `signupUser = data`, `formError = ""` |
| 실패 | `signupUser = null`, `formError = message` |
| 종료 | `isLoading = false` |
| 초기화 | `username = ""`, `email = ""`, `password = ""`, `confirmPassword = ""`, `usernameError = ""`, `emailError = ""`, `passwordError = ""`, `confirmPasswordError = ""`, `formError = ""`, `isFormValid = false`, `isLoading = false`, `signupUser = null` |

### C. 서비스

서비스는 기능 단위로 나누어 정의한다.

#### I. 서비스 타입

<a id="type-signup-result"></a>

##### a. `SignupResult`

```ts
type SignupResult =
  | {
      success: true;
      data: User;
    }
  | {
      success: false;
      message: string;
    };
```

#### II. `signupService`

##### a. 서비스 요약

| 항목 | 내용 |
| --- | --- |
| 서비스명 | `signupService` |
| 역할 | 입력값 검증, 회원가입 비즈니스 로직 수행, 레포지토리 호출, 회원가입 성공 후 자동 로그인에 필요한 사용자 정보 반환 |
| 호출 Repository | `authRepository.signup(username, email, password)` |

##### b. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 대상 | 실패 메시지 | 역할 |
| --- | --- | --- | --- | --- | --- | --- |
| `signup()` | `public` | `username: string`, `email: string`, `password: string`, `confirmPassword: string` | <code>Promise&lt;<a href="#type-signup-result">SignupResult</a>&gt;</code> | <code>authRepository.signup(username: string, email: string, password: string): Promise&lt;<a href="#type-signup-api-response">SignupApiResponse</a>&gt;</code> | `이미 사용 중인 유저 이름입니다.`<br>`이미 사용 중인 이메일입니다.`<br>`서버 오류가 발생했습니다.`<br>`네트워크 오류가 발생했습니다. 다시 시도해주세요.` | 회원가입 성공/실패 결과를 반환하고 성공 시 자동 로그인에 사용할 사용자 정보를 전달한다. |
| `validateUsername()` | `public` | `username: string` | `boolean` | 없음 | `유저 이름을 입력해주세요`<br>`유저 이름은 16자 이내여야 합니다.`<br>`유저 이름에 띄어쓰기를 사용할 수 없습니다.`<br>`사용할 수 없는 유저 이름입니다.` | 유저 이름 형식을 검증한다. |
| `validateEmail()` | `public` | `email: string` | `boolean` | 없음 | `이메일 형식과 맞지 않음` | 이메일 형식을 검증한다. |
| `validatePassword()` | `public` | `password: string` | `boolean` | 없음 | `비밀번호를 입력해주세요` | 비밀번호 입력 여부를 검증한다. |
| `validateConfirmPassword()` | `public` | `password: string`, `confirmPassword: string` | `boolean` | 없음 | `비밀번호를 다시 입력해주세요`<br>`비밀번호가 일치하지 않습니다.` | 비밀번호 재입력 여부와 비밀번호 일치 여부를 검증한다. |

##### c. 동작 규칙

- `signup()`
  - 시작 시 `validateUsername(username)`를 호출한다.
  - 다음으로 `validateEmail(email)`를 호출한다.
  - 다음으로 `validatePassword(password)`를 호출한다.
  - 다음으로 `validateConfirmPassword(password, confirmPassword)`를 호출한다.
  - 네 검증이 모두 통과하면 `authRepository.signup(username, email, password)`를 호출한다.
  - 회원가입 성공 시 서버가 반환한 사용자 데이터를 기준으로 훅이 전역 auth store 또는 session에 자동 로그인 상태를 저장할 수 있도록 전달한다.
- `validateUsername()`
  - 유저 이름 값이 비어 있는지 확인한다.
  - 유저 이름은 16자 이내여야 한다.
  - 유저 이름에 띄어쓰기를 포함할 수 없다.
  - `undefined`, `null`과 같은 예약어는 사용할 수 없다.
- `validateEmail()`
  - 정규식은 `const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;`
    - 이메일은 `@`를 포함해야 한다.
    - 도메인 형식을 만족해야 한다.
    - 공백은 허용하지 않는다.
- `validatePassword()`
  - 비밀번호 값이 비어 있는지 확인한다.
- `validateConfirmPassword()`
  - 재입력 비밀번호 값이 비어 있는지 확인한다.
  - 비밀번호와 재입력 비밀번호가 일치하는지 확인한다.

##### d. 반환 규칙

- `signup()`

| 상황 | 반환값 |
| --- | --- |
| 회원가입 성공 | `success: true`, <code>data: <a href="#type-user">User</a></code> |
| 회원가입 실패 | `success: false`, `message: string` |

- `validateUsername()`

| 상황 | 반환값 |
| --- | --- |
| 유저 이름 누락 | `false` |
| 유저 이름 길이 초과 | `false` |
| 유저 이름 공백 포함 | `false` |
| 사용할 수 없는 유저 이름 | `false` |
| 유저 이름 형식 일치 | `true` |

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

- `validateConfirmPassword()`

| 상황 | 반환값 |
| --- | --- |
| 재입력 비밀번호 누락 | `false` |
| 비밀번호 불일치 | `false` |
| 비밀번호 일치 | `true` |

### D. 레포지토리

레포지토리는 기능 단위로 나누어 정의한다.

#### I. API 타입

<a id="type-signup-api-response"></a>

##### a. `SignupApiResponse`

```ts
type SignupApiResponse = SignupResult;
```

#### II. `authRepository`

##### a. 레포지토리 요약

| 항목 | 내용 |
| --- | --- |
| 레포지토리명 | `authRepository` |
| 역할 | API 요청 전송, 서버 응답 수신, 응답 데이터를 서비스 계층에 전달 |
| 호출 API | `POST /api/auth/signup` |

##### b. 함수

| 함수 명 | 받는 props | return 값 | 호출하는 API | 역할 |
| --- | --- | --- | --- | --- |
| `signup()` | `username: string`, `email: string`, `password: string` | <code>Promise&lt;<a href="#type-signup-api-response">SignupApiResponse</a>&gt;</code> | `POST /api/auth/signup` | 회원가입 API 요청 후 응답 결과를 반환한다. |

##### c. 요청 규칙

| 항목 | 내용 |
| --- | --- |
| Method | `POST` |
| URL | `/api/auth/signup` |
| 요청 본문 | `username`, `email`, `password` |

##### d. 동작 규칙

- `signup()`
  - `username`, `email`, `password`를 요청 바디에 담는다.
  - `POST /api/auth/signup`으로 요청을 전송한다.
  - 서버 응답을 <a href="#type-signup-api-response"><code>SignupApiResponse</code></a> 형태로 반환한다.

##### e. 반환 규칙

| 상황 | 반환값 |
| --- | --- |
| 회원가입 성공 | `success: true`, <code>data: <a href="#type-user">User</a></code> |
| 회원가입 실패 | `success: false`, `message: string` |

### E. 서버

#### I. 회원가입 API

##### a. API 요약

| 항목 | 내용 |
| --- | --- |
| API 이름 | 회원가입 API |
| Method | `POST` |
| URL | `/api/auth/signup` |
| 요청 본문 | `username`, `email`, `password` |
| 처리 | 유저 이름, 이메일, 비밀번호를 검증하고 유저 이름 및 이메일 중복 여부를 확인한 뒤 성공 시 자동 로그인에 사용할 사용자 정보와 토큰을 반환한다. |
| Response | `success`, `data` 또는 `message` |

##### b. 요청 본문 예시

```json
{
  "username": "honggildong",
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
  "message": "이미 사용 중인 이메일입니다."
}
```

###### 3. 서버 에러 응답 예시

```json
{
  "success": false,
  "message": "서버 오류가 발생했습니다."
}
```

## 3. 디자인 참조

회원가입 기능의 상세 디자인 명세는 `docs/plan/layout/design-system` 아래 문서에서 관리하고, 이 문서에서는 참조만 연결한다.

### A. 디자인 참조 문서

| 구분 | 문서 | 역할 |
| --- | --- | --- |
| 전체 디자인 시스템 | [design-system.md](../../layout/design-system.md) | 토큰, 무드, 상태, 레이아웃 기준 |
| 화면 조합 패턴 | [screen-patterns.md](../../layout/design-system/screen-patterns.md) | 인증 화면 공통 패턴 기준 |
| 공통 UI 컴포넌트 | [components-ui.md](../../layout/design-system/components-ui.md) | `Input`, `Button` 등 공통 UI 기준 |
| 공통 레이아웃 컴포넌트 | [components-layout.md](../../layout/design-system/components-layout.md) | 인증 화면 레이아웃 기준 |
| 인증 화면 레퍼런스 | [auth-login.md](../../layout/design-system/auth-login.md) | 인증 화면 상태 표현과 공통 구조 기준 |
