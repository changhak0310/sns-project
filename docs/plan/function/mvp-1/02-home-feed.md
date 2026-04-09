# 기능 02 - 홈 피드

## 개요

| 항목 | 내용 |
| --- | --- |
| 라우트 | `/` |
| 페이지 | `app/(main)/page.tsx` |
| 주요 액션 | 게시물 상세 오버레이 열기, `toggleLikeAction`, `createCommentAction` |
| 핵심 데이터 | 게시물 목록, 작성자 정보, 사용자 반응 상태, 피드 맥락을 유지한 permalink 진입 정보 |
| 성공 후 | 피드 유지 + `/p/[shortcode]` 오버레이 진입 + 닫기 후 원래 위치 복귀 |

## 유저 입장

### 유저 스토리

> 나는 홈 피드를 보다가 게시물을 누르면 현재 화면 위에서 상세를 열고, 댓글까지 남긴 뒤 같은 피드 위치로 돌아가고 싶다.

### 사용자가 보게 되는 것

- 상단 헤더
- 게시물 리스트
- 게시물 카드
- 캡션 미리보기
- 좋아요 수, 댓글 수
- 게시물 상세 오버레이
- 오버레이 내부 댓글 입력 영역

### 사용자 흐름

1. `/` 진입
2. 최신 게시물 목록 확인
3. 게시물 카드 스크롤
4. 게시물 카드 또는 이미지 클릭
5. URL이 `/p/[shortcode]`로 바뀌고, 현재 피드 위에 상세 오버레이가 열린다
6. 오버레이 안에서 좋아요 또는 댓글 반응을 한다
7. 닫기 또는 뒤로가기 시 다시 `/`로 돌아가며 피드 위치를 유지한다

### 유저 기준 핵심 규칙

- 피드는 로그인 후 바로 보여야 한다.
- 게시물 카드는 이미지와 작성자 정보가 분명해야 한다.
- 상세 URL은 공유 가능한 고정 주소여야 한다.
- 피드 안에서 게시물을 열 때는 전체 페이지 전환보다 오버레이 경험이 우선이다.
- 오버레이를 닫아도 피드 스크롤 위치가 유지돼야 한다.

## 개발자 입장

### 구조

#### 라우트 구조

```text
app/
  (main)/
    layout.tsx
    page.tsx
    p/
      [shortcode]/
        page.tsx
    @modal/
      default.tsx
      (.)p/
        [shortcode]/
          page.tsx
      [...catchAll]/
        page.tsx
```

#### UI 구조

```text
features/
  feed/
    components/
      feed-list.tsx
      post-card.tsx
      feed-empty-state.tsx

  post-detail/
    components/
      post-detail-modal.tsx
      post-detail-content.tsx
      comment-form.tsx

components/
  layout/
    empty-state.tsx
```

#### 액션 구조

```text
lib/actions/interaction.ts
  - toggleLikeAction
  - createCommentAction
```

#### 데이터 구조

```text
FeedItem
  - shortcode
  - imageUrl
  - captionPreview
  - createdAt
  - likeCount
  - commentCount
  - likedByViewer
  - author

FeedViewModel
  - items
  - isEmpty
  - viewerId
```

추가 규칙:

- 현재 열린 게시물은 별도 상태 객체로 저장하지 않고 URL과 `@modal` 슬롯에서 파생한다.
- 피드에서 상세를 열었는지 여부는 인터셉트 라우트 맥락으로 판단한다.

### 담당 파일

| 항목 | 파일 |
| --- | --- |
| 페이지 | `app/(main)/page.tsx` |
| 피드 리스트 | `features/feed/components/feed-list.tsx` |
| 게시물 카드 | `features/feed/components/post-card.tsx` |
| 피드 빈 상태 | `features/feed/components/feed-empty-state.tsx` |
| 상세 오버레이 route | `app/(main)/@modal/(.)p/[shortcode]/page.tsx` |
| 모달 기본 슬롯 | `app/(main)/@modal/default.tsx` |
| 모달 catch-all | `app/(main)/@modal/[...catchAll]/page.tsx` |
| 상세 오버레이 UI | `features/post-detail/components/post-detail-modal.tsx` |
| 액션 | `lib/actions/interaction.ts` |
| 조회 조합 | `lib/queries/feed.ts` (optional) |
| repository | `lib/social-repository/*` |

### 로컬 상태

| 상태 | 설명 |
| --- | --- |
| `liked` | 카드 또는 액션 영역의 낙관적 좋아요 여부 |
| `isPending` | 좋아요 처리 중 여부 |
| `comment` | 오버레이 댓글 입력값. 상세 feature 내부에서 소유 |

상태가 아닌 값:

- `selectedShortcode`는 현재 pathname과 modal segment에서 파생한다.
- `isOverlayOpen`은 `@modal` 슬롯 렌더 여부에서 파생한다.

### 구현 규칙

- 피드 데이터는 서버에서 조회한다.
- `app/(main)/page.tsx`는 직접 시드 데이터를 읽지 않고 repository 또는 repository를 감싼 query helper만 사용한다.
- 게시물 카드는 항상 `/p/[shortcode]` 링크를 가진다.
- 기능 전용 UI는 `features/feed`, `features/post-detail` 아래에 둔다.
- 피드에서의 클라이언트 이동만 `@modal` 슬롯으로 인터셉트한다.
- 오버레이와 단독 상세는 같은 상세 콘텐츠 컴포넌트를 재사용한다.
- 홈 피드 문서는 "피드 목록과 오버레이 진입 경험"을 소유하고, 상세 본문/댓글/좋아요의 공통 구현은 `03-post-detail-engagement.md` 기준을 재사용한다.
- 좋아요 버튼과 댓글 입력만 최소 범위 Client Component로 분리한다.
- `selectedShortcode`와 `isOverlayOpen`을 별도 client state로 중복 저장하지 않는다.
- 모달 닫힘은 `@modal/default.tsx`와 `@modal/[...catchAll]/page.tsx`로 안전하게 처리한다.
- 저장 버튼은 홈 피드 카드에 배치 여지를 둘 수 있지만, 실제 저장 mutation 연결은 `08-save-bookmark.md`에서 확장한다.
- 피드 위치 유지 요구사항은 기본적으로 브라우저 히스토리와 인터셉트 라우트 동작에 기대고, 별도 전역 스토어는 기본 도입하지 않는다.

### 개발자 플로우

1. `app/(main)/page.tsx`가 repository 또는 query helper를 통해 피드 데이터를 조회한다.
2. `features/feed/components/feed-list.tsx`가 목록을 렌더링한다.
3. `features/feed/components/post-card.tsx`가 각 게시물을 `/p/[shortcode]` 링크로 출력한다.
4. 홈 피드에서 게시물을 클릭하면 `app/(main)/@modal/(.)p/[shortcode]/page.tsx`가 오버레이를 렌더링한다.
5. 오버레이는 `features/post-detail/components/post-detail-content.tsx`를 재사용해 상세와 댓글을 보여준다.
6. 좋아요 클릭 시 `toggleLikeAction`을 호출한다.
7. 댓글 제출 시 `createCommentAction`을 호출한다.
8. 닫기 또는 다른 페이지 이동 시 `@modal` 슬롯이 `null`로 정리된다.

### 예외 처리

- 게시물이 없으면 빈 상태 화면 노출
- 좋아요 실패 시 이전 상태 유지
- 이미지 누락 시 fallback UI 노출
- 상세 조회 실패 시 오버레이 내부 에러 상태 노출
- 삭제된 게시물을 누르면 not-found 또는 안전한 에러 UI 처리
- 새 탭 열기, 직접 URL 입력, 새로고침은 오버레이가 아니라 단독 상세 페이지로 처리

## 체크리스트

- [ ] `/` 페이지가 렌더링된다
- [ ] 게시물 목록이 노출된다
- [ ] 게시물 카드에 이미지, 작성자, 캡션이 보인다
- [ ] 게시물 카드는 `/p/[shortcode]` 링크를 가진다
- [ ] 게시물 클릭 시 피드 위에 상세 오버레이가 열린다
- [ ] 오버레이 안에서 좋아요와 댓글 작성이 가능하다
- [ ] `selectedShortcode`, `isOverlayOpen`을 별도 상태로 저장하지 않고 라우트에서 파생한다
- [ ] 닫기 또는 뒤로가기 시 피드 위치가 유지된다
- [ ] 빈 피드 상태가 존재한다
