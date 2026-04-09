# Next.js 아키텍처 명세

> 목적: AI와 사람이 같은 구조와 같은 판단으로 구현하도록 강제하는 기준 문서

## 1. 핵심 원칙

- 기술 스택: `Next.js 16 + React 19 + TypeScript + Tailwind CSS 4`
- 기본 조회 경로: `Page/Layout(Server Component) -> Query(optional) -> SocialRepository -> Data Source`
- 기본 상호작용 경로는 세 갈래로 나눈다.
  - UI 전용 상태: `Client Component -> page/feature local state`
  - 경량 전역 상호작용: `Client Component -> SessionProvider`
  - 영속 mutation: `Form/Event -> Server Action -> SocialRepository -> Data Source -> revalidate/refresh/redirect`
- `activeNav`, `canGoBack`, `redirectTo`, `activeTab`, `selectedShortcode`, `isOverlayOpen`처럼 라우트에서 파생 가능한 값은 `params`, `searchParams`, `pathname`, `@modal` 슬롯에서 계산한다.
- `app/route.ts`는 기본 CRUD 경로로 사용하지 않는다. mutation의 기본 진입점은 `lib/actions/*` Server Action이다.
- 데이터 소스의 1차 추상화 책임은 `SocialRepository`에 둔다.
- 보안의 1차 책임은 인증 공급자, 세션 검증, 데이터 소스 권한 규칙, Server Action 내부 검증에 둔다. 앱 코드는 이를 우회하지 않는다.
- 단방향 데이터 흐름만 허용한다.
- `app`는 라우팅과 조합 전용으로 유지하고, 재사용 로직은 `features`, `components`, `lib`, `data`, `types`로 분리한다.
- `lib/actions`, `lib/queries`, `lib/social-repository`, `lib/firebase` 같은 서버 전용 모듈은 client bundle로 새지 않도록 `server-only` 경계를 우선 고려한다.

## 2. 모듈 경계

이 프로젝트는 Next.js App Router 기준으로 아래 디렉터리 경계와 import 규칙으로 모듈화를 구현한다.

- `app`: 라우트, 레이아웃, 메타데이터, 슬롯 조합, 가드 진입점
- `features`: 기능 구현과 상호작용 소유
- `components`: 공통 UI, 공통 레이아웃, feature 정책이 없는 얇은 표현 계층
- `lib`: queries, actions, repository, session, validators, utils, firebase 같은 전역 기반
- `data`: 시드 데이터와 읽기 전용 데모 데이터
- `types`: 공통 도메인 타입

의존성 규칙:

```text
app -> features, components, lib, types
features -> components, lib, types
components -> lib, types
lib -> data, types
data -> types
types -> nothing
```

금지 규칙:

- feature -> 다른 feature 내부 직접 참조 금지
- components -> feature 참조 금지
- app/page 또는 app/layout -> `data/seed` 직접 참조 금지
- lib 외부 레이어 -> Firebase SDK 또는 외부 데이터 소스 직접 호출 금지
- data -> app, features, components, lib 참조 금지
- `lib/actions`, `lib/queries`, `lib/social-repository`, `lib/firebase`를 Client Component에서 직접 소비하는 구조 금지

## 3. 레이어 책임

| 레이어 | 역할 | 금지 |
| --- | --- | --- |
| `app` | 라우트, 레이아웃, 메타데이터, loading/error/not-found/default, 화면 조합, 세션 가드 진입 | 기능 세부 로직 소유, 데이터 소스 직접 호출 |
| `features` | 기능별 UI, 기능별 상호작용, 낙관적 UI, 기능 전용 훅/모델 | 다른 feature 내부 직접 참조, 데이터 소스 직접 호출 |
| `components` | 공통 UI 프리미티브, 공통 레이아웃, 얇은 표현용 도메인 컴포넌트 | 기능 상태/정책 소유, repository 직접 호출 |
| `lib` | repository, queries, actions, session, validators, firebase, utils 같은 전역 기반 | 화면 소유, feature UI 소유 |
| `data` | 시드 데이터, 데모 fixture | UI 로직, 상태 로직, 권한 로직 소유 |
| `types` | 도메인 계약과 공통 타입 | 실행 로직 소유 |

## 4. Next.js 기준 책임 분리

### `app`

- `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `global-error.tsx`, `not-found.tsx`, `default.tsx`, `template.tsx`, `opengraph-image.tsx`, `twitter-image.tsx` 같은 Next.js 파일 규약을 라우트 책임에 맞게 둔다.
- `(auth)`, `(main)` 같은 route group으로 셸을 나누고, `@modal` 같은 parallel route와 인터셉트 라우트로 오버레이 UX를 구현할 수 있다.
- Page와 Layout은 서버에서 세션, `params`, `searchParams`, query helper를 읽고 필요한 데이터를 조합한다.
- Main Layout은 공통 셸과 인증 가드를 소유하고, 필요하면 `children`과 `modal` 슬롯을 함께 렌더링한다.
- Page는 feature 컴포넌트를 조합하고 로딩/에러/빈 상태/not-found 분기를 책임진다.

금지:

- `fetch`, Firebase SDK, 시드 데이터 파일을 page에서 직접 호출
- 공통 비즈니스 로직 중복 작성
- `use client`를 페이지 전체에 넓게 붙이는 방식
- `page.tsx`와 같은 세그먼트에 `route.ts`를 나란히 두는 설계
- `selectedShortcode`, `activeTab`, `redirectTo` 같은 URL 파생값을 별도 전역 상태로 승격하는 방식

### `features`

- 피드, 게시물 상세, 작성, 프로필, 인증처럼 상태와 상호작용을 소유하는 기능 단위 구현을 둔다.
- 기능 전용 컴포넌트, 경량 훅, 뷰 모델 변환, 액션 wiring, 낙관적 반응 UI를 소유한다.
- 필요하면 feature 내부에 `_components`, `hooks`, `model` 같은 세부 폴더를 둔다.
- 게시물 좋아요, 댓글 작성, 저장, 팔로우 같은 mutation 연결은 기본적으로 해당 feature가 소유한다.

금지:

- 다른 feature 내부 구현 직접 import
- 시드 데이터나 Firebase 클라이언트 직접 import
- 기능 정책을 `components/ui`나 `components/layout`로 밀어 올리는 방식

### `components`

- `components/ui`: Button, IconButton, Avatar, Card, Tabs, Sheet, Input, Textarea 같은 공통 프리미티브
- `components/layout`: AppHeader, BottomNav, DesktopSidebar, ShellFrame, EmptyState, LoadingState 같은 공통 레이아웃 조각
- `components/<domain>`: `explore`, `notification`, `profile`처럼 feature 정책이 얇고 표현 위주인 라우트 계열 UI 묶음

규칙:

- 공통 컴포넌트는 Props 기반으로만 통신한다.
- 공통 컴포넌트는 feature store나 feature 상태를 알지 못해야 한다.
- 공통 컴포넌트는 repository를 직접 호출하지 않는다.
- `components/<domain>`은 읽기 전용 뷰 조합이나 얇은 폼 표현까지만 허용한다.
- `components/<domain>`이 고유 상태, 낙관적 처리, mutation 정책을 가지기 시작하면 `features/<feature>`로 승격한다.

### `lib`

#### `lib/social-repository`

- 데이터 접근의 유일한 진입점이다.
- 조회와 mutation 계약은 `getFeed`, `getPost`, `getProfile`, `getSavedPosts`, `getExplore`, `getNotifications`, `createPost`, `createComment`, `toggleLike`, `toggleSave`, `toggleFollow`, `createUser`, `findUserByEmail`, `updateProfile`처럼 기능 기준으로 확장한다.
- v1에서는 시드 데이터 어댑터를 연결하고, 이후 Firebase 어댑터로 교체 가능하게 만든다.

규칙:

- repository만 `data/seed`를 읽는다.
- repository만 Firebase 또는 실제 백엔드와 연결한다.
- page와 feature는 데이터 소스가 시드인지 Firebase인지 몰라야 한다.
- source access, 영속화, ID/권한 기준 조회 계약은 query가 아니라 repository에 둔다.

#### `lib/queries`

- 서버 전용 조회 조합 계층이다.
- `feed.ts`, `post.ts`, `profile.ts`, `explore.ts`, `notification.ts`처럼 라우트나 화면 맥락별 read model을 만든다.
- 여러 repository 호출, viewer 기준 파생 필드, 빈 상태 플래그, 화면 전용 view model shaping을 담당한다.

규칙:

- query는 mutation하지 않는다.
- query는 쿠키를 쓰지 않는다.
- query는 UI 상태를 저장하지 않는다.
- repository 하나 호출만으로 충분하면 query를 생략할 수 있다.

#### `lib/actions`

- Server Action의 기본 위치다.
- `auth.ts`, `interaction.ts`, `post.ts`, `profile.ts`처럼 mutation 성격별로 파일을 나눈다.
- 액션은 입력 normalize/검증, 인증/권한 확인, repository mutation, `revalidatePath`/`revalidateTag`/`refresh`/`redirect`를 한 흐름으로 묶는다.

규칙:

- 모든 Server Action은 직접 `POST`로 호출될 수 있다고 가정하고 내부에서 인증과 권한을 검증한다.
- 액션은 UI를 렌더링하지 않는다.
- 액션은 repository를 우회해 시드 데이터나 Firebase를 직접 만지지 않는다.
- 액션은 직렬화 가능한 입력/출력만 노출한다.

#### `lib/session`

- 서버 세션 helper와 최소 범위 클라이언트 상태를 함께 관리한다.
- 서버 측 책임은 세션 읽기/쓰기/삭제, 현재 사용자 판별, 보호 라우트 가드 보조다.
- 클라이언트 측 책임은 `좋아요`, `저장`, `팔로우`, `작성 draft`, `로그인 세션 표시` 같은 경량 전역 상호작용만 허용한다.
- 구현은 `SessionProvider + reducer/context`를 기본으로 하되, Provider는 가능한 한 트리 깊게 둔다.

금지:

- 서버 데이터 전체를 client store로 복제
- 피드 목록, 게시물 상세, 프로필 전체를 전역 상태로 들고 있는 구조
- `redirectTo`, `activeTab`, `selectedShortcode`를 세션 store에 저장하는 구조

#### `lib/validators`

- `auth`, `profile`, `post`, `navigation` 같은 입력 규칙과 normalize 규칙을 둔다.
- `email` normalize, 비밀번호 길이, `displayName`/`bio` 제한, `redirect` query 검증, `tab` 허용값 검증 같은 pure validation을 담당한다.

규칙:

- validator는 side effect가 없는 순수 함수로 유지한다.
- redirect 보안 검증은 액션이나 page 안에서 중복 작성하지 않고 validator/helper로 통일한다.

#### `lib/firebase`

- stretch 단계 전용 인프라다.
- Firebase SDK 초기화, env 파싱, adapter 연결만 담당한다.
- UI와 직접 연결하지 않고 repository 뒤에서만 사용한다.

#### `lib/utils`

- 순수 함수만 허용한다.
- 포맷팅, className 병합, 날짜 표시, 숫자 축약 같은 공통 계산 로직을 둔다.
- React Hook이나 DOM 접근은 넣지 않는다.

### `data`

- MVP 시드 데이터와 데모용 fixture를 둔다.
- 사용자, 게시물, 댓글, 추천 계정, 알림 활동 피드 같은 큐레이션 데이터를 관리한다.
- 상태나 정책은 넣지 않는다.

### `types`

- `SocialUser`, `SocialPost`, `SocialComment`, `AuthSession`, `DraftPost`, `SessionState`, `CreatePostInput`, `ProfileEditInput`, `NotificationItem` 같은 계약을 둔다.
- feature와 repository, query 사이의 공통 언어 역할만 맡는다.

## 5. 파일 배치 규칙

새 코드는 아래 순서로 위치를 결정한다.

1. 라우트 진입점이면 `app/`
2. 특정 기능의 상태와 상호작용을 소유하면 `features/<feature>/`
3. 공통 UI 또는 얇은 표현 조각이면 `components/`
4. 전역 기반 로직이면 `lib/`
5. 읽기 전용 시드 데이터면 `data/`
6. 공통 계약 타입이면 `types/`

애매할 때 우선순위:

- `feature` vs `components` -> `feature`
- `components/<domain>` vs `feature` -> 기능 정책과 상태가 있으면 `feature`, 표현만 있으면 `components/<domain>`
- `query` vs `repository` -> 데이터 소스 접근이면 `repository`, 화면 조합과 view model shaping이면 `query`
- `action` vs `query` -> mutation, 권한 확인, redirect/revalidate가 있으면 `action`
- `params/searchParams` vs `local state` -> 공유 가능하고 새로고침에 안정적이어야 하면 URL 파생값
- `session` vs `local state` -> `local state`
- `client state` vs `server data` -> `server data`
- `hook` vs `utils` -> React 의존이 없으면 `utils`

## 5-1. 현재 구조 우선 원칙

- 작업 기준은 이 문서의 구조(`app / features / components / lib / data / types`)다.
- 새 기능은 `app` 안에 모든 구현을 몰아넣지 않는다.
- 공통 UI는 `components/`에 만들고, 기능 전용 UI는 `features/`에 만든다.
- 읽기 조합은 `lib/queries/*`, mutation은 `lib/actions/*`, 데이터 접근은 `lib/social-repository/*` 기준으로 추가한다.
- 인증, redirect, 입력 규칙은 `lib/session/*`, `lib/validators/*`에서 재사용 가능하게 관리한다.
- 새 시드/데모 데이터는 `data/seed` 기준으로 관리한다.

## 5-2. 스타터 코드 정리 규칙

- create-next-app 기본 화면 코드를 계속 확장하지 않는다.
- 스타터 자산과 예제 카피는 기능 구현과 함께 제거하거나 대체한다.
- `app/page.tsx`에 임시로 넣은 큰 JSX는 기능 확정 시 feature 컴포넌트로 분리한다.
- route segment 안 private folder는 해당 세그먼트 전용 뷰 보조 코드만 허용한다.
- 인터셉트 라우트를 도입할 때는 `@modal/default.tsx`와 catch-all 정리 라우트를 함께 설계한다.

## 6. 서버 계층과 mutation 규칙

기본 원칙은 "조회는 Server Component + query/repository, mutation은 Server Action"이다.

아래 경우에만 `route.ts`, 서버 전용 함수, 외부 업로드 엔드포인트를 도입한다.

- 비밀 키 또는 서비스 키가 필요한 작업
- 외부 API 중계가 필요한 작업
- 업로드 서명 생성 같은 서버 전용 작업
- 웹훅 검증이나 콜백 처리
- 여러 클라이언트가 같은 규칙을 공유해야 하는 강한 권한 로직
- 데이터 소스 규칙만으로 표현하기 어려운 권한 검사

규칙:

- 기본 CRUD를 한 번에 서버 라우트로 옮기지 않는다.
- mutation은 먼저 `lib/actions/*` Server Action으로 설계한다.
- 액션 내부에서 필요한 `revalidatePath`, `revalidateTag`, `refresh`, `redirect`를 명시적으로 결정한다.
- `cookies()` 접근은 세션 helper, Server Action, Route Handler 같은 서버 경계 안으로 제한한다.
- 승격 전에는 설계 문서부터 수정한다.
- `route.ts`는 UI용 데이터 페칭 대체물이 아니다.

## 7. 상태 관리와 URL 상태 규칙

- 전역 상태는 최소화한다.
- 피드 목록, 게시물 상세, 프로필, 탐색, 알림 데이터는 기본적으로 서버 데이터로 본다.
- `좋아요`, `저장`, `팔로우`, `작성 draft`, `로그인 세션 표시` 정도만 전역 후보로 본다.
- 입력값, 다이얼로그 열림 여부, 필터 상태, 미리보기 상태는 페이지 또는 feature 로컬 상태로 둔다.
- `redirect`, `tab`, `selectedShortcode`, `isOverlayOpen`, `activeNav`, `canGoBack`은 URL/라우트 파생값으로 관리한다.
- 같은 데이터를 서버와 클라이언트 store에 이중 저장하지 않는다.
- 피드 위치 유지 요구사항은 우선 브라우저 히스토리와 인터셉트 라우트 동작에 기대고, 전역 스토어는 기본 도입하지 않는다.

## 8. 네이밍 규칙

- Feature 폴더: `{domain}`
- Feature Component: `{Domain}{Name}.tsx`
- Shared UI Component: `{Name}.tsx`
- Domain Presentation Folder: `components/{domain}`
- Provider: `{Domain}Provider.tsx`
- Reducer: `{domain}-reducer.ts`
- Hook: `use{Name}.ts`
- Action 파일: `lib/actions/{domain}.ts`
- Query 파일: `lib/queries/{domain}.ts`
- Validator 파일: `lib/validators/{domain}.ts`
- Repository 파일: `{domain}-repository.ts` 또는 `index.ts`
- 입력/뷰 모델 타입: `{Domain}Input`, `{Domain}ViewModel`, `{Domain}Item`
- Boolean: `is`, `has`, `can`, `should` 접두사 사용

## 9. AI 작업 규칙

- 새 기능은 먼저 `features/<feature>` 기준으로 배치한다.
- `app`는 조합과 라우팅만 담당하게 유지한다.
- 공통으로 확실한 것만 `components`로 올린다.
- `components/<domain>`은 얇은 표현 전용일 때만 허용한다.
- 조회는 `lib/queries` 또는 `lib/social-repository` 뒤로 숨기고, mutation은 `lib/actions` 뒤로 숨긴다.
- 라우트에서 파생 가능한 값은 client state로 복제하지 않는다.
- 설계 규칙이 바뀌면 구현보다 문서 수정을 먼저 한다.
- 빠르게 만들더라도 `use client` 범위를 불필요하게 넓히지 않는다.
- stretch 기능(Firebase, 실제 업로드, 인증 확장)은 기존 경계를 깨지 않는 범위에서만 추가한다.

## 10. 최종 권장안

이번 SNS MVP의 최종 아키텍처 기준은 아래 조합이다.

- App Router 중심 라우트 구성
- route group + parallel/intercept route를 활용한 셸과 모달 구조
- Server Component + `lib/queries` 중심 조회
- `lib/actions` 중심 mutation
- `SocialRepository` 중심 데이터 추상화
- `SessionProvider + reducer/context` 중심 경량 전역 상태
- `data/seed` 기반 MVP와 `lib/firebase` 기반 stretch를 같은 계약 뒤에서 교체 가능하게 유지

이 구조면 지금은 시드 기반으로 빠르게 완성하고, 이후 탐색, 알림, 저장, 프로필 수정, Firebase 연동까지 붙일 때도 화면 구조와 서버 경계를 크게 흔들지 않고 확장할 수 있다.
