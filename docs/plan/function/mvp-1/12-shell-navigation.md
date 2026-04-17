# 셸과 네비게이션 명세

## 1. 상태 변수 및 함수 정의

셸과 네비게이션 기능은 메인 셸 안에서 경로에 맞는 상단 헤더, 모바일 하단 탭, 데스크톱 사이드바, 뒤로가기 버튼, 강조된 작성 진입 버튼을 공통 계약으로 사용한다.
인스타그램처럼 모바일은 하단 탭을 기본으로 두고, 데스크톱은 왼쪽 사이드바를 기본으로 둔다.
`showBottomTabBar`, `showDesktopSidebar`는 현재 경로에서 해당 셸 요소를 사용할 수 있는지 나타내며, 실제 렌더링은 viewport 기준으로 모바일에서는 `BottomTabBar`, 데스크톱에서는 `DesktopSidebar`만 노출한다.
`layoutRule`, `navItems`, `activeNavKey`, `headerTitle`, `backFallbackHref`는 현재 경로와 세션 사용자명 기준 파생값으로 계산한다.
데스크톱 사이드바는 내비게이션 외에 `Theme` 토글을 포함할 수 있으며, 실제 테마 상태는 별도 `useShellTheme()` 훅에서 관리한다.

### A. 타입 정의

#### I. 공통 타입

<a id="type-shell-nav-key"></a>

##### a. `ShellNavKey`

```ts
type ShellNavKey = "home" | "create" | "profile";
```

<a id="type-shell-nav-item"></a>

##### b. `ShellNavItem`

```ts
type ShellNavItem = {
  key: ShellNavKey;
  label: string;
  href: string;
  matchPrefixes: string[];
  emphasis: "default" | "primary";
};
```

<a id="type-shell-layout-rule"></a>

##### c. `ShellLayoutRule`

```ts
type ShellLayoutRule = {
  showHeader: boolean;
  showBottomTabBar: boolean;
  showDesktopSidebar: boolean;
  showBackButton: boolean;
};
```

### B. 상태 변수 정의

| 변수명 | 타입 | 설명 | 초기값 | 사용 컴포넌트 |
| --- | --- | --- | --- | --- |
| `isDesktopSidebarCollapsed` | `boolean` | 데스크톱 사이드바 축소 여부다. | `false` | `ShellNavigationLayer`, `DesktopSidebar` |

### C. 함수 정의

| 함수명 | 시그니처 | 역할 | 사용 컴포넌트 |
| --- | --- | --- | --- |
| `toggleDesktopSidebar()` | `() => void` | 데스크톱 사이드바 축소 상태를 전환한다. | `ShellNavigationLayer`, `DesktopSidebar` |
| `goBackOrFallback()` | `() => void` | 히스토리 뒤로가기가 가능하면 뒤로가고, 아니면 계산된 fallback 경로로 이동한다. | `ShellNavigationLayer`, `BackButton` |
| `resetShellNavigationState()` | `() => void` | 셸 네비게이션 상태를 초기값으로 되돌린다. | `ShellNavigationLayer` |

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

참조 - [function-md-guide.md](../function-md-guide.md), [layer.md](../../layout/layer.md), [00-common-foundation.md](./00-common-foundation.md), [09-session-guard-navigation.md](./09-session-guard-navigation.md), [08-polish.md](./08-polish.md)

### A. 컴포넌트

셸과 네비게이션 기능은 공통 기반의 `MainLayout`, `ShellFrame` 위에 올라가는 네비게이션 레이어를 담당한다.
인스타그램처럼 홈, 작성, 프로필 이동은 항상 짧고 분명해야 하고, 현재 위치는 아이콘과 강조 상태로 바로 보여야 한다.

#### I. 컴포넌트 구조

```text
MainLayout
  -> ShellFrame
    -> ShellNavigationLayer
      -> AppHeader
        -> BackButton
        -> headerRightSlot
      -> children
      -> BottomTabBar
        -> ShellNavLink
        -> PrimaryComposeButton
      -> DesktopSidebar
        -> ShellNavLink
        -> PrimaryComposeButton
        -> sidebarFooterSlot
      -> modal
```

#### II. 컴포넌트 타입

<a id="type-shell-navigation-layer-props"></a>

##### a. `ShellNavigationLayerProps`

```ts
type ShellNavigationLayerProps = {
  pathname: string;
  username?: string;
  children: ReactNode;
  modal?: ReactNode;
  headerRightSlot?: ReactNode;
  sidebarFooterSlot?: ReactNode;
};
```

<a id="type-app-header-props"></a>

##### b. `AppHeaderProps`

```ts
type AppHeaderProps = {
  title: string;
  showBackButton: boolean;
  onBack?: () => void;
  rightSlot?: ReactNode;
};
```

<a id="type-bottom-tab-bar-props"></a>

##### c. `BottomTabBarProps`

```ts
type BottomTabBarProps = {
  navItems: ShellNavItem[];
  activeNavKey: ShellNavKey | "";
};
```

<a id="type-desktop-sidebar-props"></a>

##### d. `DesktopSidebarProps`

```ts
type DesktopSidebarProps = {
  navItems: ShellNavItem[];
  activeNavKey: ShellNavKey | "";
  collapsed: boolean;
  onToggleCollapse: () => void;
  shellTheme: "dark" | "light";
  onToggleTheme: () => void;
  footerSlot?: ReactNode;
};
```

<a id="type-shell-nav-link-props"></a>

##### e. `ShellNavLinkProps`

```ts
type ShellNavLinkProps = {
  item: ShellNavItem;
  isActive: boolean;
};
```

<a id="type-primary-compose-button-props"></a>

##### f. `PrimaryComposeButtonProps`

```ts
type PrimaryComposeButtonProps = {
  href: string;
  isActive: boolean;
};
```

<a id="type-back-button-props"></a>

##### g. `BackButtonProps`

```ts
type BackButtonProps = {
  fallbackHref: string;
  onClick: () => void;
};
```

#### III. 컴포넌트 정의

| 컴포넌트명 | 역할 | 사용하는 Hook | 받는 props | 이벤트에서 호출하는 함수 | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `ShellNavigationLayer` | 현재 경로 기준 셸 규칙, 활성 탭, 헤더 제목, 뒤로가기 fallback, 사이드바 축소 상태를 한 번에 조합한다. `navItems` 중 `emphasis = "primary"` 항목은 `PrimaryComposeButton`으로, 나머지는 `ShellNavLink`로 분리해 전달한다. | `useShellNavigation()` | <a href="#type-shell-navigation-layer-props"><code>ShellNavigationLayerProps</code></a> | `onUnmount -> resetShellNavigationState()` | `isDesktopSidebarCollapsed` |
| `AppHeader` | 상단 헤더에서 제목, 뒤로가기 버튼, 오른쪽 액션 슬롯을 렌더링한다. | 없음 | <a href="#type-app-header-props"><code>AppHeaderProps</code></a> | `BackButton.onClick -> onBack?.()` | 없음 |
| `BottomTabBar` | 모바일 하단 고정 탭을 렌더링한다. `navItems` 중 `emphasis = "default"`는 `ShellNavLink`로, `emphasis = "primary"`는 `PrimaryComposeButton`으로 렌더링한다. | 없음 | <a href="#type-bottom-tab-bar-props"><code>BottomTabBarProps</code></a> | 없음 | 없음 |
| `DesktopSidebar` | 데스크톱 왼쪽 사이드바를 렌더링하고 축소 토글과 테마 전환을 처리한다. `navItems` 중 `emphasis = "default"`는 `ShellNavLink`로, `emphasis = "primary"`는 `PrimaryComposeButton`으로 렌더링한다. | 없음 | <a href="#type-desktop-sidebar-props"><code>DesktopSidebarProps</code></a> | `onToggleCollapse -> onToggleCollapse()`, `onToggleTheme -> onToggleTheme()` | 없음 |
| `ShellNavLink` | 기본 네비게이션 링크를 렌더링하고 활성 상태를 표시한다. | 없음 | <a href="#type-shell-nav-link-props"><code>ShellNavLinkProps</code></a> | 없음 | 없음 |
| `PrimaryComposeButton` | 작성 진입 버튼을 기본 탭보다 더 강조된 스타일로 렌더링한다. | 없음 | <a href="#type-primary-compose-button-props"><code>PrimaryComposeButtonProps</code></a> | 없음 | 없음 |
| `BackButton` | 상세나 서브 라우트에서 뒤로가기를 실행하고, 히스토리가 없으면 fallback 경로로 이동한다. | 없음 | <a href="#type-back-button-props"><code>BackButtonProps</code></a> | `onClick -> onClick()` | 없음 |

### B. 훅

셸과 네비게이션 훅은 셸 로컬 상태와 경로 기반 계산값을 함께 제공한다.

#### I. 훅 타입

<a id="type-shell-navigation-state"></a>

##### a. `ShellNavigationState`

```ts
type ShellNavigationState = {
  isDesktopSidebarCollapsed: boolean;
};
```

<a id="type-shell-navigation-computed"></a>

##### b. `ShellNavigationComputed`

```ts
type ShellNavigationComputed = {
  layoutRule: ShellLayoutRule;
  navItems: ShellNavItem[];
  activeNavKey: ShellNavKey | "";
  headerTitle: string;
  backFallbackHref: string;
};
```

<a id="type-shell-navigation-actions"></a>

##### c. `ShellNavigationActions`

```ts
type ShellNavigationActions = {
  toggleDesktopSidebar: () => void;
  goBackOrFallback: () => void;
  resetShellNavigationState: () => void;
};
```

<a id="type-use-shell-navigation-return"></a>

##### d. `UseShellNavigationReturn`

```ts
type UseShellNavigationReturn = ShellNavigationState &
  ShellNavigationComputed &
  ShellNavigationActions;
```

#### II. useShellNavigation

##### a. 훅 요약

| 항목 | 내용 |
| --- | --- |
| 훅명 | `useShellNavigation()` |
| 역할 | 셸 로컬 상태 관리, 경로 기반 셸 규칙 계산, 활성 탭 계산, 뒤로가기 fallback 계산 |
| 호출 Service | `shellNavigationService.getShellLayoutRule(pathname, username)`, `shellNavigationService.getShellNavItems(username)`, `shellNavigationService.getActiveNavKey(pathname, navItems)`, `shellNavigationService.getHeaderTitle(pathname, username)`, `shellNavigationService.getBackFallbackHref(pathname, username)` |
| 훅 입력값 | `pathname`, `username` |

##### b. 상태

| 변수명 | 범위 | 초기값 | 역할 |
| --- | --- | --- | --- |
| `isDesktopSidebarCollapsed` | `public` | `false` | 셸 UI 상태 관리 |

##### c. 계산값

| 변수명 | 계산 기준 | 역할 |
| --- | --- | --- |
| `layoutRule` | <code>shellNavigationService.getShellLayoutRule(pathname: string, username?: string): <a href="#type-shell-layout-rule">ShellLayoutRule</a></code> | 현재 경로에서 어떤 셸 요소를 보여줄지 결정한다. |
| `navItems` | <code>shellNavigationService.getShellNavItems(username?: string): <a href="#type-shell-nav-item">ShellNavItem</a>[]</code> | 홈, 작성, 프로필 네비게이션 항목을 계산한다. |
| `activeNavKey` | <code>shellNavigationService.getActiveNavKey(pathname: string, navItems: <a href="#type-shell-nav-item">ShellNavItem</a>[]): <a href="#type-shell-nav-key">ShellNavKey</a> \| ""</code> | 현재 경로와 일치하는 활성 탭을 계산한다. |
| `headerTitle` | <code>shellNavigationService.getHeaderTitle(pathname: string, username?: string): string</code> | 헤더 제목을 계산한다. |
| `backFallbackHref` | <code>shellNavigationService.getBackFallbackHref(pathname: string, username?: string): string</code> | 히스토리가 없을 때 이동할 fallback 경로를 계산한다. |

##### d. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 service | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `toggleDesktopSidebar()` | `public` | 없음 | `void` | 없음 | `isDesktopSidebarCollapsed` |
| `goBackOrFallback()` | `public` | 없음 | `void` | 없음 | 없음 |
| `resetShellNavigationState()` | `public` | 없음 | `void` | 없음 | `isDesktopSidebarCollapsed` |

##### e. 동작 규칙

- `useShellNavigation()`
  - `pathname`, `username`을 기준으로 `layoutRule`, `navItems`, `activeNavKey`, `headerTitle`, `backFallbackHref`를 계산한다.
  - `layoutRule.showBottomTabBar = true`와 `layoutRule.showDesktopSidebar = true`는 메인 셸 경로에서 두 UI를 사용할 수 있다는 뜻이며, 실제 렌더링은 viewport 기준으로 모바일은 하단 탭, 데스크톱은 왼쪽 사이드바를 사용한다.
- `DesktopSidebar`
  - 현재 `shellTheme`을 표시하고 `onToggleTheme()`으로 라이트/다크 셸 전환을 노출할 수 있다.
- `toggleDesktopSidebar()`
  - `isDesktopSidebarCollapsed` 값을 반전한다.
- `goBackOrFallback()`
  - 브라우저 히스토리가 있으면 뒤로간다.
  - 히스토리가 없으면 `backFallbackHref`로 이동한다.
- `resetShellNavigationState()`
  - `ShellNavigationLayer`가 언마운트되거나 메인 셸을 벗어날 때 `isDesktopSidebarCollapsed = false`로 초기화한다.

##### f. 상태 갱신 규칙

| 상황 | 상태 갱신 |
| --- | --- |
| 데스크톱 사이드바 토글 | `isDesktopSidebarCollapsed = !isDesktopSidebarCollapsed` |
| 셸 상태 초기화 | `isDesktopSidebarCollapsed = false` |

### C. 서비스

셸과 네비게이션 서비스는 경로와 사용자명 기준으로 네비게이션 항목과 셸 노출 규칙을 계산한다.

#### I. 서비스 타입

서비스는 별도 결과 타입 없이 <a href="#type-shell-nav-item"><code>ShellNavItem</code></a>, <a href="#type-shell-layout-rule"><code>ShellLayoutRule</code></a>를 직접 사용한다.

#### II. `shellNavigationService`

##### a. 서비스 요약

| 항목 | 내용 |
| --- | --- |
| 서비스명 | `shellNavigationService` |
| 역할 | 경로별 셸 규칙 계산, 네비게이션 항목 계산, 활성 탭 계산, 헤더 제목 계산, 뒤로가기 fallback 계산 |
| 호출 Repository | 없음 |

##### b. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 대상 | 실패 메시지 | 역할 |
| --- | --- | --- | --- | --- | --- | --- |
| `getShellLayoutRule()` | `public` | `pathname: string`, `username?: string` | <code><a href="#type-shell-layout-rule">ShellLayoutRule</a></code> | <code>isViewerProfileRoute(pathname: string, username?: string): boolean</code> | 없음 | 현재 경로에 맞는 셸 노출 규칙을 계산한다. |
| `getShellNavItems()` | `public` | `username?: string` | <code><a href="#type-shell-nav-item">ShellNavItem</a>[]</code> | <code>buildProfileHref(username?: string): string</code> | 없음 | 홈, 작성, 프로필 네비게이션 항목을 계산한다. |
| `getActiveNavKey()` | `public` | `pathname: string`, `navItems: <a href="#type-shell-nav-item"><code>ShellNavItem</code></a>[]` | <code><a href="#type-shell-nav-key">ShellNavKey</a> \| ""</code> | 없음 | 없음 | 현재 경로와 일치하는 활성 탭을 계산한다. |
| `getHeaderTitle()` | `public` | `pathname: string`, `username?: string` | `string` | <code>isViewerProfileRoute(pathname: string, username?: string): boolean</code> | 없음 | 현재 경로에 맞는 헤더 제목을 계산한다. |
| `getBackFallbackHref()` | `public` | `pathname: string`, `username?: string` | `string` | <code>buildProfileHref(username?: string): string</code> | 없음 | 히스토리가 없을 때 사용할 fallback 경로를 계산한다. |
| `isViewerProfileRoute()` | `private` | `pathname: string`, `username?: string` | `boolean` | 없음 | 없음 | 현재 경로가 내 프로필 경로인지 판단한다. |
| `buildProfileHref()` | `private` | `username?: string` | `string` | 없음 | 없음 | 현재 사용자 프로필 href를 계산한다. |

##### c. 동작 규칙

- `getShellLayoutRule()`
  - 메인 셸 경로에서는 `showBottomTabBar = true`, `showDesktopSidebar = true`를 함께 반환할 수 있다.
  - 이는 모바일과 데스크톱에서 각각 사용할 네비게이션 UI가 모두 준비되었다는 뜻이며, 실제 렌더링은 viewport에서 모바일은 `BottomTabBar`, 데스크톱은 `DesktopSidebar`만 노출한다.
  - `/`는 홈 탭 기준으로 `showHeader = true`, `showBottomTabBar = true`, `showDesktopSidebar = true`, `showBackButton = false`를 반환한다.
  - `/create`는 작성 화면이므로 `showBackButton = true`를 반환한다.
  - `/p/[shortcode]`는 상세 화면이므로 `showBackButton = true`를 반환한다.
  - `/u/[username]`는 내 프로필이면 탭 화면으로 보고 `showBackButton = false`를 반환한다.
  - `/u/[username]`가 다른 사람 프로필이면 서브 화면으로 보고 `showBackButton = true`를 반환한다.
- `getShellNavItems()`
  - 홈 항목은 `/`
  - 작성 항목은 `/create`
  - 프로필 항목은 `buildProfileHref(username)`를 사용한다.
  - 작성 항목은 `emphasis = "primary"`로 계산한다.
  - `ShellNavigationLayer`, `BottomTabBar`, `DesktopSidebar`는 `emphasis = "primary"` 항목을 `PrimaryComposeButton`으로, 나머지를 `ShellNavLink`로 분리해 렌더링한다.
  - `DesktopSidebar`는 내비게이션 목록과 별도로 `Theme` 토글 액션을 footer 영역에 배치할 수 있다.
- `getActiveNavKey()`
  - `pathname`과 `matchPrefixes`를 비교해 활성 탭을 계산한다.
  - 다른 사람 프로필처럼 현재 네비와 직접 일치하지 않는 경로는 `""`를 반환한다.
- `getHeaderTitle()`
  - `/`는 `홈`
  - `/create`는 `새 게시물`
  - `/p/[shortcode]`는 `게시물`
  - 내 프로필은 `프로필`
  - 다른 사람 프로필은 해당 사용자 화면이라는 의미로 `프로필`을 반환한다.
- `getBackFallbackHref()`
  - `/create`와 `/p/[shortcode]`는 `/`
  - 다른 사람 프로필은 `/`
  - 내 프로필은 `buildProfileHref(username)`를 반환한다.
- `isViewerProfileRoute()`
  - `username`이 있을 때 `pathname === /u/{username}`면 `true`
  - 아니면 `false`
- `buildProfileHref()`
  - `username`이 있으면 `/u/{username}`
  - 없으면 `/`

##### d. 반환 규칙

- `getShellLayoutRule()`

| 상황 | 반환값 |
| --- | --- |
| 홈 경로 | `showHeader: true`, `showBottomTabBar: true`, `showDesktopSidebar: true`, `showBackButton: false` |
| 작성 또는 상세 경로 | `showHeader: true`, `showBottomTabBar: true`, `showDesktopSidebar: true`, `showBackButton: true` |
| 내 프로필 경로 | `showHeader: true`, `showBottomTabBar: true`, `showDesktopSidebar: true`, `showBackButton: false` |
| 다른 사람 프로필 경로 | `showHeader: true`, `showBottomTabBar: true`, `showDesktopSidebar: true`, `showBackButton: true` |

- `getShellNavItems()`

| 상황 | 반환값 |
| --- | --- |
| `username` 존재 | 프로필 href가 `/u/{username}`인 <code><a href="#type-shell-nav-item">ShellNavItem</a>[]</code> |
| `username` 없음 | 프로필 href가 `/`인 <code><a href="#type-shell-nav-item">ShellNavItem</a>[]</code> |

- `getActiveNavKey()`

| 상황 | 반환값 |
| --- | --- |
| 홈 경로 | `home` |
| 작성 경로 | `create` |
| 내 프로필 경로 | `profile` |
| 다른 사람 프로필 또는 서브 경로 | `""` |

- `getHeaderTitle()`

| 상황 | 반환값 |
| --- | --- |
| 홈 경로 | `홈` |
| 작성 경로 | `새 게시물` |
| 게시글 상세 경로 | `게시물` |
| 프로필 경로 | `프로필` |

- `getBackFallbackHref()`

| 상황 | 반환값 |
| --- | --- |
| 홈 경로 | `/` |
| 작성 또는 상세 경로 | `/` |
| 내 프로필 경로 | `/u/{username}` 또는 `/` |
| 다른 사람 프로필 경로 | `/` |

### D. 레포지토리

셸과 네비게이션 기능은 레포지토리 계층을 직접 사용하지 않는다.

#### I. API 타입

해당 없음.

#### II. 레포지토리 사용

##### a. 레포지토리 요약

| 항목 | 내용 |
| --- | --- |
| 레포지토리명 | 없음 |
| 역할 | 셸 네비게이션은 API 통신 없이 현재 경로와 사용자명만으로 계산한다. |
| 호출 API | 없음 |

##### b. 함수

없음.

##### c. 요청 규칙

없음.

##### d. 동작 규칙

- 셸 네비게이션은 레포지토리 계층을 직접 호출하지 않는다.
- 인증 상태에 따른 액션 노출은 [09-session-guard-navigation.md](./09-session-guard-navigation.md)에서 별도로 관리한다.

##### e. 반환 규칙

없음.

### E. 서버

셸과 네비게이션 기능은 별도 서버 API보다 App Router의 `(main)/layout.tsx`와 `@modal` 슬롯에서 셸 조합을 선택하는 방식으로 동작한다.

#### I. 셸 서버 처리

##### a. API 요약

| 항목 | 내용 |
| --- | --- |
| API 이름 | 없음 |
| 메서드 | 없음 |
| URL | 없음 |
| 요청 본문 | 없음 |
| 처리 | 메인 레이아웃이 현재 경로와 모달 슬롯을 기준으로 셸 구조를 조합하고, 네비게이션 레이어를 렌더링한다. |
| 응답 | 없음 |

##### b. 요청 본문 예시

없음.

##### c. 응답 예시

없음.

## 3. 디자인 참조

셸과 네비게이션 기능은 인스타그램처럼 모바일 하단 탭, 데스크톱 좌측 사이드바, 작은 상단 헤더, 분명한 활성 상태를 기준으로 디자인 문서를 참조한다.

### A. 디자인 참조 문서

| 구분 | 문서 | 역할 |
| --- | --- | --- |
| 전체 디자인 시스템 | [design-system.md](../../layout/design-system.md) | 토큰, 상태, 인터랙션 기본 규칙 |
| 화면 조합 패턴 | [screen-patterns.md](../../layout/design-system/screen-patterns.md) | 메인 셸, 상세, 모달 전환 패턴 |
| 공통 UI 컴포넌트 | [components-ui.md](../../layout/design-system/components-ui.md) | 아이콘 버튼, 링크 버튼, 활성 상태 표현 규칙 |
| 공통 레이아웃 컴포넌트 | [components-layout.md](../../layout/design-system/components-layout.md) | `ShellFrame`, `AppHeader`, `BottomTabBar`, `DesktopSidebar` 배치 규칙 |
