# 공통 레이아웃 컴포넌트

> 구현 디렉터리: `components/layout`

## 1. 규칙

- 레이아웃 컴포넌트는 화면 배치와 반복 구조를 담당한다
- 비즈니스 정책과 데이터 mutation은 담당하지 않는다
- 모바일과 데스크톱은 구조 차이를 허용하되 정보 구조는 공유한다
- 셸 계열 컴포넌트는 직접 색을 하드코딩하지 않고 `data-shell-theme` 기반 토큰을 사용한다

## 2. 컴포넌트 목록

### ShellFrame

| 항목 | 내용 |
| --- | --- |
| 역할 | 헤더, 콘텐츠, 모바일/데스크톱 내비, modal slot을 담는 최상위 셸 |
| 구성 | `header / content / mobileNav / desktopSidebar / modal` |
| 테마 규칙 | 루트에 `data-shell-theme="dark" | "light"`를 두고 헤더, 사이드바, overlay가 같은 셸 토큰을 공유한다 |
| 디자인 규칙 | 모바일은 하단 탭 padding, 데스크톱은 2~3열 확장 가능 |

### AppHeader

| 항목 | 내용 |
| --- | --- |
| 역할 | 현재 화면 제목, 뒤로가기, 보조 액션 제공 |
| 구성 | 브랜드 또는 title, back button, right action slot |
| 테마 규칙 | backdrop, border, hover는 셸 토큰을 그대로 사용한다 |
| 디자인 규칙 | sticky 사용, 얇은 glass surface 가정 |

### BottomNav

| 항목 | 내용 |
| --- | --- |
| 역할 | 모바일 핵심 이동 |
| 구성 | 아이콘 + 짧은 레이블 |
| 테마 규칙 | 배경, handle, border, active surface는 셸 토큰을 따른다 |
| 활성 상태 | 현재 라우트 기준 자동 감지 |

### DesktopSidebar

| 항목 | 내용 |
| --- | --- |
| 역할 | 데스크톱 메인 이동 |
| 구성 | 로고, 주요 이동, `Theme` 토글, 계정 보조 액션 |
| 테마 규칙 | 현재 `shellTheme`을 표시하고 `onToggleTheme()`으로 즉시 전환한다 |
| 디자인 규칙 | 대시보드보다 가벼운 에디토리얼 앱 느낌 유지 |

### BackButton

| 항목 | 내용 |
| --- | --- |
| 역할 | 상세/서브 페이지 복귀 |
| 규칙 | 충분한 터치 영역과 hover/focus 표현 필요 |

### AccountMenu

| 항목 | 내용 |
| --- | --- |
| 역할 | 세션 사용자 정보와 로그아웃 진입 |
| 구성 | avatar, 이름, menu list |
| 디자인 규칙 | popover 또는 dropdown 형태 사용 |

### LogoutButton

| 항목 | 내용 |
| --- | --- |
| 역할 | 로그아웃 액션 전용 UI |
| 디자인 규칙 | destructive tone은 주되 공격적이지 않게 조절 |

### PageHeader

| 항목 | 내용 |
| --- | --- |
| 역할 | 화면 제목, 설명, 보조 액션 정리 |
| 사용처 | 탐색, 알림, 프로필 수정, 저장 탭 |
| 규칙 | 콘텐츠 시작부 위계 정리에만 집중 |

### EmptyStateVisual

| 항목 | 내용 |
| --- | --- |
| 역할 | 빈 상태 공통 비주얼 조각 |
| 사용처 | 피드 없음, 저장 없음, 탐색 없음 |
| 규칙 | 과한 일러스트보다 단순 shape 조합 우선 |
