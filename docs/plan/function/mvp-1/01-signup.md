# 기능 01 - 회원가입

## 개요

| 항목 | 내용 |
| --- | --- |
| 라우트 | `/signup` |
| 페이지 | `app/(auth)/signup/page.tsx` |
| 주요 액션 | `signupAction` |
| 핵심 데이터 | 사용자 정보, 비밀번호 hash, 세션 정보, 안전한 redirect 정보 |
| 성공 후 | 회원가입 성공 시 자동 로그인 후 `/` 또는 검증된 `redirectTo`로 이동 |

## 유저 입장

### 유저 스토리

> 나는 계정을 만들고 바로 로그인된 상태로 서비스를 시작하고 싶다.

### 사용자가 보게 되는 것

- 회원가입 폼
- 이름, 이메일, 비밀번호 입력 필드
- 입력 에러 메시지
- 제출 버튼
- 로그인 화면 전환 링크

### 사용자 흐름

1. 비회원 사용자가 `/signup`에 진입
2. 이름, 이메일, 비밀번호를 입력한다
3. 제출 시 입력값 검증과 이메일 중복 검사를 수행한다
4. 성공 시 계정이 생성되고 자동 로그인된다
5. `/` 또는 원래 가려던 내부 경로로 이동한다
6. 실패 시 입력값은 유지되고 에러가 노출된다

### 유저 기준 핵심 규칙

- 회원가입은 실제 입력값 검증이 있어야 한다.
- 실패해도 입력값이 사라지지 않아야 한다.
- 회원가입 성공 직후 다시 로그인할 필요가 없어야 한다.
- 이미 로그인된 사용자는 `/signup`에 머물지 않아야 한다.

## 개발자 입장

### 구조

#### 라우트 구조

```text
app/
  (auth)/
    signup/
      page.tsx
  (main)/
    layout.tsx
```

#### UI 구조

```text
features/
  auth/
    components/
      auth-header.tsx
      signup-form.tsx
      auth-switch-link.tsx

components/
  ui/
    button.tsx
    input.tsx
```

#### 액션 구조

```text
lib/actions/auth.ts
  - signupAction
```

#### 데이터 구조

```text
SignupInput
  - name
  - email
  - password

User
  - id
  - email
  - passwordHash
  - displayName
  - username
  - avatarUrl

AuthSession
  - userId
  - email
  - username
  - displayName
```

추가 규칙:

- 회원가입 폼의 `name`은 저장 시 `displayName`으로 매핑한다.
- `username`은 회원가입 시 자동 생성하며, 중복되지 않도록 보정한다.
- 세션에는 `passwordHash`를 절대 포함하지 않는다.

#### API 구조

```text
Server Action API

signupAction(formData)
  input:
    - name
    - email
    - password
    - redirect (optional)
  output:
    - success
    - fieldErrors
    - formError
    - redirectTo
```

- 1차 회원가입은 별도 REST endpoint보다 `Server Action`을 우선 사용한다.
- 브라우저 폼 제출은 `signupAction`으로 직접 연결한다.
- 필드 단위 오류는 `fieldErrors`, 공통 실패는 `formError`로 구분한다.
- 성공 시 사용자 생성 후 세션 저장과 redirect를 같은 흐름에서 처리한다.

#### 주요 상수와 함수

```text
constants
  - AUTH_COOKIE_NAME
  - AUTH_REDIRECT_QUERY_KEY = "redirect"
  - AUTH_DEFAULT_REDIRECT = "/"
  - PASSWORD_MIN_LENGTH = 8
  - USERNAME_SUFFIX_START = 1

functions
  - normalizeEmail(email)
  - validateRedirect(value)
  - hashPassword(password)
  - generateBaseUsername(name, email)
  - ensureUniqueUsername(baseUsername)
  - createAuthSession(user)
  - getAuthSession()
```

- `AUTH_COOKIE_NAME`은 인증 쿠키 이름을 하나로 고정하는 기준값이다.
- `AUTH_REDIRECT_QUERY_KEY`는 URL query 키를 문서와 구현에서 동일하게 유지하기 위한 상수다.
- `AUTH_DEFAULT_REDIRECT`는 잘못된 redirect 입력이나 빈 값일 때의 fallback 경로다.
- `normalizeEmail`은 trim, lowercase 처리 후 비교와 저장에 사용한다.
- `validateRedirect`는 내부 경로만 허용하고 외부 URL, protocol 포함 값, `//` 경로를 차단한다.
- `hashPassword`는 비밀번호 저장 전 hash 생성 책임을 가진다.
- `generateBaseUsername`, `ensureUniqueUsername`는 username 생성 책임을 분리한다.
- `createAuthSession`, `getAuthSession`은 쿠키 기반 로그인 유지 정보를 다룬다.

### 담당 파일

| 항목 | 파일 |
| --- | --- |
| 회원가입 페이지 | `app/(auth)/signup/page.tsx` |
| 인증 feature UI | `features/auth/components/signup-form.tsx` |
| 공통 입력 UI | `components/ui/*` |
| 액션 | `lib/actions/auth.ts` |
| 세션 helper | `lib/session/*` |
| validator | `lib/validators/auth.ts` |
| repository | `lib/social-repository/*` |
| 가드 | `app/(main)/layout.tsx` |

### 로컬 상태

| 상태 | 설명 |
| --- | --- |
| `name` | 회원가입 이름 입력값 |
| `email` | 이메일 입력값 |
| `password` | 비밀번호 입력값 |
| `isSubmitting` | 제출 중 여부 |
| `submitError` | 실패 메시지 |
| `redirectTo` | `redirect` query를 검증한 안전한 내부 이동 경로 |

### 구현 규칙

- 회원가입은 이메일/비밀번호 기반으로 구현한다.
- 회원가입 성공 시 자동 로그인한다.
- 이메일 중복은 대소문자 구분 없이 검사한다.
- 사용자 생성은 `lib/social-repository`를 통해 수행한다.
- URL query 이름은 `redirect`로 통일한다.
- 내부 검증이 끝난 이동 경로 이름은 `redirectTo`로 통일한다.
- `redirectTo`는 `/`로 시작하는 내부 경로만 허용한다.
- 성공 시 세션 쿠키를 저장한다.

### username 생성 규칙

- 기본 후보는 `name`을 우선 사용하고, 비어 있거나 부적절하면 이메일의 local part를 사용한다.
- lowercase 기준으로 생성한다.
- 허용 문자는 영문 소문자, 숫자, `_`만 사용한다.
- 중복 시 숫자 suffix를 붙여 유니크하게 만든다.

### 개발자 플로우

1. `app/(auth)/signup/page.tsx`에서 세션과 `searchParams.redirect`를 확인한다.
2. `redirect`를 검증해서 내부 값 `redirectTo`를 만든다.
3. 이미 로그인 상태면 즉시 `redirectTo` 또는 `/`로 보낸다.
4. 비로그인 상태면 회원가입 폼을 렌더링한다.
5. `signupAction`이 이름, 이메일, 비밀번호를 검증한다.
6. `signupAction`은 이메일 normalize, 중복 검사, `username` 생성, 비밀번호 hash 저장, 사용자 생성을 처리한다.
7. 회원가입 성공 시 세션 쿠키를 저장하고 `redirectTo` 또는 `/`로 리다이렉트한다.
8. `app/(main)/layout.tsx`는 보호 라우트 진입 시 세션이 없으면 `/login?redirect=...`로 보낸다.

### 예외 처리

- 공백 입력은 제출 불가
- 제출 중에는 중복 클릭 차단
- 회원가입 실패 시 입력값 유지
- 중복 이메일은 에러 반환
- 잘못된 `redirect`는 `/`로 fallback
- 이미 로그인 상태에서 `/signup`에 진입하면 즉시 이동
- `username` 충돌 시 suffix를 붙여 자동 보정

## 체크리스트

- [ ] `/signup` 페이지가 렌더링된다
- [ ] 회원가입 폼에 이름, 이메일, 비밀번호 입력이 있다
- [ ] 잘못된 입력 시 에러 메시지가 보인다
- [ ] 이메일은 normalize 후 비교되며 중복 검사가 대소문자 구분 없이 동작한다
- [ ] `signupAction`이 새 사용자를 생성하고 세션 쿠키를 생성한다
- [ ] `signupAction`이 유니크한 `username`을 자동 생성한다
- [ ] 회원가입 성공 시 `redirect` query가 있으면 검증 후 해당 경로로 이동한다
- [ ] 잘못된 `redirect`는 `/`로 이동한다
- [ ] 이미 로그인 상태에서 `/signup` 접근 시 홈 또는 목적지로 이동한다
- [ ] 실패 시 입력값이 유지된다
