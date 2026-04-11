# 세션 가드와 인증 네비게이션 명세

## 1. 상태 변수 및 함수 정의

세션 가드와 인증 네비게이션 기능은 로그인 페이지 재진입 차단, 보호 라우트 접근 제어, 로그인 후 복귀 경로 계산, 셸 안 인증 액션 노출 규칙을 공통 계약으로 사용한다.

### A. 타입 정의

#### I. 공통 타입

<a id="type-session-user"></a>

##### a. `SessionUser`

```ts
type SessionUser = {
  id: number;
  email: string;
  username: string;
  name: string;
  avatarUrl?: string;
};
```

### B. 상태 변수 정의

| 변수명 | 타입 | 설명 | 초기값 | 사용 컴포넌트 |
| --- | --- | --- | --- | --- |
| `sessionUser` | <a href="#type-session-user"><code>SessionUser</code></a> \| null | 현재 세션 기준 사용자 정보다. 값이 없으면 비로그인 상태다. | `auth store 또는 session의 현재 값` | `SessionGuardBoundary`, `LoginRedirectGate`, `AuthNavigationArea` |
| `redirectTo` | `string` | 가드 결과에 따라 실제로 이동할 경로다. 보호 라우트 차단 시에는 `/login?redirect=...`, 로그인 페이지 재진입 차단 시에는 안전한 내부 경로를 저장한다. | `"/"` | `SessionGuardBoundary`, `LoginRedirectGate` |
| `guardError` | `string` | 세션 확인 또는 인증 이동 과정에서 보여줄 안내 메시지다. | `""` | `LoginRedirectGate`, `GuardNoticeBanner` |
| `isCheckingSession` | `boolean` | 세션 확인 또는 리다이렉트 판단 진행 여부다. | `false` | `SessionGuardBoundary`, `LoginRedirectGate` |

### C. 함수 정의

| 함수명 | 시그니처 | 역할 | 사용 컴포넌트 |
| --- | --- | --- | --- |
| `syncSessionUser()` | `() => Promise<SessionUser \| null>` | 현재 세션 사용자 정보를 읽어 훅 상태와 동기화하고 최신 세션 값을 반환한다. | `SessionGuardBoundary`, `LoginRedirectGate`, `AuthNavigationArea` |
| `resolveRedirectTo()` | `(redirect: string \| null) => string` | `redirect` query를 검증해 안전한 내부 경로만 반환한다. | `SessionGuardBoundary`, `LoginRedirectGate` |
| `guardProtectedRoute()` | `(pathname: string, search: string) => Promise<void>` | 비로그인 사용자의 보호 라우트 진입을 차단하고 로그인 페이지로 이동시킨다. | `SessionGuardBoundary` |
| `guardAuthRoute()` | `(pathname: string, redirect: string \| null) => Promise<void>` | 로그인한 사용자의 `/login` 재진입을 차단하고 홈 또는 목적지로 이동시킨다. | `LoginRedirectGate` |
| `clearGuardError()` | `() => void` | 인증 안내 메시지를 초기화한다. | `LoginRedirectGate`, `GuardNoticeBanner` |

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
A. 컴포넌트 -> B. 훅 -> C. 서비스 -> D. 레포지토리(없음) -> E. 서버(없음)
```

참조 - [function-md-guide.md](../function-md-guide.md), [layer.md](../../layout/layer.md), [02-login.md](./02-login.md), [03-logout.md](./03-logout.md), [12-shell-navigation.md](./12-shell-navigation.md)

### A. 컴포넌트

세션 가드와 인증 네비게이션 기능은 인스타그램처럼 로그인 상태에 따라 자연스럽게 화면을 전환하고, 메인 셸에서는 로그인 버튼 또는 프로필/로그아웃 액션만 보이도록 정리한다.
이 문서 기준 보호 라우트는 `/`, `/create`, `/p/[shortcode]`, `/u/[username]`다.

#### I. 컴포넌트 구조

```text
LoginPage
  -> LoginRedirectGate
    -> GuardNoticeBanner
    -> LoginForm

MainLayout
  -> SessionGuardBoundary
    -> ShellFrame
      -> AuthNavigationArea
        -> LoginLinkButton
        -> ProfileLinkButton
        -> LogoutButton
      -> children
```

#### II. 컴포넌트 타입

<a id="type-session-guard-boundary-props"></a>

##### a. `SessionGuardBoundaryProps`

```ts
type SessionGuardBoundaryProps = {
  pathname: string;
  search: string;
  children: ReactNode;
};
```

<a id="type-login-redirect-gate-props"></a>

##### b. `LoginRedirectGateProps`

```ts
type LoginRedirectGateProps = {
  pathname: string;
  redirect: string | null;
  children: ReactNode;
};
```

<a id="type-auth-navigation-area-props"></a>

##### c. `AuthNavigationAreaProps`

```ts
type AuthNavigationAreaProps = {
  loginHref: string;
  profileHref: string;
};
```

<a id="type-auth-link-button-props"></a>

##### d. `AuthLinkButtonProps`

```ts
type AuthLinkButtonProps = {
  href: string;
  label: string;
};
```

<a id="type-guard-notice-banner-props"></a>

##### e. `GuardNoticeBannerProps`

```ts
type GuardNoticeBannerProps = {
  message: string;
  onClose: () => void;
};
```

<a id="type-logout-trigger-button-props"></a>

##### f. `LogoutTriggerButtonProps`

```ts
type LogoutTriggerButtonProps = {
  disabled: boolean;
  onClick: () => void;
};
```

#### III. 컴포넌트 정의

| 컴포넌트명 | 역할 | 사용하는 Hook | 받는 props | 이벤트에서 호출하는 함수 | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `LoginPage` | 로그인 페이지 진입 컴포넌트다. 실제 세션 재진입 차단은 `LoginRedirectGate`가 담당한다. | 없음 | 없음 | 없음 | 없음 |
| `LoginRedirectGate` | 로그인 페이지 진입 전 현재 세션과 `redirect` query를 검사한다. 로그인된 사용자는 홈 또는 원래 목적지로 보낸다. | `useSessionGuard()` | <a href="#type-login-redirect-gate-props"><code>LoginRedirectGateProps</code></a> | `onMount 또는 onRedirectChange -> guardAuthRoute(pathname, redirect)` | `sessionUser`, `redirectTo`, `guardError`, `isCheckingSession` |
| `GuardNoticeBanner` | 보호 라우트에서 로그인 페이지로 이동한 뒤 보여줄 인증 안내 메시지를 출력한다. | 없음 | <a href="#type-guard-notice-banner-props"><code>GuardNoticeBannerProps</code></a> | `onClose -> clearGuardError()` | 없음 |
| `MainLayout` | 메인 셸 진입 컴포넌트다. 실제 보호 라우트 차단은 `SessionGuardBoundary`가 담당한다. | 없음 | 없음 | 없음 | 없음 |
| `SessionGuardBoundary` | 보호 라우트 진입 전 세션을 확인하고, 비로그인 상태면 `/login?redirect=...`로 이동시킨다. | `useSessionGuard()` | <a href="#type-session-guard-boundary-props"><code>SessionGuardBoundaryProps</code></a> | `onMount 또는 onPathChange -> guardProtectedRoute(pathname, search)` | `sessionUser`, `redirectTo`, `guardError`, `isCheckingSession` |
| `AuthNavigationArea` | 로그인 여부에 따라 `LoginLinkButton` 또는 `ProfileLinkButton`, `LogoutButton`을 나눠 노출한다. | `useSessionGuard()` | <a href="#type-auth-navigation-area-props"><code>AuthNavigationAreaProps</code></a> | 없음 | `sessionUser` |
| `LoginLinkButton` | 비로그인 상태에서 로그인 페이지 이동 버튼을 노출한다. | 없음 | <a href="#type-auth-link-button-props"><code>AuthLinkButtonProps</code></a> | 없음 | 없음 |
| `ProfileLinkButton` | 로그인 상태에서 현재 사용자 프로필 이동 버튼을 노출한다. | 없음 | <a href="#type-auth-link-button-props"><code>AuthLinkButtonProps</code></a> | 없음 | 없음 |
| `LogoutButton` | 로그인 상태에서만 노출되고, 실제 로그아웃 요청은 로그아웃 기능 문서의 `useLogout()`에 위임한다. | `useLogout()` | <a href="#type-logout-trigger-button-props"><code>LogoutTriggerButtonProps</code></a> | `onClick -> logout()` | 없음 |

### B. 훅

세션 가드 훅은 현재 세션 정보와 인증 이동 규칙을 기능 단위로 관리한다.

#### I. 훅 타입

<a id="type-session-guard-state"></a>

##### a. `SessionGuardState`

```ts
type SessionGuardState = {
  sessionUser: SessionUser | null;
  redirectTo: string;
  guardError: string;
  isCheckingSession: boolean;
};
```

<a id="type-session-guard-actions"></a>

##### b. `SessionGuardActions`

```ts
type SessionGuardActions = {
  syncSessionUser: () => Promise<SessionUser | null>;
  resolveRedirectTo: (redirect: string | null) => string;
  guardProtectedRoute: (pathname: string, search: string) => Promise<void>;
  guardAuthRoute: (pathname: string, redirect: string | null) => Promise<void>;
  clearGuardError: () => void;
};
```

<a id="type-use-session-guard-return"></a>

##### c. `UseSessionGuardReturn`

```ts
type UseSessionGuardReturn = SessionGuardState & SessionGuardActions;
```

#### II. useSessionGuard

##### a. 훅 요약

| 항목 | 내용 |
| --- | --- |
| 훅명 | `useSessionGuard()` |
| 역할 | 세션 상태 동기화, 보호 라우트 접근 제어, 로그인 페이지 재진입 제어 |
| 호출 Service | `sessionGuardService.getSessionUser()`, `sessionGuardService.resolveRedirectTo(redirect)`, `sessionGuardService.guardProtectedRoute(pathname, search, currentSessionUser)`, `sessionGuardService.guardAuthRoute(pathname, redirectTo, currentSessionUser)` |

##### b. 상태

| 변수명 | 범위 | 초기값 | 역할 |
| --- | --- | --- | --- |
| `sessionUser` | `public` | `auth store 또는 session의 현재 값` | 세션 상태 동기화 |
| `redirectTo` | `public` | `"/"` | 가드 결과 이동 경로 관리 |
| `guardError` | `public` | `""` | 인증 안내 상태 관리 |
| `isCheckingSession` | `public` | `false` | 세션 확인 상태 관리 |

##### c. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 service | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `syncSessionUser()` | `public` | 없음 | <code>Promise&lt;<a href="#type-session-user">SessionUser</a> \| null&gt;</code> | <code>sessionGuardService.getSessionUser(): Promise&lt;<a href="#type-session-user">SessionUser</a> \| null&gt;</code> | `sessionUser`, `guardError`, `isCheckingSession` |
| `resolveRedirectTo()` | `public` | `redirect: string \| null` | `string` | <code>sessionGuardService.resolveRedirectTo(redirect: string \| null): string</code> | `redirectTo`, `guardError` |
| `guardProtectedRoute()` | `public` | `pathname: string`, `search: string` | `Promise<void>` | <code>sessionGuardService.guardProtectedRoute(pathname: string, search: string, currentSessionUser: <a href="#type-session-user">SessionUser</a> \| null): <a href="#type-guard-result">GuardResult</a></code> | `redirectTo`, `guardError`, `isCheckingSession` |
| `guardAuthRoute()` | `public` | `pathname: string`, `redirect: string \| null` | `Promise<void>` | <code>sessionGuardService.guardAuthRoute(pathname: string, redirectTo: string, currentSessionUser: <a href="#type-session-user">SessionUser</a> \| null): <a href="#type-guard-result">GuardResult</a></code> | `redirectTo`, `guardError`, `isCheckingSession` |
| `clearGuardError()` | `public` | 없음 | `void` | 없음 | `guardError` |

##### d. 동작 규칙

- `syncSessionUser()`
  - 시작 시 `isCheckingSession = true`, `guardError = ""`
  - 실행 중 `sessionGuardService.getSessionUser()`를 호출한다.
  - 완료 시 현재 세션 사용자 정보를 `sessionUser`에 동기화하고 최신 세션 값을 반환한다.
- `resolveRedirectTo()`
  - 전달받은 `redirect` 값을 `sessionGuardService.resolveRedirectTo(redirect)`로 검증한다.
  - 안전한 내부 경로면 그대로 사용하고, 아니면 `"/"`로 대체한다.
- `guardProtectedRoute()`
  - 보호 라우트 진입 시 먼저 `const currentSessionUser = await syncSessionUser()`를 실행한다.
  - `sessionGuardService.guardProtectedRoute(pathname, search, currentSessionUser)`를 호출한다.
  - `allow = false`면 `result.redirectTo`로 이동한다.
- `guardAuthRoute()`
  - 로그인 페이지 진입 시 먼저 `const safeRedirectTo = resolveRedirectTo(redirect)`로 목적 경로를 정리한다.
  - `const currentSessionUser = await syncSessionUser()` 이후 `sessionGuardService.guardAuthRoute(pathname, safeRedirectTo, currentSessionUser)`를 호출한다.
  - `allow = false`면 `result.redirectTo` 또는 `"/"`로 이동한다.
- `clearGuardError()`
  - `guardError = ""`로 초기화한다.

##### e. 상태 갱신 규칙

| 상황 | 상태 갱신 |
| --- | --- |
| 세션 확인 시작 | `isCheckingSession = true`, `guardError = ""` |
| 세션 확인 완료 | `sessionUser = data`, `isCheckingSession = false` |
| 보호 라우트 차단 | `redirectTo = "/login?redirect=..."`, `guardError = "계속하려면 로그인하세요."`, `isCheckingSession = false` |
| 로그인 페이지 재진입 차단 | `redirectTo = safePath`, `guardError = ""`, `isCheckingSession = false` |
| 안내 메시지 초기화 | `guardError = ""` |

### C. 서비스

세션 가드 서비스는 현재 세션 확인, 안전한 복귀 경로 계산, 보호 라우트 차단 규칙을 담당한다.

#### I. 서비스 타입

<a id="type-guard-result"></a>

##### a. `GuardResult`

```ts
type GuardResult = {
  allow: boolean;
  redirectTo: string | null;
  message: string;
};
```

#### II. `sessionGuardService`

##### a. 서비스 요약

| 항목 | 내용 |
| --- | --- |
| 서비스명 | `sessionGuardService` |
| 역할 | 현재 세션 확인, 안전한 `redirectTo` 계산, 보호 라우트 차단, 로그인 페이지 재진입 차단 |
| 호출 Repository | 없음 |

##### b. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 대상 | 실패 메시지 | 역할 |
| --- | --- | --- | --- | --- | --- | --- |
| `getSessionUser()` | `public` | 없음 | <code>Promise&lt;<a href="#type-session-user">SessionUser</a> \| null&gt;</code> | <code>session helper.getSessionUser(): Promise&lt;<a href="#type-session-user">SessionUser</a> \| null&gt;</code> | 없음 | 현재 세션 사용자 정보를 읽는다. |
| `resolveRedirectTo()` | `public` | `redirect: string \| null` | `string` | <code>validateRedirect(redirect: string \| null): boolean</code> | 없음 | 안전한 내부 경로만 `redirectTo`로 반환한다. |
| `guardProtectedRoute()` | `public` | `pathname: string`, `search: string`, `sessionUser: <a href="#type-session-user"><code>SessionUser</code></a> \| null` | <code><a href="#type-guard-result">GuardResult</a></code> | <code>buildLoginRedirect(pathname: string, search: string): string</code> | `계속하려면 로그인하세요.` | 보호 라우트 접근 허용 여부와 로그인 페이지 이동 경로를 반환한다. |
| `guardAuthRoute()` | `public` | `pathname: string`, `redirectTo: string`, `sessionUser: <a href="#type-session-user"><code>SessionUser</code></a> \| null` | <code><a href="#type-guard-result">GuardResult</a></code> | 없음 | 없음 | 로그인 페이지 재진입 허용 여부와 이동 경로를 반환한다. |
| `validateRedirect()` | `private` | `redirect: string \| null` | `boolean` | 없음 | 없음 | `redirect`가 안전한 내부 경로인지 검사한다. |
| `buildLoginRedirect()` | `private` | `pathname: string`, `search: string` | `string` | 없음 | 없음 | 현재 보호 라우트를 로그인 후 복귀 가능한 경로로 직렬화한다. |

##### c. 동작 규칙

- `getSessionUser()`
  - session helper에서 현재 사용자 정보를 읽는다.
- `resolveRedirectTo()`
  - `validateRedirect()`로 `redirect` query를 검증한다.
  - 유효한 내부 경로면 그대로 반환한다.
  - 유효하지 않으면 `"/"`를 반환한다.
- `guardProtectedRoute()`
  - `sessionUser`가 있으면 접근을 허용한다.
  - `sessionUser`가 없으면 `buildLoginRedirect(pathname, search)`를 호출한다.
  - 로그인 페이지 경로와 `계속하려면 로그인하세요.` 메시지를 반환한다.
- `guardAuthRoute()`
  - `sessionUser`가 없으면 로그인 페이지 접근을 허용한다.
  - `sessionUser`가 있으면 `redirectTo` 또는 `"/"`로 이동시킨다.
- `validateRedirect()`
  - `redirect`는 `/`로 시작해야 한다.
  - `//`, `http://`, `https://`, 빈 문자열은 허용하지 않는다.
- `buildLoginRedirect()`
  - `pathname`과 `search`를 합쳐 원래 목적 경로를 만든다.
  - `/login?redirect=...` 형식의 안전한 로그인 경로를 반환한다.

##### d. 반환 규칙

- `getSessionUser()`

| 상황 | 반환값 |
| --- | --- |
| 세션 있음 | <code><a href="#type-session-user">SessionUser</a></code> |
| 세션 없음 | `null` |

- `resolveRedirectTo()`

| 상황 | 반환값 |
| --- | --- |
| 유효한 내부 경로 | `redirect` |
| 유효하지 않은 경로 | `"/"` |

- `guardProtectedRoute()`

| 상황 | 반환값 |
| --- | --- |
| 세션 있음 | `allow: true`, `redirectTo: null`, `message: ""` |
| 세션 없음 | `allow: false`, `redirectTo: "/login?redirect=..."`, `message: "계속하려면 로그인하세요."` |

- `guardAuthRoute()`

| 상황 | 반환값 |
| --- | --- |
| 세션 없음 | `allow: true`, `redirectTo: null`, `message: ""` |
| 세션 있음 | `allow: false`, `redirectTo: string`, `message: ""` |

- `validateRedirect()`

| 상황 | 반환값 |
| --- | --- |
| 유효한 내부 경로 | `true` |
| 유효하지 않은 경로 | `false` |

- `buildLoginRedirect()`

| 상황 | 반환값 |
| --- | --- |
| 보호 라우트 직렬화 성공 | `/login?redirect=...` |

### D. 레포지토리

세션 가드와 인증 네비게이션 기능은 별도 API repository를 직접 사용하지 않고 session helper와 app router 리다이렉트만 사용한다.

#### I. API 타입

해당 없음.

#### II. 레포지토리 사용

##### a. 레포지토리 요약

| 항목 | 내용 |
| --- | --- |
| 레포지토리명 | 없음 |
| 역할 | 세션 가드와 인증 네비게이션은 API 통신보다 현재 세션 확인과 경로 계산을 우선한다. |
| 호출 API | 없음 |

##### b. 함수

없음.

##### c. 요청 규칙

없음.

##### d. 동작 규칙

- 세션 가드 기능은 repository 계층을 직접 사용하지 않는다.
- 로그아웃 API 요청은 [03-logout.md](./03-logout.md)에서 별도로 관리한다.

##### e. 반환 규칙

없음.

### E. 서버

세션 가드와 인증 네비게이션 기능은 별도 서버 API보다 앱 라우팅 계층에서 세션과 경로를 확인하는 방식으로 동작한다.

#### I. 세션 가드 서버 처리

##### a. API 요약

| 항목 | 내용 |
| --- | --- |
| API 이름 | 없음 |
| 메서드 | 없음 |
| URL | 없음 |
| 요청 본문 | 없음 |
| 처리 | 세션 가드는 별도 서버 API 호출 없이 앱 라우팅 계층에서 현재 세션과 현재 경로를 확인해 리다이렉트만 수행한다. |
| 응답 | 없음 |

##### b. 요청 본문 예시

없음.

##### c. 응답 예시

없음.

## 3. 디자인 참조

세션 가드와 인증 네비게이션 기능은 인증 화면, 공통 셸, 상단 액션 영역을 인스타그램처럼 가볍고 자연스럽게 연결하는 방향으로 디자인 문서를 참조한다.

### A. 디자인 참조 문서

| 구분 | 문서 | 역할 |
| --- | --- | --- |
| 전체 디자인 시스템 | [design-system.md](../../layout/design-system.md) | 토큰, 상태, 인터랙션 기본 규칙 |
| 화면 조합 패턴 | [screen-patterns.md](../../layout/design-system/screen-patterns.md) | 로그인 화면과 메인 셸 전환 패턴 |
| 공통 UI 컴포넌트 | [components-ui.md](../../layout/design-system/components-ui.md) | 버튼, 배너, 링크형 액션 UI 규칙 |
| 공통 레이아웃 컴포넌트 | [components-layout.md](../../layout/design-system/components-layout.md) | `AppHeader`, `ShellFrame`, `DesktopSidebar` 구성 규칙 |
| 인증 화면 디자인 | [auth-login.md](../../layout/design-system/auth-login.md) | 로그인 진입 화면과 인증 안내 UI 기준 |
