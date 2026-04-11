# 저장과 북마크 명세

## 1. 상태 변수 및 함수 정의

저장과 북마크 기능은 피드와 게시글 상세에서 게시물을 저장하고, 본인 프로필의 `Saved` 탭에서 다시 보는 흐름을 공통 계약으로 사용한다.
인스타그램처럼 저장 버튼은 빠르게 반응해야 하고, 저장 목록은 본인만 볼 수 있어야 한다.

### A. 타입 정의

#### I. 공통 타입

<a id="type-save-tab-value"></a>

##### a. `SaveTabValue`

```ts
type SaveTabValue = "posts" | "saved";
```

<a id="type-saved-post-author"></a>

##### b. `SavedPostAuthor`

```ts
type SavedPostAuthor = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string;
};
```

<a id="type-saved-post-summary"></a>

##### c. `SavedPostSummary`

```ts
type SavedPostSummary = {
  id: number;
  shortcode: string;
  thumbnailUrl: string;
  captionPreview: string;
  savedAt: string;
  author: SavedPostAuthor;
};
```

<a id="type-saved-posts-page-data"></a>

##### d. `SavedPostsPageData`

```ts
type SavedPostsPageData = {
  savedPosts: SavedPostSummary[];
  nextCursor: string | null;
  hasNextPage: boolean;
};
```

### B. 상태 변수 정의

| 변수명 | 타입 | 설명 | 초기값 | 사용 컴포넌트 |
| --- | --- | --- | --- | --- |
| `savedByViewer` | `boolean` | 현재 게시물이 저장된 상태인지 나타낸다. | `false` | `FeedSaveButton`, `PostDetailSaveButton` |
| `saveActionError` | `string` | 저장 또는 저장 취소 요청 실패 메시지다. | `""` | `FeedSaveButton`, `PostDetailSaveButton` |
| `isSaving` | `boolean` | 저장 또는 저장 취소 요청 진행 여부다. | `false` | `FeedSaveButton`, `PostDetailSaveButton` |
| `savedPosts` | <a href="#type-saved-post-summary"><code>SavedPostSummary</code></a>[] | 본인 프로필 `Saved` 탭에 노출할 저장 게시물 목록이다. | `[]` | `ProfileSavedTabPanel`, `SavedPostGrid`, `SavedPostCard` |
| `nextCursor` | `string \| null` | 저장 목록 다음 페이지를 요청할 기준 커서다. | `null` | `ProfileSavedTabPanel`, `SavedGridInfiniteTrigger` |
| `hasNextPage` | `boolean` | 저장 목록 추가 조회 가능 여부다. | `true` | `ProfileSavedTabPanel`, `SavedGridInfiniteTrigger` |
| `savedPostsError` | `string` | 저장 목록 조회 실패 메시지다. | `""` | `ProfileSavedTabPanel`, `SavedPostsErrorMessage` |
| `isLoadingSavedPosts` | `boolean` | 저장 목록 최초 조회 진행 여부다. | `false` | `ProfileSavedTabPanel`, `SavedPostGrid` |
| `isFetchingMoreSavedPosts` | `boolean` | 저장 목록 무한 스크롤 추가 조회 진행 여부다. | `false` | `ProfileSavedTabPanel`, `SavedGridInfiniteTrigger` |

### C. 함수 정의

| 함수명 | 시그니처 | 역할 | 사용 컴포넌트 |
| --- | --- | --- | --- |
| `toggleSave()` | `() => Promise<void>` | 현재 게시물 저장 상태를 토글한다. | `FeedSaveButton`, `PostDetailSaveButton` |
| `loadSavedPosts()` | `() => Promise<void>` | 본인 프로필 `Saved` 탭의 저장 목록을 최초 조회한다. | `ProfileSavedTabPanel` |
| `loadMoreSavedPosts()` | `() => Promise<void>` | 본인 프로필 `Saved` 탭 저장 목록을 추가 조회한다. | `ProfileSavedTabPanel`, `SavedGridInfiniteTrigger` |
| `resetSavedPostsState()` | `() => void` | 저장 목록 상태를 초기화한다. | `ProfileSavedTabPanel` |

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

참조 - [function-md-guide.md](../function-md-guide.md), [layer.md](../../layout/layer.md), [06-post-detail-engagement.md](./06-post-detail-engagement.md), [07-profile-follow.md](./07-profile-follow.md), [09-session-guard-navigation.md](./09-session-guard-navigation.md)

### A. 컴포넌트

저장과 북마크 기능은 인스타그램처럼 피드 카드와 게시글 상세에서 같은 저장 아이콘을 사용하고, 본인 프로필에서만 `Saved` 탭과 저장 목록 그리드를 노출한다.

#### I. 컴포넌트 구조

```text
HomeFeedPage
  -> FeedPostCard
    -> FeedSaveButton

PostDetailPage
  -> PostDetailContent
    -> PostDetailSaveButton

ProfilePage
  -> ProfileTabs
    -> SavedTabButton
  -> ProfileSavedTabPanel
    -> SavedPostGrid
      -> SavedPostCard
      -> SavedGridInfiniteTrigger
      -> SavedEmptyState
      -> SavedPostsErrorMessage
```

#### II. 컴포넌트 타입

<a id="type-save-button-props"></a>

##### a. `SaveButtonProps`

```ts
type SaveButtonProps = {
  postId: number;
  initialSavedByViewer: boolean;
};
```

<a id="type-saved-tab-button-props"></a>

##### b. `SavedTabButtonProps`

```ts
type SavedTabButtonProps = {
  href: string;
  isActive: boolean;
};
```

<a id="type-profile-saved-tab-panel-props"></a>

##### c. `ProfileSavedTabPanelProps`

```ts
type ProfileSavedTabPanelProps = {
  isViewerProfile: boolean;
};
```

<a id="type-saved-post-grid-props"></a>

##### d. `SavedPostGridProps`

```ts
type SavedPostGridProps = {
  savedPosts: SavedPostSummary[];
  isLoading: boolean;
  errorMessage: string;
  emptyTitle: string;
  emptyDescription: string;
  hasNextPage: boolean;
  isFetchingMore: boolean;
  onLoadMore: () => void;
};
```

<a id="type-saved-post-card-props"></a>

##### e. `SavedPostCardProps`

```ts
type SavedPostCardProps = {
  post: SavedPostSummary;
  href: string;
};
```

<a id="type-saved-grid-infinite-trigger-props"></a>

##### f. `SavedGridInfiniteTriggerProps`

```ts
type SavedGridInfiniteTriggerProps = {
  hasNextPage: boolean;
  isFetchingMore: boolean;
  onVisible: () => void;
};
```

<a id="type-saved-empty-state-props"></a>

##### g. `SavedEmptyStateProps`

```ts
type SavedEmptyStateProps = {
  title: string;
  description: string;
};
```

<a id="type-saved-posts-error-message-props"></a>

##### h. `SavedPostsErrorMessageProps`

```ts
type SavedPostsErrorMessageProps = {
  message: string;
};
```

#### III. 컴포넌트 정의

| 컴포넌트명 | 역할 | 사용하는 Hook | 받는 props | 이벤트에서 호출하는 함수 | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `FeedSaveButton` | 피드 카드에서 저장 아이콘을 노출하고, 즉시 채워지는 저장 상태를 반영한다. | `usePostSave()` | <a href="#type-save-button-props"><code>SaveButtonProps</code></a> | `onClick -> toggleSave()` | `savedByViewer`, `saveActionError`, `isSaving` |
| `PostDetailSaveButton` | 게시글 상세에서 저장 아이콘을 노출하고, 피드와 같은 저장 토글 동작을 사용한다. | `usePostSave()` | <a href="#type-save-button-props"><code>SaveButtonProps</code></a> | `onClick -> toggleSave()` | `savedByViewer`, `saveActionError`, `isSaving` |
| `SavedTabButton` | 본인 프로필에서만 저장 탭 이동 버튼을 노출한다. | 없음 | <a href="#type-saved-tab-button-props"><code>SavedTabButtonProps</code></a> | 없음 | 없음 |
| `ProfileSavedTabPanel` | 본인 프로필 `Saved` 탭의 저장 목록 조회와 추가 조회를 관리한다. | `useSavedPosts()` | <a href="#type-profile-saved-tab-panel-props"><code>ProfileSavedTabPanelProps</code></a> | `onMount -> loadSavedPosts()`<br>`onUnmount 또는 onTabExit -> resetSavedPostsState()` | `savedPosts`, `nextCursor`, `hasNextPage`, `savedPostsError`, `isLoadingSavedPosts`, `isFetchingMoreSavedPosts` |
| `SavedPostGrid` | 저장한 게시물을 인스타그램처럼 3열 그리드로 출력하고, 빈 상태, 조회 실패, 무한 스크롤 트리거를 함께 조합한다. | 없음 | <a href="#type-saved-post-grid-props"><code>SavedPostGridProps</code></a> | `SavedGridInfiniteTrigger.onVisible -> onLoadMore()` | 없음 |
| `SavedPostCard` | 저장한 게시물 썸네일과 permalink 이동 링크를 렌더링한다. | 없음 | <a href="#type-saved-post-card-props"><code>SavedPostCardProps</code></a> | 없음 | 없음 |
| `SavedGridInfiniteTrigger` | 저장 목록 하단 도달 시 다음 저장 게시물을 추가 요청한다. | 없음 | <a href="#type-saved-grid-infinite-trigger-props"><code>SavedGridInfiniteTriggerProps</code></a> | `onVisible -> loadMoreSavedPosts()` | 없음 |
| `SavedEmptyState` | 저장한 게시물이 하나도 없을 때 비어 있는 상태를 출력한다. | 없음 | <a href="#type-saved-empty-state-props"><code>SavedEmptyStateProps</code></a> | 없음 | 없음 |
| `SavedPostsErrorMessage` | 저장 목록 조회 실패 메시지를 출력한다. | 없음 | <a href="#type-saved-posts-error-message-props"><code>SavedPostsErrorMessageProps</code></a> | 없음 | 없음 |

### B. 훅

저장과 북마크 훅은 저장 버튼 토글과 저장 목록 조회를 기능 단위로 나누어 관리한다.

#### I. 훅 타입

<a id="type-post-save-state"></a>

##### a. `PostSaveState`

```ts
type PostSaveState = {
  savedByViewer: boolean;
  saveActionError: string;
  isSaving: boolean;
};
```

<a id="type-post-save-actions"></a>

##### b. `PostSaveActions`

```ts
type PostSaveActions = {
  toggleSave: () => Promise<void>;
};
```

<a id="type-use-post-save-return"></a>

##### c. `UsePostSaveReturn`

```ts
type UsePostSaveReturn = PostSaveState & PostSaveActions;
```

<a id="type-saved-posts-state"></a>

##### d. `SavedPostsState`

```ts
type SavedPostsState = {
  savedPosts: SavedPostSummary[];
  nextCursor: string | null;
  hasNextPage: boolean;
  savedPostsError: string;
  isLoadingSavedPosts: boolean;
  isFetchingMoreSavedPosts: boolean;
};
```

<a id="type-saved-posts-actions"></a>

##### e. `SavedPostsActions`

```ts
type SavedPostsActions = {
  loadSavedPosts: () => Promise<void>;
  loadMoreSavedPosts: () => Promise<void>;
  resetSavedPostsState: () => void;
};
```

<a id="type-use-saved-posts-return"></a>

##### f. `UseSavedPostsReturn`

```ts
type UseSavedPostsReturn = SavedPostsState & SavedPostsActions;
```

#### II. usePostSave

##### a. 훅 요약

| 항목 | 내용 |
| --- | --- |
| 훅명 | `usePostSave()` |
| 역할 | 저장 버튼 UI 상태 관리, 저장 토글 요청 실행, 저장 아이콘 즉시 반영 |
| 호출 Service | `saveBookmarkService.toggleSave(postId, savedByViewer)` |
| 훅 입력값 | `postId`, `initialSavedByViewer` |

##### b. 상태

| 변수명 | 범위 | 초기값 | 역할 |
| --- | --- | --- | --- |
| `savedByViewer` | `public` | `initialSavedByViewer` | 저장 UI 상태 관리 |
| `saveActionError` | `public` | `""` | 저장 결과 상태 관리 |
| `isSaving` | `public` | `false` | 저장 요청 실행 |

##### c. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 service | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `toggleSave()` | `public` | 없음 | `Promise<void>` | <code>saveBookmarkService.toggleSave(postId: number, savedByViewer: boolean): Promise&lt;<a href="#type-save-mutation-result">SaveMutationResult</a>&gt;</code> | `savedByViewer`, `saveActionError`, `isSaving` |

##### d. 동작 규칙

- `initialSavedByViewer`
  - 입력값이 변경되면 `savedByViewer = initialSavedByViewer`로 다시 동기화한다.
- `toggleSave()`
  - 시작 시 `isSaving = true`, `saveActionError = ""`
  - 인스타그램처럼 즉시 반응하도록 `savedByViewer`를 먼저 반전시킨다.
  - 실행 중 `saveBookmarkService.toggleSave(postId, previousSavedByViewer)`를 호출한다.
  - 성공하면 서버가 반환한 `savedByViewer`를 최종 상태로 다시 반영한다.
  - 실패하면 `savedByViewer`를 이전 값으로 되돌린다.

##### e. 상태 갱신 규칙

| 상황 | 상태 갱신 |
| --- | --- |
| 외부 저장 상태 변경 | `savedByViewer = initialSavedByViewer`, `saveActionError = ""` |
| 저장 토글 시작 | `isSaving = true`, `saveActionError = ""`, `savedByViewer = !savedByViewer` |
| 저장 토글 성공 | `savedByViewer = result.savedByViewer`, `saveActionError = ""` |
| 저장 토글 실패 | `savedByViewer = previousSavedByViewer`, `saveActionError = message` |
| 종료 | `isSaving = false` |

#### III. useSavedPosts

##### a. 훅 요약

| 항목 | 내용 |
| --- | --- |
| 훅명 | `useSavedPosts()` |
| 역할 | 저장 목록 UI 상태 관리, 저장 목록 최초 조회, 저장 목록 추가 조회, 저장 목록 상태 초기화 |
| 호출 Service | `saveBookmarkService.getSavedPosts(isViewerProfile, cursor, limit)` |
| 훅 입력값 | `isViewerProfile` |

##### b. 상태

| 변수명 | 범위 | 초기값 | 역할 |
| --- | --- | --- | --- |
| `savedPosts` | `public` | `[]` | 저장 목록 UI 상태 관리 |
| `nextCursor` | `public` | `null` | 저장 목록 추가 조회 상태 관리 |
| `hasNextPage` | `public` | `true` | 저장 목록 추가 조회 상태 관리 |
| `savedPostsError` | `public` | `""` | 저장 목록 결과 상태 관리 |
| `isLoadingSavedPosts` | `public` | `false` | 저장 목록 요청 실행 |
| `isFetchingMoreSavedPosts` | `public` | `false` | 저장 목록 요청 실행 |

##### c. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 service | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `loadSavedPosts()` | `public` | 없음 | `Promise<void>` | <code>saveBookmarkService.getSavedPosts(isViewerProfile: boolean, cursor: string \| null, limit: number): Promise&lt;<a href="#type-saved-posts-result">SavedPostsResult</a>&gt;</code> | `savedPosts`, `nextCursor`, `hasNextPage`, `savedPostsError`, `isLoadingSavedPosts` |
| `loadMoreSavedPosts()` | `public` | 없음 | `Promise<void>` | <code>saveBookmarkService.getSavedPosts(isViewerProfile: boolean, cursor: string \| null, limit: number): Promise&lt;<a href="#type-saved-posts-result">SavedPostsResult</a>&gt;</code> | `savedPosts`, `nextCursor`, `hasNextPage`, `savedPostsError`, `isFetchingMoreSavedPosts` |
| `resetSavedPostsState()` | `public` | 없음 | `void` | 없음 | `savedPosts`, `nextCursor`, `hasNextPage`, `savedPostsError`, `isLoadingSavedPosts`, `isFetchingMoreSavedPosts` |

##### d. 동작 규칙

- `loadSavedPosts()`
  - 시작 시 `isLoadingSavedPosts = true`, `savedPostsError = ""`
  - `saveBookmarkService.getSavedPosts(isViewerProfile, null, 12)`를 호출한다.
  - 본인 프로필이 아니면 저장 목록을 조회하지 않는다.
- `loadMoreSavedPosts()`
  - `hasNextPage = false`면 추가 요청을 실행하지 않는다.
  - `nextCursor = null`면 추가 요청을 실행하지 않는다.
  - `isFetchingMoreSavedPosts = true`면 중복 요청을 실행하지 않는다.
  - `saveBookmarkService.getSavedPosts(isViewerProfile, nextCursor, 12)`를 호출한다.
- `resetSavedPostsState()`
  - 저장 목록 상태를 모두 초기값으로 되돌린다.

##### e. 상태 갱신 규칙

| 상황 | 상태 갱신 |
| --- | --- |
| 저장 목록 조회 시작 | `isLoadingSavedPosts = true`, `savedPostsError = ""` |
| 저장 목록 조회 성공 | `savedPosts = data.savedPosts`, `nextCursor = data.nextCursor`, `hasNextPage = data.hasNextPage` |
| 저장 목록 추가 조회 시작 | `isFetchingMoreSavedPosts = true` |
| 저장 목록 추가 조회 성공 | `savedPosts = [...savedPosts, ...data.savedPosts]`, `nextCursor = data.nextCursor`, `hasNextPage = data.hasNextPage` |
| 저장 목록 조회 실패 | `savedPostsError = message` |
| 종료 | `isLoadingSavedPosts = false`, `isFetchingMoreSavedPosts = false` |
| 초기화 | `savedPosts = []`, `nextCursor = null`, `hasNextPage = true`, `savedPostsError = ""`, `isLoadingSavedPosts = false`, `isFetchingMoreSavedPosts = false` |

### C. 서비스

저장과 북마크 서비스는 저장 토글과 저장 목록 조회 규칙을 담당한다.

#### I. 서비스 타입

<a id="type-save-mutation-result"></a>

##### a. `SaveMutationResult`

```ts
type SaveMutationResult =
  | {
      success: true;
      savedByViewer: boolean;
    }
  | {
      success: false;
      message: string;
    };
```

<a id="type-saved-posts-result"></a>

##### b. `SavedPostsResult`

```ts
type SavedPostsResult =
  | {
      success: true;
      data: SavedPostsPageData;
    }
  | {
      success: false;
      message: string;
    };
```

#### II. `saveBookmarkService`

##### a. 서비스 요약

| 항목 | 내용 |
| --- | --- |
| 서비스명 | `saveBookmarkService` |
| 역할 | 저장 토글 처리, 저장 목록 최신순 조회, 자기 프로필 접근 검증, 최종 결과 반환 |
| 호출 Repository | `bookmarkRepository.createBookmark(postId)`, `bookmarkRepository.deleteBookmark(postId)`, `bookmarkRepository.getSavedPosts(cursor, limit)` |

##### b. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 대상 | 실패 메시지 | 역할 |
| --- | --- | --- | --- | --- | --- | --- |
| `toggleSave()` | `public` | `postId: number`, `savedByViewer: boolean` | <code>Promise&lt;<a href="#type-save-mutation-result">SaveMutationResult</a>&gt;</code> | <code>bookmarkRepository.createBookmark(postId: number): Promise&lt;<a href="#type-save-mutation-api-response">SaveMutationApiResponse</a>&gt;</code><br><code>bookmarkRepository.deleteBookmark(postId: number): Promise&lt;<a href="#type-save-mutation-api-response">SaveMutationApiResponse</a>&gt;</code> | `로그인이 필요합니다.`<br>`저장 처리 중 문제가 발생했습니다.` | 현재 저장 상태에 따라 저장 또는 저장 취소를 수행한다. |
| `getSavedPosts()` | `public` | `isViewerProfile: boolean`, `cursor: string \| null`, `limit: number` | <code>Promise&lt;<a href="#type-saved-posts-result">SavedPostsResult</a>&gt;</code> | <code>bookmarkRepository.getSavedPosts(cursor: string \| null, limit: number): Promise&lt;<a href="#type-saved-posts-api-response">SavedPostsApiResponse</a>&gt;</code> | `저장한 게시물은 본인만 볼 수 있습니다.`<br>`저장한 게시물을 불러오지 못했습니다.` | 본인 프로필 `Saved` 탭의 저장 목록을 최신 저장순으로 반환한다. |
| `validateSavedAccess()` | `private` | `isViewerProfile: boolean` | `boolean` | 없음 | 없음 | 저장 목록이 본인에게만 보이도록 접근 가능 여부를 검증한다. |

##### c. 동작 규칙

- `toggleSave()`
  - `savedByViewer = false`면 `bookmarkRepository.createBookmark(postId)`를 호출한다.
  - `savedByViewer = true`면 `bookmarkRepository.deleteBookmark(postId)`를 호출한다.
- `getSavedPosts()`
  - 시작 시 `validateSavedAccess(isViewerProfile)`를 호출한다.
  - `false`면 저장 목록을 조회하지 않고 실패 메시지를 반환한다.
  - 통과하면 `bookmarkRepository.getSavedPosts(cursor, limit)`를 호출한다.
  - 저장 목록은 `savedAt` 기준 최신순으로 정렬된 상태를 기준으로 반환한다.
  - 기본 `limit`은 `12`다.
- `validateSavedAccess()`
  - `isViewerProfile = true`면 `true`를 반환한다.
  - `isViewerProfile = false`면 `false`를 반환한다.

##### d. 반환 규칙

- `toggleSave()`

| 상황 | 반환값 |
| --- | --- |
| 저장 또는 저장 취소 성공 | `success: true`, `savedByViewer: boolean` |
| 저장 또는 저장 취소 실패 | `success: false`, `message: string` |

- `getSavedPosts()`

| 상황 | 반환값 |
| --- | --- |
| 저장 목록 조회 성공 | `success: true`, <code>data: <a href="#type-saved-posts-page-data">SavedPostsPageData</a></code> |
| 저장 목록 조회 실패 | `success: false`, `message: string` |

- `validateSavedAccess()`

| 상황 | 반환값 |
| --- | --- |
| 본인 프로필 | `true` |
| 다른 사람 프로필 | `false` |

### D. 레포지토리

레포지토리는 저장 토글 API와 저장 목록 조회 API의 요청과 응답만 담당한다.

#### I. API 타입

<a id="type-save-mutation-api-response"></a>

##### a. `SaveMutationApiResponse`

```ts
type SaveMutationApiResponse = SaveMutationResult;
```

<a id="type-saved-posts-api-response"></a>

##### b. `SavedPostsApiResponse`

```ts
type SavedPostsApiResponse = SavedPostsResult;
```

#### II. `bookmarkRepository`

##### a. 레포지토리 요약

| 항목 | 내용 |
| --- | --- |
| 레포지토리명 | `bookmarkRepository` |
| 역할 | API 요청 전송, 서버 응답 수신, 응답 데이터를 서비스 계층에 전달 |
| 호출 API | `POST /api/posts/{postId}/bookmarks`, `DELETE /api/posts/{postId}/bookmarks`, `GET /api/users/me/bookmarks?cursor={cursor}&limit=12` |

##### b. 함수

| 함수 명 | 받는 props | return 값 | 호출하는 API | 역할 |
| --- | --- | --- | --- | --- |
| `createBookmark()` | `postId: number` | <code>Promise&lt;<a href="#type-save-mutation-api-response">SaveMutationApiResponse</a>&gt;</code> | `POST /api/posts/{postId}/bookmarks` | 게시물 저장 API 요청과 응답 결과를 반환한다. |
| `deleteBookmark()` | `postId: number` | <code>Promise&lt;<a href="#type-save-mutation-api-response">SaveMutationApiResponse</a>&gt;</code> | `DELETE /api/posts/{postId}/bookmarks` | 게시물 저장 취소 API 요청과 응답 결과를 반환한다. |
| `getSavedPosts()` | `cursor: string \| null`, `limit: number` | <code>Promise&lt;<a href="#type-saved-posts-api-response">SavedPostsApiResponse</a>&gt;</code> | `GET /api/users/me/bookmarks?cursor={cursor}&limit=12` | 저장 목록 조회 API 요청과 응답 결과를 반환한다. |

##### c. 요청 규칙

| 항목 | 내용 |
| --- | --- |
| 저장 Method | `POST` |
| 저장 URL | `/api/posts/{postId}/bookmarks` |
| 저장 취소 Method | `DELETE` |
| 저장 취소 URL | `/api/posts/{postId}/bookmarks` |
| 저장 목록 조회 Method | `GET` |
| 저장 목록 조회 URL | `/api/users/me/bookmarks` |
| 저장 목록 조회 요청 파라미터 | `cursor`, `limit=12` |

##### d. 동작 규칙

- `createBookmark()`
  - `POST /api/posts/{postId}/bookmarks`로 요청을 전송한다.
  - 서버 응답은 <a href="#type-save-mutation-api-response"><code>SaveMutationApiResponse</code></a> 형태로 반환한다.
- `deleteBookmark()`
  - `DELETE /api/posts/{postId}/bookmarks`로 요청을 전송한다.
  - 서버 응답은 <a href="#type-save-mutation-api-response"><code>SaveMutationApiResponse</code></a> 형태로 반환한다.
- `getSavedPosts()`
  - `cursor`, `limit=12`를 query parameter로 전송한다.
  - `GET /api/users/me/bookmarks`로 요청을 전송한다.
  - 서버 응답은 <a href="#type-saved-posts-api-response"><code>SavedPostsApiResponse</code></a> 형태로 반환한다.

##### e. 반환 규칙

| 상황 | 반환값 |
| --- | --- |
| 저장 또는 저장 취소 성공 | `success: true`, `savedByViewer: boolean` |
| 저장 목록 조회 성공 | `success: true`, <code>data: <a href="#type-saved-posts-page-data">SavedPostsPageData</a></code> |
| 요청 실패 | `success: false`, `message: string` |

### E. 서버

서버는 저장 API와 저장 목록 API를 통해 로그인 사용자 기준 저장 상태와 저장 목록만 반환한다.

#### I. 북마크 API

##### a. API 요약

| 항목 | 내용 |
| --- | --- |
| API 이름 | 북마크 API |
| 메서드 | `POST`, `DELETE` |
| URL | `/api/posts/{postId}/bookmarks` |
| 요청 본문 | 없음 |
| 처리 | 로그인 사용자의 게시물 저장을 생성하거나 취소한다. |
| 응답 | `success`, `savedByViewer` 또는 `message` |

##### b. 요청 본문 예시

없음.

##### c. 응답 예시

###### 1. 성공 응답 예시

```json
{
  "success": true,
  "savedByViewer": true
}
```

###### 2. 실패 응답 예시

```json
{
  "success": false,
  "message": "로그인이 필요합니다."
}
```

###### 3. 서버 에러 응답 예시

```json
{
  "success": false,
  "message": "서버 오류가 발생했습니다."
}
```

#### II. 저장 목록 API

##### a. API 요약

| 항목 | 내용 |
| --- | --- |
| API 이름 | 저장 목록 API |
| 메서드 | `GET` |
| URL | `/api/users/me/bookmarks` |
| 요청 본문 | 없음 |
| 처리 | 로그인 사용자가 저장한 게시물을 `savedAt` 최신순으로 12개씩 반환한다. |
| 응답 | `success`, `data` 또는 `message` |

##### b. 요청 본문 예시

```text
GET /api/users/me/bookmarks?cursor=2026-04-11T12:00:00.000Z_48&limit=12
```

##### c. 응답 예시

###### 1. 성공 응답 예시

```json
{
  "success": true,
  "data": {
    "savedPosts": [
      {
        "id": 48,
        "shortcode": "AbCd1234",
        "thumbnailUrl": "https://example.com/posts/48-thumb.jpg",
        "captionPreview": "주말 기록",
        "savedAt": "2026-04-11T12:00:00.000Z",
        "author": {
          "id": 7,
          "username": "honggildong",
          "name": "홍길동",
          "avatarUrl": "https://example.com/avatar.png"
        }
      }
    ],
    "nextCursor": "2026-04-10T18:00:00.000Z_47",
    "hasNextPage": true
  }
}
```

###### 2. 실패 응답 예시

```json
{
  "success": false,
  "message": "저장한 게시물은 본인만 볼 수 있습니다."
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

저장과 북마크 기능은 인스타그램처럼 눈에 띄지 않지만 즉시 반응하는 저장 아이콘과, 본인 프로필 안에만 감춰진 `Saved` 탭을 기준으로 디자인 문서를 참조한다.

### A. 디자인 참조 문서

| 구분 | 문서 | 역할 |
| --- | --- | --- |
| 전체 디자인 시스템 | [design-system.md](../../layout/design-system.md) | 토큰, 상태, 인터랙션 기본 규칙 |
| 화면 조합 패턴 | [screen-patterns.md](../../layout/design-system/screen-patterns.md) | 피드, 상세, 프로필 탭 전환 패턴 |
| 공통 UI 컴포넌트 | [components-ui.md](../../layout/design-system/components-ui.md) | 아이콘 버튼, 빈 상태, 로딩 UI 규칙 |
| 공통 레이아웃 컴포넌트 | [components-layout.md](../../layout/design-system/components-layout.md) | 프로필 탭과 메인 셸 배치 규칙 |
