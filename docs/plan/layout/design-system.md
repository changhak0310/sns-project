# 디자인 시스템

> 기준 문서: `docs/plan/layout/architecture.md`
>
> 토큰 정의 기준: 1차는 `app/globals.css`, 확장 시 `design-system/tokens.ts`

## 1. 원칙

- 색상값, 간격값, 반경값 직접 하드코딩 금지
- 공통 컴포넌트는 토큰과 variant만 소비한다
- 기능 정책은 디자인 시스템 문서보다 기능 문서와 feature 조합에서 다룬다
- 모바일 우선으로 설계하고 데스크톱은 확장 레이아웃으로 대응한다
- 이미지가 있는 화면은 텍스트보다 미디어 비율 안정성을 우선한다
- 서비스 무드는 `Clean Social + Media First + Soft Editorial`로 통일한다
- 전체 인상은 인스타그램처럼 가볍고 빠르게 읽히는 구조를 지향하되, 프로젝트 고유 토큰과 컴포넌트 규칙 안에서만 해석한다
- empty, loading, error, pending 상태도 같은 시각 언어로 표현한다

## 2. 컬러 토큰

| 그룹 | 역할 | 특성 |
| --- | --- | --- |
| `primary` | 주요 액션, 활성 상태, 강조 요소 | 차콜/블랙 기반 5단계 (`50 ~ 900`) |
| `neutral` | 텍스트, 배경, 구분선 | 화이트/라이트 그레이/차콜 기반 7단계 (`0 ~ 950`) |
| `accent` | 링크, 추천, 보조 강조 | 코랄/오렌지/로즈 계열 3단계, 필요 시 sunset gradient 허용 |
| `semantic.error` | 에러, 파괴적 액션 | 레드 계열 |
| `semantic.success` | 저장 완료, 수정 완료 | 그린 계열 |
| `semantic.warning` | draft, 주의 상태 | 앰버 계열 |
| `overlay` | 모달, 시트, 딤 배경 | 반투명 블랙 |

## 3. 무드 토큰

| Mood | 한글 | 사용처 | 배경 계열 | 텍스트 계열 |
| --- | --- | --- | --- | --- |
| `archive` | 아카이브 | 프로필, 저장 탭, 피드 기본 바탕 | 소프트 화이트 | 차콜 |
| `focus` | 집중 | 로그인, 작성, 수정 폼 | 화이트 또는 매우 옅은 그레이 | 차콜 |
| `focus-dark` | 집중(다크) | 로그인/회원가입의 다크 auth 화면 | 거의 검정 | 라이트 그레이/오프화이트 |
| `discover` | 발견 | 탐색, 추천 섹션 | 화이트 + 소프트 틴트 배경 | 차콜 + accent |
| `highlight` | 반응 | 좋아요, 저장, CTA | 소프트 로즈/오렌지 틴트 | 차콜/화이트 |
| `alert` | 알림 | 에러, 경고, system feedback | 소프트 레드/앰버 | 레드/브라운 |

## 4. 타이포그래피 토큰

| 토큰 | 폰트 | 사용처 |
| --- | --- | --- |
| `font.display` | Instrument Serif 또는 DM Serif Display | 브랜드 헤드라인, auth 카피, 섹션 타이틀 |
| `font.sans` | Pretendard 또는 Geist | UI 전반, 버튼, 캡션, 메타, form |
| `font.mono` | JetBrains Mono | 카운터, 시간, 숫자 메타 |

| 사이즈 | px | 사용처 |
| --- | --- | --- |
| `text.xs` | 12 | 시간, 보조 메타, 카운터 |
| `text.sm` | 14 | 카드 미리보기, 레이블, 설명 |
| `text.base` | 16 | 기본 본문, 입력값 |
| `text.lg` | 18 | 소제목, 섹션 헤더 |
| `text.xl` | 22 | 화면 제목 |
| `text.2xl` | 28 | auth 헤드라인, 프로필 이름 강조 |
| `text.3xl` | 36 | 브랜드 카피, OG 타이틀 |

- 줄 간격은 `1.4 / 1.6 / 1.8`
- 메타 정보는 본문보다 최소 한 단계 작게 유지
- auth, 피드, 탐색 화면은 긴 카피보다 짧은 라벨과 빠른 스캔을 우선한다

## 5. 간격 · 반경 · 이펙트 토큰

| 구분 | 토큰 | 값 |
| --- | --- | --- |
| 간격 | `spacing.1 ~ spacing.16` | 4px 기반 스케일 (`4px ~ 64px`) |
| 반경 | `radius.sm / md / lg / xl / full` | `8px / 12px / 16px / 24px / 9999px` |
| 그림자 | `shadow.sm / md / lg` | 카드, 시트, 오버레이 3단계 |
| 보더 | `border.subtle / strong` | 연한 구분선 / 강조 구분선 |
| 트랜지션 | `transition.fast / normal / slow` | `120ms / 200ms / 320ms` |
| 블러 | `blur.sm / md` | 헤더 유리 효과, 딤 배경 |
| 콘텐츠 폭 | `content.narrow / default / wide` | auth / 일반 페이지 / 상세 2열 |
| 터치 영역 | `touch.min` | 최소 `44px` |

## 6. 상태 표현 규칙

| State | 의미 | 사용처 |
| --- | --- | --- |
| `default` | 기본 상태 | 카드, 버튼, 입력 필드 |
| `hover` | 포인터 반응 | 데스크톱 버튼, 카드 hover |
| `active` | 선택/토글 활성 | 탭, 좋아요, 저장 버튼 |
| `focus` | 키보드 포커스 | 입력창, 버튼, 링크 |
| `disabled` | 비활성 상태 | 제출 전 조건 미충족 버튼 |
| `pending` | 액션 처리 중 | 좋아요, 저장, 팔로우, 로그인 |
| `loading` | 화면 또는 블록 로딩 | 피드 skeleton, 알림 skeleton |
| `empty` | 데이터 없음 | 피드 빈 상태, 저장 없음, 탐색 결과 없음 |
| `error` | 실패 상태 | 이미지 로드 실패, 검증 실패, 조회 실패 |

## 7. 레이아웃 기준

- 루트 배경은 `neutral`의 가장 밝은 톤을 사용한다
- 메인 셸은 `Header + Content + BottomNav/DesktopSidebar + ModalSlot` 구조를 기본으로 한다
- auth 화면은 중앙 정렬 단일 카드 레이아웃을 기본으로 한다
- auth 화면이 다크 변형일 때는 `focus-dark` 무드와 단일 카드 레이아웃을 함께 사용한다
- auth, 피드, 탐색은 화이트 기반 surface와 얇은 보더를 우선하고, 무거운 그림자는 최소화한다
- 강조는 색을 많이 쓰기보다 미디어, 여백, 타이포 우선순위로 해결한다
- auth 화면의 상세 시각 규칙, 상태 규칙, 컴포넌트 매핑은 `docs/plan/layout/design-system/screen-patterns.md`의 `인증 화면` 섹션을 기준으로 한다
- 게시물 상세는 모바일에서 sheet/modal, 데스크톱에서 2열 상세 레이아웃을 허용한다
- 프로필/저장/탐색은 정사각 썸네일 그리드를 공통 패턴으로 재사용한다

## 8. 분리 문서

길어지는 섹션은 아래 문서로 분리한다.

| 주제 | 문서 | 실제 구현 디렉터리 |
| --- | --- | --- |
| 공통 UI 컴포넌트 | `docs/plan/layout/design-system/components-ui.md` | `components/ui` |
| 공통 레이아웃 컴포넌트 | `docs/plan/layout/design-system/components-layout.md` | `components/layout` |
| 화면 조합 패턴 | `docs/plan/layout/design-system/screen-patterns.md` | `features/*/components` |
| 로그인 화면 디자인 명세 | `docs/plan/layout/design-system/auth-login.md` | `features/auth/components` |

## 9. 1차 구현 우선순위

1. `Button`, `IconButton`, `Input`, `Textarea`, `Avatar`, `Card`, `Tabs`
2. `ShellFrame`, `AppHeader`, `BottomNav`, `DesktopSidebar`
3. `PostCard`, `PostActions`, `CommentForm`, `CreatePostForm`, `ProfileHeader`, `ProfileTabs`
4. `ExploreHeader`, `NotificationItem`, `EditProfileForm`

## 10. 최종 권장 조합

- Tailwind CSS 4 기반
- CSS 변수 기반 토큰
- `clsx` + `tailwind-merge`
- `class-variance-authority`
- `shadcn/ui` 또는 Radix UI 기반 래핑 허용
- `lucide-react`

이 문서는 짧게 유지하고, 상세 컴포넌트 규칙은 분리 문서에서 관리한다.
