# 기능 00 - 공통 기반

## 개요

| 항목 | 내용 |
| --- | --- |
| 라우트 | 공통 |
| 페이지 | `app/layout.tsx`, `app/(main)/layout.tsx`, `app/(auth)/*`, 필요 시 `app/(auth)/layout.tsx` |
| 주요 액션 | 없음 |
| 핵심 데이터 | 공통 레이아웃 정보, 네비게이션 정보, 디자인 토큰, 반응형 셸 규칙 |
| 성공 후 | 모든 주요 화면이 같은 서비스 셸과 공통 UI 위에서 조합된다 |

## 유저 입장

### 유저 스토리

> 나는 어떤 화면에 들어가도 같은 서비스 안에 있다는 느낌을 받고, 이동과 사용이 자연스럽길 원한다.

### 사용자가 보게 되는 것

- 공통 레이아웃
- 상단 헤더
- 모바일 하단 네비게이션
- 데스크톱 사이드 네비게이션
- 일관된 버튼, 입력창, 카드 스타일
- 안정적인 여백과 타이포그래피

### 사용자 흐름

1. 앱 진입
2. 공통 레이아웃과 서비스 분위기 확인
3. 화면 간 이동
4. 같은 스타일과 조작 방식 유지

### 유저 기준 핵심 규칙

- 화면마다 UI 규칙이 크게 달라지면 안 된다.
- 헤더와 네비게이션은 이동에 혼란이 없어야 한다.
- 버튼, 입력창, 카드의 상태 표현이 일관돼야 한다.
- 인증 화면과 메인 화면은 같은 서비스 느낌을 유지하되 셸은 분리되어야 한다.

## 개발자 입장

### 구조

#### 라우트 구조

```text
app/
  layout.tsx
  (auth)/
    layout.tsx (optional)
  (main)/
    layout.tsx
```

#### UI 구조

```text
components/
  layout/
    app-header.tsx
    bottom-nav.tsx
    desktop-sidebar.tsx
    shell-frame.tsx
    empty-state.tsx

  ui/
    button.tsx
    input.tsx
    textarea.tsx
    avatar.tsx
    badge.tsx
    card.tsx
```

#### 액션 구조

```text
없음
```

#### 데이터 구조

```text
NavItem
  - label
  - href
  - icon
  - matchPrefixes

ThemeToken
  - color
  - spacing
  - radius
  - typography
  - shadow
  - transition

ShellRule
  - showHeader
  - showMobileNav
  - showDesktopSidebar
```

추가 규칙:

- `activeNav`는 상태로 저장하지 않고 현재 pathname에서 계산한다.
- 뒤로가기 노출 여부도 가능한 한 현재 라우트 기준으로 계산한다.
- 공통 컴포넌트는 데이터 조회나 feature 정책을 직접 소유하지 않는다.

### 담당 파일

| 항목 | 파일 |
| --- | --- |
| 루트 레이아웃 | `app/layout.tsx` |
| 인증 레이아웃 | `app/(auth)/layout.tsx` (optional) |
| 메인 레이아웃 | `app/(main)/layout.tsx` |
| 전역 스타일 | `app/globals.css` |
| 헤더 | `components/layout/app-header.tsx` |
| 하단 탭 | `components/layout/bottom-nav.tsx` |
| 데스크톱 사이드바 | `components/layout/desktop-sidebar.tsx` |
| 셸 프레임 | `components/layout/shell-frame.tsx` |
| 공통 빈 상태 | `components/layout/empty-state.tsx` |
| 공통 UI | `components/ui/*` |

### 로컬 상태

| 상태 | 설명 |
| --- | --- |
| `isMobileNavOpen` | 모바일 네비게이션 열림 여부. 필요 시만 사용 |
| `isDesktopSidebarCollapsed` | 데스크톱 사이드바 축소 여부. 필요 시만 사용 |

상태가 아닌 값:

- `activeNav`는 pathname 기반 파생값이다.
- `canGoBack`은 라우트 정책 또는 히스토리 기준 파생값이다.

### 구현 규칙

- 공통 구조는 기능보다 먼저 만든다.
- `app/layout.tsx`는 전역 스타일, 폰트, 메타데이터, 전역 배경만 담당한다.
- `app/(main)/layout.tsx`가 메인 셸을 단일하게 소유한다.
- `app/(auth)/layout.tsx`는 필요할 때만 추가하고, 메인 네비게이션은 노출하지 않는다.
- 공통 UI는 범용 props 중심으로 만든다.
- 공통 레이아웃 조각은 `components/layout`, 순수 프리미티브는 `components/ui`에 둔다.
- 스타일은 전역 토큰 기준으로 맞춘다. MVP에서는 우선 `app/globals.css`의 CSS 변수 기준으로 관리한다.
- 기능 전용 UI는 공통 UI 위에 조합해서 만든다.
- `app`는 조합과 라우팅만 담당하고, 기능 상세 구현은 `features/*`로 분리한다.
- 스타터 `app/page.tsx` 코드를 계속 확장하지 않고, 공통 기반 완성 후 `app/(main)/page.tsx` 구조로 전환한다.

### 개발자 플로우

1. `app/layout.tsx`에서 전역 스타일, 폰트 변수, 기본 메타데이터를 적용한다.
2. `app/globals.css`에 공통 토큰과 기본 surface 규칙을 정의한다.
3. 필요 시 `app/(auth)/layout.tsx`를 추가해 인증 화면 분위기를 분리한다.
4. `app/(main)/layout.tsx`에서 `shell-frame`, 헤더, 모바일 하단 탭, 데스크톱 사이드바를 배치한다.
5. `components/ui/*`에서 버튼, 입력창, 카드 계열을 만든다.
6. `components/layout/*`에서 공통 레이아웃 조각을 만든다.
7. 각 기능 페이지는 공통 레이아웃과 공통 UI를 조합해서 화면을 만든다.

### 예외 처리

- 특정 화면에서 공통 네비게이션이 필요 없으면 레이아웃에서 분기한다.
- 공통 UI가 기능 전용 요구사항을 모두 흡수하려 하지 않는다.
- 모바일과 데스크톱에서 네비게이션 방식이 달라도 정보 구조는 유지한다.
- 파생 가능한 값을 불필요한 client state로 승격하지 않는다.

## 체크리스트

- [ ] 루트 레이아웃이 적용된다
- [ ] 메인 레이아웃이 적용된다
- [ ] 필요 시 인증 레이아웃을 별도로 둘 수 있다
- [ ] 상단 헤더가 공통으로 동작한다
- [ ] 모바일 하단 네비게이션이 공통으로 동작한다
- [ ] 데스크톱 사이드 네비게이션이 공통으로 동작한다
- [ ] `activeNav`가 pathname 기반으로 계산된다
- [ ] 버튼, 입력창, textarea, avatar, card 등 공통 UI가 존재한다
- [ ] 전역 스타일과 디자인 토큰이 적용된다
- [ ] 기능 화면이 공통 기반 위에서 조합된다
