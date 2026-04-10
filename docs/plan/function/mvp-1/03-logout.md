# 기능 03 - 로그아웃

## 개요

| 항목 | 내용 |
| --- | --- |
| 라우트 | 공통 (`(main)` 내부) |
| 페이지 | 없음. `app/(main)` 내부 UI에서 호출 |
| 주요 액션 | `logoutAction` |
| 핵심 데이터 | 세션 정보, 현재 사용자 인증 상태, 로그아웃 호출 위치 |
| 성공 후 | 세션 삭제 후 `/login`으로 이동 |

## 유저 입장

### 유저 스토리

> 나는 로그인된 상태에서 명확한 로그아웃 버튼을 누르고, 내 세션이 종료된 뒤 로그인 화면으로 이동하고 싶다.

### 사용자가 보게 되는 것

- 헤더 또는 프로필 메뉴 안 로그아웃 버튼
- 클릭 가능한 단일 액션
- 처리 중 비활성 상태

### 사용자 흐름

1. 로그인된 사용자가 메인 셸 안에서 로그아웃 버튼을 본다
2. 로그아웃 버튼을 클릭한다
3. 세션이 삭제된다
4. `/login`으로 이동한다
5. 이후 보호 라우트 접근 시 다시 로그인이 필요하다

### 유저 기준 핵심 규칙

- 로그아웃 버튼은 로그인된 상태에서만 보여야 한다.
- 클릭 후 세션이 즉시 종료되어야 한다.
- 로그아웃 후 보호 페이지에 다시 접근하면 로그인으로 보내야 한다.
- 처리 중에는 중복 클릭이 되지 않아야 한다.

## 개발자 입장

### 구조

#### 라우트 구조

```text
app/
  (main)/
    layout.tsx
    page.tsx
    u/
      [username]/
        page.tsx
```

#### UI 구조

```text
features/
  auth/
    components/
      logout-button.tsx

components/
  layout/
    app-header.tsx
    desktop-sidebar.tsx
    bottom-nav.tsx
```

#### 액션 구조

```text
lib/actions/auth.ts
  - logoutAction

lib/session/index.ts
  - clearAuthSession
  - getAuthSession
```

#### 데이터 구조

```text
AuthSession
  - userId
  - email
  - username
  - displayName

LogoutIntent
  - source
  - shouldRedirectToLogin
```

추가 규칙:

- 로그아웃은 별도 페이지가 아니라 메인 셸 내부 액션으로 동작한다.
- 세션이 없는 상태에서 로그아웃을 호출해도 안전하게 `/login`으로 보낼 수 있어야 한다.

#### API 구조

```text
Server Action API

logoutAction()
  input:
    - none
  output:
    - session cleared
    - redirect to /login
```

- 로그아웃은 별도 REST endpoint보다 `Server Action`을 우선 사용한다.
- 버튼 클릭은 `logoutAction`으로 직접 연결한다.
- 성공 기준은 세션 쿠키 삭제와 `/login` 이동이다.

#### 주요 상수와 함수

```text
constants
  - AUTH_COOKIE_NAME
  - LOGIN_ROUTE = "/login"

functions
  - clearAuthSession()
  - getAuthSession()
  - logoutAction()
```

- `AUTH_COOKIE_NAME`은 삭제 대상 인증 쿠키 이름을 고정한다.
- `LOGIN_ROUTE`는 로그아웃 후 공통 이동 경로다.
- `clearAuthSession`은 쿠키 기반 로그인 유지 정보를 제거한다.
- `getAuthSession`은 버튼 노출 여부와 보호 라우트 판별에 사용한다.
- `logoutAction`은 세션 삭제 후 `/login` redirect를 수행한다.

### 담당 파일

| 항목 | 파일 |
| --- | --- |
| 메인 가드 레이아웃 | `app/(main)/layout.tsx` |
| 로그아웃 버튼 | `features/auth/components/logout-button.tsx` |
| 헤더 배치 | `components/layout/app-header.tsx` |
| 데스크톱 메뉴 배치 | `components/layout/desktop-sidebar.tsx` |
| 액션 | `lib/actions/auth.ts` |
| 세션 helper | `lib/session/*` |

### 로컬 상태

| 상태 | 설명 |
| --- | --- |
| `isPending` | 로그아웃 처리 중 여부 |

상태가 아닌 값:

- `isAuthenticated`는 서버에서 `getAuthSession()` 결과로 판단한다.
- `logoutVisible`은 로그인 상태와 현재 셸 위치에서 파생한다.

### 구현 규칙

- 로그아웃 UI는 `(main)` 셸 내부에서만 노출한다.
- 로그아웃 버튼은 `features/auth/components/logout-button.tsx`에 둔다.
- 헤더, 사이드바 같은 배치만 `components/layout`에서 담당한다.
- 로그아웃은 `logoutAction -> clearAuthSession -> redirect('/login')` 흐름으로 처리한다.
- 세션 삭제 로직은 UI에서 직접 구현하지 않고 `lib/session` helper를 사용한다.
- 로그아웃 후 브라우저 뒤로가기로 보호 라우트가 보이더라도 서버 가드가 다시 로그인으로 보내야 한다.

### 개발자 플로우

1. `app/(main)/layout.tsx`가 현재 세션을 확인한다.
2. 로그인 상태면 헤더 또는 사이드바에 `logout-button.tsx`를 렌더링한다.
3. 사용자가 버튼을 클릭하면 `logoutAction`을 호출한다.
4. `logoutAction`이 `clearAuthSession()`으로 인증 쿠키를 삭제한다.
5. 세션 삭제 후 `/login`으로 리다이렉트한다.
6. 이후 보호 라우트 재진입 시 가드가 다시 세션 유무를 검사한다.

### 예외 처리

- 이미 세션이 없는 상태에서 로그아웃 호출 시에도 안전하게 `/login`으로 이동
- 처리 중 중복 클릭 차단
- 세션 삭제 실패 시 로그인 화면으로 보내기 전에 에러 로그 기록 고려
- 로그아웃 후 보호 라우트 접근 시 다시 로그인으로 보낸다

## 체크리스트

- [ ] 로그인된 상태에서만 로그아웃 버튼이 보인다
- [ ] 로그아웃 버튼 클릭 시 `logoutAction`이 호출된다
- [ ] `logoutAction`이 세션 쿠키를 삭제한다
- [ ] 로그아웃 성공 시 `/login`으로 이동한다
- [ ] 로그아웃 처리 중 중복 클릭이 차단된다
- [ ] 로그아웃 후 보호 라우트 접근이 차단된다
