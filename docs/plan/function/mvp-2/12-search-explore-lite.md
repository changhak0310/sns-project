# 기능 12 - Search / Explore Lite

## 개요

| 항목 | 내용 |
| --- | --- |
| 라우트 | `/explore` |
| 페이지 | `app/(main)/explore/page.tsx` |
| 주요 액션 | `toggleFollowAction`, `toggleLikeAction` |
| 핵심 데이터 | 추천 유저 목록, 추천 게시물 목록, optional `q` query |
| 성공 후 | 홈 피드와 다른 발견 경험 제공 |

## 유저 입장

### 유저 스토리

> 나는 홈 피드와 별도로 새로운 유저와 게시물을 가볍게 둘러보고 싶다.

### 사용자가 보게 되는 것

- 탐색 헤더
- 가벼운 검색 입력 또는 검색 CTA
- 추천 유저 섹션
- 추천 게시물 그리드
- 유저 팔로우 버튼과 게시물 반응

### 사용자 흐름

1. `/explore` 진입
2. 추천 유저와 추천 게시물 확인
3. 필요하면 검색어 입력 또는 탐색 범위 좁히기
4. 유저 프로필 이동 또는 게시물 상세 이동
5. 팔로우하거나 좋아요 반응

### 유저 기준 핵심 규칙

- 완전한 검색 엔진이 아니어도 "탐색" 느낌이 나야 한다.
- 홈 피드와 다른 콘텐츠를 보여줘야 한다.
- 유저와 게시물 둘 다 발견할 수 있어야 한다.
- 검색어가 없어도 진입 즉시 둘러볼 수 있어야 한다.

## 개발자 입장

### 구조

#### 라우트 구조

```text
app/
  (main)/
    explore/
      page.tsx
```

#### UI 구조

```text
features/
  explore/
    components/
      explore-header.tsx
      explore-search-form.tsx
      suggested-user-list.tsx
      suggested-user-card.tsx
      suggested-post-grid.tsx
      suggested-post-card.tsx
      explore-empty-state.tsx
```

#### 액션 구조

```text
lib/actions/profile.ts
  - toggleFollowAction

lib/actions/interaction.ts
  - toggleLikeAction
```

#### 데이터 구조

```text
SuggestedUser
  - userId
  - username
  - displayName
  - avatarUrl
  - bio
  - isFollowing

SuggestedPost
  - shortcode
  - imageUrl
  - caption
  - author
  - likedByViewer
  - savedByViewer (optional)
```

추가 규칙:

- `SuggestedPost.shortcode`를 permalink 키로 사용하고, 상세 이동 경로는 `/p/[shortcode]`로 통일한다.
- 검색 UI를 노출하더라도 1차는 전문 검색 엔진이 아니라 추천 목록에 대한 경량 필터 수준으로 제한한다.
- 추천 기준은 repository가 소유하고, page나 feature는 시드 데이터 규칙을 직접 알지 않는다.

### 담당 파일

| 항목 | 파일 |
| --- | --- |
| 페이지 | `app/(main)/explore/page.tsx` |
| 탐색 헤더 | `features/explore/components/explore-header.tsx` |
| 검색 입력 | `features/explore/components/explore-search-form.tsx` |
| 유저 추천 UI | `features/explore/components/suggested-user-list.tsx` |
| 게시물 추천 UI | `features/explore/components/suggested-post-grid.tsx` |
| 빈 상태 | `features/explore/components/explore-empty-state.tsx` |
| 팔로우 액션 | `lib/actions/profile.ts` |
| 좋아요 액션 | `lib/actions/interaction.ts` |
| 조회 조합 | `lib/queries/explore.ts` (optional) |
| repository | `lib/social-repository/*` |

### 로컬 상태

| 상태 | 설명 |
| --- | --- |
| `isPending` | 팔로우 또는 좋아요 처리 중 여부 |

상태가 아닌 값:

- `query`는 `searchParams.q`에서 파생한다.
- `activeSection`이 필요하더라도 URL이나 렌더링 조건에서 계산하고, 별도 필수 로컬 상태로 두지 않는다.

### 구현 규칙

- `page.tsx`는 직접 시드 데이터를 읽지 않고 repository 또는 query helper를 통해 탐색 데이터를 조회한다.
- `page.tsx`가 `searchParams`를 읽을 때는 Next.js 16 규칙에 맞게 async `searchParams`를 처리한다.
- 검색 입력이 있다면 `GET /explore?q=...` 형태로 공유 가능한 URL을 만든다.
- 추천 유저와 추천 게시물은 같은 화면에서 동시에 보여주되, 한쪽 데이터가 비어도 다른 섹션은 유지한다.
- 유저 카드는 `/u/[username]`으로, 게시물 카드는 `/p/[shortcode]`로 연결한다.
- 게시물 카드는 홈 피드보다 그리드 비중을 높여 "발견" 느낌을 강화한다.
- 팔로우와 좋아요는 카드 단위 상호작용으로만 분리하고, 탐색 화면 전체를 클라이언트 컴포넌트로 만들지 않는다.
- 저장 버튼까지 재사용할 경우 `savedByViewer`를 함께 조회할 수 있지만, 이 문서의 최소 요구사항은 팔로우와 좋아요까지다.

### 개발자 플로우

1. `page.tsx`가 optional `q`와 현재 세션을 읽는다.
2. repository 또는 query helper가 추천 유저/게시물 데이터를 조회한다.
3. `explore-header.tsx`와 검색 폼을 렌더링한다.
4. 유저 추천 섹션과 게시물 추천 섹션을 각각 렌더링한다.
5. 유저 카드에서는 `toggleFollowAction`을 연결한다.
6. 게시물 카드에서는 상세 이동과 `toggleLikeAction`을 연결한다.
7. 성공 시 해당 카드 상태만 갱신하거나 관련 섹션을 재검증한다.

### 예외 처리

- 추천 유저와 추천 게시물이 모두 없으면 전체 빈 상태 UI 노출
- 추천 유저만 없으면 유저 섹션 빈 상태 노출
- 추천 게시물만 없으면 게시물 섹션 빈 상태 노출
- 잘못된 `q` 값은 기본 추천 화면으로 fallback
- 팔로우/좋아요 실패 시 이전 상태 유지
- 잘못된 추천 데이터는 목록에서 제외

## 체크리스트

- [ ] `/explore` 페이지가 렌더링된다
- [ ] 추천 유저 목록이 보인다
- [ ] 추천 게시물 목록이 보인다
- [ ] 검색어 없이도 탐색 화면이 성립한다
- [ ] 검색 UI를 붙일 경우 `q` query 기준으로 동작한다
- [ ] 유저 카드에서 프로필 이동이 가능하다
- [ ] 게시물 카드에서 `/p/[shortcode]` 상세 이동이 가능하다
- [ ] 팔로우 또는 좋아요 동작이 연결된다
- [ ] 추천 데이터가 없을 때 빈 상태가 존재한다
