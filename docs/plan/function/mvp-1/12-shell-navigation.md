# 기능 12 - 셸과 네비게이션

## 개요

| 항목 | 내용 |
| --- | --- |
| 라우트 | 공통, `(main)` 전체 |
| 페이지 | `app/(main)/layout.tsx` 및 주요 라우트 |
| 주요 액션 | 없음 |
| 핵심 데이터 | 현재 경로, 활성 탭, 네비게이션 항목, 뒤로가기 가능 여부 |
| 성공 후 | 화면 이동 규칙이 일관되고 서비스 셸이 명확해짐 |

## 유저 입장

### 유저 스토리

> 나는 어디서든 현재 위치를 이해하고, 홈·작성·프로필 같은 핵심 화면으로 빠르게 이동하고 싶다.

### 사용자가 보게 되는 것

- 상단 헤더
- 모바일 하단 탭
- 데스크톱 사이드바
- 활성 탭 표시
- 뒤로가기 버튼

### 사용자 흐름

1. 메인 라우트 진입
2. 상단 헤더와 하단/사이드 네비 확인
3. 현재 위치에 맞는 활성 탭 확인
4. 탭 또는 뒤로가기로 화면 이동

### 유저 기준 핵심 규칙

- 어떤 라우트에서 어떤 네비게이션이 보이는지 일관돼야 한다.
- 현재 위치가 시각적으로 분명해야 한다.
- 작성 버튼은 눈에 잘 띄는 위치에 있어야 한다.

## 개발자 입장

### 구조

#### 라우트 구조

```text
app/
  (main)/
    layout.tsx
    @modal/
      default.tsx
```

#### UI 구조

```text
components/
  layout/
    shell-frame.tsx
    app-header.tsx
    bottom-nav.tsx
    desktop-sidebar.tsx
    back-button.tsx
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

ShellRule
  - showHeader
  - showMobileNav
  - showDesktopSidebar
  - showBackButton
```

추가 규칙:

- 프로필 네비게이션의 href는 현재 세션의 `username`을 사용해 계산한다.
- 메인 레이아웃은 `children`과 `modal` 슬롯을 함께 렌더링한다.

### 담당 파일

| 항목 | 파일 |
| --- | --- |
| 메인 셸 | `app/(main)/layout.tsx` |
| 셸 프레임 | `components/layout/shell-frame.tsx` |
| 상단 헤더 | `components/layout/app-header.tsx` |
| 하단 탭 | `components/layout/bottom-nav.tsx` |
| 데스크톱 사이드바 | `components/layout/desktop-sidebar.tsx` |
| 뒤로가기 | `components/layout/back-button.tsx` |
| 세션 helper | `lib/session/*` |

### 로컬 상태

| 상태 | 설명 |
| --- | --- |
| `isMobileNavOpen` | 모바일 네비게이션 열림 여부. 필요 시만 사용 |
| `isDesktopSidebarCollapsed` | 데스크톱 사이드바 축소 여부. 필요 시만 사용 |

상태가 아닌 값:

- `activeTab`은 현재 pathname 기반 파생값이다.
- `canGoBack`은 라우트 정책과 네비게이션 맥락에서 파생한다.
- `isComposePrimary`는 현재 pathname이 `/create`인지 여부로 파생한다.

### 구현 규칙

- `(main)` 레이아웃이 셸을 단일하게 소유한다.
- 모바일은 하단 탭, 데스크톱은 사이드바를 기본으로 둔다.
- 활성 탭 기준은 현재 pathname으로 계산한다.
- 상세 페이지에서는 뒤로가기 우선, 탭 이동은 보조 역할로 둔다.
- 공통 셸 조각은 `components/layout`에 둔다.
- `activeTab`, `canGoBack`, `isComposePrimary`를 불필요한 client state로 저장하지 않는다.
- 로그인과 회원가입 화면에서는 메인 셸을 노출하지 않는다.

### 개발자 플로우

1. `app/(main)/layout.tsx`에서 공통 셸을 렌더링한다.
2. 현재 pathname과 세션을 기반으로 네비게이션 항목을 계산한다.
3. `shell-frame.tsx`에 헤더, `children`, `modal`, 모바일/데스크톱 네비를 배치한다.
4. 라우트별로 뒤로가기 노출 여부와 헤더 액션을 분기한다.

### 예외 처리

- 로그인 화면에서는 메인 셸을 노출하지 않음
- 존재하지 않는 탭 경로는 활성 표시하지 않음
- 뒤로갈 히스토리가 없으면 홈 이동 fallback 고려
- 세션이 아직 없으면 프로필 탭 href를 확정하지 않고 가드 흐름을 우선함

## 체크리스트

- [ ] `(main)` 레이아웃에 공통 셸이 적용된다
- [ ] 상단 헤더가 주요 라우트에 노출된다
- [ ] 모바일 하단 탭이 동작한다
- [ ] 데스크톱 사이드바가 동작한다
- [ ] 활성 탭이 현재 경로를 반영한다
- [ ] 상세 페이지에서 뒤로가기 동작이 정리된다
- [ ] 작성 버튼 위치가 분명하다


