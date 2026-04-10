# 기능 05 - 게시물 상세와 반응

## 개요

| 항목 | 내용 |
| --- | --- |
| 라우트 | `/p/[shortcode]` |
| 페이지 | `app/(main)/p/[shortcode]/page.tsx` |
| 주요 액션 | `toggleLikeAction`, `createCommentAction` |
| 핵심 데이터 | 게시물 정보, 작성자 정보, 댓글 목록, 사용자 반응 상태, shareable permalink |
| 성공 후 | 단독 상세 페이지 갱신 또는 낙관적 UI 반영 |

## 유저 입장

### 유저 스토리

> 나는 공유받은 게시물 링크로 바로 들어오거나 새로고침해도 전체 상세 페이지를 보고, 좋아요와 댓글 반응을 하고 싶다.

### 사용자가 보게 되는 것

- 큰 게시물 이미지
- 작성자 정보
- 전체 캡션
- 댓글 목록
- 좋아요/댓글 입력 영역
- 프로필 이동 링크

### 사용자 흐름

1. `/p/[shortcode]` 직접 진입 또는 새로고침
2. 게시물 전체 내용 확인
3. 좋아요 클릭 또는 댓글 작성
4. 반응 결과 확인
5. 필요하면 작성자 프로필로 이동

### 유저 기준 핵심 규칙

- 같은 게시물 URL은 직접 열어도 정상 동작해야 한다.
- 홈 피드 맥락이 없으면 오버레이가 아니라 단독 페이지로 보여야 한다.
- 댓글이 없어도 화면이 깨지면 안 된다.
- 좋아요와 댓글은 즉시 반영돼야 한다.

## 개발자 입장

### 구조

#### 라우트 구조

```text
app/
  (main)/
    p/
      [shortcode]/
        page.tsx
        loading.tsx (optional)
        not-found.tsx (optional)
```

#### UI 구조

```text
features/
  post-detail/
    components/
      post-detail-page.tsx
      post-detail-content.tsx
      post-actions.tsx
      comment-list.tsx
      comment-form.tsx

components/
  ui/
    image-fallback.tsx
```

#### 액션 구조

```text
lib/actions/interaction.ts
  - toggleLikeAction
  - createCommentAction
```

#### 데이터 구조

```text
PostDetail
  - shortcode
  - imageUrl
  - caption
  - createdAt
  - likeCount
  - commentCount
  - likedByViewer
  - savedByViewer
  - author
  - comments
```

추가 규칙:

- `savedByViewer` 필드는 상세 액션 영역 확장을 위해 함께 조회할 수 있다.
- 실제 저장 toggle 연결은 `10-save-bookmark.md`에서 확장한다.

### 담당 파일

| 항목 | 파일 |
| --- | --- |
| 페이지 | `app/(main)/p/[shortcode]/page.tsx` |
| 상세 페이지 UI | `features/post-detail/components/post-detail-page.tsx` |
| 공통 상세 콘텐츠 | `features/post-detail/components/post-detail-content.tsx` |
| 반응 UI | `features/post-detail/components/post-actions.tsx` |
| 댓글 리스트 | `features/post-detail/components/comment-list.tsx` |
| 댓글 폼 | `features/post-detail/components/comment-form.tsx` |
| 액션 | `lib/actions/interaction.ts` |
| 조회 조합 | `lib/queries/post.ts` (optional) |
| repository | `lib/social-repository/*` |

### 로컬 상태

| 상태 | 설명 |
| --- | --- |
| `liked` | 현재 사용자의 낙관적 좋아요 여부 |
| `comment` | 댓글 입력값 |
| `isPendingLike` | 좋아요 처리 중 여부 |
| `isSubmittingComment` | 댓글 제출 중 여부 |

상태가 아닌 값:

- `shortcode`는 async `params`에서 파생한다.
- `canSave`와 `saved`는 저장 기능 연결 시 `08` 기준으로 확장한다.

### 구현 규칙

- 상세 페이지는 `shortcode` 기반 permalink를 사용한다.
- 직접 URL 진입, 새 탭 열기, 새로고침은 항상 단독 상세 페이지를 렌더링한다.
- `page.tsx`와 `generateMetadata`에서 `params`를 사용할 때는 Next.js 16 규칙에 맞게 `await params` 또는 적절한 helper를 사용한다.
- 상세 데이터는 server에서 조회하고, page는 직접 시드 데이터를 읽지 않는다.
- 오버레이와 단독 상세는 `post-detail-content.tsx`를 공유한다.
- 댓글 입력은 빈 값과 공백만 입력을 막고, 최대 길이는 validator에서 고정한다.
- 작성자 이름과 아바타는 프로필 링크(`/u/[username]`)로 연결한다.
- 액션 영역은 like/comment 중심으로 먼저 연결하고, save toggle은 `10-save-bookmark.md`에서 같은 레이아웃에 확장 가능하게 둔다.
- 시간이 허용되면 `generateMetadata`로 게시물 메타데이터를 확장한다.

### 개발자 플로우

1. `page.tsx`가 async `params`에서 `shortcode`를 받는다.
2. repository 또는 query helper가 shortcode 기준으로 상세 데이터를 조회한다.
3. 게시물이 없으면 `notFound()`로 처리한다.
4. `post-detail-page.tsx`가 단독 상세 레이아웃을 렌더링한다.
5. 내부 본문은 `post-detail-content.tsx`가 렌더링한다.
6. 좋아요 클릭 시 `toggleLikeAction`을 호출한다.
7. 댓글 제출 시 `createCommentAction`을 호출한다.
8. 성공 시 상세 데이터를 재검증하거나 낙관적 UI를 갱신한다.

### 예외 처리

- 없는 `shortcode`는 not-found 처리
- 댓글 없음 상태 UI 노출
- 댓글 실패 시 입력값 유지
- 좋아요 실패 시 이전 상태 유지
- 이미지 로드 실패 시 fallback UI 노출

## 체크리스트

- [ ] `/p/[shortcode]` 직접 진입 시 단독 상세 페이지가 렌더링된다
- [ ] 새로고침해도 단독 상세 페이지가 유지된다
- [ ] 게시물 상세 정보와 댓글 목록이 노출된다
- [ ] 좋아요 클릭 시 상태가 갱신된다
- [ ] 댓글 작성 시 목록이 갱신된다
- [ ] 작성자 프로필 링크로 이동할 수 있다
- [ ] 없는 게시물은 not-found 처리된다



