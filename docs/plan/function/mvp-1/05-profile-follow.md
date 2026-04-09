# 기능 05 - 프로필과 팔로우

## 개요

| 항목 | 내용 |
| --- | --- |
| 라우트 | `/u/[username]` |
| 페이지 | `app/(main)/u/[username]/page.tsx` |
| 주요 액션 | `toggleFollowAction` |
| 핵심 데이터 | 사용자 정보, 게시물 그리드, 팔로우 상태 |
| 성공 후 | 프로필 상태 갱신 또는 낙관적 UI 반영 |

## 유저 입장

### 유저 스토리

> 나는 다른 사용자의 프로필을 보고, 게시물을 확인하고, 팔로우하고 싶다.

### 사용자가 보게 되는 것

- 프로필 헤더
- 아바타와 바이오
- 팔로워/팔로잉 수
- 게시물 그리드
- 팔로우 버튼

### 사용자 흐름

1. `/u/[username]` 진입
2. 프로필 정보 확인
3. 게시물 그리드 확인
4. 팔로우 클릭 또는 게시물 상세 이동

### 유저 기준 핵심 규칙

- 프로필은 사용자 정체성이 분명하게 보여야 한다.
- 팔로우 버튼은 현재 관계를 반영해야 한다.
- 게시물 그리드에서 상세 이동이 가능해야 한다.

## 개발자 입장

### 구조

#### 라우트 구조

```text
app/
  (main)/
    u/
      [username]/
        page.tsx
```

#### UI 구조

```text
features/
  profile/
    components/
      profile-header.tsx
      profile-grid.tsx
      follow-button.tsx
      profile-empty-state.tsx
```

#### 액션 구조

```text
lib/actions/profile.ts
  - toggleFollowAction
```

#### 데이터 구조

```text
ProfileView
  - user
  - posts
  - followerCount
  - followingCount
  - isFollowing
  - isViewerProfile
```

추가 규칙:

- `user`는 `displayName`, `username`, `avatarUrl`, `bio`를 포함한다.
- 프로필 기본 화면은 `posts` 섹션을 렌더링하고, `Saved` 탭 확장은 `08-save-bookmark.md`에서 처리한다.

### 담당 파일

| 항목 | 파일 |
| --- | --- |
| 페이지 | `app/(main)/u/[username]/page.tsx` |
| 프로필 헤더 | `features/profile/components/profile-header.tsx` |
| 프로필 그리드 | `features/profile/components/profile-grid.tsx` |
| 팔로우 버튼 | `features/profile/components/follow-button.tsx` |
| 빈 상태 | `features/profile/components/profile-empty-state.tsx` |
| 액션 | `lib/actions/profile.ts` |
| 조회 조합 | `lib/queries/profile.ts` (optional) |
| repository | `lib/social-repository/*` |

### 로컬 상태

| 상태 | 설명 |
| --- | --- |
| `isFollowing` | 현재 사용자의 낙관적 팔로우 여부 |
| `isPending` | 팔로우 처리 중 여부 |

상태가 아닌 값:

- `username`은 async `params`에서 파생한다.
- `isViewerProfile`은 현재 세션과 조회된 프로필 비교로 계산한다.
- `activeTab`은 `08`에서 `searchParams.tab` 기준으로 확장한다.

### 구현 규칙

- 프로필 데이터는 서버에서 조회한다.
- `page.tsx`와 `generateMetadata`에서 `params`를 사용할 때는 Next.js 16 규칙에 맞게 `await params` 또는 적절한 helper를 사용한다.
- 팔로우 버튼만 클라이언트 상호작용으로 분리한다.
- 자기 자신은 팔로우할 수 없게 막는다.
- 그리드의 게시물은 `/p/[shortcode]` permalink 링크로 연결한다.
- 그리드 클릭 후 오버레이로 열릴지 단독 페이지로 열릴지는 `(main)` 레이아웃의 인터셉트 라우트 구현을 따른다.
- `tab` query는 profile page가 읽을 수 있지만, `saved` 탭 실제 렌더링은 `08-save-bookmark.md` 기준으로 확장한다.

### 개발자 플로우

1. `page.tsx`가 async `params`에서 `username`을 받는다.
2. repository 또는 query helper가 `username` 기준으로 프로필 데이터를 조회한다.
3. 사용자가 없으면 `notFound()`로 처리한다.
4. `profile-header.tsx`가 사용자 정보를 렌더링한다.
5. `profile-grid.tsx`가 게시물 목록을 렌더링한다.
6. 팔로우 클릭 시 `toggleFollowAction`을 호출한다.
7. 성공 시 프로필 상태를 재검증하거나 낙관적 UI를 반영한다.

### 예외 처리

- 없는 `username`은 not-found 처리
- 게시물이 없는 프로필은 빈 상태 UI 노출
- 팔로우 실패 시 이전 상태 유지
- 자기 자신 프로필은 팔로우 버튼 숨김 또는 비활성화

## 체크리스트

- [ ] `/u/[username]` 페이지가 렌더링된다
- [ ] 프로필 정보가 노출된다
- [ ] 게시물 그리드가 노출된다
- [ ] 팔로우 버튼이 현재 관계를 반영한다
- [ ] 팔로우 클릭 시 상태가 갱신된다
- [ ] 게시물 클릭 시 `/p/[shortcode]` permalink로 이동한다
- [ ] 없는 사용자는 not-found 처리된다
