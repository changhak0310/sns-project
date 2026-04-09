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
| 추가할 디자인 | 집중형 auth card, 짧은 브랜드 카피, 부드러운 설명 문구 |
| 필요한 컴포넌트 | `AuthHeader`, `AuthCard`, `LoginForm`, `SignupForm`, `AuthSwitchLink`, `OAuthButton(optional)` |

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
