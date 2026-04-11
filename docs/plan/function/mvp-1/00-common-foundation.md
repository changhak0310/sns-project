# 공통 기반 명세

## 1. 상태 변수 및 함수 정의

공통 기반 기능은 메인 셸 레이아웃과 인증 레이아웃의 공통 구조를 정의하고, 셸에서 사용하는 최소 상태와 함수 계약을 고정한다.

### A. 타입 정의

#### I. 공통 타입
<a id="type-nav-item"></a>

##### a. `NavItem`

```ts
type NavItem = {
  label: string;
  href: string;
  icon: string;
  matchPrefixes?: string[];
};
```

<a id="type-shell-layout-config"></a>

##### b. `ShellLayoutConfig`

```ts
type ShellLayoutConfig = {
  showHeader: boolean;
  showMobileNav: boolean;
  showDesktopSidebar: boolean;
  showBackButton: boolean;
  showMenuButton: boolean;
};
```

### B. 상태 변수 정의

| 변수명 | 타입 | 설명 | 초기값 | 사용 컴포넌트 |
| --- | --- | --- | --- | --- |
| `isMobileNavOpen` | `boolean` | 모바일 셸 메뉴 열림 여부 | `false` | `MainLayout`, `AppHeader`, `ShellFrame` |
| `isDesktopSidebarCollapsed` | `boolean` | 데스크톱 사이드바 축소 여부 | `false` | `MainLayout`, `DesktopSidebar`, `ShellFrame` |

### C. 함수 정의

| 함수명 | 시그니처 | 역할 | 사용 컴포넌트 |
| --- | --- | --- | --- |
| `openMobileNav()` | `() => void` | 모바일 메뉴를 연다. | `AppHeader` |
| `closeMobileNav()` | `() => void` | 모바일 메뉴를 닫는다. | `MainLayout`, `ShellFrame` |
| `toggleMobileNav()` | `() => void` | 모바일 메뉴 열림 상태를 전환한다. | `AppHeader` |
| `toggleDesktopSidebar()` | `() => void` | 데스크톱 사이드바 축소 상태를 전환한다. | `DesktopSidebar` |
| `resetShellState()` | `() => void` | 공통 셸 로컬 상태를 초기값으로 되돌린다. | `MainLayout` |

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

참조 - [function-md-guide.md](../function-md-guide.md), [layer.md](../../layout/layer.md)

### A. 컴포넌트

공통 기반 기능은 루트 레이아웃, 메인 셸 레이아웃, 인증 레이아웃, 공통 셸 조각 컴포넌트를 기능 단위로 나누어 정의한다.

#### I. 컴포넌트 구조

```text
RootLayout
  -> MainLayout
    -> ShellFrame
      -> AppHeader
      -> BottomNav
      -> DesktopSidebar
  -> AuthLayout
```

#### II. 컴포넌트 타입
<a id="type-layout-children-props"></a>

##### a. `LayoutChildrenProps`

```ts
type LayoutChildrenProps = {
  children: ReactNode;
};
```

<a id="type-main-layout-props"></a>

##### b. `MainLayoutProps`

```ts
type MainLayoutProps = {
  children: ReactNode;
  modal?: ReactNode;
};
```

<a id="type-shell-frame-props"></a>

##### c. `ShellFrameProps`

```ts
type ShellFrameProps = {
  children: ReactNode;
  header?: ReactNode;
  mobileNav?: ReactNode;
  desktopSidebar?: ReactNode;
  modal?: ReactNode;
  onCloseMobileNav?: () => void;
};
```

<a id="type-app-header-props"></a>

##### d. `AppHeaderProps`

```ts
type AppHeaderProps = {
  title: string;
  showBackButton: boolean;
  showMenuButton: boolean;
  onBack?: () => void;
  onMenuClick?: () => void;
  rightAction?: ReactNode;
};
```

<a id="type-bottom-nav-props"></a>

##### e. `BottomNavProps`

```ts
type BottomNavProps = {
  navItems: NavItem[];
  activeHref: string;
};
```

<a id="type-desktop-sidebar-props"></a>

##### f. `DesktopSidebarProps`

```ts
type DesktopSidebarProps = {
  navItems: NavItem[];
  activeHref: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
};
```

#### III. 컴포넌트 정의

| 컴포넌트명 | 역할 | 사용하는 Hook | 받는 props | 이벤트에서 호출하는 함수 | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `RootLayout` | 앱 전체 HTML 루트와 공통 provider를 감싼다. | 없음 | <a href="#type-layout-children-props"><code>LayoutChildrenProps</code></a> | 없음 | 없음 |
| `MainLayout` | 메인 라우트 공통 셸 구성과 배치를 담당한다. | `useAppShell()` | <a href="#type-main-layout-props"><code>MainLayoutProps</code></a> | `onUnmount -> resetShellState()` | `isMobileNavOpen`, `isDesktopSidebarCollapsed` |
| `AuthLayout` | 로그인, 회원가입 등 인증 라우트 전용 단순 레이아웃을 담당한다. | 없음 | <a href="#type-layout-children-props"><code>LayoutChildrenProps</code></a> | 없음 | 없음 |
| `ShellFrame` | 헤더, 본문, 모바일 네비, 데스크톱 사이드바, 모달 슬롯을 배치한다. | 없음 | <a href="#type-shell-frame-props"><code>ShellFrameProps</code></a> | `onCloseMobileNav -> onCloseMobileNav?.()` | 없음 |
| `AppHeader` | 화면 제목, 뒤로가기 버튼, 모바일 메뉴 버튼을 노출한다. | 없음 | <a href="#type-app-header-props"><code>AppHeaderProps</code></a> | `onMenuClick -> onMenuClick?.()` | 없음 |
| `BottomNav` | 모바일 하단 탭 네비게이션을 렌더링한다. | 없음 | <a href="#type-bottom-nav-props"><code>BottomNavProps</code></a> | 없음 | 없음 |
| `DesktopSidebar` | 데스크톱 사이드바 네비게이션과 축소 토글을 렌더링한다. | 없음 | <a href="#type-desktop-sidebar-props"><code>DesktopSidebarProps</code></a> | `onToggleCollapse -> onToggleCollapse()` | 없음 |

### B. 훅

공통 기반 기능에서 사용하는 훅은 셸 상태와 셸 계산값을 기능 단위로 나누어 정의한다.

#### I. 훅 타입
<a id="type-app-shell-state"></a>

##### a. `AppShellState`

```ts
type AppShellState = {
  isMobileNavOpen: boolean;
  isDesktopSidebarCollapsed: boolean;
};
```

<a id="type-app-shell-computed"></a>

##### b. `AppShellComputed`

```ts
type AppShellComputed = {
  layoutConfig: ShellLayoutConfig;
  navItems: NavItem[];
  activeHref: string;
};
```

<a id="type-app-shell-actions"></a>

##### c. `AppShellActions`

```ts
type AppShellActions = {
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;
  toggleDesktopSidebar: () => void;
  resetShellState: () => void;
};
```

<a id="type-use-app-shell-return"></a>

##### d. `UseAppShellReturn`

```ts
type UseAppShellReturn = AppShellState & AppShellComputed & AppShellActions;
```

#### II. useAppShell

##### a. 훅 요약

| 항목 | 내용 |
| --- | --- |
| 훅명 | `useAppShell()` |
| 역할 | 공통 셸 UI 상태 관리, 셸 배치 계산, 활성 네비게이션 계산 |
| 호출 Service | `shellService.getShellLayoutConfig(pathname)`, `shellService.getNavItems(username)`, `shellService.getActiveNavHref(pathname, navItems)` |
| 내부 입력값 | 현재 `pathname`, 현재 로그인 사용자 `username` |

##### b. 상태

| 변수 명 | 범위 | 초기 값 | 역할 |
| --- | --- | --- | --- |
| `isMobileNavOpen` | `public` | `false` | 공통 셸 UI 상태 관리 |
| `isDesktopSidebarCollapsed` | `public` | `false` | 공통 셸 UI 상태 관리 |

##### c. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 service | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `openMobileNav()` | `public` | 없음 | `void` | 없음 | `isMobileNavOpen` |
| `closeMobileNav()` | `public` | 없음 | `void` | 없음 | `isMobileNavOpen` |
| `toggleMobileNav()` | `public` | 없음 | `void` | 없음 | `isMobileNavOpen` |
| `toggleDesktopSidebar()` | `public` | 없음 | `void` | 없음 | `isDesktopSidebarCollapsed` |
| `resetShellState()` | `public` | 없음 | `void` | 없음 | `isMobileNavOpen`, `isDesktopSidebarCollapsed` |

##### d. 동작 규칙

- `useAppShell()`
  - 라우터와 auth store 또는 session에서 현재 `pathname`, `username`을 읽는다.
  - `shellService.getShellLayoutConfig(pathname)`를 호출해 `layoutConfig`를 계산한다.
  - `shellService.getNavItems(username)`을 호출해 `navItems`를 계산한다.
  - `shellService.getActiveNavHref(pathname, navItems)`를 호출해 `activeHref`를 계산한다.
- `openMobileNav()`
  - `isMobileNavOpen = true`로 갱신한다.
- `closeMobileNav()`
  - `isMobileNavOpen = false`로 갱신한다.
- `toggleMobileNav()`
  - `isMobileNavOpen` 값을 반전한다.
- `toggleDesktopSidebar()`
  - `isDesktopSidebarCollapsed` 값을 반전한다.
- `resetShellState()`
  - `MainLayout`가 언마운트되거나 메인 셸을 벗어날 때 `isMobileNavOpen = false`, `isDesktopSidebarCollapsed = false`로 초기화한다.

##### e. 상태 갱신 규칙

| 상황 | 상태 갱신 |
| --- | --- |
| 모바일 메뉴 열기 | `isMobileNavOpen = true` |
| 모바일 메뉴 닫기 | `isMobileNavOpen = false` |
| 모바일 메뉴 토글 | `isMobileNavOpen = !isMobileNavOpen` |
| 데스크톱 사이드바 토글 | `isDesktopSidebarCollapsed = !isDesktopSidebarCollapsed` |
| 셸 상태 초기화 | `isMobileNavOpen = false`, `isDesktopSidebarCollapsed = false` |

### C. 서비스

공통 기반 기능에서 사용하는 서비스는 셸 배치 규칙과 공통 네비게이션 계산만 담당한다.

#### I. 서비스 타입

공통 기반 기능은 서비스 전용 추가 타입 없이 <a href="#type-nav-item"><code>NavItem</code></a>, <a href="#type-shell-layout-config"><code>ShellLayoutConfig</code></a>를 재사용한다.

#### II. `shellService`

##### a. 서비스 요약

| 항목 | 내용 |
| --- | --- |
| 서비스명 | `shellService` |
| 역할 | 경로 기반 셸 배치 계산, 공통 네비게이션 항목 계산, 활성 네비게이션 계산 |
| 호출 Repository | 없음 |

##### b. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 대상 | 실패 메시지 | 역할 |
| --- | --- | --- | --- | --- | --- | --- |
| `getShellLayoutConfig()` | `public` | `pathname: string` | <code><a href="#type-shell-layout-config">ShellLayoutConfig</a></code> | 없음 | 없음 | 현재 경로에 맞는 셸 노출 규칙을 반환한다. |
| `getNavItems()` | `public` | `username?: string` | <code><a href="#type-nav-item">NavItem</a>[]</code> | 없음 | 없음 | 공통 네비게이션 항목을 반환한다. |
| `getActiveNavHref()` | `public` | `pathname: string`, `navItems: <a href="#type-nav-item"><code>NavItem</code></a>[]` | `string` | 없음 | 없음 | 현재 경로와 일치하는 활성 네비게이션 href를 반환한다. |

##### c. 동작 규칙

- `getShellLayoutConfig()`
  - 인증 라우트에서는 메인 셸을 노출하지 않는다.
  - 메인 라우트에서는 헤더와 네비게이션을 기본으로 노출한다.
  - 상세 또는 서브 라우트에서는 뒤로가기 버튼 노출 여부를 함께 계산한다.
  - 모바일 네비게이션을 노출하는 라우트에서는 `showMenuButton = true`로 계산한다.
- `getNavItems()`
  - 홈, 작성, 프로필 네비게이션 항목을 생성한다.
  - `username`이 있으면 프로필 href를 `/u/{username}`으로 계산한다.
  - `username`이 없으면 프로필 href를 `/`로 계산한다.
- `getActiveNavHref()`
  - `pathname`과 `navItems`의 `href`, `matchPrefixes`를 비교한다.
  - 일치하는 항목이 있으면 해당 `href`를 반환한다.
  - 일치하는 항목이 없으면 빈 문자열을 반환한다.

##### d. 반환 규칙

- `getShellLayoutConfig()`

| 상황 | 반환값 |
| --- | --- |
| 인증 라우트 | `showHeader: false`, `showMobileNav: false`, `showDesktopSidebar: false`, `showBackButton: false`, `showMenuButton: false` |
| 메인 라우트 | `showHeader: true`, `showMobileNav: true`, `showDesktopSidebar: true`, `showBackButton: false`, `showMenuButton: true` |
| 상세 또는 서브 라우트 | `showHeader: true`, `showMobileNav: true`, `showDesktopSidebar: true`, `showBackButton: true`, `showMenuButton: true` |

- `getNavItems()`

| 상황 | 반환값 |
| --- | --- |
| `username` 존재 | 프로필 href가 `/u/{username}`인 <code><a href="#type-nav-item">NavItem</a>[]</code> |
| `username` 없음 | 프로필 href가 `/`인 <code><a href="#type-nav-item">NavItem</a>[]</code> |

- `getActiveNavHref()`

| 상황 | 반환값 |
| --- | --- |
| 일치하는 네비게이션 존재 | `href: string` |
| 일치하는 네비게이션 없음 | `""` |

### D. 레포지토리

공통 기반 기능은 레포지토리 계층을 사용하지 않는다.

#### I. API 타입

해당 없음.

#### II. 레포지토리 사용

##### a. 레포지토리 요약

| 항목 | 내용 |
| --- | --- |
| 레포지토리명 | 없음 |
| 역할 | 공통 기반 기능에서는 API 요청과 응답 처리를 수행하지 않는다. |
| 호출 API | 없음 |

##### b. 함수

없음.

##### c. 요청 규칙

없음.

##### d. 동작 규칙

- 공통 기반 기능은 셸 레이아웃과 공통 UI 조합만 다루므로 레포지토리를 호출하지 않는다.

##### e. 반환 규칙

없음.

### E. 서버

공통 기반 기능은 서버 API를 직접 사용하지 않는다.

#### I. 공통 기반 API

##### a. API 요약

| 항목 | 내용 |
| --- | --- |
| API 이름 | 없음 |
| 메서드 | 없음 |
| URL | 없음 |
| 요청 본문 | 없음 |
| 처리 | 공통 기반 기능은 서버 요청 없이 클라이언트 셸 구조와 공통 레이아웃만 관리한다. |
| 응답 | 없음 |

##### b. 요청 본문 예시

없음.

##### c. 응답 예시

없음.

## 3. 디자인 참조

공통 기반 기능의 시각 규칙과 공통 레이아웃 패턴은 별도 디자인 문서에서 관리하고, 이 문서에서는 참조만 연결한다.

### A. 디자인 참조 문서

| 구분 | 문서 | 역할 |
| --- | --- | --- |
| 전체 디자인 시스템 | [design-system.md](../../layout/design-system.md) | 토큰, 간격, 상태, 레이아웃 기본 규칙 |
| 화면 조합 패턴 | [screen-patterns.md](../../layout/design-system/screen-patterns.md) | 메인 화면과 인증 화면의 공통 배치 규칙 |
| 공통 UI 컴포넌트 | [components-ui.md](../../layout/design-system/components-ui.md) | 버튼, 입력창 등 공통 UI 규칙 |
| 공통 레이아웃 컴포넌트 | [components-layout.md](../../layout/design-system/components-layout.md) | `ShellFrame`, `AppHeader`, `BottomNav`, `DesktopSidebar` 규칙 |
| 인증 화면 인터페이스 | [auth-login.md](../../layout/design-system/auth-login.md) | 로그인, 회원가입 화면의 인증 레이아웃 규칙 |
