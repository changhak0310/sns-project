# 게시글 상세와 반응 명세

## 1. 상태 변수 및 함수 정의

게시글 상세와 반응 기능은 오버레이 또는 단독 상세 화면에서 게시글 정보를 보여주고, 좋아요 토글과 댓글 작성/삭제를 공통 계약으로 사용한다.

### A. 타입 정의

#### I. 공통 타입

<a id="type-post-detail-author"></a>

##### a. `PostDetailAuthor`

```ts
type PostDetailAuthor = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string;
};
```

<a id="type-post-comment-item"></a>

##### b. `PostCommentItem`

```ts
type PostCommentItem = {
  id: number;
  content: string;
  createdAt: string;
  author: PostDetailAuthor;
  canDelete: boolean;
};
```

<a id="type-post-detail"></a>

##### c. `PostDetail`

```ts
type PostDetail = {
  id: number;
  shortcode: string;
  imageUrls: string[];
  caption: string;
  likeCount: number;
  commentCount: number;
  likedByViewer: boolean;
  createdAt: string;
  author: PostDetailAuthor;
  comments: PostCommentItem[];
};
```

### B. 상태 변수 정의

| 변수명 | 타입 | 설명 | 초기값 | 사용 컴포넌트 |
| --- | --- | --- | --- | --- |
| `postDetail` | <a href="#type-post-detail"><code>PostDetail</code></a> \| null | 현재 오버레이 또는 상세 화면에 노출할 게시글 정보 | `null` | `PostDetailPage`, `PostDetailOverlay`, `PostDetailContent`, `PostLikeButton`, `CommentList` |
| `commentInput` | `string` | 사용자가 입력 중인 댓글 내용 | `""` | `PostDetailContent`, `CommentForm` |
| `commentError` | `string` | 댓글 입력 영역의 검증 메시지 | `""` | `PostDetailContent`, `CommentForm` |
| `actionError` | `string` | 상세 조회, 좋아요, 댓글 요청 실패 시 화면에 보여줄 메시지 | `""` | `PostDetailPage`, `PostDetailOverlay`, `PostDetailErrorMessage` |
| `isLoading` | `boolean` | 게시글 상세 조회 진행 여부 | `false` | `PostDetailPage`, `PostDetailOverlay`, `PostDetailContent` |
| `isLiking` | `boolean` | 좋아요 또는 좋아요 취소 요청 진행 여부 | `false` | `PostLikeButton`, `PostDetailContent` |
| `isCommentSubmitting` | `boolean` | 댓글 작성 요청 진행 여부 | `false` | `CommentForm`, `PostDetailContent` |
| `deletingCommentId` | `number \| null` | 현재 삭제 요청 중인 댓글 id | `null` | `CommentList`, `CommentDeleteButton` |

### C. 함수 정의

| 함수명 | 시그니처 | 역할 | 사용 컴포넌트 |
| --- | --- | --- | --- |
| `loadPostDetail()` | `(shortcode: string) => Promise<void>` | 게시글 상세 정보를 조회한다. | `PostDetailPage`, `PostDetailOverlay` |
| `setCommentInput()` | `(value: string) => void` | 댓글 입력값을 변경하고 검증 상태를 갱신한다. | `PostDetailContent`, `CommentForm` |
| `toggleLike()` | `() => Promise<void>` | 좋아요 또는 좋아요 취소 요청을 실행한다. | `PostLikeButton`, `PostDetailContent` |
| `createComment()` | `() => Promise<void>` | 댓글 작성 요청을 실행한다. | `CommentForm`, `PostDetailContent` |
| `deleteComment()` | `(commentId: number) => Promise<void>` | 댓글 삭제 요청을 실행한다. | `CommentList`, `CommentDeleteButton` |
| `resetPostDetailState()` | `() => void` | 게시글 상세 상태와 반응 상태를 초기값으로 되돌린다. | `PostDetailPage`, `PostDetailOverlay` |

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

참조 - [function-md-guide.md](../function-md-guide.md), [layer.md](../../layout/layer.md), [05-home-feed.md](./05-home-feed.md)

### A. 컴포넌트

게시글 상세 기능은 오버레이와 단독 상세 화면에서 같은 상세 콘텐츠를 재사용한다. 홈 피드에서 상세 화면으로 진입한 뒤의 좋아요와 댓글 동작은 이 문서를 기준으로 한다.

#### I. 컴포넌트 구조

```text
PostDetailPage
  -> PostDetailContent
    -> PostLikeButton
    -> CommentList
      -> CommentDeleteButton
    -> CommentForm
    -> PostDetailErrorMessage

PostDetailOverlay
  -> PostDetailContent
    -> PostLikeButton
    -> CommentList
      -> CommentDeleteButton
    -> CommentForm
    -> PostDetailErrorMessage
```

#### II. 컴포넌트 타입

<a id="type-post-detail-route-props"></a>

##### a. `PostDetailRouteProps`

```ts
type PostDetailRouteProps = {
  shortcode: string;
};
```

<a id="type-post-detail-content-props"></a>

##### b. `PostDetailContentProps`

```ts
type PostDetailContentProps = {
  postDetail: PostDetail;
  commentInput: string;
  commentError?: string;
  actionError?: string;
  isLiking: boolean;
  isCommentSubmitting: boolean;
  deletingCommentId: number | null;
  onLike: () => void;
  onCommentChange: (value: string) => void;
  onCommentSubmit: () => void;
  onCommentDelete: (commentId: number) => void;
};
```

<a id="type-post-like-button-props"></a>

##### c. `PostLikeButtonProps`

```ts
type PostLikeButtonProps = {
  likedByViewer: boolean;
  likeCount: number;
  isLoading: boolean;
  onClick: () => void;
};
```

<a id="type-comment-list-props"></a>

##### d. `CommentListProps`

```ts
type CommentListProps = {
  comments: PostCommentItem[];
  deletingCommentId: number | null;
  onDelete: (commentId: number) => void;
};
```

<a id="type-comment-form-props"></a>

##### e. `CommentFormProps`

```ts
type CommentFormProps = {
  value: string;
  fieldErrorMessage?: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};
```

<a id="type-comment-delete-button-props"></a>

##### f. `CommentDeleteButtonProps`

```ts
type CommentDeleteButtonProps = {
  isLoading: boolean;
  onClick: () => void;
};
```

<a id="type-post-detail-error-message-props"></a>

##### g. `PostDetailErrorMessageProps`

```ts
type PostDetailErrorMessageProps = {
  message: string;
};
```

#### III. 컴포넌트 정의

| 컴포넌트명 | 역할 | 사용하는 Hook | 받는 props | 이벤트에서 호출하는 함수 | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `PostDetailPage` | 단독 상세 페이지에서 게시글 정보와 반응 영역을 렌더링한다. | `usePostDetail()` | <a href="#type-post-detail-route-props"><code>PostDetailRouteProps</code></a> | `onMount 또는 onShortcodeChange -> loadPostDetail(shortcode)` | `postDetail`, `actionError`, `isLoading` |
| `PostDetailOverlay` | 홈 피드에서 게시글 클릭 시 오버레이 상세 화면을 렌더링한다. | `usePostDetail()` | <a href="#type-post-detail-route-props"><code>PostDetailRouteProps</code></a> | `onMount 또는 onShortcodeChange -> loadPostDetail(shortcode)` | `postDetail`, `actionError`, `isLoading` |
| `PostDetailContent` | 게시글 이미지, 캡션, 좋아요, 댓글 목록, 댓글 입력을 조합한다. | 없음 | <a href="#type-post-detail-content-props"><code>PostDetailContentProps</code></a> | `PostLikeButton.onClick -> onLike()`<br>`CommentForm.onChange -> onCommentChange(value)`<br>`CommentForm.onSubmit -> onCommentSubmit()`<br>`CommentList.onDelete -> onCommentDelete(commentId)` | 없음 |
| `PostLikeButton` | 단독 상세 화면과 오버레이에서 공통으로 사용하는 좋아요 버튼을 렌더링한다. | 없음 | <a href="#type-post-like-button-props"><code>PostLikeButtonProps</code></a> | `onClick -> toggleLike()` | 없음 |
| `CommentList` | 댓글 목록과 삭제 버튼을 렌더링한다. | 없음 | <a href="#type-comment-list-props"><code>CommentListProps</code></a> | `onDelete -> deleteComment(commentId)` | 없음 |
| `CommentDeleteButton` | 현재 사용자 댓글 삭제 요청을 실행한다. | 없음 | <a href="#type-comment-delete-button-props"><code>CommentDeleteButtonProps</code></a> | `onClick -> deleteComment(commentId)` | 없음 |
| `CommentForm` | 댓글 입력과 등록 요청을 처리한다. | 없음 | <a href="#type-comment-form-props"><code>CommentFormProps</code></a> | `onChange -> setCommentInput(value)`<br>`onSubmit -> createComment()` | 없음 |
| `PostDetailErrorMessage` | 상세 조회 또는 반응 요청 실패 메시지를 출력한다. | 없음 | <a href="#type-post-detail-error-message-props"><code>PostDetailErrorMessageProps</code></a> | 없음 | 없음 |

### B. 훅

훅은 게시글 상세 조회와 좋아요/댓글 반응 흐름을 기능 단위로 나누어 정의한다.

#### I. 훅 타입

<a id="type-post-detail-state"></a>

##### a. `PostDetailState`

```ts
type PostDetailState = {
  postDetail: PostDetail | null;
  commentInput: string;
  commentError: string;
  actionError: string;
  isLoading: boolean;
  isLiking: boolean;
  isCommentSubmitting: boolean;
  deletingCommentId: number | null;
};
```

<a id="type-post-detail-actions"></a>

##### b. `PostDetailActions`

```ts
type PostDetailActions = {
  loadPostDetail: (shortcode: string) => Promise<void>;
  setCommentInput: (value: string) => void;
  toggleLike: () => Promise<void>;
  createComment: () => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;
  resetPostDetailState: () => void;
};
```

<a id="type-use-post-detail-return"></a>

##### c. `UsePostDetailReturn`

```ts
type UsePostDetailReturn = PostDetailState & PostDetailActions;
```

#### II. usePostDetail

##### a. 훅 요약

| 항목 | 내용 |
| --- | --- |
| 훅명 | `usePostDetail()` |
| 역할 | 게시글 상세 UI 상태 관리, 게시글 상세 조회, 좋아요 요청 실행, 댓글 요청 실행, 게시글 반응 상태 갱신, 게시글 상태 초기화 |
| 호출 Service | `postDetailService.getPostDetail(shortcode)`, `postDetailService.toggleLike(postId, likedByViewer)`, `postDetailService.validateComment(commentInput)`, `postDetailService.createComment(postId, content)`, `postDetailService.deleteComment(postId, commentId)` |
| 호출 입력값 | `shortcode` |

##### b. 상태

| 변수 명 | 범위 | 초기 값 | 역할 |
| --- | --- | --- | --- |
| `postDetail` | `public` | `null` | 게시글 상세 UI 상태 관리 |
| `commentInput` | `public` | `""` | 게시글 상세 UI 상태 관리 |
| `commentError` | `public` | `""` | 입력 필드 에러 상태 관리 |
| `actionError` | `public` | `""` | 게시글 결과 상태 관리 |
| `isLoading` | `public` | `false` | 게시글 요청 실행 |
| `isLiking` | `public` | `false` | 게시글 요청 실행 |
| `isCommentSubmitting` | `public` | `false` | 게시글 요청 실행 |
| `deletingCommentId` | `public` | `null` | 게시글 요청 실행 |

##### c. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 service | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `loadPostDetail()` | `public` | `shortcode: string` | `Promise<void>` | <code>postDetailService.getPostDetail(shortcode: string): Promise&lt;<a href="#type-post-detail-result">PostDetailResult</a>&gt;</code> | `postDetail`, `actionError`, `isLoading` |
| `setCommentInput()` | `public` | `value: string` | `void` | <code>postDetailService.validateComment(content: string): boolean</code> | `commentInput`, `commentError`, `actionError` |
| `toggleLike()` | `public` | 없음 | `Promise<void>` | <code>postDetailService.toggleLike(postId: number, likedByViewer: boolean): Promise&lt;<a href="#type-like-mutation-result">LikeMutationResult</a>&gt;</code> | `postDetail`, `actionError`, `isLiking` |
| `createComment()` | `public` | 없음 | `Promise<void>` | <code>postDetailService.createComment(postId: number, content: string): Promise&lt;<a href="#type-comment-mutation-result">CommentMutationResult</a>&gt;</code> | `postDetail`, `commentInput`, `commentError`, `actionError`, `isCommentSubmitting` |
| `deleteComment()` | `public` | `commentId: number` | `Promise<void>` | <code>postDetailService.deleteComment(postId: number, commentId: number): Promise&lt;<a href="#type-delete-comment-result">DeleteCommentResult</a>&gt;</code> | `postDetail`, `actionError`, `deletingCommentId` |
| `resetPostDetailState()` | `public` | 없음 | `void` | 없음 | `postDetail`, `commentInput`, `commentError`, `actionError`, `isLoading`, `isLiking`, `isCommentSubmitting`, `deletingCommentId` |

##### d. 동작 규칙

- `loadPostDetail()`
  - 상세 페이지 또는 오버레이가 마운트되거나 `shortcode`가 변경될 때 `loadPostDetail(shortcode)`를 호출한다.
  - 시작 시 `postDetail = null`, `commentInput = ""`, `commentError = ""`, `isLoading = true`, `actionError = ""`
  - `postDetailService.getPostDetail(shortcode)`를 호출한다.
- `setCommentInput()`
  - `commentInput` 값을 갱신한다.
  - `postDetailService.validateComment(value)`를 호출해 `commentError`를 갱신한다.
  - 이전 반응 요청 에러를 초기화하기 위해 `actionError = ""`로 갱신한다.
- `toggleLike()`
  - `postDetail = null`이면 좋아요 요청을 진행하지 않는다.
  - 시작 시 `isLiking = true`, `actionError = ""`
  - `postDetailService.toggleLike(postDetail.id, postDetail.likedByViewer)`를 호출한다.
- `createComment()`
  - `postDetail = null`이면 댓글 작성 요청을 진행하지 않는다.
  - `postDetailService.validateComment(commentInput)` 결과가 `false`이면 요청을 진행하지 않는다.
  - 시작 시 `isCommentSubmitting = true`, `actionError = ""`
  - `postDetailService.createComment(postDetail.id, commentInput)`을 호출한다.
- `deleteComment()`
  - `postDetail = null`이면 댓글 삭제 요청을 진행하지 않는다.
  - 시작 시 `deletingCommentId = commentId`, `actionError = ""`
  - `postDetailService.deleteComment(postDetail.id, commentId)`를 호출한다.
- `resetPostDetailState()`
  - 게시글 상세 상태와 반응 상태를 모두 초기값으로 되돌린다.

##### e. 상태 갱신 규칙

| 상황 | 상태 갱신 |
| --- | --- |
| 상세 조회 시작 | `postDetail = null`, `commentInput = ""`, `commentError = ""`, `isLoading = true`, `actionError = ""` |
| 상세 조회 성공 | `postDetail = data`, `actionError = ""` |
| 댓글 입력 변경 | `commentInput`, `commentError`, `actionError = ""` |
| 좋아요 성공 | `postDetail.likedByViewer`, `postDetail.likeCount`, `actionError = ""` |
| 댓글 작성 성공 | `postDetail.comments`, `postDetail.commentCount`, `commentInput = ""`, `commentError = ""`, `actionError = ""` |
| 댓글 삭제 성공 | `postDetail.comments`, `postDetail.commentCount`, `actionError = ""` |
| 실패 | `actionError = message` |
| 종료 | `isLoading = false`, `isLiking = false`, `isCommentSubmitting = false`, `deletingCommentId = null` |
| 초기화 | `postDetail = null`, `commentInput = ""`, `commentError = ""`, `actionError = ""`, `isLoading = false`, `isLiking = false`, `isCommentSubmitting = false`, `deletingCommentId = null` |

### C. 서비스

게시글 상세 서비스는 상세 조회, 좋아요 토글, 댓글 작성/삭제 비즈니스 로직을 담당한다.

#### I. 서비스 타입

<a id="type-post-detail-result"></a>

##### a. `PostDetailResult`

```ts
type PostDetailResult =
  | {
      success: true;
      data: PostDetail;
    }
  | {
      success: false;
      message: string;
    };
```

<a id="type-like-mutation-result"></a>

##### b. `LikeMutationResult`

```ts
type LikeMutationResult =
  | {
      success: true;
      likedByViewer: boolean;
      likeCount: number;
    }
  | {
      success: false;
      message: string;
    };
```

<a id="type-comment-mutation-result"></a>

##### c. `CommentMutationResult`

```ts
type CommentMutationResult =
  | {
      success: true;
      data: PostCommentItem;
      commentCount: number;
    }
  | {
      success: false;
      message: string;
    };
```

<a id="type-delete-comment-result"></a>

##### d. `DeleteCommentResult`

```ts
type DeleteCommentResult =
  | {
      success: true;
      deletedCommentId: number;
      commentCount: number;
    }
  | {
      success: false;
      message: string;
    };
```

#### II. `postDetailService`

##### a. 서비스 요약

| 항목 | 내용 |
| --- | --- |
| 서비스명 | `postDetailService` |
| 역할 | 게시글 상세 조회, 좋아요 토글, 댓글 작성/삭제 비즈니스 로직 수행, 레포지토리 호출, 최종 결과 반환 |
| 호출 Repository | `postDetailRepository.getPostDetail(shortcode)`, `postDetailRepository.createLike(postId)`, `postDetailRepository.deleteLike(postId)`, `postDetailRepository.createComment(postId, content)`, `postDetailRepository.deleteComment(postId, commentId)` |

##### b. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 대상 | 실패 메시지 | 역할 |
| --- | --- | --- | --- | --- | --- | --- |
| `getPostDetail()` | `public` | `shortcode: string` | <code>Promise&lt;<a href="#type-post-detail-result">PostDetailResult</a>&gt;</code> | <code>postDetailRepository.getPostDetail(shortcode: string): Promise&lt;<a href="#type-post-detail-api-response">PostDetailApiResponse</a>&gt;</code> | `게시글을 불러오지 못했습니다.`<br>`게시글을 찾을 수 없습니다.` | 게시글 상세 정보를 반환한다. |
| `toggleLike()` | `public` | `postId: number`, `likedByViewer: boolean` | <code>Promise&lt;<a href="#type-like-mutation-result">LikeMutationResult</a>&gt;</code> | <code>postDetailRepository.createLike(postId: number): Promise&lt;<a href="#type-like-api-response">LikeApiResponse</a>&gt;</code><br><code>postDetailRepository.deleteLike(postId: number): Promise&lt;<a href="#type-like-api-response">LikeApiResponse</a>&gt;</code> | `좋아요 처리 중 문제가 발생했습니다.`<br>`로그인이 필요합니다.` | 현재 좋아요 상태에 따라 좋아요 또는 좋아요 취소를 실행한다. |
| `createComment()` | `public` | `postId: number`, `content: string` | <code>Promise&lt;<a href="#type-comment-mutation-result">CommentMutationResult</a>&gt;</code> | <code>postDetailRepository.createComment(postId: number, content: string): Promise&lt;<a href="#type-comment-api-response">CommentApiResponse</a>&gt;</code> | `댓글을 입력해주세요.`<br>`댓글 등록 중 문제가 발생했습니다.` | 댓글 작성 결과를 반환한다. |
| `deleteComment()` | `public` | `postId: number`, `commentId: number` | <code>Promise&lt;<a href="#type-delete-comment-result">DeleteCommentResult</a>&gt;</code> | <code>postDetailRepository.deleteComment(postId: number, commentId: number): Promise&lt;<a href="#type-delete-comment-api-response">DeleteCommentApiResponse</a>&gt;</code> | `댓글 삭제 권한이 없습니다.`<br>`댓글을 찾을 수 없습니다.` | 댓글 삭제 결과를 반환한다. |
| `validateComment()` | `public` | `content: string` | `boolean` | 없음 | `댓글을 입력해주세요.` | 댓글 입력 여부를 검증한다. |

##### c. 동작 규칙

- `getPostDetail()`
  - `postDetailRepository.getPostDetail(shortcode)`를 호출한다.
- `toggleLike()`
  - `likedByViewer = false`이면 `postDetailRepository.createLike(postId)`를 호출한다.
  - `likedByViewer = true`이면 `postDetailRepository.deleteLike(postId)`를 호출한다.
- `createComment()`
  - 시작 시 `validateComment(content)`를 호출한다.
  - 검증이 통과하면 `postDetailRepository.createComment(postId, content)`를 호출한다.
- `deleteComment()`
  - `postDetailRepository.deleteComment(postId, commentId)`를 호출한다.
- `validateComment()`
  - 댓글 값이 비어 있는지 확인한다.
  - 공백만 입력된 값은 유효하지 않다.

##### d. 반환 규칙

- `getPostDetail()`

| 상황 | 반환값 |
| --- | --- |
| 상세 조회 성공 | `success: true`, <code>data: <a href="#type-post-detail">PostDetail</a></code> |
| 상세 조회 실패 | `success: false`, `message: string` |

- `toggleLike()`

| 상황 | 반환값 |
| --- | --- |
| 좋아요 또는 좋아요 취소 성공 | `success: true`, `likedByViewer: boolean`, `likeCount: number` |
| 좋아요 또는 좋아요 취소 실패 | `success: false`, `message: string` |

- `createComment()`

| 상황 | 반환값 |
| --- | --- |
| 댓글 작성 성공 | `success: true`, <code>data: <a href="#type-post-comment-item">PostCommentItem</a></code>, `commentCount: number` |
| 댓글 작성 실패 | `success: false`, `message: string` |

- `deleteComment()`

| 상황 | 반환값 |
| --- | --- |
| 댓글 삭제 성공 | `success: true`, `deletedCommentId: number`, `commentCount: number` |
| 댓글 삭제 실패 | `success: false`, `message: string` |

- `validateComment()`

| 상황 | 반환값 |
| --- | --- |
| 댓글 누락 | `false` |
| 댓글 값 존재 | `true` |

### D. 레포지토리

레포지토리는 게시글 상세 조회와 좋아요/댓글 API 요청, 응답 처리만 담당한다.

#### I. API 타입

<a id="type-post-detail-api-response"></a>

##### a. `PostDetailApiResponse`

```ts
type PostDetailApiResponse = PostDetailResult;
```

<a id="type-like-api-response"></a>

##### b. `LikeApiResponse`

```ts
type LikeApiResponse = LikeMutationResult;
```

<a id="type-comment-api-response"></a>

##### c. `CommentApiResponse`

```ts
type CommentApiResponse = CommentMutationResult;
```

<a id="type-delete-comment-api-response"></a>

##### d. `DeleteCommentApiResponse`

```ts
type DeleteCommentApiResponse = DeleteCommentResult;
```

#### II. `postDetailRepository`

##### a. 레포지토리 요약

| 항목 | 내용 |
| --- | --- |
| 레포지토리명 | `postDetailRepository` |
| 역할 | API 요청 전송, 서버 응답 수신, 응답 데이터를 서비스 계층에 전달 |
| 호출 API | `GET /api/posts/shortcodes/{shortcode}`, `POST /api/posts/{postId}/likes`, `DELETE /api/posts/{postId}/likes`, `POST /api/posts/{postId}/comments`, `DELETE /api/posts/{postId}/comments/{commentId}` |

##### b. 함수

| 함수 명 | 받는 props | return 값 | 호출하는 API | 역할 |
| --- | --- | --- | --- | --- |
| `getPostDetail()` | `shortcode: string` | <code>Promise&lt;<a href="#type-post-detail-api-response">PostDetailApiResponse</a>&gt;</code> | `GET /api/posts/shortcodes/{shortcode}` | 게시글 상세 조회 API 요청 후 응답 결과를 반환한다. |
| `createLike()` | `postId: number` | <code>Promise&lt;<a href="#type-like-api-response">LikeApiResponse</a>&gt;</code> | `POST /api/posts/{postId}/likes` | 좋아요 API 요청 후 응답 결과를 반환한다. |
| `deleteLike()` | `postId: number` | <code>Promise&lt;<a href="#type-like-api-response">LikeApiResponse</a>&gt;</code> | `DELETE /api/posts/{postId}/likes` | 좋아요 취소 API 요청 후 응답 결과를 반환한다. |
| `createComment()` | `postId: number`, `content: string` | <code>Promise&lt;<a href="#type-comment-api-response">CommentApiResponse</a>&gt;</code> | `POST /api/posts/{postId}/comments` | 댓글 작성 API 요청 후 응답 결과를 반환한다. |
| `deleteComment()` | `postId: number`, `commentId: number` | <code>Promise&lt;<a href="#type-delete-comment-api-response">DeleteCommentApiResponse</a>&gt;</code> | `DELETE /api/posts/{postId}/comments/{commentId}` | 댓글 삭제 API 요청 후 응답 결과를 반환한다. |

##### c. 요청 규칙

| 항목 | 내용 |
| --- | --- |
| 게시글 상세 Method | `GET` |
| 게시글 상세 URL | `/api/posts/shortcodes/{shortcode}` |
| 좋아요 생성 Method | `POST` |
| 좋아요 생성 URL | `/api/posts/{postId}/likes` |
| 좋아요 취소 Method | `DELETE` |
| 좋아요 취소 URL | `/api/posts/{postId}/likes` |
| 댓글 생성 Method | `POST` |
| 댓글 생성 URL | `/api/posts/{postId}/comments` |
| 댓글 삭제 Method | `DELETE` |
| 댓글 삭제 URL | `/api/posts/{postId}/comments/{commentId}` |

##### d. 동작 규칙

- `getPostDetail()`
  - `GET /api/posts/shortcodes/{shortcode}`로 요청을 전송한다.
  - 서버 응답을 <a href="#type-post-detail-api-response"><code>PostDetailApiResponse</code></a> 형태로 반환한다.
- `createLike()`
  - `POST /api/posts/{postId}/likes`로 요청을 전송한다.
  - 서버 응답을 <a href="#type-like-api-response"><code>LikeApiResponse</code></a> 형태로 반환한다.
- `deleteLike()`
  - `DELETE /api/posts/{postId}/likes`로 요청을 전송한다.
  - 서버 응답을 <a href="#type-like-api-response"><code>LikeApiResponse</code></a> 형태로 반환한다.
- `createComment()`
  - `content`를 요청 본문에 담아 `POST /api/posts/{postId}/comments`로 요청을 전송한다.
  - 서버 응답을 <a href="#type-comment-api-response"><code>CommentApiResponse</code></a> 형태로 반환한다.
- `deleteComment()`
  - `DELETE /api/posts/{postId}/comments/{commentId}`로 요청을 전송한다.
  - 서버 응답을 <a href="#type-delete-comment-api-response"><code>DeleteCommentApiResponse</code></a> 형태로 반환한다.

##### e. 반환 규칙

| 상황 | 반환값 |
| --- | --- |
| 상세 조회 성공 | `success: true`, <code>data: <a href="#type-post-detail">PostDetail</a></code> |
| 좋아요 또는 좋아요 취소 성공 | `success: true`, `likedByViewer: boolean`, `likeCount: number` |
| 댓글 작성 성공 | `success: true`, <code>data: <a href="#type-post-comment-item">PostCommentItem</a></code>, `commentCount: number` |
| 댓글 삭제 성공 | `success: true`, `deletedCommentId: number`, `commentCount: number` |
| 요청 실패 | `success: false`, `message: string` |

### E. 서버

#### I. 게시글 상세 API

##### a. API 요약

| 항목 | 내용 |
| --- | --- |
| API 이름 | 게시글 상세 API |
| Method | `GET` |
| URL | `/api/posts/shortcodes/{shortcode}` |
| 요청 본문 | 없음 |
| 처리 | 게시글 상세 정보와 좋아요 상태, 댓글 목록을 함께 반환한다. |
| Response | `success`, `data` 또는 `message` |

##### b. 요청 본문 예시

```text
GET /api/posts/shortcodes/AbCd1234
```

##### c. 응답 예시

###### 1. 성공 응답 예시

```json
{
  "success": true,
  "data": {
    "id": 1,
    "shortcode": "AbCd1234",
    "imageUrls": [
      "https://example.com/posts/1-1.jpg"
    ],
    "caption": "오늘 찍은 사진",
    "likeCount": 12,
    "commentCount": 2,
    "likedByViewer": true,
    "createdAt": "2026-04-11T12:00:00.000Z",
    "author": {
      "id": 7,
      "username": "honggildong",
      "name": "홍길동",
      "avatarUrl": "https://example.com/avatar.png"
    },
    "comments": [
      {
        "id": 10,
        "content": "좋아요",
        "createdAt": "2026-04-11T12:10:00.000Z",
        "author": {
          "id": 8,
          "username": "kim",
          "name": "김철수",
          "avatarUrl": "https://example.com/avatar2.png"
        },
        "canDelete": false
      }
    ]
  }
}
```

###### 2. 실패 응답 예시

```json
{
  "success": false,
  "message": "게시글을 찾을 수 없습니다."
}
```

###### 3. 서버 에러 응답 예시

```json
{
  "success": false,
  "message": "서버 오류가 발생했습니다."
}
```

#### II. 좋아요 API

##### a. API 요약

| 항목 | 내용 |
| --- | --- |
| API 이름 | 좋아요 API |
| Method | `POST`, `DELETE` |
| URL | `/api/posts/{postId}/likes` |
| 요청 본문 | 없음 |
| 처리 | 게시글 좋아요를 생성하거나 취소한다. |
| Response | `success`, `likedByViewer`, `likeCount` 또는 `message` |

##### b. 요청 본문 예시

```text
POST /api/posts/1/likes
DELETE /api/posts/1/likes
```

##### c. 응답 예시

###### 1. 성공 응답 예시

```json
{
  "success": true,
  "likedByViewer": true,
  "likeCount": 13
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

#### III. 댓글 생성 API

##### a. API 요약

| 항목 | 내용 |
| --- | --- |
| API 이름 | 댓글 생성 API |
| Method | `POST` |
| URL | `/api/posts/{postId}/comments` |
| 요청 본문 | `content` |
| 처리 | 게시글에 새 댓글을 등록한다. |
| Response | `success`, `data`, `commentCount` 또는 `message` |

##### b. 요청 본문 예시

```json
{
  "content": "댓글 남깁니다."
}
```

##### c. 응답 예시

###### 1. 성공 응답 예시

```json
{
  "success": true,
  "data": {
    "id": 22,
    "content": "댓글 남깁니다.",
    "createdAt": "2026-04-11T12:20:00.000Z",
    "author": {
      "id": 7,
      "username": "honggildong",
      "name": "홍길동",
      "avatarUrl": "https://example.com/avatar.png"
    },
    "canDelete": true
  },
  "commentCount": 3
}
```

###### 2. 실패 응답 예시

```json
{
  "success": false,
  "message": "댓글을 입력해주세요."
}
```

###### 3. 서버 에러 응답 예시

```json
{
  "success": false,
  "message": "서버 오류가 발생했습니다."
}
```

#### IV. 댓글 삭제 API

##### a. API 요약

| 항목 | 내용 |
| --- | --- |
| API 이름 | 댓글 삭제 API |
| Method | `DELETE` |
| URL | `/api/posts/{postId}/comments/{commentId}` |
| 요청 본문 | 없음 |
| 처리 | 현재 사용자가 작성한 댓글을 삭제한다. |
| Response | `success`, `deletedCommentId`, `commentCount` 또는 `message` |

##### b. 요청 본문 예시

```text
DELETE /api/posts/1/comments/22
```

##### c. 응답 예시

###### 1. 성공 응답 예시

```json
{
  "success": true,
  "deletedCommentId": 22,
  "commentCount": 2
}
```

###### 2. 실패 응답 예시

```json
{
  "success": false,
  "message": "댓글 삭제 권한이 없습니다."
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

게시글 상세와 반응 기능의 상세 UI 규칙은 공통 카드, 액션 버튼, 오버레이 레이아웃 문서를 참조한다.

### A. 디자인 참조 문서

| 구분 | 문서 | 역할 |
| --- | --- | --- |
| 전체 디자인 시스템 | [design-system.md](../../layout/design-system.md) | 토큰, 무드, 상태, 레이아웃 기준 |
| 화면 조합 패턴 | [screen-patterns.md](../../layout/design-system/screen-patterns.md) | 오버레이와 단독 상세 화면 패턴 기준 |
| 공통 UI 컴포넌트 | [components-ui.md](../../layout/design-system/components-ui.md) | 버튼, 댓글 입력, 에러 메시지 등 공통 UI 기준 |
| 공통 레이아웃 컴포넌트 | [components-layout.md](../../layout/design-system/components-layout.md) | 상세 오버레이와 셸 배치 기준 |
