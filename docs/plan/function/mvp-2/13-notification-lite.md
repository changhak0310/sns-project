# 기능 13 - Notification Lite

## 개요

| 항목 | 내용 |
| --- | --- |
| 라우트 | `/notifications` |
| 페이지 | `app/(main)/notifications/page.tsx` |
| 주요 액션 | 없음 |
| 핵심 데이터 | 활동 피드 목록, 알림 유형, 이동 대상 링크, 시간 정보 |
| 성공 후 | SNS다운 활동 피드 경험 제공 |

## 유저 입장

### 유저 스토리

> 나는 누가 내 글에 반응했는지 한눈에 보고, 서비스가 살아 있다는 느낌을 받고 싶다.

### 사용자가 보게 되는 것

- 활동 피드 리스트
- 좋아요, 댓글, 팔로우 유형별 아이콘
- 활동 시간 표시
- 관련 프로필 또는 게시물로 이동하는 링크

### 사용자 흐름

1. `/notifications` 진입
2. 최근 활동 목록 확인
3. 특정 활동 클릭
4. 관련 게시물 또는 프로필로 이동

### 유저 기준 핵심 규칙

- 실제 실시간이 아니어도 "누가 반응했다"는 맥락이 분명해야 한다.
- 활동 타입이 한눈에 구분돼야 한다.
- 클릭 후 관련 콘텐츠로 이동할 수 있어야 한다.
- 알림이 없어도 서비스 상태를 이해할 수 있는 빈 화면이 필요하다.

## 개발자 입장

### 구조

#### 라우트 구조

```text
app/
  (main)/
    notifications/
      page.tsx
```

#### UI 구조

```text
features/
  notification/
    components/
      notification-list.tsx
      notification-item.tsx
      notification-empty-state.tsx
      notification-filter-tabs.tsx
```

#### 액션 구조

```text
없음
```

#### 데이터 구조

```text
NotificationActor
  - userId
  - username
  - displayName
  - avatarUrl

NotificationItem
  - id
  - type
  - actor
  - targetShortcode
  - href
  - previewText
  - createdAt
```

추가 규칙:

- `type`은 1차에서 `like`, `comment`, `follow`만 지원한다.
- `href`는 UI에서 즉석 조합하지 않고 조회 단계에서 미리 계산해 넘긴다.
- `targetShortcode`는 게시물 관련 알림에서만 사용하고, 팔로우 알림은 보통 `actor.username` 기반 프로필 링크를 사용한다.

### 담당 파일

| 항목 | 파일 |
| --- | --- |
| 페이지 | `app/(main)/notifications/page.tsx` |
| 목록 UI | `features/notification/components/notification-list.tsx` |
| 아이템 UI | `features/notification/components/notification-item.tsx` |
| 빈 상태 | `features/notification/components/notification-empty-state.tsx` |
| 필터 탭 | `features/notification/components/notification-filter-tabs.tsx` |
| 조회 조합 | `lib/queries/notification.ts` (optional) |
| repository | `lib/social-repository/*` |

### 로컬 상태

| 상태 | 설명 |
| --- | --- |
| 없음 | 페이지 자체는 서버 조회만으로도 구현 가능 |

상태가 아닌 값:

- `activeFilter`가 필요하면 `searchParams.filter`에서 파생한다.
- 허용 filter 값은 `all`, `like`, `comment`, `follow`만 둔다.

### 구현 규칙

- 실제 실시간 알림이 아니라 seed 또는 repository 기반 활동 피드로 구현한다.
- `page.tsx`는 직접 시드 데이터를 읽지 않고 repository 또는 query helper를 통해 알림 데이터를 조회한다.
- `page.tsx`가 `searchParams`를 읽을 때는 Next.js 16 규칙에 맞게 async `searchParams`를 처리한다.
- 각 알림 아이템은 타입에 맞는 아이콘, 문구, 이동 링크를 함께 가져야 한다.
- 게시물 관련 알림은 `/p/[shortcode]`, 팔로우 알림은 `/u/[username]`으로 연결한다.
- 읽음/안읽음 상태, 배지 카운트, 실시간 push는 2차 확장으로 미룬다.
- 필터 UI를 추가하더라도 클라이언트 전역 상태를 두기보다 URL query 기준으로 동작하게 한다.

### 개발자 플로우

1. `page.tsx`가 optional `filter`와 현재 세션을 읽는다.
2. repository 또는 query helper가 활동 피드 데이터를 조회한다.
3. `notification-list.tsx`가 목록을 렌더링한다.
4. `notification-item.tsx`가 타입에 맞는 아이콘, 문구, 시간, 링크를 출력한다.
5. 알림이 없으면 빈 상태 UI를 노출한다.

### 예외 처리

- 활동 피드가 없으면 빈 상태 UI 노출
- 삭제된 게시물 대상 알림은 프로필 링크나 일반 문구로 fallback
- 알림 타입이 알 수 없는 값이면 generic item으로 렌더링
- 잘못된 `filter` 값은 `all`로 fallback

## 체크리스트

- [ ] `/notifications` 페이지가 렌더링된다
- [ ] 활동 피드 목록이 보인다
- [ ] 좋아요/댓글/팔로우 타입이 구분된다
- [ ] 게시물 관련 알림이 `/p/[shortcode]`로 연결된다
- [ ] 팔로우 알림이 관련 프로필로 연결된다
- [ ] 필터 UI를 붙일 경우 `filter` query 기준으로 동작한다
- [ ] 알림이 없을 때 빈 상태가 존재한다
