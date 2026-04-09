# 기능 08 - 저장과 북마크

## 개요

| 항목 | 내용 |
| --- | --- |
| 라우트 | `/`, `/p/[shortcode]`, `/u/[username]?tab=saved` |
| 페이지 | 피드, 게시물 상세, 프로필 페이지 |
| 주요 액션 | `toggleSaveAction` |
| 핵심 데이터 | 저장 여부, 저장한 게시물 목록, 현재 프로필 탭 |
| 성공 후 | 저장 상태 갱신 및 내 프로필 Saved 탭에서 확인 가능 |

## 유저 입장

### 유저 스토리

> 나는 나중에 다시 보고 싶은 게시물을 저장하고, 저장한 목록을 한 곳에서 다시 보고 싶다.

### 사용자가 보게 되는 것

- 게시물 카드/상세의 저장 버튼
- 내 프로필의 `Posts / Saved` 탭
- 저장한 게시물 그리드

### 사용자 흐름

1. 피드나 상세에서 저장 버튼 클릭
2. 저장 상태 반영
3. 내 프로필 진입
4. `Saved` 탭 선택
5. 저장한 게시물 목록 확인

### 유저 기준 핵심 규칙

- 저장 버튼은 현재 저장 상태를 분명하게 보여줘야 한다.
- 저장 후 결과를 다시 볼 수 있는 진입점이 반드시 있어야 한다.
- 다른 사람 프로필에서는 Saved 탭이 보이지 않아야 한다.

## 개발자 입장

### 구조

#### 라우트 구조

```text
app/
  (main)/
    page.tsx
    p/
      [shortcode]/
        page.tsx
    u/
      [username]/
        page.tsx
```

#### UI 구조

```text
features/
  profile/
    components/
      profile-tabs.tsx
      saved-post-grid.tsx

components/
  ui/
    icon-button.tsx
```

추가 위치 규칙:

- 피드 카드의 저장 트리거는 `features/feed/components/post-card.tsx` 안에서 연결한다.
- 상세 저장 트리거는 `features/post-detail/components/post-actions.tsx` 안에서 연결한다.

#### 액션 구조

```text
lib/actions/interaction.ts
  - toggleSaveAction
```

#### 데이터 구조

```text
SavedPost
  - shortcode
  - imageUrl
  - author
  - savedAt
```

추가 규칙:

- 피드와 상세 조회 데이터에는 `savedByViewer` 필드를 함께 포함할 수 있다.
- 프로필 탭의 query 이름은 `tab`으로 통일하고, 허용 값은 `posts`, `saved`만 둔다.

### 담당 파일

| 항목 | 파일 |
| --- | --- |
| 피드 저장 연결 | `features/feed/components/post-card.tsx` |
| 상세 저장 연결 | `features/post-detail/components/post-actions.tsx` |
| 프로필 탭 | `features/profile/components/profile-tabs.tsx` |
| 저장 목록 | `features/profile/components/saved-post-grid.tsx` |
| 액션 | `lib/actions/interaction.ts` |
| 조회 조합 | `lib/queries/profile.ts` (optional) |
| repository | `lib/social-repository/*` |

### 로컬 상태

| 상태 | 설명 |
| --- | --- |
| `saved` | 현재 게시물 저장 여부 |
| `isPending` | 저장 처리 중 여부 |

상태가 아닌 값:

- `activeTab`은 `searchParams.tab`에서 파생한다.
- `canViewSavedTab`은 현재 세션 사용자와 프로필 소유자 비교로 계산한다.

### 구현 규칙

- 저장 버튼은 피드와 상세에서 공통 동작해야 한다.
- 저장 결과는 내 프로필의 `Saved` 탭에서 확인하게 한다.
- `Saved` 탭은 자기 프로필에서만 노출한다.
- 잘못된 `tab` 값은 `posts`로 fallback 한다.
- 저장 상태는 낙관적 UI로 반영할 수 있다.
- page는 직접 시드 데이터를 읽지 않고 repository 또는 query helper를 사용한다.
- 저장 버튼 자체는 공통 `IconButton`을 쓸 수 있지만, 저장 정책과 mutation wiring은 각 feature에서 소유한다.

### 개발자 플로우

1. 피드와 상세에서 게시물별 저장 여부를 함께 조회한다.
2. 저장 버튼 클릭 시 `toggleSaveAction`을 호출한다.
3. 성공 시 저장 상태를 반영한다.
4. 프로필 페이지는 `tab` 값에 따라 `posts` 또는 `saved`를 렌더링한다.
5. `saved` 탭에서는 저장한 게시물 목록만 보여준다.

### 예외 처리

- 저장 실패 시 이전 상태 유지
- 저장한 게시물이 없으면 빈 상태 UI 노출
- 다른 사람 프로필에서 `saved` 탭 접근 시 기본 `posts` 탭으로 fallback

## 체크리스트

- [ ] 피드에서 저장 버튼이 노출된다
- [ ] 상세 페이지에서 저장 버튼이 노출된다
- [ ] 저장 클릭 시 상태가 갱신된다
- [ ] 내 프로필에 `Saved` 탭이 보인다
- [ ] `Saved` 탭에서 저장한 게시물 목록을 볼 수 있다
- [ ] 저장한 게시물이 없으면 빈 상태가 보인다
