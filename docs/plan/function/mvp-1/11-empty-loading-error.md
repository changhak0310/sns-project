# Empty, Loading, Error 상태 명세

## 1. 상태 변수 및 함수 정의

Empty, Loading, Error 상태 기능은 각 페이지가 이미 판단한 상태를 인스타그램처럼 가볍고 자연스럽게 보여주는 공통 상태 UI 규칙을 사용한다.
실제 `isLoading`, `isEmpty`, `isError` 여부는 각 기능 문서에서 결정하고, 이 문서는 상태 UI preset, 재시도 UI, 이미지 fallback만 소유한다.

### A. 타입 정의

#### I. 공통 타입

<a id="type-status-surface"></a>

##### a. `StatusSurface`

```ts
type StatusSurface =
  | "feed"
  | "detail"
  | "profile"
  | "create"
  | "modal"
  | "global";
```

<a id="type-status-kind"></a>

##### b. `StatusKind`

```ts
type StatusKind = "loading" | "empty" | "error" | "not-found";
```

<a id="type-status-preset"></a>

##### c. `StatusPreset`

```ts
type StatusPreset = {
  title: string;
  description: string;
  actionLabel?: string;
  tone: "neutral" | "error";
  layout: "centered" | "inline";
  illustration: "skeleton" | "empty-grid" | "error-card" | "lost-page";
};
```

<a id="type-image-fallback-preset"></a>

##### d. `ImageFallbackPreset`

```ts
type ImageFallbackPreset = {
  label: string;
  backgroundTone: "soft-gray" | "soft-warm";
};
```

### B. 상태 변수 정의

| 변수명 | 타입 | 설명 | 초기값 | 사용 컴포넌트 |
| --- | --- | --- | --- | --- |
| `statusPreset` | <a href="#type-status-preset"><code>StatusPreset</code></a> \| null | 현재 surface와 상태 종류에 맞는 공통 상태 UI preset이다. 정상 콘텐츠 상태면 `null`이다. | `null` | `StatusBoundary`, `LoadingState`, `EmptyState`, `ErrorState`, `NotFoundState` |
| `isRetrying` | `boolean` | 에러 상태에서 재시도 액션 진행 여부다. | `false` | `StatusBoundary`, `ErrorState` |
| `hasImageError` | `boolean` | 개별 이미지가 실패해 fallback UI로 전환되었는지 여부다. | `false` | `ImageFallbackFrame` |
| `imageFallbackPreset` | <a href="#type-image-fallback-preset"><code>ImageFallbackPreset</code></a> \| null | 현재 surface에 맞는 이미지 fallback preset이다. | `null` | `ImageFallbackFrame` |

### C. 함수 정의

| 함수명 | 시그니처 | 역할 | 사용 컴포넌트 |
| --- | --- | --- | --- |
| `applyStatus()` | `(surface: StatusSurface, kind: StatusKind \| null, message?: string) => void` | 현재 surface와 상태 종류에 맞는 공통 상태 preset을 적용한다. `kind = null`이면 정상 콘텐츠 상태로 본다. | `StatusBoundary` |
| `startRetry()` | `() => void` | 에러 상태 재시도 시작 UI를 반영한다. | `StatusBoundary`, `ErrorState` |
| `finishRetry()` | `() => void` | 에러 상태 재시도 종료 UI를 반영한다. | `StatusBoundary`, `ErrorState` |
| `applyImageFallbackPreset()` | `(surface: StatusSurface) => void` | 현재 surface에 맞는 이미지 fallback preset을 적용한다. | `ImageFallbackFrame` |
| `markImageError()` | `() => void` | 이미지 실패를 기록하고 fallback UI로 전환한다. | `ImageFallbackFrame` |
| `resetImageError()` | `() => void` | 이미지 실패 상태를 초기화한다. | `ImageFallbackFrame` |
| `resetStatusState()` | `() => void` | 공통 상태 UI 상태를 초기값으로 되돌린다. | `StatusBoundary` |

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
A. 컴포넌트 -> B. 훅 -> C. 서비스 -> D. 레포지토리(없음) -> E. 서버(없음)
```

참조 - [function-md-guide.md](../function-md-guide.md), [layer.md](../../layout/layer.md), [05-home-feed.md](./05-home-feed.md), [06-post-detail-engagement.md](./06-post-detail-engagement.md), [07-profile-follow.md](./07-profile-follow.md), [08-polish.md](./08-polish.md)

### A. 컴포넌트

상태 UI 기능은 인스타그램처럼 화면 전체를 막아버리는 과한 메시지 대신, 현재 surface에 맞는 skeleton, 빈 상태, 부드러운 에러 메시지, 이미지 fallback을 최소한의 톤으로 보여준다.

#### I. 컴포넌트 구조

```text
FeedPage
  -> StatusBoundary
    -> LoadingState
    -> EmptyState
    -> ErrorState
    -> HomeFeedList

PostDetailPage
  -> StatusBoundary
    -> LoadingState
    -> ErrorState
    -> PostDetailContent
      -> ImageFallbackFrame

ProfilePage
  -> StatusBoundary
    -> LoadingState
    -> EmptyState
    -> ErrorState
    -> ProfilePostGrid
      -> ImageFallbackFrame

GlobalNotFoundPage
  -> NotFoundState
```

#### II. 컴포넌트 타입

<a id="type-status-boundary-props"></a>

##### a. `StatusBoundaryProps`

```ts
type StatusBoundaryProps = {
  surface: StatusSurface;
  kind: StatusKind | null;
  message?: string;
  onRetry?: () => Promise<void> | void;
  children: ReactNode;
};
```

<a id="type-status-state-view-props"></a>

##### b. `StatusStateViewProps`

```ts
type StatusStateViewProps = {
  preset: StatusPreset;
};
```

<a id="type-error-state-props"></a>

##### c. `ErrorStateProps`

```ts
type ErrorStateProps = {
  preset: StatusPreset;
  isRetrying: boolean;
  onRetry?: () => Promise<void> | void;
};
```

<a id="type-image-fallback-frame-props"></a>

##### d. `ImageFallbackFrameProps`

```ts
type ImageFallbackFrameProps = {
  surface: StatusSurface;
  src: string;
  alt: string;
  aspectRatio: string;
};
```

#### III. 컴포넌트 정의

| 컴포넌트명 | 역할 | 사용하는 Hook | 받는 props | 이벤트에서 호출하는 함수 | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `StatusBoundary` | 각 페이지가 결정한 상태 종류를 받아 적절한 `LoadingState`, `EmptyState`, `ErrorState`, `children` 분기를 렌더링한다. `kind = null`이면 `children`을 그대로 렌더링한다. | `useStatusState()` | <a href="#type-status-boundary-props"><code>StatusBoundaryProps</code></a> | `onMount 또는 onStatusChange -> applyStatus(surface, kind, message)`<br>`onRetry -> startRetry(), await onRetry?.(), finally finishRetry()`<br>`onUnmount -> resetStatusState()` | `statusPreset`, `isRetrying` |
| `LoadingState` | 인스타그램처럼 조용한 skeleton 중심의 로딩 UI를 surface별로 출력한다. | 없음 | <a href="#type-status-state-view-props"><code>StatusStateViewProps</code></a> | 없음 | 없음 |
| `EmptyState` | 데이터가 비어 있을 때 다음 행동을 이해할 수 있는 빈 상태 UI를 출력한다. | 없음 | <a href="#type-status-state-view-props"><code>StatusStateViewProps</code></a> | 없음 | 없음 |
| `ErrorState` | 에러 상태 메시지와 재시도 버튼을 출력한다. | 없음 | <a href="#type-error-state-props"><code>ErrorStateProps</code></a> | `onRetry -> onRetry()` | 없음 |
| `NotFoundState` | 라우트를 찾지 못했을 때 전역 not-found UI를 출력한다. | 없음 | <a href="#type-status-state-view-props"><code>StatusStateViewProps</code></a> | 없음 | 없음 |
| `ImageFallbackFrame` | 이미지 로드 실패 시 깨진 이미지 대신 부드러운 fallback block을 출력한다. | `useImageFallback()` | <a href="#type-image-fallback-frame-props"><code>ImageFallbackFrameProps</code></a> | `onMount 또는 onSurfaceChange -> applyImageFallbackPreset(surface)`<br>`onError -> markImageError()`<br>`onSrcChange 또는 onUnmount -> resetImageError()` | `hasImageError`, `imageFallbackPreset` |

### B. 훅

상태 UI 훅은 상태 preset 관리와 이미지 fallback 관리를 기능 단위로 나누어 정의한다.

#### I. 훅 타입

<a id="type-status-state"></a>

##### a. `StatusState`

```ts
type StatusState = {
  statusPreset: StatusPreset | null;
  isRetrying: boolean;
};
```

<a id="type-status-actions"></a>

##### b. `StatusActions`

```ts
type StatusActions = {
  applyStatus: (surface: StatusSurface, kind: StatusKind | null, message?: string) => void;
  startRetry: () => void;
  finishRetry: () => void;
  resetStatusState: () => void;
};
```

<a id="type-use-status-state-return"></a>

##### c. `UseStatusStateReturn`

```ts
type UseStatusStateReturn = StatusState & StatusActions;
```

<a id="type-image-fallback-state"></a>

##### d. `ImageFallbackState`

```ts
type ImageFallbackState = {
  hasImageError: boolean;
  imageFallbackPreset: ImageFallbackPreset | null;
};
```

<a id="type-image-fallback-actions"></a>

##### e. `ImageFallbackActions`

```ts
type ImageFallbackActions = {
  applyImageFallbackPreset: (surface: StatusSurface) => void;
  markImageError: () => void;
  resetImageError: () => void;
};
```

<a id="type-use-image-fallback-return"></a>

##### f. `UseImageFallbackReturn`

```ts
type UseImageFallbackReturn = ImageFallbackState & ImageFallbackActions;
```

#### II. useStatusState

##### a. 훅 요약

| 항목 | 내용 |
| --- | --- |
| 훅명 | `useStatusState()` |
| 역할 | 공통 상태 preset 적용, 정상 콘텐츠 분기 처리, 재시도 UI 상태 관리, 상태 UI 초기화 |
| 호출 Service | `statusStateService.getStatusPreset(surface, kind, message)` |

##### b. 상태

| 변수명 | 범위 | 초기값 | 역할 |
| --- | --- | --- | --- |
| `statusPreset` | `public` | `null` | 상태 UI preset 관리 |
| `isRetrying` | `public` | `false` | 재시도 상태 관리 |

##### c. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 service | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `applyStatus()` | `public` | `surface: <a href="#type-status-surface"><code>StatusSurface</code></a>`, `kind: <a href="#type-status-kind"><code>StatusKind</code></a> \| null`, `message?: string` | `void` | <code>statusStateService.getStatusPreset(surface: <a href="#type-status-surface">StatusSurface</a>, kind: <a href="#type-status-kind">StatusKind</a>, message?: string): <a href="#type-status-preset">StatusPreset</a></code> | `statusPreset`, `isRetrying` |
| `startRetry()` | `public` | 없음 | `void` | 없음 | `isRetrying` |
| `finishRetry()` | `public` | 없음 | `void` | 없음 | `isRetrying` |
| `resetStatusState()` | `public` | 없음 | `void` | 없음 | `statusPreset`, `isRetrying` |

##### d. 동작 규칙

- `applyStatus()`
  - `kind = null`이면 `statusPreset = null`, `isRetrying = false`로 초기화하고 `children`을 그대로 렌더링한다.
  - `kind != null`이면 `statusStateService.getStatusPreset(surface, kind, message)`를 호출한다.
  - 반환된 preset을 `statusPreset`에 저장한다.
  - 새 상태를 적용할 때 `isRetrying = false`로 초기화한다.
- `startRetry()`
  - `isRetrying = true`로 갱신한다.
- `finishRetry()`
  - `isRetrying = false`로 갱신한다.
- `resetStatusState()`
  - 상태 UI preset과 재시도 상태를 초기값으로 되돌린다.

##### e. 상태 갱신 규칙

| 상황 | 상태 갱신 |
| --- | --- |
| 정상 콘텐츠 상태 적용 | `statusPreset = null`, `isRetrying = false` |
| 상태 preset 적용 | `statusPreset = preset`, `isRetrying = false` |
| 재시도 시작 | `isRetrying = true` |
| 재시도 종료 | `isRetrying = false` |
| 초기화 | `statusPreset = null`, `isRetrying = false` |

#### III. useImageFallback

##### a. 훅 요약

| 항목 | 내용 |
| --- | --- |
| 훅명 | `useImageFallback()` |
| 역할 | 이미지 실패 여부 관리, fallback preset 적용, fallback 전환, 이미지 상태 초기화 |
| 호출 Service | `statusStateService.getImageFallbackPreset(surface)` |

##### b. 상태

| 변수명 | 범위 | 초기값 | 역할 |
| --- | --- | --- | --- |
| `hasImageError` | `public` | `false` | 이미지 fallback 상태 관리 |
| `imageFallbackPreset` | `public` | `null` | 이미지 fallback preset 관리 |

##### c. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 service | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `applyImageFallbackPreset()` | `public` | `surface: <a href="#type-status-surface"><code>StatusSurface</code></a>` | `void` | <code>statusStateService.getImageFallbackPreset(surface: <a href="#type-status-surface">StatusSurface</a>): <a href="#type-image-fallback-preset">ImageFallbackPreset</a></code> | `imageFallbackPreset` |
| `markImageError()` | `public` | 없음 | `void` | 없음 | `hasImageError` |
| `resetImageError()` | `public` | 없음 | `void` | 없음 | `hasImageError`, `imageFallbackPreset` |

##### d. 동작 규칙

- `applyImageFallbackPreset()`
  - `statusStateService.getImageFallbackPreset(surface)`를 호출한다.
  - 반환된 preset을 `imageFallbackPreset`에 저장한다.
- `markImageError()`
  - 이미지 로드 실패 이벤트가 발생하면 `hasImageError = true`로 갱신한다.
- `resetImageError()`
  - 이미지가 교체되거나 컴포넌트가 재사용될 때 `hasImageError = false`, `imageFallbackPreset = null`로 초기화한다.

##### e. 상태 갱신 규칙

| 상황 | 상태 갱신 |
| --- | --- |
| 이미지 fallback preset 적용 | `imageFallbackPreset = preset` |
| 이미지 로드 실패 | `hasImageError = true` |
| 이미지 상태 초기화 | `hasImageError = false`, `imageFallbackPreset = null` |

### C. 서비스

상태 UI 서비스는 surface와 상태 종류에 맞는 preset 문구와 레이아웃만 계산한다.

#### I. 서비스 타입

서비스는 별도 결과 타입 없이 <a href="#type-status-preset"><code>StatusPreset</code></a>, <a href="#type-image-fallback-preset"><code>ImageFallbackPreset</code></a>을 직접 사용한다.

#### II. `statusStateService`

##### a. 서비스 요약

| 항목 | 내용 |
| --- | --- |
| 서비스명 | `statusStateService` |
| 역할 | surface별 로딩/빈 상태/에러/not-found 문구 계산, 이미지 fallback preset 계산 |
| 호출 Repository | 없음 |

##### b. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 대상 | 실패 메시지 | 역할 |
| --- | --- | --- | --- | --- | --- | --- |
| `getStatusPreset()` | `public` | `surface: <a href="#type-status-surface"><code>StatusSurface</code></a>`, `kind: <a href="#type-status-kind"><code>StatusKind</code></a>`, `message?: string` | <code><a href="#type-status-preset">StatusPreset</a></code> | <code>getDefaultMessage(surface: <a href="#type-status-surface">StatusSurface</a>, kind: <a href="#type-status-kind">StatusKind</a>): string</code><br><code>getDefaultActionLabel(kind: <a href="#type-status-kind">StatusKind</a>): string \| undefined</code> | 없음 | 현재 상태 UI에 필요한 제목, 설명, 액션 라벨, 레이아웃을 계산한다. |
| `getImageFallbackPreset()` | `public` | `surface: <a href="#type-status-surface"><code>StatusSurface</code></a>` | <code><a href="#type-image-fallback-preset">ImageFallbackPreset</a></code> | 없음 | 없음 | 이미지 실패 시 보여줄 fallback 라벨과 배경 톤을 계산한다. |
| `getDefaultMessage()` | `private` | `surface: <a href="#type-status-surface"><code>StatusSurface</code></a>`, `kind: <a href="#type-status-kind"><code>StatusKind</code></a>` | `string` | 없음 | 없음 | surface와 상태 종류에 맞는 기본 설명 문구를 반환한다. |
| `getDefaultActionLabel()` | `private` | `kind: <a href="#type-status-kind"><code>StatusKind</code></a>` | `string \| undefined` | 없음 | 없음 | 재시도나 홈 이동 같은 기본 액션 라벨을 반환한다. |

##### c. 동작 규칙

- `getStatusPreset()`
  - `surface`와 `kind`에 맞는 기본 제목과 설명을 계산한다.
  - `message`가 전달되면 기본 설명 대신 우선 사용한다.
  - `loading`은 skeleton 중심, `empty`는 행동 유도 문구 중심, `error`는 재시도 중심, `not-found`는 홈 복귀 중심으로 preset을 만든다.
  - `feed`, `profile`은 `centered`, `detail`, `modal`은 `inline` 레이아웃을 우선 사용한다.
- `getImageFallbackPreset()`
  - `feed`, `profile`은 `soft-gray`, `detail`, `create`는 `soft-warm` 배경 톤을 반환한다.
  - 라벨은 `이미지를 불러오지 못했어요.`로 통일한다.
- `getDefaultMessage()`
  - `feed empty`는 아직 게시물이 없다는 톤을 사용한다.
  - `profile empty`는 아직 올린 게시물이 없다는 톤을 사용한다.
  - `saved empty` 같은 세부 copy는 각 기능 문서가 전달한 `message`를 우선 사용한다.
  - `error`는 사용자가 다음 행동을 이해할 수 있는 짧은 문구로 반환한다.
- `getDefaultActionLabel()`
  - `error`면 `다시 시도`
  - `not-found`면 `홈으로 이동`
  - 나머지는 `없음`

##### d. 반환 규칙

- `getStatusPreset()`

| 상황 | 반환값 |
| --- | --- |
| 로딩 상태 | `title: string`, `description: string`, `tone: "neutral"`, `illustration: "skeleton"` |
| 빈 상태 | `title: string`, `description: string`, `tone: "neutral"`, `illustration: "empty-grid"` |
| 에러 상태 | `title: string`, `description: string`, `actionLabel: "다시 시도"`, `tone: "error"`, `illustration: "error-card"` |
| not-found 상태 | `title: string`, `description: string`, `actionLabel: "홈으로 이동"`, `tone: "neutral"`, `illustration: "lost-page"` |

- `getImageFallbackPreset()`

| 상황 | 반환값 |
| --- | --- |
| 이미지 fallback | `label: "이미지를 불러오지 못했어요."`, `backgroundTone: "soft-gray" \| "soft-warm"` |

### D. 레포지토리

상태 UI 기능은 레포지토리 계층을 직접 사용하지 않는다.

#### I. API 타입

해당 없음.

#### II. 레포지토리 사용

##### a. 레포지토리 요약

| 항목 | 내용 |
| --- | --- |
| 레포지토리명 | 없음 |
| 역할 | 상태 UI 기능은 API 통신 없이 화면 상태 preset과 fallback만 관리한다. |
| 호출 API | 없음 |

##### b. 함수

없음.

##### c. 요청 규칙

없음.

##### d. 동작 규칙

- 상태 UI 기능은 레포지토리 계층을 직접 호출하지 않는다.
- 실제 데이터 조회와 mutation 실패는 각 기능 문서에서 처리하고, 이 문서는 표현만 담당한다.

##### e. 반환 규칙

없음.

### E. 서버

상태 UI 기능은 별도 서버 API보다 App Router의 `loading.tsx`, `error.tsx`, `not-found.tsx`, `@modal/default.tsx`에서 상태 화면을 연결하는 방식으로 동작한다.

#### I. 상태 UI 서버 처리

##### a. API 요약

| 항목 | 내용 |
| --- | --- |
| API 이름 | 없음 |
| 메서드 | 없음 |
| URL | 없음 |
| 요청 본문 | 없음 |
| 처리 | App Router 세그먼트가 현재 상태에 맞는 상태 UI 컴포넌트를 선택해 렌더링한다. |
| 응답 | 없음 |

##### b. 요청 본문 예시

없음.

##### c. 응답 예시

없음.

## 3. 디자인 참조

상태 UI 기능은 인스타그램처럼 과장된 경고 대신 조용한 skeleton, 낮은 대비의 빈 상태, 짧은 에러 문구를 기준으로 디자인 문서를 참조한다.

### A. 디자인 참조 문서

| 구분 | 문서 | 역할 |
| --- | --- | --- |
| 전체 디자인 시스템 | [design-system.md](../../layout/design-system.md) | 토큰, 상태, 인터랙션 기본 규칙 |
| 화면 조합 패턴 | [screen-patterns.md](../../layout/design-system/screen-patterns.md) | 피드, 상세, 프로필의 상태 UI 배치 기준 |
| 공통 UI 컴포넌트 | [components-ui.md](../../layout/design-system/components-ui.md) | skeleton, 버튼, 배너, 빈 상태 UI 규칙 |
| 공통 레이아웃 컴포넌트 | [components-layout.md](../../layout/design-system/components-layout.md) | page, modal, grid 안 상태 UI 배치 규칙 |
