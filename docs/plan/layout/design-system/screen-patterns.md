# 화면 조합 패턴

> 구현 디렉터리: `features/*/components`

## 1. 규칙

- 아래 내용은 공통 UI가 아니라 화면 조합 패턴 기준이다
- 실제 구현은 각 feature 내부 컴포넌트가 소유한다
- 공통으로 검증되기 전까지는 `components/ui`, `components/layout`로 올리지 않는다

## 2. 화면별 패턴

### 인증 화면

| 항목 | 내용 |
| --- | --- |
| 구현 디렉터리 | `features/auth/components` |
| 적용 화면 | `/login`, `/signup` |
| 추가할 디자인 | 클린 소셜 auth card, 짧은 브랜드 카피, 빠르게 읽히는 설명 문구 |
| 필요한 컴포넌트 | `AuthHeader`, `AuthCard`, `LoginForm`, `SignupForm`, `AuthSwitchLink`, `OAuthButton(optional)` |

#### 인증 화면 상세 규칙

| 구분 | 규칙 |
| --- | --- |
| 시각 방향 | 인스타그램처럼 가볍고 즉시 읽히는 auth 화면을 지향하되, 장식보다 대비와 여백 중심의 미니멀 구성을 유지한다 |
| 무드 | 기본은 `focus`, 다크 화면은 `focus-dark` |
| 배경 | 기본은 화이트 또는 매우 옅은 그레이, 필요 시 은은한 radial tint를 허용하고 다크 화면은 거의 검정의 surface를 사용한다 |
| 카드 위치 | 화면 정중앙 단일 카드 |
| 카드 폭 | 모바일 `calc(100% - 32px)`, 최대 `420px` |
| 카드 padding | 모바일 `24px`, 데스크톱 `32px` |
| 정보 순서 | `제목 -> 설명 -> email -> password -> CTA -> 전환 링크` |
| 카드 인상 | 화이트 surface, 얇은 보더, 낮은 그림자, 상단 브랜드 영역을 기본으로 한다 |
| CTA 인상 | 기본 CTA는 또렷한 solid tone을 사용하고, 보조 강조만 accent tone 또는 약한 gradient를 허용한다 |
| 확장 규칙 | 데스크톱에서도 2열로 나누지 않고 단일 카드 유지 |

#### 인증 화면 상태 규칙

| 상태 | 표현 방식 |
| --- | --- |
| 기본 | clean card + subtle border + muted placeholder |
| focus | 입력 보더 강조 + clean focus ring |
| error | 필드 하단 에러 메시지 + 에러 보더 |
| pending | CTA 비활성 + 로딩 텍스트 또는 스피너 |
| disabled | 명도 낮춤 + 클릭 차단 |

#### 인증 화면 컴포넌트 적용 규칙

| 요소 | 기본 컴포넌트 | 규칙 |
| --- | --- | --- |
| name / displayName | `components/ui/input.tsx` | `type="text"`, 한 줄 입력, signup에서만 사용 |
| email | `components/ui/input.tsx` | `type=\"email\"`, 한 줄 입력 |
| password | `components/ui/input.tsx` | `type=\"password\"`, 한 줄 입력 |
| submit CTA | `components/ui/button.tsx` | primary variant, full width |
| 보조 링크 | `features/auth/components/auth-switch-link.tsx` | CTA보다 낮은 우선순위의 텍스트 링크 |
| 카드 래퍼 | `features/auth/components/auth-form-card.tsx` | 입력/버튼/링크를 단일 card surface로 묶음 |
| auth shell | `components/layout/auth-shell.tsx` | 중앙 정렬과 화면 폭 제어만 담당 |

### 홈 피드

| 항목 | 내용 |
| --- | --- |
| 구현 디렉터리 | `features/feed/components` |
| 추가할 디자인 | 이미지 중심 카드 스택, 안정적인 액션 바, 카드 간 여백 리듬 |
| 필요한 컴포넌트 | `FeedList`, `PostCard`, `PostMedia`, `PostMeta`, `PostActions`, `FeedEmptyState` |

### 게시물 상세와 댓글

| 항목 | 내용 |
| --- | --- |
| 구현 디렉터리 | `features/post-detail/components` |
| 추가할 디자인 | 모바일 sheet/modal, 데스크톱 2열 상세, sticky 댓글 입력 바 |
| 필요한 컴포넌트 | `PostDetailModal`, `PostDetailPage`, `PostDetailContent`, `CommentList`, `CommentItem`, `CommentForm`, `DetailMetaPanel` |

### 게시물 작성

| 항목 | 내용 |
| --- | --- |
| 구현 디렉터리 | `features/post-compose/components` |
| 추가할 디자인 | 양식보다 미리보기 툴에 가까운 화면, sticky action zone |
| 필요한 컴포넌트 | `CreatePostForm`, `PresetImagePicker`, `CaptionInput`, `PostPreview`, `ComposerToolbar` |

### 프로필과 저장 탭

| 항목 | 내용 |
| --- | --- |
| 구현 디렉터리 | `features/profile/components` |
| 추가할 디자인 | 인물 소개 + 아카이브 균형, 큰 통계 숫자, `Posts / Saved` 탭 연결 |
| 필요한 컴포넌트 | `ProfileHeader`, `ProfileStats`, `FollowButton`, `ProfileTabs`, `ProfileGrid`, `SavedPostGrid`, `ProfileEmptyState` |

### 탐색 화면

| 항목 | 내용 |
| --- | --- |
| 구현 디렉터리 | `features/explore/components` |
| 추가할 디자인 | 홈보다 가벼운 발견형 레이아웃, 추천 유저/게시물 밀도 차이 |
| 필요한 컴포넌트 | `ExploreHeader`, `ExploreSearchForm`, `SuggestedUserList`, `SuggestedUserCard`, `SuggestedPostGrid`, `SuggestedPostCard`, `ExploreEmptyState` |

### 알림 화면

| 항목 | 내용 |
| --- | --- |
| 구현 디렉터리 | `features/notification/components` |
| 추가할 디자인 | 단순 목록이 아닌 활동 피드 느낌, 타입별 아이콘 명확화 |
| 필요한 컴포넌트 | `NotificationList`, `NotificationItem`, `NotificationFilterTabs`, `NotificationActor`, `NotificationEmptyState` |

### 프로필 수정

| 항목 | 내용 |
| --- | --- |
| 구현 디렉터리 | `features/profile/components` |
| 추가할 디자인 | 관리형 settings와 인물 편집 UI의 중간 느낌, 이미지/이름/bio 카드화 |
| 필요한 컴포넌트 | `EditProfileForm`, `ProfileImagePicker`, `DisplayNameField`, `BioField`, `ProfileEditNotice` |

## 3. 상태 패턴

| 상태 | 디자인 규칙 |
| --- | --- |
| `loading` | 실제 컴포넌트 비율과 비슷한 skeleton을 사용한다 |
| `empty` | 설명 문구와 다음 행동 CTA를 함께 둔다 |
| `error` | 기술 문구보다 retry 또는 복귀 행동을 먼저 보여준다 |
| `pending` | 좋아요, 저장, 팔로우는 즉시 tone을 바꾸고 중복 클릭을 막는다 |
