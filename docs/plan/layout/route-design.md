# 라우트 설계

> 기준 문서: `docs/plan/layout/architecture.md`

## 1. 라우트 원칙

- 라우트는 사용자 흐름 기준으로 최소 개수만 둔다
- 인증 전 화면은 `(auth)`, 로그인 후 화면은 `(main)`으로 분리한다
- 게시물 상세는 `/p/[shortcode]` 단일 permalink를 쓰고, 진입 맥락에 따라 오버레이 또는 단독 페이지로 렌더링한다
- 보호 라우트 접근 제어는 우선 `app/(main)/layout.tsx` 가드 기준으로 처리한다
- API 목적이 아닌 한 `route.ts`는 먼저 만들지 않는다

## 2. 라우트 목록

| Route | 목적 | 접근 | 비고 |
| --- | --- | --- | --- |
| `/signup` | 회원가입 | 비로그인 | 성공 시 `/` 또는 `redirect` 경로 이동 |
| `/login` | 로그인 | 비로그인 | 성공 시 `/` 또는 `redirect` 경로 이동 |
| `/` | 홈 피드 | 로그인 필요 | 피드에서 상세 오버레이 진입 |
| `/p/[shortcode]` | 게시물 상세 | 로그인 필요 | 직접 진입 시 단독 상세 |
| `/create` | 게시물 작성 | 로그인 필요 | 성공 시 새 permalink 이동 |
| `/design-system` | 디자인 시스템 프리뷰 | 로그인 필요 | 내부 UI 기준 확인용 |
| `/u/[username]` | 프로필 | 로그인 필요 | `tab` query로 `posts/saved` 전환 |
| `/u/[username]/edit` | 프로필 수정 | 로그인 필요 | 본인만 접근 |
| `/explore` | 탐색 | 로그인 필요 | 추천 유저/게시물 탐색 |
| `/notifications` | 알림 | 로그인 필요 | 활동 피드 |

## 3. 앱 라우트 트리

```text
app/
  layout.tsx
  globals.css
  not-found.tsx
  opengraph-image.tsx
  (auth)/
    layout.tsx (optional)
    signup/
      page.tsx
    login/
      page.tsx
  (main)/
    layout.tsx
    loading.tsx (optional)
    error.tsx (optional)
    page.tsx
    create/
      page.tsx
    design-system/
      page.tsx
    explore/
      page.tsx
    notifications/
      page.tsx
    p/
      [shortcode]/
        page.tsx
        loading.tsx (optional)
        not-found.tsx (optional)
    u/
      [username]/
        page.tsx
        edit/
          page.tsx
    @modal/
      default.tsx
      (.)p/
        [shortcode]/
          page.tsx
      [...catchAll]/
        page.tsx
```

- `app/layout.tsx`는 전역 메타데이터, 폰트, 배경, Provider 진입점만 담당한다
- `app/(auth)`는 메인 셸 없이 인증 화면만 렌더링한다
- `app/(main)`은 헤더, 하단 탭, 사이드바, modal slot을 공유한다
- `@modal`은 홈 피드에서 게시물 상세를 오버레이로 띄울 때만 사용한다

## 4. 접근 규칙

- `/signup`, `/login`은 비로그인 진입 라우트다
- `/`, `/p/[shortcode]`, `/create`, `/design-system`, `/u/[username]`, `/u/[username]/edit`, `/explore`, `/notifications`는 로그인 이후 경험으로 본다
- 세션이 없으면 보호 라우트에서 `/login?redirect=...`로 보낸다
- `redirect`는 내부 경로만 허용한다
- `/u/[username]?tab=saved`는 자기 프로필에서만 유효하다
- `/u/[username]/edit`는 본인만 접근 가능하다

## 5. 네비게이션 흐름

### 인증 흐름

- 비로그인 사용자는 `/signup` 또는 `/login`에서 시작한다
- 보호 라우트에 바로 접근하면 `/login?redirect=...`로 이동한다
- 로그인/회원가입 성공 후 `/` 또는 검증된 `redirect` 경로로 이동한다

### 메인 흐름

- 기본 진입은 `/`
- 메인 네비게이션의 기본 목적지는 `홈`, `작성`, `탐색`, `알림`, `프로필`이다
- 메인 셸 안에서는 상단 헤더와 모바일 하단 탭, 데스크톱 사이드바가 같은 정보 구조를 공유한다

### 콘텐츠 흐름

- 홈 피드에서 게시물을 누르면 URL은 `/p/[shortcode]`가 되지만, 홈 맥락에서는 `@modal` 오버레이로 연다
- 오버레이에서 뒤로가기 또는 닫기를 누르면 `/`로 돌아가고 피드 위치를 유지한다
- 새 탭, 직접 URL 진입, 새로고침은 `/p/[shortcode]` 단독 페이지로 본다

### 작성/프로필 흐름

- `/create`에서 작성 성공 시 새 게시물의 `/p/[shortcode]`로 이동한다
- `/u/[username]`에서 게시물을 누르면 상세로 이동한다
- 자기 프로필에서는 `?tab=saved`로 저장 목록을 본다
- `/u/[username]/edit` 저장 성공 후 `/u/[username]`로 복귀한다

### 탐색/알림 흐름

- `/explore`에서는 추천 유저는 프로필로, 추천 게시물은 상세로 이동한다
- `/notifications`에서는 알림 타입에 따라 관련 프로필 또는 게시물 상세로 이동한다

## 6. 구현 체크포인트

- 새 라우트는 먼저 `(auth)`와 `(main)` 중 어디에 속하는지 결정한다
- 동적 라우트는 `params` async 규칙과 not-found 처리를 함께 설계한다
- 페이지는 조회와 조합만 담당하고, 기능 UI는 `features/*`에서 구현한다
- 인터셉트 라우트를 쓸 때는 `default.tsx`와 catch-all 정리 라우트를 함께 둔다
- `tab`, `redirect`, `q` 같은 공유 가능한 상태는 query 기준으로 관리한다
