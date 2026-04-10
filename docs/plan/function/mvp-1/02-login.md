# 로그인 상태 관리 명세

## 1. 로그인 상태 변수 및 함수 정의

로그인 훅과 컴포넌트는 아래 변수와 함수를 공통 계약으로 사용한다.

### 상태 변수 정의

| 변수명 | 타입 | 설명 | 초기값 |
| --- | --- | --- | --- |
| `email` | `string` | 사용자가 입력한 이메일 | `""` |
| `password` | `string` | 사용자가 입력한 비밀번호 | `""` |
| `isLoading` | `boolean` | 로그인 요청 진행 여부 | `false` |
| `isSuccess` | `boolean` | 로그인 성공 여부 | `false` |
| `errorMessage` | `string` | 로그인 실패 시 사용자에게 보여줄 메시지 | `""` |
| `user` | `User \| null` | 로그인 성공 후 저장할 사용자 정보 | `null` |
| `isLoggedIn` | `boolean` | 현재 로그인 상태 여부 | `false` |

### 함수 정의

| 함수명 | 시그니처 | 역할 |
| --- | --- | --- |
| `setEmail` | `(value: string) => void` | 이메일 입력값을 변경한다. |
| `setPassword` | `(value: string) => void` | 비밀번호 입력값을 변경한다. |
| `login` | `() => Promise<void>` | 로그인 요청을 실행한다. |
| `resetLoginState` | `() => void` | 로그인 상태를 초기값으로 되돌린다. |

## 2. 데이터 흐름

### 컴포넌트

로그인 화면 컴포넌트는 아래 구조로 고정한다.

#### 컴포넌트 구조

```text
LoginPage
  -> LoginForm
    -> EmailInputField
    -> PasswordInputField
    -> LoginSubmitButton
    -> LoginErrorMessage
```

#### 컴포넌트 정의

| 컴포넌트명 | 역할 | 사용하는 인터페이스 | 내부 state | 이벤트에서 호출하는 함수 |
| --- | --- | --- | --- | --- |
| `LoginPage` | 로그인 화면 진입 페이지 | 없음 | 없음 | 없음 |
| `LoginForm` | 로그인 폼 조합과 제출 처리 | `UseLoginReturn` | 없음, `useLogin()` 반환값 사용 | `onSubmit -> login()` |
| `EmailInputField` | 이메일 입력 필드 | `LoginFieldProps` | 없음 | `onChange -> setEmail(value)` |
| `PasswordInputField` | 비밀번호 입력 필드 | `LoginFieldProps` | 없음 | `onChange -> setPassword(value)` |
| `LoginSubmitButton` | 로그인 제출 버튼 | `LoginSubmitButtonProps` | 없음 | `onClick -> login()` |
| `LoginErrorMessage` | 로그인 실패 메시지 출력 | `LoginErrorMessageProps` | 없음 | 없음 |

컴포넌트에서 사용할 인터페이스는 아래와 같이 정의한다.

```ts
interface UseLoginReturn {
  email: string;
  password: string;
  isLoading: boolean;
  isSuccess: boolean;
  errorMessage: string;
  user: User | null;
  isLoggedIn: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  login: () => Promise<void>;
  resetLoginState: () => void;
}

interface LoginFieldProps {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

interface LoginSubmitButtonProps {
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
}

interface LoginErrorMessageProps {
  message: string;
}
```

### 훅

훅 이름은 `useLogin`이다.

역할은 아래와 같다.

- 로그인 UI 상태 관리
- 로그인 요청 실행
- 서비스 호출
- 성공/실패에 따라 상태 업데이트

입력값은 훅 내부 상태로 관리하는 방식을 기본으로 한다.

- `email`
- `password`

훅 내부 상태는 아래와 같다.

- `email`
- `password`
- `isLoading`
- `isSuccess`
- `errorMessage`
- `user`
- `isLoggedIn`

`login(email, password)` 또는 내부 상태 기반 `login()` 함수는 아래 순서로 동작한다.

1. `isLoading = true`
2. `errorMessage = ""`
3. `isSuccess = false`
4. 로그인 서비스의 `login(email, password)` 호출
5. 서비스 결과에 따라 상태 업데이트

서비스 응답은 아래 형태를 기준으로 한다.

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

성공 시 상태 갱신:

- `isSuccess = true`
- `isLoggedIn = true`
- `user = data`
- `errorMessage = ""`

실패 시 상태 갱신:

- `isSuccess = false`
- `isLoggedIn = false`
- `user = null`
- `errorMessage = message`

종료 시 상태 갱신:

- `isLoading = false`

### 서비스

서비스 이름은 `loginService`다.

역할은 아래와 같다.

- 입력값 검증
- 로그인 비즈니스 로직 수행
- 레포지토리 호출
- 최종 결과를 훅에 반환

함수 시그니처는 아래와 같다.

```ts
login(email: string, password: string): Promise<LoginResult>
```

### 레포지토리

레포지토리 이름은 `authRepository`다.

역할은 아래와 같다.

- API 요청 전송
- 서버 응답 수신
- 응답 데이터를 서비스 계층에 전달

함수 시그니처는 아래와 같다.

```ts
login(email: string, password: string): Promise<LoginApiResponse>
```

### 서버

서버는 요청으로 전달받은 이메일과 비밀번호를 검증하고 인증 결과를 반환한다.

## 3. 서비스 내부 처리 순서

로그인 서비스의 `login()` 함수는 아래 순서로 동작한다.

1. 이메일 형식 검증 함수 `validateEmail(email)` 호출
2. 비밀번호 공백 검증 함수 `validatePassword(password)` 호출
3. 두 검증이 모두 통과하면 `authRepository.login(email, password)` 호출

검증 실패 시 반환 메시지는 아래 규칙을 따른다.

- 이메일 형식 오류: `이메일 형식과 맞지 않음`
- 비밀번호 누락: `비밀번호를 입력해주세요`

## 4. 이메일 검증 함수 명세

함수명은 `validateEmail`이다.

```ts
function validateEmail(email: string): boolean
```

예시 정규식:

```ts
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

규칙은 아래와 같다.

- 이메일은 `@`를 포함해야 한다.
- 도메인 형식을 만족해야 한다.
- 공백은 허용하지 않는다.

반환값:

- 유효한 이메일이면 `true`
- 유효하지 않으면 `false`

## 5. 비밀번호 검증 함수 명세

함수명은 `validatePassword`다.

```ts
function validatePassword(password: string): boolean
```

현재 로그인 명세에서는 아래 규칙만 적용한다.

- 빈 문자열이 아니어야 한다.

추후 아래 조건으로 확장할 수 있다.

- 최소 8자 이상
- 영문/숫자 포함
- 특수문자 포함

반환값:

- 비밀번호가 존재하면 `true`
- 비어 있으면 `false`

## 6. Repository 명세

레포지토리 이름은 `authRepository`다.

반환 타입은 아래와 같다.

```ts
type LoginApiResponse =
  | {
      success: true;
      data: User;
    }
  | {
      success: false;
      message: string;
    };
```

동작은 아래와 같다.

1. 이메일과 비밀번호를 API 요청 바디에 담는다.
2. 로그인 API를 호출한다.
3. 응답 결과를 반환한다.

## 7. API 스펙 정의

로그인 API 스펙은 아래와 같다.

| 항목 | 값 |
| --- | --- |
| API 이름 | 로그인 API |
| Method | `POST` |
| URL | `/api/auth/login` |

Request Body:

```json
{
  "email": "user@example.com",
  "password": "1234"
}
```

성공 응답 예시:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "accessToken": "jwt-token"
  }
}
```

실패 응답 예시:

```json
{
  "success": false,
  "message": "이메일 또는 비밀번호가 올바르지 않습니다."
}
```

서버 에러 응답 예시:

```json
{
  "success": false,
  "message": "서버 오류가 발생했습니다."
}
```

## 8. 서버 명세

서버의 역할은 아래와 같다.

- 요청 바디에서 이메일과 비밀번호 추출
- 이메일로 사용자 조회
- 사용자가 존재하지 않으면 실패 반환
- 비밀번호 일치 여부 확인
- 일치하면 로그인 성공 반환
- 필요 시 `accessToken` 발급
- 사용자 정보 반환

## 9. 로그인 성공 시 처리

로그인 성공 시 훅은 아래 상태를 갱신한다.

- `isSuccess = true`
- `isLoggedIn = true`
- `user = 서버에서 받은 사용자 정보`
- `errorMessage = ""`
- `isLoading = false`

필요 시 아래 추가 작업을 수행할 수 있다.

- `accessToken` 저장
- `refreshToken` 저장
- 홈 화면으로 이동
- 전역 auth store 업데이트

## 10. 로그인 실패 시 처리

로그인 실패 시 훅은 아래 상태를 갱신한다.

- `isSuccess = false`
- `isLoggedIn = false`
- `user = null`
- `errorMessage = 실패 메시지`
- `isLoading = false`

## 11. 예외 처리 규칙

| 상황 | 메시지 |
| --- | --- |
| 이메일 검증 실패 | `이메일 형식과 맞지 않음` |
| 비밀번호 누락 | `비밀번호를 입력해주세요` |
| 서버 인증 실패 | `이메일 또는 비밀번호가 올바르지 않습니다.` |
| 서버 오류 | `서버 오류가 발생했습니다.` |
| 네트워크 오류 | `네트워크 오류가 발생했습니다. 다시 시도해주세요.` |

## 12. 타입 정의 예시

```ts
type User = {
  id: number;
  email: string;
  name: string;
  accessToken?: string;
};

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

## 13. 권장 변수명 정리

로그인 상태 관리는 아래 변수명으로 통일하는 것을 권장한다.

- `email`
- `password`
- `isLoading`
- `isSuccess`
- `isLoggedIn`
- `errorMessage`
- `user`
- `login`
- `setEmail`
- `setPassword`
- `resetLoginState`

메시지 변수는 `msg`보다 `errorMessage`를 사용한다.
성공 여부도 `success` 또는 `isSuccess`로 일관되게 유지한다.
