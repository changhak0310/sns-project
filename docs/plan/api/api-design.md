# API 설계 명세

## 1. 범위

- 대상: 현재 SNS Web MVP
- 기준: `Next.js 16 App Router`
- 목적: 웹 MVP의 API 구현 기준 통일

## 2. 기본 원칙

- 조회: `Server Component -> lib/queries(optional) -> lib/social-repository`
- 변경: `Client/Form/Event -> lib/actions/* -> lib/social-repository`
- 기본 CRUD용 `app/api/*/route.ts`는 만들지 않는다.
- `route.ts`는 공개 HTTP API, 업로드, webhook, callback이 필요할 때만 사용한다.
- 모든 인증/인가 검사는 `Server Action` 또는 `Route Handler` 내부에서 다시 수행한다.
- `page.tsx`, `features/*`는 시드 데이터나 Firebase를 직접 호출하지 않는다.

## 3. 레이어 명세

| 레이어 | 역할 | 금지 |
| --- | --- | --- |
| `app/*` | 라우팅, 페이지 조합, `params/searchParams` 처리 | 데이터 소스 직접 접근 |
| `lib/queries/*` | 화면 전용 read model 조합 | mutation |
| `lib/actions/*` | mutation 진입점 | UI 렌더링 |
| `lib/social-repository/*` | 데이터 접근 단일 진입점 | UI/route 의존 |
| `app/api/v1/*` | 공개 HTTP API | 내부 화면 조회 대체 |

## 4. 필수 내부 API

### 4-1. Query

```ts
getFeedPageData(input: { viewerId: string })
getPostDetailPageData(input: { viewerId: string; shortcode: string })
getProfilePageData(input: { viewerId: string; username: string; tab?: 'posts' | 'saved' })
getExplorePageData(input: { viewerId: string; q?: string })
getNotificationsPageData(input: { viewerId: string; filter?: 'all' | 'like' | 'comment' | 'follow' })
```

### 4-2. Action

| 파일 | 액션 |
| --- | --- |
| `lib/actions/auth.ts` | `signupAction`, `loginAction`, `logoutAction` |
| `lib/actions/post.ts` | `createPostAction` |
| `lib/actions/interaction.ts` | `toggleLikeAction`, `createCommentAction`, `toggleSaveAction` |
| `lib/actions/profile.ts` | `toggleFollowAction`, `updateProfileAction` |

### 4-3. Repository

```ts
getFeed(input: { viewerId: string; cursor?: string; limit?: number })
getPost(input: { shortcode: string; viewerId: string })
getProfile(input: { username: string; viewerId: string })
getSavedPosts(input: { userId: string })
getExplore(input: { viewerId: string; q?: string })
getNotifications(input: { viewerId: string; filter?: 'all' | 'like' | 'comment' | 'follow' })
findUserByEmail(input: { email: string })
findUserByUsername(input: { username: string })
createUser(input: SignupInput)
createPost(input: CreatePostInput)
createComment(input: { shortcode: string; authorId: string; content: string })
toggleLike(input: { shortcode: string; viewerId: string })
toggleSave(input: { shortcode: string; viewerId: string })
toggleFollow(input: { username: string; viewerId: string })
updateProfile(input: { userId: string; avatarUrl: string; displayName: string; bio: string })
```

## 5. 세션/검증 명세

### 5-1. 세션

- 쿠키는 `httpOnly`, `sameSite='lax'`, `path='/'` 기본값 사용
- production에서는 `secure` 사용
- 세션에는 `passwordHash` 저장 금지
- `cookies()`는 async 기준으로 사용

### 5-2. 입력 규칙

| 항목 | 규칙 |
| --- | --- |
| `email` | trim + lowercase normalize |
| `password` | 최소 8자 |
| `displayName` | trim 후 필수 |
| `bio` | 최대 160자 |
| `caption` | trim 후 1~300자 |
| `tab` | `posts` 또는 `saved` |
| `filter` | `all`, `like`, `comment`, `follow` |
| `redirect` | `/`로 시작하는 내부 경로만 허용 |

## 6. Next.js 16 규칙

- `params`와 `searchParams`는 async 기준으로 처리한다.
- `Route Handler`의 `context.params`도 Promise 기준으로 처리한다.
- `page.tsx`와 같은 세그먼트에 `route.ts`를 같이 두지 않는다.
- Server Component에서 자기 앱의 `Route Handler`를 다시 호출해 데이터를 읽지 않는다.

## 7. 재검증 기준

| 액션 | 최소 재검증 대상 |
| --- | --- |
| `createPostAction` | `/`, `/u/[username]`, `/p/[shortcode]` |
| `toggleLikeAction` | `/`, `/p/[shortcode]` |
| `createCommentAction` | `/p/[shortcode]` |
| `toggleSaveAction` | `/p/[shortcode]`, `/u/[username]?tab=saved` |
| `toggleFollowAction` | `/u/[username]`, `/explore` |
| `updateProfileAction` | `/u/[username]` |

## 8. 공개 HTTP API 도입 조건

아래 경우에만 `app/api/v1/*`를 추가한다.

- 모바일 앱 또는 외부 클라이언트 지원
- 업로드 서명 생성
- webhook 또는 OAuth callback
- health check, rss, `llms.txt` 같은 비 UI 응답

## 9. 공개 HTTP API 초안

| Method | Path | 목적 |
| --- | --- | --- |
| `POST` | `/api/v1/auth/signup` | 회원가입 |
| `POST` | `/api/v1/auth/login` | 로그인 |
| `POST` | `/api/v1/auth/logout` | 로그아웃 |
| `GET` | `/api/v1/auth/me` | 현재 사용자 조회 |
| `GET` | `/api/v1/feed` | 피드 조회 |
| `GET` | `/api/v1/posts/[shortcode]` | 게시물 상세 조회 |
| `POST` | `/api/v1/posts` | 게시물 생성 |
| `POST` | `/api/v1/posts/[shortcode]/comments` | 댓글 생성 |
| `PUT` | `/api/v1/posts/[shortcode]/like` | 좋아요 |
| `DELETE` | `/api/v1/posts/[shortcode]/like` | 좋아요 취소 |
| `PUT` | `/api/v1/posts/[shortcode]/save` | 저장 |
| `DELETE` | `/api/v1/posts/[shortcode]/save` | 저장 취소 |
| `GET` | `/api/v1/users/[username]` | 프로필 조회 |
| `PUT` | `/api/v1/users/[username]/follow` | 팔로우 |
| `DELETE` | `/api/v1/users/[username]/follow` | 언팔로우 |
| `PATCH` | `/api/v1/me/profile` | 내 프로필 수정 |
| `GET` | `/api/v1/explore` | 탐색 조회 |
| `GET` | `/api/v1/notifications` | 알림 조회 |

## 10. 결론

- 현재 MVP의 기본 API는 `REST`가 아니라 `Server Action + Query + SocialRepository`다.
- `route.ts`는 예외적으로만 사용한다.
- 외부 공개 API가 필요해지면 `/api/v1/*`로 추가하되, 기존 `validator`, `session`, `repository`를 재사용한다.
