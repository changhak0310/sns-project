# 프로필과 팔로우 명세

## 1. 상태 변수 및 함수 정의

프로필과 팔로우 기능은 인스타그램과 유사하게 사용자 프로필 정보, 팔로워/팔로잉 수, 게시글 그리드, 팔로우 버튼 상태를 공통 계약으로 사용한다.

### A. 타입 정의

#### I. 공통 타입

<a id="type-profile-user"></a>

##### a. `ProfileUser`

```ts
type ProfileUser = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
};
```

<a id="type-profile-post-summary"></a>

##### b. `ProfilePostSummary`

```ts
type ProfilePostSummary = {
  id: number;
  shortcode: string;
  thumbnailUrl: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
};
```

<a id="type-profile-page-data"></a>

##### c. `ProfilePageData`

```ts
type ProfilePageData = {
  user: ProfileUser;
  posts: ProfilePostSummary[];
  isFollowing: boolean;
  isViewerProfile: boolean;
  nextCursor: string | null;
  hasNextPage: boolean;
};
```

### B. 상태 변수 정의

| 변수명 | 타입 | 설명 | 초기값 | 사용 컴포넌트 |
| --- | --- | --- | --- | --- |
| `profileData` | <a href="#type-profile-page-data"><code>ProfilePageData</code></a> \| null | 현재 프로필 화면에 노출할 사용자 정보, 게시글 그리드, 관계 상태 | `null` | `ProfilePage`, `ProfileHeader`, `ProfileStats`, `ProfileActionButtons`, `ProfilePostGrid` |
| `actionError` | `string` | 프로필 조회 또는 팔로우 요청 실패 시 화면에 보여줄 메시지 | `""` | `ProfilePage`, `ProfileErrorMessage` |
| `isLoading` | `boolean` | 첫 프로필 조회 진행 여부 | `false` | `ProfilePage`, `ProfileHeader`, `ProfilePostGrid` |
| `isFetchingMore` | `boolean` | 프로필 게시글 추가 조회 진행 여부 | `false` | `ProfilePage`, `ProfileGridInfiniteTrigger` |
| `isFollowLoading` | `boolean` | 팔로우 또는 팔로우 취소 요청 진행 여부 | `false` | `ProfileActionButtons`, `FollowButton` |

### C. 함수 정의

| 함수명 | 시그니처 | 역할 | 사용 컴포넌트 |
| --- | --- | --- | --- |
| `loadProfile()` | `(username: string) => Promise<void>` | 프로필 정보와 첫 게시글 그리드를 최신순으로 조회한다. | `ProfilePage` |
| `loadMoreProfilePosts()` | `() => Promise<void>` | 다음 커서 기준으로 프로필 게시글을 추가 요청한다. | `ProfilePage`, `ProfileGridInfiniteTrigger` |
| `toggleFollow()` | `() => Promise<void>` | 팔로우 또는 팔로우 취소 요청을 실행한다. | `ProfileActionButtons`, `FollowButton` |
| `resetProfileState()` | `() => void` | 프로필 상태와 팔로우 상태를 초기값으로 되돌린다. | `ProfilePage` |

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
A. 컴포넌트 -> B. 훅 -> C. 서비스 -> D. 레포지토리 -> E. 서버
```

참조 - [function-md-guide.md](../function-md-guide.md), [layer.md](../../layout/layer.md), [06-post-detail-engagement.md](./06-post-detail-engagement.md)

### A. 컴포넌트

프로필 화면은 인스타그램과 유사하게 상단 프로필 헤더와 3열 게시글 그리드로 구성한다. 게시글 클릭 시 상세 permalink로 이동하고, 상세 동작은 [06-post-detail-engagement.md](./06-post-detail-engagement.md)를 기준으로 한다.

#### I. 컴포넌트 구조

```text
ProfilePage
  -> ProfileHeader
    -> ProfileStats
    -> ProfileActionButtons
      -> FollowButton
  -> ProfilePostGrid
    -> ProfilePostGridItem
    -> ProfileGridInfiniteTrigger
    -> ProfileEmptyState
  -> ProfileErrorMessage
```

#### II. 컴포넌트 타입

<a id="type-profile-page-route-props"></a>

##### a. `ProfilePageRouteProps`

```ts
type ProfilePageRouteProps = {
  username: string;
};
```

<a id="type-profile-header-props"></a>

##### b. `ProfileHeaderProps`

```ts
type ProfileHeaderProps = {
  profileData: ProfilePageData;
};
```

<a id="type-profile-stats-props"></a>

##### c. `ProfileStatsProps`

```ts
type ProfileStatsProps = {
  postCount: number;
  followerCount: number;
  followingCount: number;
};
```

<a id="type-profile-action-buttons-props"></a>

##### d. `ProfileActionButtonsProps`

```ts
type ProfileActionButtonsProps = {
  isViewerProfile: boolean;
  isFollowing: boolean;
  isLoading: boolean;
  onFollowClick: () => void;
};
```

<a id="type-follow-button-props"></a>

##### e. `FollowButtonProps`

```ts
type FollowButtonProps = {
  isFollowing: boolean;
  isLoading: boolean;
  onClick: () => void;
};
```

<a id="type-profile-post-grid-props"></a>

##### f. `ProfilePostGridProps`

```ts
type ProfilePostGridProps = {
  posts: ProfilePostSummary[];
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingMore: boolean;
  onLoadMore: () => void;
  emptyTitle: string;
  emptyDescription: string;
};
```

<a id="type-profile-post-grid-item-props"></a>

##### g. `ProfilePostGridItemProps`

```ts
type ProfilePostGridItemProps = {
  post: ProfilePostSummary;
  href: string;
};
```

<a id="type-profile-grid-infinite-trigger-props"></a>

##### h. `ProfileGridInfiniteTriggerProps`

```ts
type ProfileGridInfiniteTriggerProps = {
  hasNextPage: boolean;
  isFetchingMore: boolean;
  onVisible: () => void;
};
```

<a id="type-profile-empty-state-props"></a>

##### i. `ProfileEmptyStateProps`

```ts
type ProfileEmptyStateProps = {
  title: string;
  description: string;
};
```

<a id="type-profile-error-message-props"></a>

##### j. `ProfileErrorMessageProps`

```ts
type ProfileErrorMessageProps = {
  message: string;
};
```

#### III. 컴포넌트 정의

| 컴포넌트명 | 역할 | 사용하는 Hook | 받는 props | 이벤트에서 호출하는 함수 | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `ProfilePage` | 프로필 정보 조회, 팔로우 상태, 게시글 그리드 흐름을 관리한다. | `useProfileFollow()` | <a href="#type-profile-page-route-props"><code>ProfilePageRouteProps</code></a> | `onMount 또는 onUsernameChange -> loadProfile(username)` | `profileData`, `actionError`, `isLoading`, `isFetchingMore`, `isFollowLoading` |
| `ProfileHeader` | 아바타, 이름, username, bio, 통계, 액션 버튼을 렌더링한다. | 없음 | <a href="#type-profile-header-props"><code>ProfileHeaderProps</code></a> | 없음 | 없음 |
| `ProfileStats` | 게시글 수, 팔로워 수, 팔로잉 수를 인스타그램형 숫자 블록으로 출력한다. | 없음 | <a href="#type-profile-stats-props"><code>ProfileStatsProps</code></a> | 없음 | 없음 |
| `ProfileActionButtons` | 본인 프로필이면 관리 버튼 영역, 다른 사용자 프로필이면 팔로우 버튼 영역을 렌더링한다. | 없음 | <a href="#type-profile-action-buttons-props"><code>ProfileActionButtonsProps</code></a> | `onFollowClick -> toggleFollow()` | 없음 |
| `FollowButton` | 현재 관계 상태에 따라 `팔로우` 또는 `팔로잉` 버튼을 렌더링한다. | 없음 | <a href="#type-follow-button-props"><code>FollowButtonProps</code></a> | `onClick -> toggleFollow()` | 없음 |
| `ProfilePostGrid` | 최신순 게시글 3열 그리드, 빈 상태, 추가 조회 트리거를 함께 렌더링한다. | 없음 | <a href="#type-profile-post-grid-props"><code>ProfilePostGridProps</code></a> | `ProfileGridInfiniteTrigger.onVisible -> onLoadMore()` | 없음 |
| `ProfilePostGridItem` | 게시글 썸네일 카드와 상세 permalink 링크를 렌더링한다. | 없음 | <a href="#type-profile-post-grid-item-props"><code>ProfilePostGridItemProps</code></a> | 없음 | 없음 |
| `ProfileGridInfiniteTrigger` | 그리드 하단 도달 시 추가 게시글 요청을 실행한다. | 없음 | <a href="#type-profile-grid-infinite-trigger-props"><code>ProfileGridInfiniteTriggerProps</code></a> | `onVisible -> loadMoreProfilePosts()` | 없음 |
| `ProfileEmptyState` | 게시글이 없는 프로필의 빈 상태를 출력한다. | 없음 | <a href="#type-profile-empty-state-props"><code>ProfileEmptyStateProps</code></a> | 없음 | 없음 |
| `ProfileErrorMessage` | 프로필 조회 또는 팔로우 요청 실패 메시지를 출력한다. | 없음 | <a href="#type-profile-error-message-props"><code>ProfileErrorMessageProps</code></a> | 없음 | 없음 |

### B. 훅

훅은 프로필 조회, 게시글 그리드 추가 조회, 팔로우 토글 흐름을 기능 단위로 나누어 정의한다.

#### I. 훅 타입

<a id="type-profile-follow-state"></a>

##### a. `ProfileFollowState`

```ts
type ProfileFollowState = {
  profileData: ProfilePageData | null;
  actionError: string;
  isLoading: boolean;
  isFetchingMore: boolean;
  isFollowLoading: boolean;
};
```

<a id="type-profile-follow-actions"></a>

##### b. `ProfileFollowActions`

```ts
type ProfileFollowActions = {
  loadProfile: (username: string) => Promise<void>;
  loadMoreProfilePosts: () => Promise<void>;
  toggleFollow: () => Promise<void>;
  resetProfileState: () => void;
};
```

<a id="type-use-profile-follow-return"></a>

##### c. `UseProfileFollowReturn`

```ts
type UseProfileFollowReturn = ProfileFollowState & ProfileFollowActions;
```

#### II. useProfileFollow

##### a. 훅 요약

| 항목 | 내용 |
| --- | --- |
| 훅명 | `useProfileFollow()` |
| 역할 | 프로필 UI 상태 관리, 프로필 조회, 게시글 그리드 추가 조회, 팔로우 요청 실행, 프로필 상태 초기화 |
| 호출 Service | `profileFollowService.getProfile(username, cursor, limit)`, `profileFollowService.toggleFollow(profileUserId, isFollowing, isViewerProfile)` |
| 호출 입력값 | `username` |

##### b. 상태

| 변수 명 | 범위 | 초기 값 | 역할 |
| --- | --- | --- | --- |
| `profileData` | `public` | `null` | 프로필 UI 상태 관리 |
| `actionError` | `public` | `""` | 프로필 결과 상태 관리 |
| `isLoading` | `public` | `false` | 프로필 요청 실행 |
| `isFetchingMore` | `public` | `false` | 프로필 요청 실행 |
| `isFollowLoading` | `public` | `false` | 프로필 요청 실행 |

##### c. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 service | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `loadProfile()` | `public` | `username: string` | `Promise<void>` | <code>profileFollowService.getProfile(username: string, cursor: string \| null, limit: number): Promise&lt;<a href="#type-profile-page-result">ProfilePageResult</a>&gt;</code> | `profileData`, `actionError`, `isLoading` |
| `loadMoreProfilePosts()` | `public` | 없음 | `Promise<void>` | <code>profileFollowService.getProfile(username: string, cursor: string \| null, limit: number): Promise&lt;<a href="#type-profile-page-result">ProfilePageResult</a>&gt;</code> | `profileData`, `actionError`, `isFetchingMore` |
| `toggleFollow()` | `public` | 없음 | `Promise<void>` | <code>profileFollowService.toggleFollow(profileUserId: number, isFollowing: boolean, isViewerProfile: boolean): Promise&lt;<a href="#type-follow-mutation-result">FollowMutationResult</a>&gt;</code> | `profileData`, `actionError`, `isFollowLoading` |
| `resetProfileState()` | `public` | 없음 | `void` | 없음 | `profileData`, `actionError`, `isLoading`, `isFetchingMore`, `isFollowLoading` |

##### d. 동작 규칙

- `loadProfile()`
  - 프로필 페이지가 마운트되거나 `username`이 변경될 때 `loadProfile(username)`을 호출한다.
  - 시작 시 `profileData = null`, `isLoading = true`, `actionError = ""`
  - 최신 게시글 기준으로 `profileFollowService.getProfile(username, null, 12)`를 호출한다.
- `loadMoreProfilePosts()`
  - `profileData = null`이면 추가 요청을 진행하지 않는다.
  - `profileData.hasNextPage = false`이면 추가 요청을 진행하지 않는다.
  - `profileData.nextCursor = null`이면 추가 요청을 진행하지 않는다.
  - `isFetchingMore = true`이면 중복 요청을 진행하지 않는다.
  - 시작 시 `isFetchingMore = true`
  - `profileFollowService.getProfile(profileData.user.username, profileData.nextCursor, 12)`를 호출해 다음 게시글을 추가한다.
- `toggleFollow()`
  - `profileData = null`이면 요청을 진행하지 않는다.
  - 시작 시 `isFollowLoading = true`, `actionError = ""`
  - `profileFollowService.toggleFollow(profileData.user.id, profileData.isFollowing, profileData.isViewerProfile)`를 호출한다.
- `resetProfileState()`
  - 프로필 상태와 팔로우 상태를 모두 초기값으로 되돌린다.

##### e. 상태 갱신 규칙

| 상황 | 상태 갱신 |
| --- | --- |
| 프로필 조회 시작 | `profileData = null`, `isLoading = true`, `actionError = ""` |
| 프로필 조회 성공 | `profileData = data`, `actionError = ""` |
| 게시글 추가 조회 시작 | `isFetchingMore = true` |
| 게시글 추가 조회 성공 | `profileData.posts = [...profileData.posts, ...data.posts]`, `profileData.nextCursor = data.nextCursor`, `profileData.hasNextPage = data.hasNextPage` |
| 팔로우 성공 | `profileData.isFollowing`, `profileData.user.followerCount`, `actionError = ""` |
| 실패 | `actionError = message` |
| 종료 | `isLoading = false`, `isFetchingMore = false`, `isFollowLoading = false` |
| 초기화 | `profileData = null`, `actionError = ""`, `isLoading = false`, `isFetchingMore = false`, `isFollowLoading = false` |

### C. 서비스

프로필 서비스는 프로필 조회와 팔로우 토글 비즈니스 로직을 담당한다.

#### I. 서비스 타입

<a id="type-profile-page-result"></a>

##### a. `ProfilePageResult`

```ts
type ProfilePageResult =
  | {
      success: true;
      data: ProfilePageData;
    }
  | {
      success: false;
      message: string;
    };
```

<a id="type-follow-mutation-result"></a>

##### b. `FollowMutationResult`

```ts
type FollowMutationResult =
  | {
      success: true;
      isFollowing: boolean;
      followerCount: number;
    }
  | {
      success: false;
      message: string;
    };
```

#### II. `profileFollowService`

##### a. 서비스 요약

| 항목 | 내용 |
| --- | --- |
| 서비스명 | `profileFollowService` |
| 역할 | 프로필 조회, 게시글 최신순 정렬 유지, 팔로우 토글 비즈니스 로직 수행, 레포지토리 호출, 최종 결과 반환 |
| 호출 Repository | `profileRepository.getProfile(username, cursor, limit)`, `profileRepository.createFollow(profileUserId)`, `profileRepository.deleteFollow(profileUserId)` |

##### b. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 대상 | 실패 메시지 | 역할 |
| --- | --- | --- | --- | --- | --- | --- |
| `getProfile()` | `public` | `username: string`, `cursor: string \| null`, `limit: number` | <code>Promise&lt;<a href="#type-profile-page-result">ProfilePageResult</a>&gt;</code> | <code>profileRepository.getProfile(username: string, cursor: string \| null, limit: number): Promise&lt;<a href="#type-profile-page-api-response">ProfilePageApiResponse</a>&gt;</code> | `프로필을 불러오지 못했습니다.`<br>`사용자를 찾을 수 없습니다.` | 프로필 정보와 최신 게시글 그리드를 반환한다. |
| `toggleFollow()` | `public` | `profileUserId: number`, `isFollowing: boolean`, `isViewerProfile: boolean` | <code>Promise&lt;<a href="#type-follow-mutation-result">FollowMutationResult</a>&gt;</code> | <code>profileRepository.createFollow(profileUserId: number): Promise&lt;<a href="#type-follow-api-response">FollowApiResponse</a>&gt;</code><br><code>profileRepository.deleteFollow(profileUserId: number): Promise&lt;<a href="#type-follow-api-response">FollowApiResponse</a>&gt;</code> | `자기 자신은 팔로우할 수 없습니다.`<br>`팔로우 처리 중 문제가 발생했습니다.` | 현재 관계 상태에 따라 팔로우 또는 팔로우 취소를 실행한다. |

##### c. 동작 규칙

- `getProfile()`
  - `username`, `cursor`, `limit`를 기준으로 `profileRepository.getProfile(username, cursor, limit)`를 호출한다.
  - 프로필 게시글 목록은 최신순 기준으로 해석한다.
  - 한 번의 요청에서 기본적으로 12개의 게시글을 반환한다.
- `toggleFollow()`
  - `isViewerProfile = true`이면 팔로우 요청을 진행하지 않는다.
  - `isFollowing = false`이면 `profileRepository.createFollow(profileUserId)`를 호출한다.
  - `isFollowing = true`이면 `profileRepository.deleteFollow(profileUserId)`를 호출한다.

##### d. 반환 규칙

- `getProfile()`

| 상황 | 반환값 |
| --- | --- |
| 프로필 조회 성공 | `success: true`, <code>data: <a href="#type-profile-page-data">ProfilePageData</a></code> |
| 프로필 조회 실패 | `success: false`, `message: string` |

- `toggleFollow()`

| 상황 | 반환값 |
| --- | --- |
| 팔로우 또는 팔로우 취소 성공 | `success: true`, `isFollowing: boolean`, `followerCount: number` |
| 팔로우 또는 팔로우 취소 실패 | `success: false`, `message: string` |

### D. 레포지토리

레포지토리는 프로필 조회와 팔로우 API 요청, 응답 처리만 담당한다.

#### I. API 타입

<a id="type-profile-page-api-response"></a>

##### a. `ProfilePageApiResponse`

```ts
type ProfilePageApiResponse = ProfilePageResult;
```

<a id="type-follow-api-response"></a>

##### b. `FollowApiResponse`

```ts
type FollowApiResponse = FollowMutationResult;
```

#### II. `profileRepository`

##### a. 레포지토리 요약

| 항목 | 내용 |
| --- | --- |
| 레포지토리명 | `profileRepository` |
| 역할 | API 요청 전송, 서버 응답 수신, 응답 데이터를 서비스 계층에 전달 |
| 호출 API | `GET /api/profiles/{username}?cursor={cursor}&limit=12`, `POST /api/profiles/{userId}/follow`, `DELETE /api/profiles/{userId}/follow` |

##### b. 함수

| 함수 명 | 받는 props | return 값 | 호출하는 API | 역할 |
| --- | --- | --- | --- | --- |
| `getProfile()` | `username: string`, `cursor: string \| null`, `limit: number` | <code>Promise&lt;<a href="#type-profile-page-api-response">ProfilePageApiResponse</a>&gt;</code> | `GET /api/profiles/{username}?cursor={cursor}&limit=12` | 프로필 조회 API 요청 후 응답 결과를 반환한다. |
| `createFollow()` | `profileUserId: number` | <code>Promise&lt;<a href="#type-follow-api-response">FollowApiResponse</a>&gt;</code> | `POST /api/profiles/{userId}/follow` | 팔로우 API 요청 후 응답 결과를 반환한다. |
| `deleteFollow()` | `profileUserId: number` | <code>Promise&lt;<a href="#type-follow-api-response">FollowApiResponse</a>&gt;</code> | `DELETE /api/profiles/{userId}/follow` | 팔로우 취소 API 요청 후 응답 결과를 반환한다. |

##### c. 요청 규칙

| 항목 | 내용 |
| --- | --- |
| 프로필 조회 Method | `GET` |
| 프로필 조회 URL | `/api/profiles/{username}` |
| 프로필 조회 요청 파라미터 | `cursor`, `limit=12` |
| 팔로우 생성 Method | `POST` |
| 팔로우 생성 URL | `/api/profiles/{userId}/follow` |
| 팔로우 취소 Method | `DELETE` |
| 팔로우 취소 URL | `/api/profiles/{userId}/follow` |

##### d. 동작 규칙

- `getProfile()`
  - `cursor`, `limit=12`를 query parameter로 전송한다.
  - `GET /api/profiles/{username}`으로 요청을 전송한다.
  - 서버 응답을 <a href="#type-profile-page-api-response"><code>ProfilePageApiResponse</code></a> 형태로 반환한다.
- `createFollow()`
  - `POST /api/profiles/{userId}/follow`로 요청을 전송한다.
  - 서버 응답을 <a href="#type-follow-api-response"><code>FollowApiResponse</code></a> 형태로 반환한다.
- `deleteFollow()`
  - `DELETE /api/profiles/{userId}/follow`로 요청을 전송한다.
  - 서버 응답을 <a href="#type-follow-api-response"><code>FollowApiResponse</code></a> 형태로 반환한다.

##### e. 반환 규칙

| 상황 | 반환값 |
| --- | --- |
| 프로필 조회 성공 | `success: true`, <code>data: <a href="#type-profile-page-data">ProfilePageData</a></code> |
| 팔로우 또는 팔로우 취소 성공 | `success: true`, `isFollowing: boolean`, `followerCount: number` |
| 요청 실패 | `success: false`, `message: string` |

### E. 서버

#### I. 프로필 조회 API

##### a. API 요약

| 항목 | 내용 |
| --- | --- |
| API 이름 | 프로필 조회 API |
| Method | `GET` |
| URL | `/api/profiles/{username}` |
| 요청 본문 | 없음 |
| 처리 | 프로필 기본 정보, 팔로우 관계, 최신 게시글 그리드를 함께 반환한다. |
| Response | `success`, `data` 또는 `message` |

##### b. 요청 본문 예시

```text
GET /api/profiles/honggildong?cursor=2026-04-11T12:00:00.000Z_88&limit=12
```

##### c. 응답 예시

###### 1. 성공 응답 예시

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 7,
      "username": "honggildong",
      "name": "홍길동",
      "avatarUrl": "https://example.com/avatar.png",
      "bio": "사진과 기록",
      "postCount": 48,
      "followerCount": 320,
      "followingCount": 180
    },
    "posts": [
      {
        "id": 88,
        "shortcode": "AbCd1234",
        "thumbnailUrl": "https://example.com/posts/88-thumb.jpg",
        "likeCount": 24,
        "commentCount": 3,
        "createdAt": "2026-04-11T12:00:00.000Z"
      }
    ],
    "isFollowing": true,
    "isViewerProfile": false,
    "nextCursor": "2026-04-10T18:00:00.000Z_87",
    "hasNextPage": true
  }
}
```

###### 2. 실패 응답 예시

```json
{
  "success": false,
  "message": "사용자를 찾을 수 없습니다."
}
```

###### 3. 서버 에러 응답 예시

```json
{
  "success": false,
  "message": "서버 오류가 발생했습니다."
}
```

#### II. 팔로우 API

##### a. API 요약

| 항목 | 내용 |
| --- | --- |
| API 이름 | 팔로우 API |
| Method | `POST`, `DELETE` |
| URL | `/api/profiles/{userId}/follow` |
| 요청 본문 | 없음 |
| 처리 | 현재 관계 상태에 따라 팔로우를 생성하거나 취소한다. |
| Response | `success`, `isFollowing`, `followerCount` 또는 `message` |

##### b. 요청 본문 예시

```text
POST /api/profiles/7/follow
DELETE /api/profiles/7/follow
```

##### c. 응답 예시

###### 1. 성공 응답 예시

```json
{
  "success": true,
  "isFollowing": true,
  "followerCount": 321
}
```

###### 2. 실패 응답 예시

```json
{
  "success": false,
  "message": "자기 자신은 팔로우할 수 없습니다."
}
```

###### 3. 서버 에러 응답 예시

```json
{
  "success": false,
  "message": "서버 오류가 발생했습니다."
}
```

## 3. 디자인 참조

프로필과 팔로우 기능의 상세 UI 규칙은 인스타그램형 프로필 헤더, 통계 블록, 3열 그리드 패턴을 기준으로 참조한다.

### A. 디자인 참조 문서

| 구분 | 문서 | 역할 |
| --- | --- | --- |
| 전체 디자인 시스템 | [design-system.md](../../layout/design-system.md) | 토큰, 무드, 상태, 레이아웃 기준 |
| 화면 조합 패턴 | [screen-patterns.md](../../layout/design-system/screen-patterns.md) | 프로필 화면과 게시글 그리드 패턴 기준 |
| 공통 UI 컴포넌트 | [components-ui.md](../../layout/design-system/components-ui.md) | 버튼, 숫자 통계 블록, 빈 상태 UI 기준 |
| 공통 레이아웃 컴포넌트 | [components-layout.md](../../layout/design-system/components-layout.md) | 상단 셸과 프로필 화면 배치 기준 |
