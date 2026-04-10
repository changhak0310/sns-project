# 기능 02 - 로그인

## 개요

| 항목 | 내용 |
| --- | --- |
| 라우트 | `/login` |
| 페이지 | `app/(auth)/login/page.tsx` |
| 주요 액션 | `loginAction` |
| 핵심 데이터 | 세션 정보, 사용자 인증 상태, 안전한 redirect 정보, auth form 상태 |
| 성공 후 | 로그인 성공 시 `/` 또는 검증된 `redirectTo`로 이동 |

## 유저 입장

### 유저 스토리

> 나는 기존 계정으로 로그인해서 바로 서비스를 이용하고 싶다.

### 사용자가 보게 되는 것

- 중앙 정렬 auth 화면
- 단일 로그인 카드 또는 폼 블록
- 로그인 폼
- 이메일, 비밀번호 입력 필드
- 입력 에러 메시지
- 제출 버튼
- 회원가입 화면 전환 링크

### 사용자 흐름

1. 비회원 사용자가 `/login`에 진입
2. 이메일, 비밀번호를 입력한다
3. 제출 시 계정 검증과 세션 생성을 수행한다
4. 성공 시 `/` 또는 원래 가려던 내부 경로로 이동한다
5. 실패 시 입력값은 유지되고 에러가 노출된다

### 유저 기준 핵심 규칙

- 로그인은 실제 입력값 검증이 있어야 한다.
- 실패해도 입력값이 사라지지 않아야 한다.
- 보호 페이지에 바로 들어가도 로그인 후 원래 경로로 돌아가야 한다.
- 이미 로그인된 사용자는 `/login`에 머물지 않아야 한다.
- 로그인 화면은 메인 셸 없이 독립된 auth 레이아웃으로 보여야 한다.

## 개발자 입장

### 구조

#### 라우트 구조

```text
app/
  layout.tsx
  (auth)/
    layout.tsx (optional)
    login/
      page.tsx
  (main)/
    layout.tsx
```

### 화면 명세 (디자인 명세)

디자인 참고 문서:

- `docs/plan/layout/design-system.md`
- `docs/plan/layout/design-system/screen-patterns.md`

#### 화면 구조

```text
components/
  layout/
    auth-shell.tsx
  ui/
    button.tsx
    input.tsx

features/
  auth/
    components/
      auth-header.tsx
      auth-form-card.tsx
      login-form.tsx
      auth-switch-link.tsx
```

#### 화면 역할

| 영역 | 역할 | 설명 |
| --- | --- | --- |
| `auth-shell.tsx` | auth 레이아웃 | 로그인/회원가입 화면을 중앙 정렬 단일 레이아웃으로 감싼다 |
| `auth-header.tsx` | 화면 헤더 | 로그인 제목, 설명 카피를 보여준다 |
| `auth-form-card.tsx` | 폼 카드 컨테이너 | 입력 필드, 버튼, 링크를 한 카드 안에 정리한다 |
| `login-form.tsx` | 로그인 폼 UI | 이메일/비밀번호 입력과 제출 상태를 렌더링한다 |
| `auth-switch-link.tsx` | 전환 링크 | 회원가입 화면으로 이동하는 링크를 보여준다 |
| `button.tsx`, `input.tsx` | 공통 UI | form의 공통 버튼과 입력창 스타일을 담당한다 |

#### 입력/버튼 UI 명세

| 요소 | 사용할 컴포넌트 | UI 규칙 |
| --- | --- | --- |
| `email` 필드 | `components/ui/input.tsx` | `type=\"email\"`, 한 줄 입력, placeholder 제공 |
| `password` 필드 | `components/ui/input.tsx` | `type=\"password\"`, 한 줄 입력, mask 처리 |
| 로그인 버튼 | `components/ui/button.tsx` | primary variant, 전체 폭 사용 |
| 회원가입 전환 링크 | `features/auth/components/auth-switch-link.tsx` | 버튼보다 약한 시각 우선순위의 텍스트 링크 |

#### 화면 상태

| 상태 | 설명 |
| --- | --- |
| `email` | 이메일 입력값 |
| `password` | 비밀번호 입력값 |
| `isSubmitting` | 제출 중 여부 |
| `submitError` | 공통 실패 메시지 |

상태가 아닌 값:

- `redirectTo`는 `searchParams.redirect`를 검증해 파생한다.
- `isAuthenticated`는 서버에서 `getAuthSession()` 결과로 판단한다.

#### 화면 담당 파일

| 항목 | 파일 |
| --- | --- |
| auth 레이아웃 | `app/(auth)/layout.tsx` (optional) |
| 로그인 페이지 | `app/(auth)/login/page.tsx` |
| auth 셸 | `components/layout/auth-shell.tsx` |
| auth 카드 | `features/auth/components/auth-form-card.tsx` |
| 인증 feature UI | `features/auth/components/login-form.tsx` |
| auth 헤더 | `features/auth/components/auth-header.tsx` |
| 화면 전환 링크 | `features/auth/components/auth-switch-link.tsx` |
| 공통 입력 UI | `components/ui/*` |

### 기능 명세

#### 액션 구조

```text
lib/actions/auth.ts
  - loginAction

lib/validators/auth.ts
  - validateLoginInput
  - validateRedirect

lib/social-repository/index.ts
  - findUserByEmail

lib/session/index.ts
  - createAuthSession
  - getAuthSession

app/api/v1/auth/login/route.ts
  - POST (optional public HTTP API)
```

#### 데이터 구조

```text
LoginInput
  - email
  - password

AuthSession
  - userId
  - email
  - username
  - displayName
```

#### API 구조

```text
internal API entry
  - type: Server Action
  - caller: login-form.tsx
  - target: lib/actions/auth.ts -> loginAction

public API entry (optional)
  - type: HTTP API
  - method: POST
  - path: /api/v1/auth/login
  - file: app/api/v1/auth/login/route.ts

request body
  - email: string
  - password: string
  - redirect: string | undefined

failure response
  - success: false
  - fieldErrors
  - formError
  - values

success response (public API only)
  - success: true
  - redirectTo
  - user
```

- 웹 MVP 내부 기본 진입점은 `loginAction`이다.
- 외부 클라이언트나 공개 HTTP API가 필요할 때만 `POST /api/v1/auth/login`을 사용한다.
- `api-design.md` 기준으로 `route.ts`는 기본 경로가 아니라 공개 API가 필요할 때만 추가한다.
- 웹 내부 로그인 성공은 JSON 응답보다 `redirect`가 우선이다.

#### API 아키텍처 흐름

```text
web login flow
  app/(auth)/login/page.tsx
    -> features/auth/components/login-form.tsx
    -> lib/actions/auth.ts::loginAction
    -> lib/validators/auth.ts::validateLoginInput
    -> lib/validators/auth.ts::validateRedirect
    -> normalizeEmail(email)
    -> lib/social-repository::findUserByEmail
    -> verifyPassword(password, passwordHash)
    -> lib/session::createAuthSession
    -> redirect(redirectTo || "/")

public API flow (optional)
  POST /api/v1/auth/login
    -> app/api/v1/auth/login/route.ts
    -> lib/validators/auth.ts::validateLoginInput
    -> lib/validators/auth.ts::validateRedirect
    -> normalizeEmail(email)
    -> lib/social-repository::findUserByEmail
    -> verifyPassword(password, passwordHash)
    -> lib/session::createAuthSession
    -> JSON response
```

- 내부 웹 흐름은 `Client/Form -> Server Action -> SocialRepository -> Session -> Redirect` 구조를 따른다.
- 공개 API를 열더라도 validator, repository, session helper는 같은 것을 재사용한다.
- `page.tsx`나 `features/*`가 시드 데이터나 Firebase를 직접 호출하지 않는다.

#### 주요 상수와 함수

```text
constants
  - AUTH_COOKIE_NAME
  - AUTH_REDIRECT_QUERY_KEY = "redirect"
  - AUTH_DEFAULT_REDIRECT = "/"

functions
  - normalizeEmail(email)
  - validateRedirect(value)
  - validateLoginInput(input)
  - verifyPassword(password, passwordHash)
  - createAuthSession(user)
  - getAuthSession()
```

##### 상수 역할

| 이름 | 분류 | 역할 | 실제 기능 | 주 사용 위치 |
| --- | --- | --- | --- | --- |
| `AUTH_COOKIE_NAME` | 세션 상수 | 인증 쿠키 이름 고정 | 로그인 성공 시 저장할 쿠키와 이후 읽어올 쿠키를 동일한 이름으로 맞춘다 | `createAuthSession`, `getAuthSession`, `logoutAction` |
| `AUTH_REDIRECT_QUERY_KEY` | 라우팅 상수 | redirect query 이름 고정 | `/login?redirect=...`에서 어떤 query key를 읽을지 통일한다 | `app/(auth)/login/page.tsx`, 보호 라우트 가드 |
| `AUTH_DEFAULT_REDIRECT` | 라우팅 상수 | 기본 이동 경로 고정 | `redirect`가 없거나 잘못된 값일 때 `/`로 보내는 fallback 기준이 된다 | `validateRedirect`, `loginAction` |

##### 함수 역할

| 이름 | 분류 | 입력 | 출력 | 역할 | 실제 기능 | 주 사용 위치 |
| --- | --- | --- | --- | --- | --- | --- |
| `normalizeEmail(email)` | 정규화 함수 | `email: string` | `normalizedEmail: string` | 이메일 비교 기준 통일 | trim, lowercase 처리 후 같은 이메일을 같은 값으로 맞춘다 | `loginAction`, `findUserByEmail` 호출 전 |
| `validateRedirect(value)` | 라우팅 검증 함수 | `value: string \| undefined` | `redirectTo: string` | 안전한 내부 이동 경로 보장 | `/`로 시작하는 내부 경로만 허용하고, 외부 URL이나 `//` 경로는 차단한 뒤 fallback을 반환한다 | `app/(auth)/login/page.tsx`, `loginAction` |
| `validateLoginInput(input)` | 폼 검증 함수 | `{ email, password }` | `{ fieldErrors, isValid }` 또는 동등한 검증 결과 | 로그인 폼 입력 검증 | 이메일 형식, 비밀번호 빈 값, 에러 메시지 구조를 한곳에서 통일한다 | `loginAction` |
| `verifyPassword(password, passwordHash)` | 인증 검증 함수 | `password: string`, `passwordHash: string` | `boolean` | 로그인 자격 검증 | 사용자가 입력한 비밀번호와 저장된 hash가 일치하는지 비교한다 | `loginAction` |
| `createAuthSession(user)` | 세션 생성 함수 | `user: AuthSession 생성 가능한 사용자 객체` | 세션 저장 결과 또는 cookie write side effect | 로그인 상태 시작 | 사용자 최소 식별 정보를 인증 쿠키에 저장해 이후 요청에서도 로그인 상태를 유지하게 만든다 | `loginAction` 성공 직후 |
| `getAuthSession()` | 세션 조회 함수 | 없음 | `AuthSession \| null` | 현재 로그인 상태 확인 | 쿠키를 읽어서 현재 사용자가 로그인 상태인지, 누구인지 판별한다 | `app/(auth)/login/page.tsx`, `app/(main)/layout.tsx` |

##### 사용 흐름 기준 정리

1. `normalizeEmail`이 이메일을 비교 가능한 형태로 맞춘다.
2. `validateLoginInput`이 폼 입력 자체가 유효한지 검사한다.
3. `validateRedirect`가 이동 가능한 내부 경로인지 확인한다.
4. `verifyPassword`가 계정 인증 성공 여부를 판별한다.
5. `createAuthSession`이 로그인 상태를 저장한다.
6. `getAuthSession`이 이후 페이지에서 로그인 상태를 읽는다.

#### 기능 담당 파일

| 항목 | 파일 |
| --- | --- |
| 액션 | `lib/actions/auth.ts` |
| 공개 로그인 API | `app/api/v1/auth/login/route.ts` (optional) |
| 세션 helper | `lib/session/*` |
| validator | `lib/validators/auth.ts` |
| repository | `lib/social-repository/*` |
| 가드 | `app/(main)/layout.tsx` |

#### 입력 및 세션 규칙

- `email`은 trim 후 lowercase로 normalize하고 형식을 검증한다.
- `password`는 빈 값 입력을 허용하지 않는다.
- 로그인 실패 메시지는 계정 존재 여부를 드러내지 않고 공통 문구로 처리한다.
- 세션 쿠키 이름은 하나로 고정하고, `httpOnly`, `sameSite=lax`, `path=/`를 기본으로 한다.
- `secure` 옵션은 production에서 활성화한다.

#### 구현 규칙

##### Route Orchestration Layer (`app/*`)

- `app/(auth)/login/page.tsx`는 로그인 화면의 진입점으로만 동작한다.
- 이 레이어의 책임은 `searchParams.redirect` 읽기, 현재 세션 확인, 인증 여부에 따른 분기, 화면 조합이다.
- 이미 로그인된 사용자는 이 레이어에서 바로 `redirectTo` 또는 `/`로 보낸다.
- `app/(auth)/login/page.tsx`는 repository, seed data, Firebase, password 검증 로직을 직접 호출하지 않는다.
- `app/(auth)/layout.tsx`가 있다면 auth 전용 레이아웃과 메타데이터만 담당한다.
- 보호 라우트 차단은 `app/(main)/layout.tsx`에서 처리하고, 로그인 페이지는 그 결과로 전달된 `redirect` query만 읽는다.

##### Presentation Layer (`features/*`, `components/*`)

- `features/auth/components/login-form.tsx`는 이메일/비밀번호 입력 UI와 제출 상호작용을 소유한다.
- 이 레이어의 책임은 입력 필드 렌더링, pending 상태 표시, field/form error 표시, submit 트리거다.
- `login-form.tsx`는 `findUserByEmail`, `createAuthSession`, `cookies()`를 직접 호출하지 않는다.
- `features/auth/components/auth-header.tsx`, `auth-form-card.tsx`, `auth-switch-link.tsx`는 auth 문맥 전용 표현 컴포넌트다.
- `components/ui/button.tsx`, `components/ui/input.tsx`는 기능 정책 없는 공통 UI 프리미티브로 유지한다.
- `components/layout/auth-shell.tsx`는 중앙 정렬, 폭, 여백, 배경 같은 레이아웃 표현만 담당한다.
- `redirectTo`는 이 레이어의 상태로 저장하지 않고, 상위 라우트에서 파생된 값을 props로만 전달받는다.

##### Application / Business Layer (`lib/actions/*`, `lib/validators/*`, `lib/session/*`)

- `lib/actions/auth.ts::loginAction`이 로그인 mutation의 단일 진입점이다.
- `loginAction`은 입력 normalize, 입력 검증, 사용자 조회 요청, password 검증, 세션 저장, redirect까지 한 흐름으로 묶는다.
- `lib/validators/auth.ts::validateLoginInput`은 이메일 형식과 비밀번호 입력 규칙을 검증한다.
- `lib/validators/auth.ts::validateRedirect`는 내부 경로만 허용하고 외부 URL을 차단한다.
- `normalizeEmail`은 액션 내부에서 조회 전에 실행한다.
- `lib/session/*`은 세션 생성과 세션 조회를 담당하며, 쿠키 옵션은 여기서 일관되게 관리한다.
- 이 레이어는 JSX를 렌더링하지 않고, UI 스타일이나 레이아웃 배치를 소유하지 않는다.

##### Data Access Layer (`lib/social-repository/*`)

- 로그인에서 사용자 조회는 `lib/social-repository/*`의 `findUserByEmail`만 사용한다.
- repository는 시드 데이터인지 실제 백엔드인지 감추는 단일 진입점 역할을 한다.
- repository는 route, searchParams, React state를 알지 못해야 한다.
- 이메일 기준 사용자 조회 계약은 `findUserByEmail({ email: normalizedEmail })` 형태로 통일한다.

##### Data Source Layer (`data/seed/*`, backend)

- 1차 MVP에서는 seed 기반 사용자 데이터로 시작할 수 있다.
- 이후 실제 백엔드로 교체되더라도 `loginAction`과 `login-form.tsx`는 바뀌지 않고 repository 뒤에서만 변경되게 유지한다.
- password hash 저장 위치와 사용자 원본 데이터는 data source가 책임지고, UI 레이어는 그 구조를 직접 알지 않는다.

##### 레이어 공통 규칙

- 로그인은 이메일/비밀번호 기반으로 구현한다.
- 조회용 `query` 계층은 필수가 아니며, 로그인은 repository + action 조합으로 충분하면 생략한다.
- URL query 이름은 `redirect`로 통일한다.
- 내부 검증이 끝난 이동 경로 이름은 `redirectTo`로 통일한다.
- `redirectTo`는 `/`로 시작하는 내부 경로만 허용한다.
- `redirectTo`를 클라이언트 전역 상태나 로컬 상태에 중복 저장하지 않는다.
- 성공 시 세션 쿠키를 저장한다.

#### 개발자 플로우

1. `app/(auth)/login/page.tsx`에서 세션과 `searchParams.redirect`를 확인한다.
2. `redirect`를 검증해서 내부 값 `redirectTo`를 만든다.
3. 이미 로그인 상태면 즉시 `redirectTo` 또는 `/`로 보낸다.
4. 비로그인 상태면 `app/(auth)/layout.tsx`와 `components/layout/auth-shell.tsx` 기준으로 중앙 정렬 auth 화면을 렌더링한다.
5. `features/auth/components/login-form.tsx`가 입력 UI와 제출 상태를 소유한다.
6. `loginAction`이 이메일 normalize, validator 실행, 비밀번호 검증, 세션 쿠키 저장을 처리한다.
7. 로그인 성공 시 `redirectTo` 또는 `/`로 리다이렉트한다.
8. `app/(main)/layout.tsx`는 보호 라우트 진입 시 세션이 없으면 `/login?redirect=...`로 보낸다.

#### 예외 처리

- 공백 입력은 제출 불가
- 제출 중에는 중복 클릭 차단
- 로그인 실패 시 입력값 유지
- 로그인 실패는 공통 인증 실패 메시지 반환
- 잘못된 `redirect`는 `/`로 fallback
- 이미 로그인 상태에서 `/login`에 진입하면 즉시 이동
- 만료되었거나 손상된 세션 쿠키는 무효 세션으로 보고 재로그인을 요구한다

## 체크리스트

- [ ] `/login` 페이지가 렌더링된다
- [ ] 로그인 화면이 메인 셸 없이 중앙 정렬 auth 레이아웃으로 보인다
- [ ] 로그인 폼에 이메일, 비밀번호 입력이 있다
- [ ] 잘못된 입력 시 에러 메시지가 보인다
- [ ] `loginAction`이 세션 쿠키를 생성한다
- [ ] 로그인 성공 시 `redirect` query가 있으면 검증 후 해당 경로로 이동한다
- [ ] 잘못된 `redirect`는 `/`로 이동한다
- [ ] 이미 로그인 상태에서 `/login` 접근 시 홈 또는 목적지로 이동한다
- [ ] `redirectTo`는 로컬 상태가 아니라 라우트 입력에서 파생된다
- [ ] 실패 시 입력값이 유지된다
- [ ] 세션이 없으면 보호 라우트 접근이 차단된다
