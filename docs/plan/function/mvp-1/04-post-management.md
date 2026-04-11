# 게시글 작성/수정/삭제 명세

## 1. 상태 변수 및 함수 정의

게시글 작성/수정 기능은 이미지와 캡션 입력을 폼 상태로 관리하고, 게시글 카드의 `...` 액션 메뉴는 별도 상태로 수정 이동과 삭제를 처리한다.

### A. 타입 정의

#### I. 공통 타입

<a id="type-post-composer-mode"></a>

##### a. `PostComposerMode`

```ts
type PostComposerMode = "create" | "edit";
```

<a id="type-post-image-input"></a>

##### b. `PostImageInput`

```ts
type PostImageInput = {
  file: File | null;
  previewUrl: string;
  source: "local" | "remote";
};
```

<a id="type-post"></a>

##### c. `Post`

```ts
type Post = {
  id: number;
  shortcode: string;
  caption: string;
  imageUrls: string[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
};
```

### B. 상태 변수 정의

| 변수명 | 타입 | 설명 | 초기값 | 사용 컴포넌트 |
| --- | --- | --- | --- | --- |
| `images` | <a href="#type-post-image-input"><code>PostImageInput</code></a>[] | 작성 화면에서는 새로 선택한 이미지, 수정 화면에서는 기존 이미지와 새 이미지를 함께 관리한다 | `[]` 또는 `initialPost.imageUrls` 변환값 | `PostComposerForm`, `PostImagePicker`, `PostPreview` |
| `caption` | `string` | 사용자가 입력한 게시글 내용 | `""` | `PostComposerForm`, `CaptionInput`, `PostPreview` |
| `imagesError` | `string` | 이미지 입력 영역의 검증 메시지 | `""` | `PostComposerForm`, `PostImagePicker` |
| `captionError` | `string` | 캡션 입력 영역의 검증 메시지 | `""` | `PostComposerForm`, `CaptionInput` |
| `formError` | `string` | 게시글 생성/수정 요청 실패 시 폼 영역에 보여줄 메시지 | `""` | `PostComposerForm`, `PostFormErrorMessage` |
| `isFormValid` | `boolean` | 이미지와 캡션이 모두 유효한지 여부 | `false` | `PostComposerForm`, `CreatePostSubmitButton`, `EditPostSubmitButton` |
| `isLoading` | `boolean` | 게시글 생성/수정 요청 진행 여부 | `false` | `PostComposerForm`, `CreatePostSubmitButton`, `EditPostSubmitButton` |
| `editingPostId` | `number \| null` | 수정 모드일 때 수정 대상 게시글 ID | `initialPost?.id ?? null` | `PostComposerForm`, `EditPostSubmitButton` |
| `savedPost` | <a href="#type-post"><code>Post</code></a> \| null | 게시글 생성 또는 수정 성공 후 저장할 게시글 정보 | `null` | `PostComposerForm` |
| `isActionMenuOpen` | `boolean` | 게시글 카드의 `...` 액션 메뉴 열림 여부 | `false` | `PostActionMenu` |
| `actionMenuError` | `string` | 게시글 삭제 요청 실패 시 액션 메뉴에 보여줄 메시지 | `""` | `PostActionMenu`, `PostActionErrorMessage` |
| `isDeleting` | `boolean` | 게시글 삭제 요청 진행 여부 | `false` | `PostActionMenu`, `DeletePostButton` |

### C. 함수 정의

| 함수명 | 시그니처 | 역할 | 사용 컴포넌트 |
| --- | --- | --- | --- |
| `setImages()` | `(images: PostImageInput[]) => void` | 이미지 목록을 변경하고 검증과 이전 게시글 결과 상태 초기화를 실행한다. | `PostComposerForm`, `PostImagePicker` |
| `setCaption()` | `(value: string) => void` | 캡션 입력값을 변경하고 검증과 이전 게시글 결과 상태 초기화를 실행한다. | `PostComposerForm`, `CaptionInput` |
| `createPost()` | `() => Promise<void>` | 새 게시글 생성 요청을 실행한다. | `PostComposerForm`, `CreatePostSubmitButton` |
| `updatePost()` | `() => Promise<void>` | 수정 모드에서 기존 게시글 수정 요청을 실행한다. | `PostComposerForm`, `EditPostSubmitButton` |
| `resetPostComposerState()` | `() => void` | 게시글 작성/수정 폼 상태를 초기값으로 되돌린다. | `PostComposerForm` |
| `openActionMenu()` | `() => void` | 게시글 액션 메뉴를 연다. | `PostActionMenu` |
| `closeActionMenu()` | `() => void` | 게시글 액션 메뉴를 닫는다. | `PostActionMenu` |
| `deletePost()` | `() => Promise<void>` | 현재 액션 메뉴가 연결된 게시글 삭제 요청을 실행한다. | `PostActionMenu`, `DeletePostButton` |

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

참조 - [function-md-guide.md](../function-md-guide.md), [layer.md](../../layout/layer.md)

### A. 컴포넌트

게시글 작성/수정 폼과 게시글 카드의 액션 메뉴는 아래 구조로 고정한다.

#### I. 컴포넌트 구조

```text
CreatePostPage
  -> PostComposerForm
    -> PostImagePicker
    -> CaptionInput
    -> PostPreview
    -> CreatePostSubmitButton
    -> PostFormErrorMessage

EditPostPage
  -> PostComposerForm
    -> PostImagePicker
    -> CaptionInput
    -> PostPreview
    -> EditPostSubmitButton
    -> PostFormErrorMessage

PostCard
  -> PostActionMenu
    -> EditPostLinkButton
    -> DeletePostButton
    -> PostActionErrorMessage
```

#### II. 컴포넌트 타입

<a id="type-post-composer-form-props"></a>

##### a. `PostComposerFormProps`

```ts
type PostComposerFormProps = {
  mode: PostComposerMode;
  initialPost?: Post | null;
};
```

<a id="type-post-image-picker-props"></a>

##### b. `PostImagePickerProps`

```ts
type PostImagePickerProps = {
  images: PostImageInput[];
  maxImages: number;
  fieldErrorMessage?: string;
  disabled?: boolean;
  onChange: (images: PostImageInput[]) => void;
};
```

<a id="type-caption-input-props"></a>

##### c. `CaptionInputProps`

```ts
type CaptionInputProps = {
  value: string;
  fieldErrorMessage?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};
```

<a id="type-post-submit-button-props"></a>

##### d. `PostSubmitButtonProps`

```ts
type PostSubmitButtonProps = {
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
};
```

<a id="type-post-preview-props"></a>

##### e. `PostPreviewProps`

```ts
type PostPreviewProps = {
  images: PostImageInput[];
  caption: string;
};
```

<a id="type-post-action-menu-props"></a>

##### f. `PostActionMenuProps`

```ts
type PostActionMenuProps = {
  postId: number;
  editHref: string;
  canEdit: boolean;
  canDelete: boolean;
};
```

<a id="type-edit-post-link-button-props"></a>

##### g. `EditPostLinkButtonProps`

```ts
type EditPostLinkButtonProps = {
  href: string;
  disabled?: boolean;
};
```

<a id="type-delete-post-button-props"></a>

##### h. `DeletePostButtonProps`

```ts
type DeletePostButtonProps = {
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
};
```

<a id="type-post-form-error-message-props"></a>

##### i. `PostFormErrorMessageProps`

```ts
type PostFormErrorMessageProps = {
  message: string;
};
```

<a id="type-post-action-error-message-props"></a>

##### j. `PostActionErrorMessageProps`

```ts
type PostActionErrorMessageProps = {
  message: string;
};
```

#### III. 컴포넌트 정의

| 컴포넌트명 | 역할 | 사용하는 Hook | 받는 props | 이벤트에서 호출하는 함수 | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `CreatePostPage` | 게시글 작성 화면 진입 페이지 | 없음 | 없음 | 없음 | 없음 |
| `EditPostPage` | 게시글 수정 화면 진입 페이지 | 없음 | 없음 | 없음 | 없음 |
| `PostComposerForm` | 이미지 선택, 캡션 입력, 게시글 생성 또는 수정 요청을 조합한다. | `usePostComposer()` | <a href="#type-post-composer-form-props"><code>PostComposerFormProps</code></a> | `onSubmit -> createPost()` 또는 `updatePost()` | `images`, `caption`, `imagesError`, `captionError`, `formError`, `isFormValid`, `isLoading`, `editingPostId`, `savedPost` |
| `PostImagePicker` | 게시글 이미지 선택, 삭제, 미리보기 목록을 출력한다. 최대 10장까지 선택 가능하다. | 없음 | <a href="#type-post-image-picker-props"><code>PostImagePickerProps</code></a> | `onChange -> setImages(images)` | 없음 |
| `CaptionInput` | 게시글 캡션 입력과 에러 메시지 출력을 담당한다. | 없음 | <a href="#type-caption-input-props"><code>CaptionInputProps</code></a> | `onChange -> setCaption(value)` | 없음 |
| `PostPreview` | 선택한 이미지와 캡션 미리보기를 출력한다. | 없음 | <a href="#type-post-preview-props"><code>PostPreviewProps</code></a> | 없음 | 없음 |
| `CreatePostSubmitButton` | 게시글 생성 버튼을 노출하고, `isFormValid = false` 또는 `isLoading = true`일 때 비활성화한다. | 없음 | <a href="#type-post-submit-button-props"><code>PostSubmitButtonProps</code></a> | `onClick -> createPost()` | 없음 |
| `EditPostSubmitButton` | 게시글 수정 버튼을 노출하고, `isFormValid = false` 또는 `isLoading = true`일 때 비활성화한다. | 없음 | <a href="#type-post-submit-button-props"><code>PostSubmitButtonProps</code></a> | `onClick -> updatePost()` | 없음 |
| `PostActionMenu` | 게시글 카드의 `...` 버튼으로 수정 이동과 삭제 액션을 노출한다. | `usePostActionMenu()` | <a href="#type-post-action-menu-props"><code>PostActionMenuProps</code></a> | `onOpen -> openActionMenu()`<br>`onClose -> closeActionMenu()` | `isActionMenuOpen`, `actionMenuError`, `isDeleting` |
| `EditPostLinkButton` | 게시글 수정 화면으로 이동한다. | 없음 | <a href="#type-edit-post-link-button-props"><code>EditPostLinkButtonProps</code></a> | 없음 | 없음 |
| `DeletePostButton` | 현재 게시글 삭제 요청을 실행한다. | 없음 | <a href="#type-delete-post-button-props"><code>DeletePostButtonProps</code></a> | `onClick -> deletePost()` | 없음 |
| `PostFormErrorMessage` | 게시글 생성/수정 요청 실패 메시지를 출력한다. | 없음 | <a href="#type-post-form-error-message-props"><code>PostFormErrorMessageProps</code></a> | 없음 | 없음 |
| `PostActionErrorMessage` | 게시글 삭제 요청 실패 메시지를 출력한다. | 없음 | <a href="#type-post-action-error-message-props"><code>PostActionErrorMessageProps</code></a> | 없음 | 없음 |

### B. 훅

훅은 게시글 작성/수정 폼과 게시글 카드 액션 메뉴를 분리해서 정의한다.

#### I. 훅 타입

<a id="type-use-post-composer-params"></a>

##### a. `UsePostComposerParams`

```ts
type UsePostComposerParams = {
  mode: PostComposerMode;
  initialPost?: Post | null;
};
```

<a id="type-post-composer-state"></a>

##### b. `PostComposerState`

```ts
type PostComposerState = {
  images: PostImageInput[];
  caption: string;
  imagesError: string;
  captionError: string;
  formError: string;
  isFormValid: boolean;
  isLoading: boolean;
  savedPost: Post | null;
};
```

<a id="type-post-composer-computed"></a>

##### c. `PostComposerComputed`

```ts
type PostComposerComputed = {
  editingPostId: number | null;
};
```

<a id="type-post-composer-actions"></a>

##### d. `PostComposerActions`

```ts
type PostComposerActions = {
  setImages: (images: PostImageInput[]) => void;
  setCaption: (value: string) => void;
  createPost: () => Promise<void>;
  updatePost: () => Promise<void>;
  resetPostComposerState: () => void;
};
```

<a id="type-use-post-composer-return"></a>

##### e. `UsePostComposerReturn`

```ts
type UsePostComposerReturn = PostComposerState & PostComposerComputed & PostComposerActions;
```

<a id="type-use-post-action-menu-params"></a>

##### f. `UsePostActionMenuParams`

```ts
type UsePostActionMenuParams = {
  postId: number;
};
```

<a id="type-post-action-menu-state"></a>

##### g. `PostActionMenuState`

```ts
type PostActionMenuState = {
  isActionMenuOpen: boolean;
  actionMenuError: string;
  isDeleting: boolean;
};
```

<a id="type-post-action-menu-actions"></a>

##### h. `PostActionMenuActions`

```ts
type PostActionMenuActions = {
  openActionMenu: () => void;
  closeActionMenu: () => void;
  deletePost: () => Promise<void>;
};
```

<a id="type-use-post-action-menu-return"></a>

##### i. `UsePostActionMenuReturn`

```ts
type UsePostActionMenuReturn = PostActionMenuState & PostActionMenuActions;
```

#### II. usePostComposer

##### a. 훅 요약

| 항목 | 내용 |
| --- | --- |
| 훅명 | `usePostComposer()` |
| 역할 | 게시글 UI 상태 관리, 입력값 실시간 검증, 게시글 생성/수정 요청 실행, 게시글 결과 상태 관리 |
| 호출 Service | `postManagementService.validateImages(images)`, `postManagementService.validateCaption(caption)`, `postManagementService.createPost(images, caption)`, `postManagementService.updatePost(postId, images, caption)` |
| 내부 입력값 | `mode`, `initialPost` |

##### b. 상태

| 변수 명 | 범위 | 초기 값 | 역할 |
| --- | --- | --- | --- |
| `images` | `public` | `[]` 또는 `initialPost.imageUrls` 변환값 | 게시글 UI 상태 관리 |
| `caption` | `public` | `""` 또는 `initialPost.caption` | 게시글 UI 상태 관리 |
| `imagesError` | `public` | `""` | 입력 필드 에러 상태 관리 |
| `captionError` | `public` | `""` | 입력 필드 에러 상태 관리 |
| `formError` | `public` | `""` | 게시글 결과 상태 관리 |
| `isFormValid` | `public` | `false` | 게시글 버튼 활성화 상태 관리 |
| `isLoading` | `public` | `false` | 게시글 요청 실행 |
| `savedPost` | `public` | `null` | 게시글 결과 상태 관리 |

##### c. 계산값

| 변수 명 | 범위 | 계산 규칙 | 역할 |
| --- | --- | --- | --- |
| `editingPostId` | `public` | `mode = "edit"`이면 `initialPost?.id ?? null`, 아니면 `null` | 수정 대상 게시글 식별 |

##### d. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 service | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `setImages()` | `public` | `images: PostImageInput[]` | `void` | <code>postManagementService.validateImages(images: <a href="#type-post-image-input">PostImageInput</a>[]): boolean</code> | `images`, `imagesError`, `formError`, `isFormValid`, `savedPost` |
| `setCaption()` | `public` | `value: string` | `void` | <code>postManagementService.validateCaption(caption: string): boolean</code> | `caption`, `captionError`, `formError`, `isFormValid`, `savedPost` |
| `createPost()` | `public` | 없음 | `Promise<void>` | <code>postManagementService.createPost(images: <a href="#type-post-image-input">PostImageInput</a>[], caption: string): Promise&lt;<a href="#type-post-mutation-result">PostMutationResult</a>&gt;</code> | `isLoading`, `formError`, `savedPost` |
| `updatePost()` | `public` | 없음 | `Promise<void>` | <code>postManagementService.updatePost(postId: number, images: <a href="#type-post-image-input">PostImageInput</a>[], caption: string): Promise&lt;<a href="#type-post-mutation-result">PostMutationResult</a>&gt;</code> | `isLoading`, `formError`, `savedPost` |
| `resetPostComposerState()` | `public` | 없음 | `void` | 없음 | `images`, `caption`, `imagesError`, `captionError`, `formError`, `isFormValid`, `isLoading`, `savedPost` |

##### e. 동작 규칙

- `usePostComposer()`
  - `mode = "create"`이면 `images = []`, `caption = ""`, `editingPostId = null`로 시작한다.
  - `mode = "edit"`이고 `initialPost`가 있으면 `initialPost.imageUrls`를 `source = "remote"`인 <a href="#type-post-image-input"><code>PostImageInput</code></a>[]으로 변환하고, `caption = initialPost.caption`, `editingPostId = initialPost.id`로 시작한다.
  - `mode = "edit"`이고 초기 이미지와 캡션이 모두 유효하면 `isFormValid = true`로 시작한다.
- `setImages()`
  - `images` 값을 갱신한다.
  - `postManagementService.validateImages(images)`를 호출해 `imagesError`를 갱신한다.
  - 이전 게시글 결과 상태를 초기화하기 위해 `formError = ""`, `savedPost = null`로 갱신한다.
  - `images`와 `caption`이 모두 유효하면 `isFormValid = true`, 아니면 `false`로 유지한다.
- `setCaption()`
  - `caption` 값을 갱신한다.
  - `postManagementService.validateCaption(caption)`를 호출해 `captionError`를 갱신한다.
  - 이전 게시글 결과 상태를 초기화하기 위해 `formError = ""`, `savedPost = null`로 갱신한다.
  - `images`와 `caption`이 모두 유효하면 `isFormValid = true`, 아니면 `false`로 유지한다.
- `createPost()`
  - `mode != "create"`이면 게시글 생성 요청을 진행하지 않는다.
  - `isFormValid = false`이면 게시글 생성 요청을 진행하지 않는다.
  - 시작 시 `isLoading = true`, `formError = ""`, `savedPost = null`
  - 실행 중 `postManagementService.createPost(images, caption)`을 호출한다.
- `updatePost()`
  - `mode != "edit"` 또는 `editingPostId = null`이면 게시글 수정 요청을 진행하지 않는다.
  - `isFormValid = false`이면 게시글 수정 요청을 진행하지 않는다.
  - 시작 시 `isLoading = true`, `formError = ""`, `savedPost = null`
  - 실행 중 `postManagementService.updatePost(editingPostId, images, caption)`을 호출한다.
- `resetPostComposerState()`
  - `mode = "create"`이면 작성 폼을 빈 값으로 초기화한다.
  - `mode = "edit"`이고 `initialPost`가 있으면 수정 폼을 `initialPost` 값으로 되돌린다.

##### f. 상태 갱신 규칙

| 상황 | 상태 갱신 |
| --- | --- |
| 이미지 입력 변경 | `images`, `imagesError`, `formError = ""`, `isFormValid`, `savedPost = null` |
| 캡션 입력 변경 | `caption`, `captionError`, `formError = ""`, `isFormValid`, `savedPost = null` |
| 생성 또는 수정 성공 | `savedPost = data`, `formError = ""` |
| 실패 | `formError = message` |
| 종료 | `isLoading = false` |
| 생성 폼 초기화 | `images = []`, `caption = ""`, `imagesError = ""`, `captionError = ""`, `formError = ""`, `isFormValid = false`, `isLoading = false`, `savedPost = null` |
| 수정 폼 초기화 | `images = initialPost.imageUrls 변환값`, `caption = initialPost.caption`, `imagesError = ""`, `captionError = ""`, `formError = ""`, `isFormValid = true`, `isLoading = false`, `savedPost = null` |

#### III. usePostActionMenu

##### a. 훅 요약

| 항목 | 내용 |
| --- | --- |
| 훅명 | `usePostActionMenu()` |
| 역할 | 게시글 액션 메뉴 상태 관리, 게시글 삭제 요청 실행, 삭제 결과 상태 갱신 |
| 호출 Service | `postManagementService.deletePost(postId)` |
| 내부 입력값 | `postId` |

##### b. 상태

| 변수 명 | 범위 | 초기 값 | 역할 |
| --- | --- | --- | --- |
| `isActionMenuOpen` | `public` | `false` | 액션 메뉴 상태 관리 |
| `actionMenuError` | `public` | `""` | 게시글 삭제 결과 상태 관리 |
| `isDeleting` | `public` | `false` | 게시글 삭제 요청 실행 |

##### c. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 service | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `openActionMenu()` | `public` | 없음 | `void` | 없음 | `isActionMenuOpen` |
| `closeActionMenu()` | `public` | 없음 | `void` | 없음 | `isActionMenuOpen` |
| `deletePost()` | `public` | 없음 | `Promise<void>` | <code>postManagementService.deletePost(postId: number): Promise&lt;<a href="#type-delete-post-result">DeletePostResult</a>&gt;</code> | `isDeleting`, `actionMenuError`, `isActionMenuOpen` |

##### d. 동작 규칙

- `openActionMenu()`
  - `isActionMenuOpen = true`로 갱신한다.
- `closeActionMenu()`
  - `isActionMenuOpen = false`로 갱신한다.
- `deletePost()`
  - 시작 시 `isDeleting = true`, `actionMenuError = ""`
  - 실행 중 `postManagementService.deletePost(postId)`를 호출한다.
  - 성공 시 `isActionMenuOpen = false`로 닫고 현재 화면의 게시글 목록 또는 상세 화면을 갱신한다.

##### e. 상태 갱신 규칙

| 상황 | 상태 갱신 |
| --- | --- |
| 액션 메뉴 열기 | `isActionMenuOpen = true` |
| 액션 메뉴 닫기 | `isActionMenuOpen = false` |
| 삭제 성공 | `actionMenuError = ""`, `isActionMenuOpen = false` |
| 삭제 실패 | `actionMenuError = message` |
| 종료 | `isDeleting = false` |

### C. 서비스

서비스는 게시글 생성, 수정, 삭제와 이미지 처리 규칙을 담당한다.

#### I. 서비스 타입

<a id="type-post-mutation-result"></a>

##### a. `PostMutationResult`

```ts
type PostMutationResult =
  | {
      success: true;
      data: Post;
    }
  | {
      success: false;
      message: string;
    };
```

<a id="type-delete-post-result"></a>

##### b. `DeletePostResult`

```ts
type DeletePostResult =
  | {
      success: true;
      deletedPostId: number;
    }
  | {
      success: false;
      message: string;
    };
```

#### II. `postManagementService`

##### a. 서비스 요약

| 항목 | 내용 |
| --- | --- |
| 서비스명 | `postManagementService` |
| 역할 | 게시글 입력값 검증, 이미지 압축, 게시글 생성/수정/삭제 비즈니스 로직 수행, 레포지토리 호출, 최종 결과 반환 |
| 호출 Repository | `postRepository.createPost(images, caption)`, `postRepository.updatePost(postId, existingImageUrls, newImages, caption)`, `postRepository.deletePost(postId)` |

##### b. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 대상 | 실패 메시지 | 역할 |
| --- | --- | --- | --- | --- | --- | --- |
| `createPost()` | `public` | `images: PostImageInput[]`, `caption: string` | <code>Promise&lt;<a href="#type-post-mutation-result">PostMutationResult</a>&gt;</code> | <code>postRepository.createPost(images: File[], caption: string): Promise&lt;<a href="#type-create-post-api-response">CreatePostApiResponse</a>&gt;</code> | `사진을 1장 이상 선택해주세요.`<br>`사진은 최대 10장까지 업로드할 수 있습니다.`<br>`게시글 내용을 입력해주세요.`<br>`서버 오류가 발생했습니다.`<br>`네트워크 오류가 발생했습니다. 다시 시도해주세요.` | 게시글 생성 결과를 반환한다. |
| `updatePost()` | `public` | `postId: number`, `images: PostImageInput[]`, `caption: string` | <code>Promise&lt;<a href="#type-post-mutation-result">PostMutationResult</a>&gt;</code> | <code>postRepository.updatePost(postId: number, existingImageUrls: string[], newImages: File[], caption: string): Promise&lt;<a href="#type-update-post-api-response">UpdatePostApiResponse</a>&gt;</code> | `사진을 1장 이상 선택해주세요.`<br>`사진은 최대 10장까지 업로드할 수 있습니다.`<br>`게시글 내용을 입력해주세요.`<br>`수정 권한이 없습니다.`<br>`게시글을 찾을 수 없습니다.` | 게시글 수정 결과를 반환한다. |
| `deletePost()` | `public` | `postId: number` | <code>Promise&lt;<a href="#type-delete-post-result">DeletePostResult</a>&gt;</code> | <code>postRepository.deletePost(postId: number): Promise&lt;<a href="#type-delete-post-api-response">DeletePostApiResponse</a>&gt;</code> | `삭제 권한이 없습니다.`<br>`게시글을 찾을 수 없습니다.`<br>`서버 오류가 발생했습니다.` | 게시글 삭제 결과를 반환한다. |
| `validateImages()` | `public` | `images: PostImageInput[]` | `boolean` | 없음 | `사진을 1장 이상 선택해주세요.`<br>`사진은 최대 10장까지 업로드할 수 있습니다.` | 이미지 개수 규칙을 검증한다. |
| `validateCaption()` | `public` | `caption: string` | `boolean` | 없음 | `게시글 내용을 입력해주세요.` | 캡션 입력 여부를 검증한다. |
| `compressImages()` | `private` | `images: File[]` | `Promise<File[]>` | 없음 | `이미지 압축 처리 중 문제가 발생했습니다.` | 업로드 전 신규 이미지를 압축해 저장 공간을 줄인다. |

##### c. 동작 규칙

- `createPost()`
  - 시작 시 `validateImages(images)`를 호출한다.
  - 다음으로 `validateCaption(caption)`를 호출한다.
  - 두 검증이 모두 통과하면 `source = "local"`인 이미지의 `file`만 추출한다.
  - 추출한 신규 이미지 파일에 대해 `compressImages(newImages)`를 호출한다.
  - 압축이 완료되면 `postRepository.createPost(compressedImages, caption)`을 호출한다.
- `updatePost()`
  - 시작 시 `validateImages(images)`를 호출한다.
  - 다음으로 `validateCaption(caption)`를 호출한다.
  - 두 검증이 모두 통과하면 `source = "remote"`인 이미지의 `previewUrl`을 `existingImageUrls`로 분리한다.
  - `source = "local"`인 이미지의 `file`만 추출해 `newImages`로 분리한다.
  - 신규 이미지가 있으면 `compressImages(newImages)`를 호출한다.
  - 분리한 `existingImageUrls`, `compressedNewImages`, `caption`으로 `postRepository.updatePost(postId, existingImageUrls, compressedNewImages, caption)`을 호출한다.
- `deletePost()`
  - `postRepository.deletePost(postId)`를 호출한다.
- `validateImages()`
  - 이미지가 1장 이상 선택되었는지 확인한다.
  - 이미지가 최대 10장을 넘지 않는지 확인한다.
- `validateCaption()`
  - 캡션 값이 비어 있는지 확인한다.
  - 공백만 입력된 값은 유효하지 않다.
- `compressImages()`
  - 업로드 전 신규 이미지를 압축한다.
  - 압축 후 업로드 가능한 파일 목록을 반환한다.

##### d. 반환 규칙

- `createPost()`

| 상황 | 반환값 |
| --- | --- |
| 게시글 생성 성공 | `success: true`, <code>data: <a href="#type-post">Post</a></code> |
| 게시글 생성 실패 | `success: false`, `message: string` |

- `updatePost()`

| 상황 | 반환값 |
| --- | --- |
| 게시글 수정 성공 | `success: true`, <code>data: <a href="#type-post">Post</a></code> |
| 게시글 수정 실패 | `success: false`, `message: string` |

- `deletePost()`

| 상황 | 반환값 |
| --- | --- |
| 게시글 삭제 성공 | `success: true`, `deletedPostId: number` |
| 게시글 삭제 실패 | `success: false`, `message: string` |

- `validateImages()`

| 상황 | 반환값 |
| --- | --- |
| 이미지 미선택 | `false` |
| 이미지 10장 초과 | `false` |
| 이미지 규칙 통과 | `true` |

- `validateCaption()`

| 상황 | 반환값 |
| --- | --- |
| 캡션 누락 | `false` |
| 캡션 값 존재 | `true` |

### D. 레포지토리

레포지토리는 게시글 생성, 수정, 삭제 API 요청과 응답 처리만 담당한다.

#### I. API 타입

<a id="type-create-post-api-response"></a>

##### a. `CreatePostApiResponse`

```ts
type CreatePostApiResponse = PostMutationResult;
```

<a id="type-update-post-api-response"></a>

##### b. `UpdatePostApiResponse`

```ts
type UpdatePostApiResponse = PostMutationResult;
```

<a id="type-delete-post-api-response"></a>

##### c. `DeletePostApiResponse`

```ts
type DeletePostApiResponse = DeletePostResult;
```

#### II. `postRepository`

##### a. 레포지토리 요약

| 항목 | 내용 |
| --- | --- |
| 레포지토리명 | `postRepository` |
| 역할 | API 요청 전송, 서버 응답 수신, 응답 데이터를 서비스 계층에 전달 |
| 호출 API | `POST /api/posts`, `PATCH /api/posts/{postId}`, `DELETE /api/posts/{postId}` |

##### b. 함수

| 함수 명 | 받는 props | return 값 | 호출하는 API | 역할 |
| --- | --- | --- | --- | --- |
| `createPost()` | `images: File[]`, `caption: string` | <code>Promise&lt;<a href="#type-create-post-api-response">CreatePostApiResponse</a>&gt;</code> | `POST /api/posts` | 게시글 생성 API 요청 후 응답 결과를 반환한다. |
| `updatePost()` | `postId: number`, `existingImageUrls: string[]`, `newImages: File[]`, `caption: string` | <code>Promise&lt;<a href="#type-update-post-api-response">UpdatePostApiResponse</a>&gt;</code> | `PATCH /api/posts/{postId}` | 게시글 수정 API 요청 후 응답 결과를 반환한다. |
| `deletePost()` | `postId: number` | <code>Promise&lt;<a href="#type-delete-post-api-response">DeletePostApiResponse</a>&gt;</code> | `DELETE /api/posts/{postId}` | 게시글 삭제 API 요청 후 응답 결과를 반환한다. |

##### c. 요청 규칙

| 항목 | 내용 |
| --- | --- |
| 게시글 생성 Method | `POST` |
| 게시글 생성 URL | `/api/posts` |
| 게시글 생성 요청 본문 | `multipart/form-data`, `images`, `caption` |
| 게시글 수정 Method | `PATCH` |
| 게시글 수정 URL | `/api/posts/{postId}` |
| 게시글 수정 요청 본문 | `multipart/form-data`, `existingImageUrls`, `newImages`, `caption` |
| 게시글 삭제 Method | `DELETE` |
| 게시글 삭제 URL | `/api/posts/{postId}` |
| 게시글 삭제 요청 본문 | 없음 |

##### d. 동작 규칙

- `createPost()`
  - 압축된 `images`와 `caption`을 `multipart/form-data`로 전송한다.
  - `POST /api/posts`로 요청을 전송한다.
  - 서버 응답을 <a href="#type-create-post-api-response"><code>CreatePostApiResponse</code></a> 형태로 반환한다.
- `updatePost()`
  - `existingImageUrls`, `newImages`, `caption`을 `multipart/form-data`로 전송한다.
  - `PATCH /api/posts/{postId}`로 요청을 전송한다.
  - 서버 응답을 <a href="#type-update-post-api-response"><code>UpdatePostApiResponse</code></a> 형태로 반환한다.
- `deletePost()`
  - `DELETE /api/posts/{postId}`로 요청을 전송한다.
  - 서버 응답을 <a href="#type-delete-post-api-response"><code>DeletePostApiResponse</code></a> 형태로 반환한다.

##### e. 반환 규칙

| 상황 | 반환값 |
| --- | --- |
| 게시글 생성 또는 수정 성공 | `success: true`, <code>data: <a href="#type-post">Post</a></code> |
| 게시글 삭제 성공 | `success: true`, `deletedPostId: number` |
| 게시글 요청 실패 | `success: false`, `message: string` |

### E. 서버

#### I. 게시글 생성 API

##### a. API 요약

| 항목 | 내용 |
| --- | --- |
| API 이름 | 게시글 생성 API |
| Method | `POST` |
| URL | `/api/posts` |
| 요청 본문 | `multipart/form-data`, `images`, `caption` |
| 처리 | 이미지 압축 결과와 캡션을 검증하고 새 게시글을 저장한다. |
| Response | `success`, `data` 또는 `message` |

##### b. 요청 본문 예시

```text
Content-Type: multipart/form-data
images: [photo-1.jpg, photo-2.jpg]
caption: "주말 산책 기록"
```

##### c. 응답 예시

###### 1. 성공 응답 예시

```json
{
  "success": true,
  "data": {
    "id": 1,
    "shortcode": "AbCd1234",
    "caption": "주말 산책 기록",
    "imageUrls": [
      "https://example.com/posts/1-1.jpg",
      "https://example.com/posts/1-2.jpg"
    ],
    "likeCount": 0,
    "commentCount": 0,
    "createdAt": "2026-04-11T12:00:00.000Z",
    "updatedAt": "2026-04-11T12:00:00.000Z"
  }
}
```

###### 2. 실패 응답 예시

```json
{
  "success": false,
  "message": "사진을 1장 이상 선택해주세요."
}
```

###### 3. 서버 에러 응답 예시

```json
{
  "success": false,
  "message": "서버 오류가 발생했습니다."
}
```

#### II. 게시글 수정 API

##### a. API 요약

| 항목 | 내용 |
| --- | --- |
| API 이름 | 게시글 수정 API |
| Method | `PATCH` |
| URL | `/api/posts/{postId}` |
| 요청 본문 | `multipart/form-data`, `existingImageUrls`, `newImages`, `caption` |
| 처리 | 유지할 기존 이미지와 새 이미지, 캡션을 검증하고 게시글을 수정한다. |
| Response | `success`, `data` 또는 `message` |

##### b. 요청 본문 예시

```text
Content-Type: multipart/form-data
existingImageUrls: ["https://example.com/posts/1-1.jpg"]
newImages: [photo-2.jpg]
caption: "수정된 게시글 내용"
```

##### c. 응답 예시

###### 1. 성공 응답 예시

```json
{
  "success": true,
  "data": {
    "id": 1,
    "shortcode": "AbCd1234",
    "caption": "수정된 게시글 내용",
    "imageUrls": [
      "https://example.com/posts/1-1.jpg",
      "https://example.com/posts/1-2.jpg"
    ],
    "likeCount": 5,
    "commentCount": 2,
    "createdAt": "2026-04-11T12:00:00.000Z",
    "updatedAt": "2026-04-11T13:00:00.000Z"
  }
}
```

###### 2. 실패 응답 예시

```json
{
  "success": false,
  "message": "수정 권한이 없습니다."
}
```

###### 3. 서버 에러 응답 예시

```json
{
  "success": false,
  "message": "서버 오류가 발생했습니다."
}
```

#### III. 게시글 삭제 API

##### a. API 요약

| 항목 | 내용 |
| --- | --- |
| API 이름 | 게시글 삭제 API |
| Method | `DELETE` |
| URL | `/api/posts/{postId}` |
| 요청 본문 | 없음 |
| 처리 | 게시글 소유 권한을 확인한 뒤 게시글과 연결된 데이터를 삭제한다. |
| Response | `success`, `deletedPostId` 또는 `message` |

##### b. 요청 본문 예시

없음.

##### c. 응답 예시

###### 1. 성공 응답 예시

```json
{
  "success": true,
  "deletedPostId": 1
}
```

###### 2. 실패 응답 예시

```json
{
  "success": false,
  "message": "삭제 권한이 없습니다."
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

게시글 작성/수정/삭제 기능의 상세 UI 규칙은 공통 UI와 레이아웃 문서를 기준으로 참조한다.

### A. 디자인 참조 문서

| 구분 | 문서 | 역할 |
| --- | --- | --- |
| 전체 디자인 시스템 | [design-system.md](../../layout/design-system.md) | 토큰, 무드, 상태, 레이아웃 기준 |
| 화면 조합 패턴 | [screen-patterns.md](../../layout/design-system/screen-patterns.md) | 작성 화면, 수정 화면, 게시글 카드 액션 메뉴 패턴 기준 |
| 공통 UI 컴포넌트 | [components-ui.md](../../layout/design-system/components-ui.md) | `Button`, `Textarea`, 이미지 선택 UI 등 공통 UI 기준 |
| 공통 레이아웃 컴포넌트 | [components-layout.md](../../layout/design-system/components-layout.md) | 셸 프레임과 액션 영역 배치 기준 |
