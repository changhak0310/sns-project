# 제품 마감 polish 명세

## 1. 상태 변수 및 함수 정의

제품 마감 polish 기능은 인스타그램과 유사하게 화면 전환, 이미지 노출, 좋아요/팔로우 같은 액션 피드백, 버튼 눌림 감도, 토스트 피드백을 일관되게 맞추는 공통 계약을 사용한다.

### A. 타입 정의

#### I. 공통 타입

<a id="type-polish-surface"></a>

##### a. `PolishSurface`

```ts
type PolishSurface = "feed" | "detail" | "profile" | "create" | "auth";
```

<a id="type-polish-action-type"></a>

##### b. `PolishActionType`

```ts
type PolishActionType =
  | "like"
  | "follow"
  | "comment"
  | "save"
  | "post-create"
  | "post-delete";
```

<a id="type-polish-viewport"></a>

##### c. `PolishViewport`

```ts
type PolishViewport = "mobile" | "desktop";
```

<a id="type-route-transition-mode"></a>

##### d. `RouteTransitionMode`

```ts
type RouteTransitionMode = "none" | "fade" | "sheet";
```

<a id="type-polish-action-key"></a>

##### e. `PolishActionKey`

```ts
type PolishActionKey = string;
```

<a id="type-polish-pending-action"></a>

##### f. `PolishPendingAction`

```ts
type PolishPendingAction = {
  actionType: PolishActionType;
  actionKey: PolishActionKey;
};
```

<a id="type-polish-feedback"></a>

##### g. `PolishFeedback`

```ts
type PolishFeedback = {
  message: string;
  tone: "neutral" | "success" | "error";
  durationMs: number;
};
```

<a id="type-surface-polish-preset"></a>

##### h. `SurfacePolishPreset`

```ts
type SurfacePolishPreset = {
  transitionMode: RouteTransitionMode;
  useProgressiveImage: boolean;
  useActionToast: boolean;
  useSafeAreaPadding: boolean;
};
```

### B. 상태 변수 정의

| 변수명 | 타입 | 설명 | 초기값 | 사용 컴포넌트 |
| --- | --- | --- | --- | --- |
| `activeSurface` | <a href="#type-polish-surface"><code>PolishSurface</code></a> \| null | 현재 polish 규칙을 적용할 화면 영역 | `null` | `AppPolishLayer`, `RouteTransitionOverlay`, `ActionToast` |
| `surfacePreset` | <a href="#type-surface-polish-preset"><code>SurfacePolishPreset</code></a> \| null | 현재 화면과 viewport에 맞게 계산된 polish preset | `null` | `AppPolishLayer`, `RouteTransitionOverlay`, `ActionToast`, `ProgressiveImageFrame` |
| `pendingAction` | <a href="#type-polish-pending-action"><code>PolishPendingAction</code></a> \| null | 현재 피드백 중인 액션 종류와 버튼 식별자 | `null` | `AppPolishLayer`, `PressableFeedbackButton` |
| `toastFeedback` | <a href="#type-polish-feedback"><code>PolishFeedback</code></a> \| null | 인스타그램형 가벼운 액션 피드백 메시지 | `null` | `ActionToast` |
| `isRouteTransitioning` | `boolean` | 화면 전환 중 오버레이 연출 진행 여부 | `false` | `AppPolishLayer`, `RouteTransitionOverlay` |

### C. 함수 정의

| 함수명 | 시그니처 | 역할 | 사용 컴포넌트 |
| --- | --- | --- | --- |
| `setActiveSurface()` | `(surface: PolishSurface, viewport: PolishViewport) => void` | 현재 화면과 viewport에 맞는 polish 표면과 preset을 설정한다. | `AppPolishLayer` |
| `startRouteTransition()` | `(surface: PolishSurface, viewport: PolishViewport) => void` | 화면 전환 연출을 시작한다. | `AppPolishLayer`, `RouteTransitionOverlay` |
| `endRouteTransition()` | `() => void` | 화면 전환 연출을 종료한다. | `AppPolishLayer`, `RouteTransitionOverlay` |
| `startActionFeedback()` | `(actionType: PolishActionType, actionKey: PolishActionKey) => void` | 좋아요, 팔로우, 저장 같은 액션 피드백을 시작한다. | `PressableFeedbackButton`, `ActionToast` |
| `finishActionFeedback()` | `(actionType: PolishActionType, actionKey: PolishActionKey, status: "success" | "error") => void` | 액션 결과에 맞는 토스트와 상태를 갱신한다. | `PressableFeedbackButton`, `ActionToast` |
| `clearToastFeedback()` | `() => void` | 액션 토스트를 제거한다. | `ActionToast` |
| `resetPolishState()` | `() => void` | polish 상태를 초기값으로 되돌린다. | `AppPolishLayer` |

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

참조 - [function-md-guide.md](../function-md-guide.md), [layer.md](../../layout/layer.md), [11-empty-loading-error.md](./11-empty-loading-error.md)

### A. 컴포넌트

polish 기능은 실제 비즈니스 로직을 소유하지 않고, 각 기능 문서에서 정의한 화면 위에 공통 마감 레이어를 씌운다. `11-empty-loading-error.md`는 상태 UI 자체를 소유하고, `08-polish.md`는 그 상태와 일반 상호작용이 인스타그램처럼 보이도록 마감 규칙을 소유한다.

#### I. 컴포넌트 구조

```text
AppPolishLayer
  -> RouteTransitionOverlay
  -> ActionToast
  -> children
    -> PressableFeedbackButton
    -> ProgressiveImageFrame
```

#### II. 컴포넌트 타입

<a id="type-app-polish-layer-props"></a>

##### a. `AppPolishLayerProps`

```ts
type AppPolishLayerProps = {
  surface: PolishSurface;
  viewport: PolishViewport;
  children: ReactNode;
};
```

<a id="type-route-transition-overlay-props"></a>

##### b. `RouteTransitionOverlayProps`

```ts
type RouteTransitionOverlayProps = {
  isVisible: boolean;
  mode: RouteTransitionMode;
  onTransitionEnd: () => void;
};
```

<a id="type-action-toast-props"></a>

##### c. `ActionToastProps`

```ts
type ActionToastProps = {
  feedback: PolishFeedback | null;
  onClose: () => void;
};
```

<a id="type-pressable-feedback-button-props"></a>

##### d. `PressableFeedbackButtonProps`

```ts
type PressableFeedbackButtonProps = {
  pending: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
};
```

<a id="type-progressive-image-frame-props"></a>

##### e. `ProgressiveImageFrameProps`

```ts
type ProgressiveImageFrameProps = {
  src: string;
  alt: string;
  aspectRatio: string;
  useProgressive: boolean;
};
```

#### III. 컴포넌트 정의

| 컴포넌트명 | 역할 | 사용하는 Hook | 받는 props | 이벤트에서 호출하는 함수 | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `AppPolishLayer` | 현재 화면에 맞는 마감 규칙, 안전 여백, 토스트, 전환 연출을 적용한다. | `usePolishUX()` | <a href="#type-app-polish-layer-props"><code>AppPolishLayerProps</code></a> | `onMount 또는 onSurfaceChange -> setActiveSurface(surface, viewport)` | `activeSurface`, `surfacePreset`, `pendingAction`, `toastFeedback`, `isRouteTransitioning` |
| `RouteTransitionOverlay` | 화면 전환 시 모바일은 sheet, 데스크톱은 fade 중심의 오버레이 연출을 담당한다. | 없음 | <a href="#type-route-transition-overlay-props"><code>RouteTransitionOverlayProps</code></a> | `onTransitionEnd -> endRouteTransition()` | 없음 |
| `ActionToast` | 좋아요, 팔로우, 저장, 게시 완료 같은 액션 결과를 가벼운 토스트로 보여준다. | 없음 | <a href="#type-action-toast-props"><code>ActionToastProps</code></a> | `onAutoHide 또는 onClose -> clearToastFeedback()` | 없음 |
| `PressableFeedbackButton` | 좋아요, 팔로우, 저장 버튼에 눌림 상태와 pending 상태를 일관되게 적용한다. | 없음 | <a href="#type-pressable-feedback-button-props"><code>PressableFeedbackButtonProps</code></a> | `onClick -> onClick()` | 없음 |
| `ProgressiveImageFrame` | 피드 카드, 상세, 프로필 그리드 이미지를 비율 고정과 페이드 인으로 출력한다. | 없음 | <a href="#type-progressive-image-frame-props"><code>ProgressiveImageFrameProps</code></a> | 없음 | 없음 |

### B. 훅

polish 훅은 화면 전환과 액션 피드백 상태만 관리한다.

#### I. 훅 타입

<a id="type-polish-ux-state"></a>

##### a. `PolishUXState`

```ts
type PolishUXState = {
  activeSurface: PolishSurface | null;
  surfacePreset: SurfacePolishPreset | null;
  pendingAction: PolishPendingAction | null;
  toastFeedback: PolishFeedback | null;
  isRouteTransitioning: boolean;
};
```

<a id="type-polish-ux-actions"></a>

##### b. `PolishUXActions`

```ts
type PolishUXActions = {
  setActiveSurface: (surface: PolishSurface, viewport: PolishViewport) => void;
  startRouteTransition: (surface: PolishSurface, viewport: PolishViewport) => void;
  endRouteTransition: () => void;
  startActionFeedback: (
    actionType: PolishActionType,
    actionKey: PolishActionKey
  ) => void;
  finishActionFeedback: (
    actionType: PolishActionType,
    actionKey: PolishActionKey,
    status: "success" | "error"
  ) => void;
  clearToastFeedback: () => void;
  resetPolishState: () => void;
};
```

<a id="type-use-polish-ux-return"></a>

##### c. `UsePolishUXReturn`

```ts
type UsePolishUXReturn = PolishUXState & PolishUXActions;
```

#### II. usePolishUX

##### a. 훅 요약

| 항목 | 내용 |
| --- | --- |
| 훅명 | `usePolishUX()` |
| 역할 | polish UI 상태 관리, 화면 전환 연출 실행, 액션 피드백 실행, 토스트 상태 초기화 |
| 호출 Service | `polishService.getSurfacePolishPreset(surface, viewport)`, `polishService.getActionFeedback(actionType, status)` |

##### b. 상태

| 변수 명 | 범위 | 초기 값 | 역할 |
| --- | --- | --- | --- |
| `activeSurface` | `public` | `null` | polish UI 상태 관리 |
| `surfacePreset` | `public` | `null` | polish UI 상태 관리 |
| `pendingAction` | `public` | `null` | polish UI 상태 관리 |
| `toastFeedback` | `public` | `null` | polish 결과 상태 관리 |
| `isRouteTransitioning` | `public` | `false` | polish 요청 실행 |

##### c. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 service | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `setActiveSurface()` | `public` | `surface: <a href="#type-polish-surface"><code>PolishSurface</code></a>`, `viewport: <a href="#type-polish-viewport"><code>PolishViewport</code></a>` | `void` | <code>polishService.getSurfacePolishPreset(surface: <a href="#type-polish-surface">PolishSurface</a>, viewport: <a href="#type-polish-viewport">PolishViewport</a>): <a href="#type-surface-polish-preset">SurfacePolishPreset</a></code> | `activeSurface`, `surfacePreset` |
| `startRouteTransition()` | `public` | `surface: <a href="#type-polish-surface"><code>PolishSurface</code></a>`, `viewport: <a href="#type-polish-viewport"><code>PolishViewport</code></a>` | `void` | <code>polishService.getSurfacePolishPreset(surface: <a href="#type-polish-surface">PolishSurface</a>, viewport: <a href="#type-polish-viewport">PolishViewport</a>): <a href="#type-surface-polish-preset">SurfacePolishPreset</a></code> | `activeSurface`, `surfacePreset`, `isRouteTransitioning` |
| `endRouteTransition()` | `public` | 없음 | `void` | 없음 | `isRouteTransitioning` |
| `startActionFeedback()` | `public` | `actionType: <a href="#type-polish-action-type"><code>PolishActionType</code></a>`, `actionKey: <a href="#type-polish-action-key"><code>PolishActionKey</code></a>` | `void` | 없음 | `pendingAction`, `toastFeedback` |
| `finishActionFeedback()` | `public` | `actionType: <a href="#type-polish-action-type"><code>PolishActionType</code></a>`, `actionKey: <a href="#type-polish-action-key"><code>PolishActionKey</code></a>`, `status: "success" \| "error"` | `void` | <code>polishService.getActionFeedback(actionType: <a href="#type-polish-action-type">PolishActionType</a>, status: "success" \| "error"): <a href="#type-polish-feedback">PolishFeedback</a> \| null</code> | `pendingAction`, `toastFeedback` |
| `clearToastFeedback()` | `public` | 없음 | `void` | 없음 | `toastFeedback` |
| `resetPolishState()` | `public` | 없음 | `void` | 없음 | `activeSurface`, `surfacePreset`, `pendingAction`, `toastFeedback`, `isRouteTransitioning` |

##### d. 동작 규칙

- `setActiveSurface()`
  - 현재 화면을 `feed`, `detail`, `profile`, `create`, `auth` 중 하나로 갱신한다.
  - `polishService.getSurfacePolishPreset(surface, viewport)`를 호출해 해당 화면 preset을 계산한다.
  - `activeSurface = surface`, `surfacePreset = preset`으로 갱신한다.
- `startRouteTransition()`
  - 시작 시 `isRouteTransitioning = true`
  - `polishService.getSurfacePolishPreset(surface, viewport)`를 호출해 전환 방식을 결정한다.
  - `activeSurface = surface`, `surfacePreset = preset`으로 갱신한다.
- `endRouteTransition()`
  - `isRouteTransitioning = false`로 갱신한다.
- `startActionFeedback()`
  - `pendingAction = { actionType, actionKey }`로 갱신한다.
  - 기존 `toastFeedback`는 초기화한다.
- `finishActionFeedback()`
  - `polishService.getActionFeedback(actionType, status)`를 호출해 토스트 메시지를 생성한다.
  - `pendingAction = null`로 갱신한다.
  - 반환값이 있으면 `toastFeedback`에 저장한다.
- `clearToastFeedback()`
  - `ActionToast`가 `feedback.durationMs` 이후 자동 종료되거나 사용자가 닫기를 누르면 호출한다.
  - `toastFeedback = null`로 갱신한다.
- `resetPolishState()`
  - polish 상태를 모두 초기값으로 되돌린다.

##### e. 상태 갱신 규칙

| 상황 | 상태 갱신 |
| --- | --- |
| 화면 설정 | `activeSurface = surface`, `surfacePreset = preset` |
| 화면 전환 시작 | `activeSurface = surface`, `surfacePreset = preset`, `isRouteTransitioning = true` |
| 화면 전환 종료 | `isRouteTransitioning = false` |
| 액션 피드백 시작 | `pendingAction = { actionType, actionKey }`, `toastFeedback = null` |
| 액션 성공 또는 실패 | `pendingAction = null`, `toastFeedback = feedback` |
| 토스트 제거 | `toastFeedback = null` |
| 초기화 | `activeSurface = null`, `surfacePreset = null`, `pendingAction = null`, `toastFeedback = null`, `isRouteTransitioning = false` |

### C. 서비스

polish 서비스는 화면별 마감 preset과 액션 피드백 문구만 계산한다.

#### I. 서비스 타입

서비스는 별도 결과 타입 없이 <a href="#type-surface-polish-preset"><code>SurfacePolishPreset</code></a>, <a href="#type-polish-feedback"><code>PolishFeedback</code></a>를 재사용한다.

#### II. `polishService`

##### a. 서비스 요약

| 항목 | 내용 |
| --- | --- |
| 서비스명 | `polishService` |
| 역할 | 화면별 전환 preset 계산, 액션 피드백 문구 계산, 인스타그램형 상호작용 마감 규칙 제공 |
| 호출 Repository | 없음 |

##### b. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 대상 | 실패 메시지 | 역할 |
| --- | --- | --- | --- | --- | --- | --- |
| `getSurfacePolishPreset()` | `public` | `surface: <a href="#type-polish-surface"><code>PolishSurface</code></a>`, `viewport: <a href="#type-polish-viewport"><code>PolishViewport</code></a>` | <code><a href="#type-surface-polish-preset">SurfacePolishPreset</a></code> | 없음 | 없음 | 화면별 전환, 이미지, 안전 여백 규칙을 반환한다. |
| `getActionFeedback()` | `public` | `actionType: <a href="#type-polish-action-type"><code>PolishActionType</code></a>`, `status: "success" \| "error"` | <code><a href="#type-polish-feedback">PolishFeedback</a> \| null</code> | 없음 | 없음 | 액션 결과에 맞는 짧은 피드백 메시지를 반환한다. |

##### c. 동작 규칙

- `getSurfacePolishPreset()`
  - `feed`는 이미지 우선 노출, `fade` 전환, 안전 하단 여백을 사용한다.
  - `detail`는 `viewport = "mobile"`이면 `sheet`, `viewport = "desktop"`이면 `fade` 전환을 사용한다.
  - `profile`은 3열 그리드 이미지 비율 유지와 빠른 썸네일 로딩을 우선한다.
  - `create`는 sticky 액션 영역과 미리보기 우선 흐름을 사용한다.
  - `auth`는 전환 연출을 최소화하고 입력 집중도를 우선한다.
- `getActionFeedback()`
  - `like` 성공 시 `좋아요`, `follow` 성공 시 `팔로잉`, `save` 성공 시 `저장됨`처럼 짧은 메시지를 반환한다.
  - `post-create` 성공 시 `게시됨`, `post-delete` 성공 시 `삭제됨`을 반환한다.
  - 에러 상태에서는 사용자가 이해하기 쉬운 짧은 오류 톤 메시지를 반환한다.
  - 모든 토스트는 기본적으로 `durationMs = 1600`을 사용한다.
  - 과한 모달형 피드백 대신 짧은 토스트만 사용한다.

##### d. 반환 규칙

- `getSurfacePolishPreset()`

| 상황 | 반환값 |
| --- | --- |
| `feed` | `transitionMode: "fade"`, `useProgressiveImage: true`, `useActionToast: true`, `useSafeAreaPadding: true` |
| `detail`, `viewport = "mobile"` | `transitionMode: "sheet"`, `useProgressiveImage: true`, `useActionToast: true`, `useSafeAreaPadding: true` |
| `detail`, `viewport = "desktop"` | `transitionMode: "fade"`, `useProgressiveImage: true`, `useActionToast: true`, `useSafeAreaPadding: true` |
| `profile` | `transitionMode: "fade"`, `useProgressiveImage: true`, `useActionToast: true`, `useSafeAreaPadding: false` |
| `create` | `transitionMode: "fade"`, `useProgressiveImage: true`, `useActionToast: true`, `useSafeAreaPadding: true` |
| `auth` | `transitionMode: "none"`, `useProgressiveImage: false`, `useActionToast: false`, `useSafeAreaPadding: false` |

- `getActionFeedback()`

| 상황 | 반환값 |
| --- | --- |
| 액션 성공 | `message: string`, `tone: "success"`, `durationMs: 1600` |
| 액션 실패 | `message: string`, `tone: "error"`, `durationMs: 1600` |

### D. 레포지토리

polish 기능은 레포지토리 계층을 사용하지 않는다.

#### I. API 타입

해당 없음.

#### II. 레포지토리 사용

##### a. 레포지토리 요약

| 항목 | 내용 |
| --- | --- |
| 레포지토리명 | 없음 |
| 역할 | polish 기능은 비즈니스 API 요청을 직접 수행하지 않는다. |
| 호출 API | 없음 |

##### b. 함수

없음.

##### c. 요청 규칙

없음.

##### d. 동작 규칙

- polish 기능은 각 기능의 성공/실패 결과를 받아서 표현만 조정하므로 레포지토리를 호출하지 않는다.

##### e. 반환 규칙

없음.

### E. 서버

polish 기능은 서버 API를 직접 사용하지 않는다.

#### I. polish API

##### a. API 요약

| 항목 | 내용 |
| --- | --- |
| API 이름 | 없음 |
| 메서드 | 없음 |
| URL | 없음 |
| 요청 본문 | 없음 |
| 처리 | polish 기능은 서버 요청 없이 클라이언트 상호작용의 마감 품질만 관리한다. |
| 응답 | 없음 |

##### b. 요청 본문 예시

없음.

##### c. 응답 예시

없음.

## 3. 디자인 참조

polish 기능의 상세 UI 규칙은 디자인 시스템 문서를 기준으로 참조하고, 이 문서에서는 인스타그램에 가까운 마감 방향만 연결한다.

### A. 디자인 참조 문서

| 구분 | 문서 | 역할 |
| --- | --- | --- |
| 전체 디자인 시스템 | [design-system.md](../../layout/design-system.md) | 토큰, 무드, 상태, 레이아웃 기준 |
| 화면 조합 패턴 | [screen-patterns.md](../../layout/design-system/screen-patterns.md) | 피드, 상세, 프로필, 작성 화면의 인스타그램형 패턴 기준 |
| 공통 UI 컴포넌트 | [components-ui.md](../../layout/design-system/components-ui.md) | 버튼, 토스트, 이미지, 상호작용 상태 기준 |
| 공통 레이아웃 컴포넌트 | [components-layout.md](../../layout/design-system/components-layout.md) | 오버레이, 헤더, 안전 여백, 셸 마감 기준 |
