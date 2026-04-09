# SNS MVP 구조 및 구현 계획

## 1. 최종 기능 범위

| Category | Include in MVP | Why |
| --- | --- | --- |
| Auth | Yes | 진입 지점과 세션 경계가 명확해야 한다. |
| Home feed | Yes | 제품 경험의 중심이다. |
| Post detail | Yes | 피드에서 더 깊은 소비 경험이 필요하다. |
| Likes and comments | Yes | 반응이 있어야 SNS처럼 느껴진다. |
| Create post | Yes | 생성이 빠지면 루프가 닫히지 않는다. |
| Profile | Yes | 정체성과 아카이브는 인스타형 UX의 핵심이다. |
| Follow | Yes | 범위는 작지만 사회적 맥락을 만든다. |
| Search or explore | No | 있으면 좋지만 닫힌 사용자 흐름에는 필수는 아니다. |
| Stories, reels, DM | No | 현재 마감 기준으로 비용이 너무 크다. |

## 2. 핵심 라우트 맵

| Route | Purpose | Priority |
| --- | --- | --- |
| `/login` | 데모 계정 기반의 빠른 진입 | High |
| `/` | 홈 피드 | High |
| `/p/[postId]` | 게시물 상세와 댓글 | High |
| `/create` | 게시물 작성 | High |
| `/u/[username]` | 프로필 페이지 | High |

## 3. 권장 폴더 구조

```text
app/
  (auth)/
    login/
      page.tsx
  (main)/
    layout.tsx
    page.tsx
    create/
      page.tsx
    p/
      [postId]/
        page.tsx
    u/
      [username]/
        page.tsx
  globals.css
  layout.tsx
  not-found.tsx

components/
  auth/
    login-form.tsx
  feed/
    feed-list.tsx
    post-card.tsx
  post/
    post-detail.tsx
    post-actions.tsx
    comment-form.tsx
    create-post-form.tsx
  profile/
    profile-header.tsx
    profile-grid.tsx
    follow-button.tsx
  shared/
    app-header.tsx
    bottom-nav.tsx
    empty-state.tsx
    section-title.tsx
  ui/
    button.tsx
    avatar.tsx
    input.tsx
    textarea.tsx
    badge.tsx

lib/
  actions/
    auth.ts
    post.ts
    interaction.ts
    profile.ts
  queries/
    feed.ts
    post.ts
    profile.ts
  repositories/
    mock/
      data.ts
      repository.ts
    index.ts
  session/
    auth.ts
    cookies.ts
  validators/
    auth.ts
    post.ts
    comment.ts
  utils/
    format.ts
    time.ts

types/
  auth.ts
  user.ts
  post.ts
  comment.ts
```

## 4. 컴포넌트 구조

### 전역 레이아웃

- `app/layout.tsx`
- `components/shared/app-header.tsx`
- `components/shared/bottom-nav.tsx`

### 피드 라우트

- `app/(main)/page.tsx`
- `components/feed/feed-list.tsx`
- `components/feed/post-card.tsx`

### 게시물 라우트

- `app/(main)/p/[postId]/page.tsx`
- `components/post/post-detail.tsx`
- `components/post/post-actions.tsx`
- `components/post/comment-form.tsx`

### 작성 라우트

- `app/(main)/create/page.tsx`
- `components/post/create-post-form.tsx`

### 프로필 라우트

- `app/(main)/u/[username]/page.tsx`
- `components/profile/profile-header.tsx`
- `components/profile/profile-grid.tsx`
- `components/profile/follow-button.tsx`

## 5. 상태관리 설계

### 원칙

- 서버 상태는 기본적으로 Server Component에서 조회한다.
- 데이터 변경은 Server Action으로 처리한다.
- 클라이언트 상태는 상호작용 UI에만 한정한다.
- 진짜 막히는 지점이 생기기 전에는 전역 스토어를 도입하지 않는다.

### 상태 소유권

| State type | Owner | Tool |
| --- | --- | --- |
| Session | Server | cookies plus session helper |
| Feed data | Server | page query function |
| Post detail data | Server | page query function |
| Profile data | Server | page query function |
| Like pending state | Client island | `useTransition` or `useOptimistic` |
| Comment form errors | Client | `useActionState` |
| Create post draft | Client | local component state |
| Global navigation state | Local layout client component only if needed | `useState` |

### 권장 규칙

- 시작은 Zustand 없이 간다.
- 드래프트가 라우트 전환을 넘어 유지되어야 할 때만 Zustand를 검토한다.
- 1차가 목업 데이터여도 데이터 권한은 서버 쪽 설계에 둔다.

## 6. 데이터 모델 초안

### User

- `id`
- `username`
- `displayName`
- `avatarUrl`
- `bio`
- `followerCount`
- `followingCount`

### Post

- `id`
- `authorId`
- `imageUrl`
- `caption`
- `createdAt`
- `likeCount`
- `commentCount`

### Comment

- `id`
- `postId`
- `authorId`
- `content`
- `createdAt`

### Like

- `userId`
- `postId`

### Follow

- `followerId`
- `followingId`

## 7. 구현 전략

### 1차

- 속도를 위해 시드 기반 목업 데이터로 먼저 만든다.
- 저장소 인터페이스를 두어 이후 Supabase나 다른 백엔드로 교체 가능하게 한다.
- 실제 파일 업로드는 1차 필수 조건이 아니라 확장 목표로 둔다.

### 시간이 남으면 2차

- 목업 저장소를 영속 백엔드로 교체
- 실제 업로드 스토리지 추가
- 모달형 상세 라우트나 탐색 페이지 추가

## 8. 1차 구현 순서

1. Global layout, design tokens, navigation, and mock data shape
2. Login flow and session guard
3. Home feed route
4. Post detail with like and comment
5. Create post form
6. Profile and follow action
7. Empty, loading, and error states
8. Metadata and responsive polish

## 9. Next.js 16 주의사항

- `app` router만 사용한다.
- `metadata` export는 Server Component에 둔다.
- 데이터 변경은 Server Action을 우선한다.
- 진짜 요청 핸들러가 필요할 때만 `route.ts`를 만든다.
- 같은 세그먼트에 `page.tsx`와 `route.ts`를 함께 두지 않는다.
- `"use client"` 경계는 작게 유지한다.
- 외부 이미지를 쓰면 `next.config.ts`에 `images.remotePatterns`를 설정한다.

## 10. 마감 전 polish 체크리스트

- 피드, 상세, 작성, 프로필이 끝까지 이어서 동작한다.
- 주요 페이지마다 로딩 상태와 빈 상태가 있다.
- 폼 에러가 눈에 띄고 읽기 쉽다.
- 모바일 레이아웃이 먼저 안정적이고, 데스크톱도 깨지지 않는다.
- 이미지 비율이 안정적으로 유지된다.
- 헤더, 간격, 타이포그래피가 의도적으로 보인다.
- 메타데이터 title과 description이 커스텀되어 있다.
- 데모 계정과 시드 콘텐츠의 톤이 일관된다.
- 버튼에 hover, active, disabled 상태가 있다.
- 키보드 포커스가 보인다.
- 기본 not-found와 error 처리가 있다.
