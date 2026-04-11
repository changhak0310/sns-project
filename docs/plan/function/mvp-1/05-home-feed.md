# 홈 피드 명세

## 1. 상태 변수 및 함수 정의

홈 피드 기능은 최신 게시글 목록을 화면에 출력하고, 무한 스크롤로 추가 게시글을 요청하는 흐름을 공통 계약으로 사용한다.

### A. 타입 정의

#### I. 공통 타입

<a id="type-feed-author"></a>

##### a. `FeedAuthor`

```ts
type FeedAuthor = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string;
};
```

<a id="type-feed-post-summary"></a>

##### b. `FeedPostSummary`

```ts
type FeedPostSummary = {
  id: number;
  shortcode: string;
  thumbnailUrl: string;
  captionPreview: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  author: FeedAuthor;
};
```

<a id="type-home-feed-page-data"></a>

##### c. `HomeFeedPageData`

```ts
type HomeFeedPageData = {
  posts: FeedPostSummary[];
  nextCursor: string | null;
  hasNextPage: boolean;
};
```

### B. 상태 변수 정의

| 변수명 | 타입 | 설명 | 초기값 | 사용 컴포넌트 |
| --- | --- | --- | --- | --- |
| `feedPosts` | <a href="#type-feed-post-summary"><code>FeedPostSummary</code></a>[] | 홈 피드에 노출할 최신 게시글 목록 | `[]` | `HomeFeedPage`, `HomeFeedList`, `FeedPostCard` |
| `nextCursor` | `string \| null` | 다음 피드 페이지를 요청할 기준 커서 | `null` | `HomeFeedPage`, `FeedInfiniteTrigger` |
| `hasNextPage` | `boolean` | 추가 게시글 요청 가능 여부 | `true` | `HomeFeedPage`, `FeedInfiniteTrigger` |
| `feedError` | `string` | 홈 피드 요청 실패 시 화면에 보여줄 메시지 | `""` | `HomeFeedPage`, `FeedErrorMessage` |
| `isLoading` | `boolean` | 첫 피드 요청 진행 여부 | `false` | `HomeFeedPage`, `HomeFeedList` |
| `isFetchingMore` | `boolean` | 무한 스크롤 추가 요청 진행 여부 | `false` | `HomeFeedPage`, `FeedInfiniteTrigger` |

### C. 함수 정의

| 함수명 | 시그니처 | 역할 | 사용 컴포넌트 |
| --- | --- | --- | --- |
| `loadInitialPosts()` | `() => Promise<void>` | 최신 게시글 기준으로 첫 홈 피드 목록을 요청한다. | `HomeFeedPage` |
| `loadMorePosts()` | `() => Promise<void>` | 다음 커서 기준으로 추가 게시글을 요청해 무한 스크롤을 구현한다. | `HomeFeedPage`, `FeedInfiniteTrigger` |
| `resetHomeFeedState()` | `() => void` | 홈 피드 상태를 초기값으로 되돌린다. | `HomeFeedPage` |

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

홈 피드 기능은 게시글 목록 출력과 상세 페이지 이동까지만 소유한다. 게시글 상세 동작은 [06-post-detail-engagement.md](./06-post-detail-engagement.md)를 기준으로 한다.

#### I. 컴포넌트 구조

```text
HomeFeedPage
  -> HomeFeedList
    -> FeedPostCard
    -> FeedInfiniteTrigger
    -> FeedErrorMessage
    -> FeedEmptyState
```

#### II. 컴포넌트 타입

<a id="type-home-feed-list-props"></a>

##### a. `HomeFeedListProps`

```ts
type HomeFeedListProps = {
  posts: FeedPostSummary[];
  isLoading: boolean;
};
```

<a id="type-feed-post-card-props"></a>

##### b. `FeedPostCardProps`

```ts
type FeedPostCardProps = {
  post: FeedPostSummary;
  href: string;
};
```

<a id="type-feed-infinite-trigger-props"></a>

##### c. `FeedInfiniteTriggerProps`

```ts
type FeedInfiniteTriggerProps = {
  hasNextPage: boolean;
  isFetchingMore: boolean;
  onVisible: () => void;
};
```

<a id="type-feed-error-message-props"></a>

##### d. `FeedErrorMessageProps`

```ts
type FeedErrorMessageProps = {
  message: string;
};
```

<a id="type-feed-empty-state-props"></a>

##### e. `FeedEmptyStateProps`

```ts
type FeedEmptyStateProps = {
  title: string;
  description: string;
};
```

#### III. 컴포넌트 정의

| 컴포넌트명 | 역할 | 사용하는 Hook | 받는 props | 이벤트에서 호출하는 함수 | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `HomeFeedPage` | 홈 피드 초기 목록 조회와 무한 스크롤 흐름을 관리한다. | `useHomeFeed()` | 없음 | `onMount -> loadInitialPosts()`<br>`onUnmount -> resetHomeFeedState()` | `feedPosts`, `nextCursor`, `hasNextPage`, `feedError`, `isLoading`, `isFetchingMore` |
| `HomeFeedList` | 최신순 게시글 목록을 렌더링한다. | 없음 | <a href="#type-home-feed-list-props"><code>HomeFeedListProps</code></a> | 없음 | `feedPosts`, `isLoading` |
| `FeedPostCard` | 피드 게시글 요약 카드와 상세 페이지 이동 링크를 렌더링한다. | 없음 | <a href="#type-feed-post-card-props"><code>FeedPostCardProps</code></a> | 없음 | `feedPosts` |
| `FeedInfiniteTrigger` | 스크롤 하단 도달 시 추가 게시글 요청을 실행한다. | 없음 | <a href="#type-feed-infinite-trigger-props"><code>FeedInfiniteTriggerProps</code></a> | `onVisible -> loadMorePosts()` | `hasNextPage`, `isFetchingMore`, `nextCursor` |
| `FeedErrorMessage` | 홈 피드 요청 실패 메시지를 출력한다. | 없음 | <a href="#type-feed-error-message-props"><code>FeedErrorMessageProps</code></a> | 없음 | `feedError` |
| `FeedEmptyState` | 게시글이 없을 때 빈 상태를 출력한다. | 없음 | <a href="#type-feed-empty-state-props"><code>FeedEmptyStateProps</code></a> | 없음 | `feedPosts` |

### B. 훅

훅은 홈 피드 초기 조회와 추가 조회 흐름을 기능 단위로 나누어 정의한다.

#### I. 훅 타입

<a id="type-home-feed-state"></a>

##### a. `HomeFeedState`

```ts
type HomeFeedState = {
  feedPosts: FeedPostSummary[];
  nextCursor: string | null;
  hasNextPage: boolean;
  feedError: string;
  isLoading: boolean;
  isFetchingMore: boolean;
};
```

<a id="type-home-feed-actions"></a>

##### b. `HomeFeedActions`

```ts
type HomeFeedActions = {
  loadInitialPosts: () => Promise<void>;
  loadMorePosts: () => Promise<void>;
  resetHomeFeedState: () => void;
};
```

<a id="type-use-home-feed-return"></a>

##### c. `UseHomeFeedReturn`

```ts
type UseHomeFeedReturn = HomeFeedState & HomeFeedActions;
```

#### II. useHomeFeed

##### a. 훅 요약

| 항목 | 내용 |
| --- | --- |
| 훅명 | `useHomeFeed()` |
| 역할 | 홈 피드 UI 상태 관리, 최신 게시글 초기 조회, 무한 스크롤 추가 조회, 홈 피드 상태 초기화 |
| 호출 Service | `homeFeedService.getHomeFeed(cursor, limit)` |

##### b. 상태

| 변수 명 | 범위 | 초기 값 | 역할 |
| --- | --- | --- | --- |
| `feedPosts` | `public` | `[]` | 홈 피드 UI 상태 관리 |
| `nextCursor` | `public` | `null` | 홈 피드 추가 조회 상태 관리 |
| `hasNextPage` | `public` | `true` | 홈 피드 추가 조회 상태 관리 |
| `feedError` | `public` | `""` | 홈 피드 결과 상태 관리 |
| `isLoading` | `public` | `false` | 홈 피드 요청 실행 |
| `isFetchingMore` | `public` | `false` | 홈 피드 요청 실행 |

##### c. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 service | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `loadInitialPosts()` | `public` | 없음 | `Promise<void>` | <code>homeFeedService.getHomeFeed(cursor: null, limit: number): Promise&lt;<a href="#type-home-feed-result">HomeFeedResult</a>&gt;</code> | `feedPosts`, `nextCursor`, `hasNextPage`, `feedError`, `isLoading` |
| `loadMorePosts()` | `public` | 없음 | `Promise<void>` | <code>homeFeedService.getHomeFeed(cursor: string \| null, limit: number): Promise&lt;<a href="#type-home-feed-result">HomeFeedResult</a>&gt;</code> | `feedPosts`, `nextCursor`, `hasNextPage`, `feedError`, `isFetchingMore` |
| `resetHomeFeedState()` | `public` | 없음 | `void` | 없음 | `feedPosts`, `nextCursor`, `hasNextPage`, `feedError`, `isLoading`, `isFetchingMore` |

##### d. 동작 규칙

- `loadInitialPosts()`
  - 시작 시 `isLoading = true`, `feedError = ""`
  - 최신 게시글 기준으로 `homeFeedService.getHomeFeed(null, 10)`을 호출한다.
  - 성공 시 첫 게시글 목록과 다음 커서를 갱신한다.
- `loadMorePosts()`
  - `hasNextPage = false`이면 추가 요청을 진행하지 않는다.
  - `nextCursor = null`이면 추가 요청을 진행하지 않는다.
  - `isFetchingMore = true`이면 중복 요청을 진행하지 않는다.
  - 시작 시 `isFetchingMore = true`
  - `homeFeedService.getHomeFeed(nextCursor, 10)`을 호출해 다음 게시글 목록을 추가한다.
- `resetHomeFeedState()`
  - 홈 피드 상태를 모두 초기값으로 되돌린다.

##### e. 상태 갱신 규칙

| 상황 | 상태 갱신 |
| --- | --- |
| 초기 조회 시작 | `isLoading = true`, `feedError = ""` |
| 초기 조회 성공 | `feedPosts = data.posts`, `nextCursor = data.nextCursor`, `hasNextPage = data.hasNextPage` |
| 추가 조회 시작 | `isFetchingMore = true` |
| 추가 조회 성공 | `feedPosts = [...feedPosts, ...data.posts]`, `nextCursor = data.nextCursor`, `hasNextPage = data.hasNextPage` |
| 실패 | `feedError = message` |
| 종료 | `isLoading = false`, `isFetchingMore = false` |
| 초기화 | `feedPosts = []`, `nextCursor = null`, `hasNextPage = true`, `feedError = ""`, `isLoading = false`, `isFetchingMore = false` |

### C. 서비스

홈 피드 서비스는 최신 게시글 조회와 페이징 규칙을 담당한다.

#### I. 서비스 타입

<a id="type-home-feed-result"></a>

##### a. `HomeFeedResult`

```ts
type HomeFeedResult =
  | {
      success: true;
      data: HomeFeedPageData;
    }
  | {
      success: false;
      message: string;
    };
```

#### II. `homeFeedService`

##### a. 서비스 요약

| 항목 | 내용 |
| --- | --- |
| 서비스명 | `homeFeedService` |
| 역할 | 홈 피드 조회 비즈니스 로직 수행, 최신순 정렬 기준 유지, 레포지토리 호출, 최종 결과 반환 |
| 호출 Repository | `feedRepository.getHomeFeed(cursor, limit)` |

##### b. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 대상 | 실패 메시지 | 역할 |
| --- | --- | --- | --- | --- | --- | --- |
| `getHomeFeed()` | `public` | `cursor: string \| null`, `limit: number` | <code>Promise&lt;<a href="#type-home-feed-result">HomeFeedResult</a>&gt;</code> | <code>feedRepository.getHomeFeed(cursor: string \| null, limit: number): Promise&lt;<a href="#type-home-feed-api-response">HomeFeedApiResponse</a>&gt;</code> | `홈 피드를 불러오지 못했습니다.`<br>`서버 오류가 발생했습니다.`<br>`네트워크 오류가 발생했습니다. 다시 시도해주세요.` | 최신순 홈 피드 목록과 다음 페이지 정보를 반환한다. |

##### c. 동작 규칙

- `getHomeFeed()`
  - `cursor`와 `limit`를 기준으로 `feedRepository.getHomeFeed(cursor, limit)`를 호출한다.
  - 레포지토리 응답을 최신 게시글 기준 목록으로 해석한다.
  - 한 번의 요청에서 기본적으로 10개의 게시글을 반환한다.
  - 다음 페이지가 있으면 `nextCursor`와 `hasNextPage = true`를 반환한다.
  - 더 이상 게시글이 없으면 `nextCursor = null`, `hasNextPage = false`를 반환한다.

##### d. 반환 규칙

- `getHomeFeed()`

| 상황 | 반환값 |
| --- | --- |
| 피드 조회 성공 | `success: true`, <code>data: <a href="#type-home-feed-page-data">HomeFeedPageData</a></code> |
| 피드 조회 실패 | `success: false`, `message: string` |

### D. 레포지토리

레포지토리는 홈 피드 조회 API 요청과 응답 처리만 담당한다.

#### I. API 타입

<a id="type-home-feed-api-response"></a>

##### a. `HomeFeedApiResponse`

```ts
type HomeFeedApiResponse = HomeFeedResult;
```

#### II. `feedRepository`

##### a. 레포지토리 요약

| 항목 | 내용 |
| --- | --- |
| 레포지토리명 | `feedRepository` |
| 역할 | API 요청 전송, 서버 응답 수신, 응답 데이터를 서비스 계층에 전달 |
| 호출 API | `GET /api/feed?cursor={cursor}&limit=10&sort=latest` |

##### b. 함수

| 함수 명 | 받는 props | return 값 | 호출하는 API | 역할 |
| --- | --- | --- | --- | --- |
| `getHomeFeed()` | `cursor: string \| null`, `limit: number` | <code>Promise&lt;<a href="#type-home-feed-api-response">HomeFeedApiResponse</a>&gt;</code> | `GET /api/feed?cursor={cursor}&limit=10&sort=latest` | 홈 피드 조회 API 요청 후 응답 결과를 반환한다. |

##### c. 요청 규칙

| 항목 | 내용 |
| --- | --- |
| Method | `GET` |
| URL | `/api/feed` |
| 요청 파라미터 | `cursor`, `limit`, `sort=latest` |
| 기본 limit | `10` |

##### d. 동작 규칙

- `getHomeFeed()`
  - `cursor`, `limit`, `sort=latest`를 query parameter로 전송한다.
  - `GET /api/feed`로 요청을 전송한다.
  - 서버 응답을 <a href="#type-home-feed-api-response"><code>HomeFeedApiResponse</code></a> 형태로 반환한다.

##### e. 반환 규칙

| 상황 | 반환값 |
| --- | --- |
| 피드 조회 성공 | `success: true`, <code>data: <a href="#type-home-feed-page-data">HomeFeedPageData</a></code> |
| 피드 조회 실패 | `success: false`, `message: string` |

### E. 서버

#### I. 홈 피드 API

##### a. API 요약

| 항목 | 내용 |
| --- | --- |
| API 이름 | 홈 피드 API |
| Method | `GET` |
| URL | `/api/feed` |
| 요청 본문 | 없음 |
| 처리 | 최신 게시글을 기준으로 홈 피드 목록을 10개씩 반환하고, 다음 페이지 커서를 함께 반환한다. |
| Response | `success`, `data` 또는 `message` |

##### b. 요청 본문 예시

```text
GET /api/feed?cursor=2026-04-11T12:00:00.000Z_120&limit=10&sort=latest
```

##### c. 응답 예시

###### 1. 성공 응답 예시

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 120,
        "shortcode": "AbCd1234",
        "thumbnailUrl": "https://example.com/posts/120-thumb.jpg",
        "captionPreview": "오늘 찍은 사진",
        "likeCount": 24,
        "commentCount": 3,
        "createdAt": "2026-04-11T12:00:00.000Z",
        "author": {
          "id": 7,
          "username": "honggildong",
          "name": "홍길동",
          "avatarUrl": "https://example.com/avatar.png"
        }
      }
    ],
    "nextCursor": "2026-04-11T11:30:00.000Z_119",
    "hasNextPage": true
  }
}
```

###### 2. 실패 응답 예시

```json
{
  "success": false,
  "message": "홈 피드를 불러오지 못했습니다."
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

홈 피드 기능의 상세 UI 규칙은 공통 레이아웃과 공통 카드/스크롤 패턴 문서를 참조한다.

### A. 디자인 참조 문서

| 구분 | 문서 | 역할 |
| --- | --- | --- |
| 전체 디자인 시스템 | [design-system.md](../../layout/design-system.md) | 토큰, 무드, 상태, 레이아웃 기준 |
| 화면 조합 패턴 | [screen-patterns.md](../../layout/design-system/screen-patterns.md) | 피드 화면과 목록 배치 패턴 기준 |
| 공통 UI 컴포넌트 | [components-ui.md](../../layout/design-system/components-ui.md) | 카드, 버튼, 로딩 UI 등 공통 UI 기준 |
| 공통 레이아웃 컴포넌트 | [components-layout.md](../../layout/design-system/components-layout.md) | 상단 헤더와 셸 레이아웃 기준 |
