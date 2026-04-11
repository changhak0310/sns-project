# 로그아웃 명세

## 1. 상태 변수 및 함수 정의

로그아웃 기능은 공통 셸 레이아웃 안에서 전역 인증 상태에 따라 로그인 버튼 또는 프로필 버튼과 로그아웃 버튼을 노출하고, 로그아웃 요청 결과를 훅 상태로 관리한다.

### A. 타입 정의

#### I. 공통 타입

<a id="type-session-user"></a>

##### a. `SessionUser`

```ts
type SessionUser = {
  id: number;
  email: string;
  username: string;
  name: string;
};
```

### B. 상태 변수 정의

| 변수명 | 타입 | 설명 | 초기값 | 사용 컴포넌트 |
| --- | --- | --- | --- | --- |
| `sessionUser` | <a href="#type-session-user"><code>SessionUser</code></a> \| null | 현재 로그인 상태를 판단하는 전역 세션 사용자 정보, 값이 없으면 로그인 버튼만 노출한다 | `auth store 또는 session의 현재 값` | `AuthActionArea`, `LoginLinkButton`, `ProfileLinkButton`, `LogoutButton` |
| `actionError` | `string` | 로그아웃 요청 실패 시 액션 영역에 보여줄 메시지 | `""` | `AuthActionArea`, `LogoutErrorMessage` |
| `isLoading` | `boolean` | 로그아웃 요청 진행 여부 | `false` | `AuthActionArea`, `LogoutButton` |

### C. 함수 정의

| 함수명 | 시그니처 | 역할 | 사용 컴포넌트 |
| --- | --- | --- | --- |
| `logout()` | `() => Promise<void>` | 로그아웃 요청을 실행하고 성공 시 전역 세션 사용자 상태를 제거한다. | `AuthActionArea`, `LogoutButton` |

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

로그아웃 기능은 공통 셸 안에서 인증 액션 영역을 기준으로 동작한다.

#### I. 컴포넌트 구조

```text
AppHeader
  -> AuthActionArea
    -> LoginLinkButton
    -> ProfileLinkButton
    -> LogoutButton
    -> LogoutErrorMessage

DesktopSidebar
  -> AuthActionArea
    -> LoginLinkButton
    -> ProfileLinkButton
    -> LogoutButton
    -> LogoutErrorMessage
```

#### II. 컴포넌트 타입

<a id="type-auth-action-area-props"></a>

##### a. `AuthActionAreaProps`

```ts
type AuthActionAreaProps = {
  loginHref: string;
  profileHref: string;
};
```

<a id="type-auth-link-button-props"></a>

##### b. `AuthLinkButtonProps`

```ts
type AuthLinkButtonProps = {
  href: string;
  label: string;
};
```

<a id="type-logout-button-props"></a>

##### c. `LogoutButtonProps`

```ts
type LogoutButtonProps = {
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
};
```

<a id="type-logout-error-message-props"></a>

##### d. `LogoutErrorMessageProps`

```ts
type LogoutErrorMessageProps = {
  message: string;
};
```

#### III. 컴포넌트 정의

| 컴포넌트명 | 역할 | 사용하는 Hook | 받는 props | 이벤트에서 호출하는 함수 | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `AuthActionArea` | 로그인되지 않았으면 로그인 버튼만, 로그인되어 있으면 프로필 버튼과 로그아웃 버튼을 함께 노출한다. | `useLogout()` | <a href="#type-auth-action-area-props"><code>AuthActionAreaProps</code></a> | 없음 | `actionError`, `isLoading` |
| `LoginLinkButton` | `sessionUser = null`일 때 로그인 페이지 이동 버튼을 노출한다. | 없음 | <a href="#type-auth-link-button-props"><code>AuthLinkButtonProps</code></a> | 없음 | 없음 |
| `ProfileLinkButton` | `sessionUser`가 있을 때 프로필 페이지 이동 버튼을 노출한다. | 없음 | <a href="#type-auth-link-button-props"><code>AuthLinkButtonProps</code></a> | 없음 | 없음 |
| `LogoutButton` | 로그인된 상태에서 로그아웃 버튼을 노출하고, `isLoading = true`일 때 비활성화한다. | 없음 | <a href="#type-logout-button-props"><code>LogoutButtonProps</code></a> | `onClick -> logout()` | 없음 |
| `LogoutErrorMessage` | 로그아웃 요청 실패 메시지를 출력한다. | 없음 | <a href="#type-logout-error-message-props"><code>LogoutErrorMessageProps</code></a> | 없음 | 없음 |

### B. 훅

로그아웃 훅은 공통 셸 액션 상태와 로그아웃 요청 흐름을 관리한다.

#### I. 훅 타입

<a id="type-logout-state"></a>

##### a. `LogoutState`

```ts
type LogoutState = {
  actionError: string;
  isLoading: boolean;
};
```

<a id="type-logout-computed"></a>

##### b. `LogoutComputed`

```ts
type LogoutComputed = {
  sessionUser: SessionUser | null;
};
```

<a id="type-logout-actions"></a>

##### c. `LogoutActions`

```ts
type LogoutActions = {
  logout: () => Promise<void>;
};
```

<a id="type-use-logout-return"></a>

##### d. `UseLogoutReturn`

```ts
type UseLogoutReturn = LogoutState & LogoutComputed & LogoutActions;
```

#### II. useLogout

##### a. 훅 요약

| 항목 | 내용 |
| --- | --- |
| 훅명 | `useLogout()` |
| 역할 | 로그아웃 UI 상태 관리, 로그아웃 요청 실행, 로그아웃 결과 상태 갱신 |
| 호출 Service | `logoutService.logout()` |
| 내부 참조값 | auth store 또는 session의 현재 `sessionUser` |

##### b. 상태

| 변수 명 | 범위 | 초기 값 | 역할 |
| --- | --- | --- | --- |
| `actionError` | `public` | `""` | 로그아웃 결과 상태 관리 |
| `isLoading` | `public` | `false` | 로그아웃 요청 실행 |

##### c. 참조값

| 변수 명 | 출처 | 역할 |
| --- | --- | --- |
| `sessionUser` | `auth store 또는 session` | 현재 로그인 여부를 판단하고 로그아웃 버튼 노출 여부를 결정한다. |

##### d. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 service | 관리하는 state |
| --- | --- | --- | --- | --- | --- |
| `logout()` | `public` | 없음 | `Promise<void>` | <code>logoutService.logout(): Promise&lt;<a href="#type-logout-result">LogoutResult</a>&gt;</code> | `actionError`, `isLoading` |

##### e. 동작 규칙

- `logout()`
  - `sessionUser = null`이면 로그아웃 요청을 진행하지 않는다.
  - 시작 시 `isLoading = true`, `actionError = ""`
  - 실행 중 `logoutService.logout()`을 호출한다.
  - 성공 시 전역 auth store 또는 session의 `sessionUser = null`로 갱신하고 `/login`으로 이동한다.

##### f. 상태 갱신 규칙

| 상황 | 상태 갱신 |
| --- | --- |
| 성공 | `actionError = ""` |
| 실패 | `actionError = message` |
| 종료 | `isLoading = false` |

### C. 서비스

로그아웃 서비스는 로그아웃 요청과 세션 종료 결과 반환만 담당한다.

#### I. 서비스 타입

<a id="type-logout-result"></a>

##### a. `LogoutResult`

```ts
type LogoutResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };
```

#### II. `logoutService`

##### a. 서비스 요약

| 항목 | 내용 |
| --- | --- |
| 서비스명 | `logoutService` |
| 역할 | 로그아웃 비즈니스 흐름 수행, 레포지토리 호출, 최종 결과 반환 |
| 호출 Repository | `authRepository.logout()` |

##### b. 함수

| 함수 명 | 범위 | 받는 props | return 값 | 호출하는 대상 | 실패 메시지 | 역할 |
| --- | --- | --- | --- | --- | --- | --- |
| `logout()` | `public` | 없음 | <code>Promise&lt;<a href="#type-logout-result">LogoutResult</a>&gt;</code> | <code>authRepository.logout(): Promise&lt;<a href="#type-logout-api-response">LogoutApiResponse</a>&gt;</code> | `로그아웃 처리 중 문제가 발생했습니다.`<br>`서버 오류가 발생했습니다.`<br>`네트워크 오류가 발생했습니다. 다시 시도해주세요.` | 로그아웃 성공/실패 결과를 반환한다. |

##### c. 동작 규칙

- `logout()`
  - `authRepository.logout()`을 호출한다.
  - 서버가 세션 삭제를 완료하면 로그아웃 성공 결과를 반환한다.
  - 로그아웃 성공 시 훅 또는 컴포넌트에서 `/login`으로 이동한다.

##### d. 반환 규칙

- `logout()`

| 상황 | 반환값 |
| --- | --- |
| 로그아웃 성공 | `success: true` |
| 로그아웃 실패 | `success: false`, `message: string` |

### D. 레포지토리

레포지토리는 로그아웃 API 요청과 응답 처리만 담당한다.

#### I. API 타입

<a id="type-logout-api-response"></a>

##### a. `LogoutApiResponse`

```ts
type LogoutApiResponse = LogoutResult;
```

#### II. `authRepository`

##### a. 레포지토리 요약

| 항목 | 내용 |
| --- | --- |
| 레포지토리명 | `authRepository` |
| 역할 | API 요청 전송, 서버 응답 수신, 응답 데이터를 서비스 계층에 전달 |
| 호출 API | `POST /api/auth/logout` |

##### b. 함수

| 함수 명 | 받는 props | return 값 | 호출하는 API | 역할 |
| --- | --- | --- | --- | --- |
| `logout()` | 없음 | <code>Promise&lt;<a href="#type-logout-api-response">LogoutApiResponse</a>&gt;</code> | `POST /api/auth/logout` | 로그아웃 API 요청 후 응답 결과를 반환한다. |

##### c. 요청 규칙

| 항목 | 내용 |
| --- | --- |
| Method | `POST` |
| URL | `/api/auth/logout` |
| 요청 본문 | 없음 |

##### d. 동작 규칙

- `logout()`
  - `POST /api/auth/logout`으로 요청을 전송한다.
  - 서버 응답을 <a href="#type-logout-api-response"><code>LogoutApiResponse</code></a> 형태로 반환한다.

##### e. 반환 규칙

| 상황 | 반환값 |
| --- | --- |
| 로그아웃 성공 | `success: true` |
| 로그아웃 실패 | `success: false`, `message: string` |

### E. 서버

#### I. 로그아웃 API

##### a. API 요약

| 항목 | 내용 |
| --- | --- |
| API 이름 | 로그아웃 API |
| Method | `POST` |
| URL | `/api/auth/logout` |
| 요청 본문 | 없음 |
| 처리 | 현재 로그인 세션을 삭제하고 로그아웃 성공/실패 결과를 반환한다. |
| Response | `success` 또는 `message` |

##### b. 요청 본문 예시

없음.

##### c. 응답 예시

###### 1. 성공 응답 예시

```json
{
  "success": true
}
```

###### 2. 실패 응답 예시

```json
{
  "success": false,
  "message": "로그아웃 처리 중 문제가 발생했습니다."
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

로그아웃 기능의 상세 UI 규칙은 셸 레이아웃과 공통 버튼 규칙 문서를 참조한다.

### A. 디자인 참조 문서

| 구분 | 문서 | 역할 |
| --- | --- | --- |
| 전체 디자인 시스템 | [design-system.md](../../layout/design-system.md) | 토큰, 무드, 상태, 레이아웃 기준 |
| 화면 조합 패턴 | [screen-patterns.md](../../layout/design-system/screen-patterns.md) | 메인 셸과 인증 전환 화면 패턴 기준 |
| 공통 UI 컴포넌트 | [components-ui.md](../../layout/design-system/components-ui.md) | `Button`, 링크 버튼 등 공통 UI 기준 |
| 공통 레이아웃 컴포넌트 | [components-layout.md](../../layout/design-system/components-layout.md) | `AppHeader`, `DesktopSidebar` 등 공통 셸 레이아웃 기준 |
