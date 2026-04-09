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
- 서비스 무드는 `Warm Archive + Editorial + Quiet Premium`으로 통일한다
- empty, loading, error, pending 상태도 같은 시각 언어로 표현한다

## 2. 컬러 토큰

| 그룹 | 역할 | 특성 |
| --- | --- | --- |
| `primary` | 주요 액션, 활성 상태, 강조 요소 | 웜 베이지/브라운 계열 5단계 (`50 ~ 900`) |
| `neutral` | 텍스트, 배경, 구분선 | 크림/차콜 기반 7단계 (`0 ~ 950`) |
| `accent` | 링크, 추천, 보조 강조 | 딥 틸 또는 올리브 계열 3단계 |
| `semantic.error` | 에러, 파괴적 액션 | 레드 계열 |
| `semantic.success` | 저장 완료, 수정 완료 | 그린 계열 |
| `semantic.warning` | draft, 주의 상태 | 앰버 계열 |
| `overlay` | 모달, 시트, 딤 배경 | 반투명 블랙 |

## 3. 무드 토큰

| Mood | 한글 | 사용처 | 배경 계열 | 텍스트 계열 |
| --- | --- | --- | --- | --- |
| `archive` | 아카이브 | 프로필, 저장 탭, 피드 기본 바탕 | 웜 크림 | 브라운 |
| `focus` | 집중 | 로그인, 작성, 수정 폼 | 라이트 베이지 | 차콜 |
| `discover` | 발견 | 탐색, 추천 섹션 | 소프트 올리브 | 딥 틸 |
| `highlight` | 반응 | 좋아요, 저장, CTA | 웜 샌드 | 브라운/골드 |
| `alert` | 알림 | 에러, 경고, system feedback | 소프트 레드/앰버 | 레드/브라운 |

## 4. 타이포그래피 토큰

| 토큰 | 폰트 | 사용처 |
| --- | --- | --- |
| `font.display` | Fraunces 또는 Marcellus 계열 | 브랜드 헤드라인, auth 카피, 섹션 타이틀 |
| `font.sans` | Pretendard | UI 전반, 버튼, 캡션, 메타, form |
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
- 게시물 상세는 모바일에서 sheet/modal, 데스크톱에서 2열 상세 레이아웃을 허용한다
- 프로필/저장/탐색은 정사각 썸네일 그리드를 공통 패턴으로 재사용한다

## 8. 분리 문서

길어지는 섹션은 아래 문서로 분리한다.

| 주제 | 문서 | 실제 구현 디렉터리 |
| --- | --- | --- |
| 공통 UI 컴포넌트 | `docs/plan/layout/design-system/components-ui.md` | `components/ui` |
| 공통 레이아웃 컴포넌트 | `docs/plan/layout/design-system/components-layout.md` | `components/layout` |
| 화면 조합 패턴 | `docs/plan/layout/design-system/screen-patterns.md` | `features/*/components` |

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
- `lucide-react`

이 문서는 짧게 유지하고, 상세 컴포넌트 규칙은 분리 문서에서 관리한다.
