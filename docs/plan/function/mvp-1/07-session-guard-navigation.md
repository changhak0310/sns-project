# 기능 07 - 세션 가드와 인증 네비게이션

## 개요

| 항목 | 내용 |
| --- | --- |
| 라우트 | 공통, `/login`, 보호 라우트 전체 |
| 페이지 | `app/(auth)/login/page.tsx`, `app/(main)/layout.tsx` |
| 주요 액션 | `loginAction`, `logoutAction` |
| 핵심 데이터 | 로그인 유지 정보, `redirectTo`, 인증 상태 |
| 성공 후 | 로그인 상태에 맞는 자연스러운 리다이렉트와 로그아웃 종료 흐름 보장 |

## 유저 입장

### 유저 스토리

> 나는 로그인 상태에 따라 올바른 화면으로 이동하고, 로그아웃하면 더 이상 보호된 기능에 접근하지 못하길 원한다.

### 사용자가 보게 되는 것

- 로그인 후 홈 이동
- 보호 라우트 접근 시 로그인 유도
- 로그아웃 버튼
- 잘못된 접근 시 자연스러운 이동

### 사용자 흐름

1. 비로그인 상태에서 `/create` 같은 보호 라우트 진입 시도
2. `/login?redirect=...`로 이동
3. 로그인 성공 후 원래 경로 또는 `/`로 이동
4. 로그인 상태에서 `/login` 진입 시 `/` 또는 `redirectTo`로 이동
5. 로그아웃 클릭 시 세션 종료 후 `/login` 이동

### 유저 기준 핵심 규칙

- 보호 라우트는 비로그인 상태에서 직접 접근되면 안 된다.
- 로그인 후에는 원래 가려던 경로로 복귀할 수 있어야 한다.
- 로그아웃 후 뒤로 가기를 해도 보호 라우트는 다시 열리면 안 된다.

## 개발자 입장

### 구조

#### 라우트 구조

```text
app/
  (auth)/
    login/
      page.tsx
  (main)/
    layout.tsx
    @modal/
      default.tsx
```

#### UI 구조

```text
features/
  auth/
    components/
      login-form.tsx

components/
  layout/
    app-header.tsx
    account-menu.tsx
    logout-button.tsx
```

#### 액션 구조

```text
lib/actions/auth.ts
  - loginAction
  - logoutAction
```

#### 데이터 구조

```text
AuthState
  - isAuthenticated
  - redirectTo
  - user
```

추가 규칙:

- 보호 라우트는 `/`, `/p/[shortcode]`, `/create`, `/u/[username]` 전체를 포함한다.
- 메인 레이아웃은 `children`과 `modal` 슬롯을 렌더링하기 전에 세션을 검사한다.

### 담당 파일

| 항목 | 파일 |
| --- | --- |
| 로그인 페이지 | `app/(auth)/login/page.tsx` |
| 메인 가드 | `app/(main)/layout.tsx` |
| 인증 feature UI | `features/auth/components/login-form.tsx` |
| 계정 메뉴 | `components/layout/account-menu.tsx` |
| 로그아웃 버튼 | `components/layout/logout-button.tsx` |
| 액션 | `lib/actions/auth.ts` |
| 세션 helper | `lib/session/*` |

### 로컬 상태

| 상태 | 설명 |
| --- | --- |
| `redirectTo` | `redirect` query를 검증한 로그인 후 이동 경로 |
| `isSubmitting` | 로그인 또는 로그아웃 처리 중 여부 |
| `submitError` | 인증 실패 메시지 |

### 구현 규칙

- 보호 라우트 접근 제어는 레이아웃 가드 기준으로 처리한다.
- URL query 이름은 `redirect`, 내부에서 검증한 값은 `redirectTo`로 통일한다.
- `redirectTo`는 `/`로 시작하는 내부 경로만 허용하고, `//`, 프로토콜 포함 URL, 빈 문자열은 허용하지 않는다.
- 보호 라우트에서 로그인 페이지로 보낼 때는 가능하면 pathname과 search를 함께 보존한다.
- 로그인 상태에서 `/login` 접근 시 중복 진입을 막는다.
- 로그아웃은 어디서 눌러도 같은 종료 흐름을 가져야 한다.
- 로그아웃 버튼은 메인 셸 안에서만 노출한다.

### 개발자 플로우

1. `app/(main)/layout.tsx`가 세션을 확인한다.
2. 세션이 없으면 현재 경로를 `redirect` query에 담아 `/login`으로 보낸다.
3. `app/(auth)/login/page.tsx`는 이미 로그인 상태면 즉시 `/` 또는 `redirectTo`로 보낸다.
4. 로그인 성공 시 세션을 저장하고 안전한 경로로 리다이렉트한다.
5. 로그아웃 클릭 시 `logoutAction`이 세션을 삭제하고 `/login`으로 이동시킨다.

### 예외 처리

- 잘못된 `redirectTo`는 `/`로 fallback
- 세션 만료 시 다음 보호 라우트 접근에서 다시 로그인 유도
- 로그아웃 실패 시 사용자에게 종료 실패 메시지 노출

## 체크리스트

- [ ] 비로그인 상태에서 보호 라우트 접근 시 `/login?redirect=...`로 이동한다
- [ ] 로그인 성공 시 `redirect` query가 있으면 검증 후 해당 경로로 이동한다
- [ ] 로그인 상태에서 `/login` 접근 시 홈 또는 목적지로 이동한다
- [ ] 로그아웃 버튼이 존재한다
- [ ] 로그아웃 시 세션이 종료되고 `/login`으로 이동한다
- [ ] 뒤로 가기 후에도 보호 라우트 접근이 차단된다
