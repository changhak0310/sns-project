# 프로젝트 구조

> 기준 문서: `docs/plan/layout/architecture.md`

## 1. 목표 구조

Next.js는 폴더 구조를 강하게 강제하지 않기 때문에, 이 프로젝트는 아래 6개 경계로 구조를 고정한다.

- `app`: App Router 엔트리
- `features`: 기능 구현
- `components`: 공통 UI와 공통 레이아웃
- `lib`: 앱 전역 인프라와 서버 계층
- `data`: 시드 데이터
- `types`: 공통 계약 타입

권장 구조 예시는 아래와 같다.

```text
app/
  layout.tsx
  globals.css
  not-found.tsx
  opengraph-image.tsx
  (auth)/
    signup/
      page.tsx
    login/
      page.tsx
  (main)/
    layout.tsx
    page.tsx
    create/
      page.tsx
    explore/
      page.tsx
    notifications/
      page.tsx
    p/
      [shortcode]/
        page.tsx
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

features/
  auth/
    components/
  feed/
    components/
  post-detail/
    components/
  post-compose/
    components/
  profile/
    components/
  explore/
    components/
  notification/
    components/

components/
  ui/
  layout/

lib/
  actions/
  queries/
  social-repository/
  session/
  validators/
  firebase/
  utils/

data/
  seed/

types/
```

## 2. 디렉터리 역할

### `app/`

- Next.js 페이지 진입점
- 레이아웃, 메타데이터, loading/error/not-found
- route group, parallel route, intercepted route 조합
- 세션 가드와 화면 조합만 담당

여기서는 하지 않는 것:

- 시드 데이터 직접 조회
- Firebase 직접 호출
- 기능 전용 UI 상세 구현
- mutation 로직 직접 소유

### `features/`

- 사용자 기능 단위 구현
- 한 기능을 수정할 때 가장 먼저 읽는 영역
- 기능 전용 컴포넌트와 상호작용을 포함

기능 기준:

- `auth`: 회원가입, 로그인
- `feed`: 홈 피드
- `post-detail`: 게시물 상세, 댓글, 반응
- `post-compose`: 작성과 미리보기
- `profile`: 프로필, 팔로우, 저장 탭, 수정
- `explore`: 추천 유저/게시물 탐색
- `notification`: 활동 피드와 필터

### `components/`

- 여러 feature에서 재사용하는 코드
- 순수 UI와 공통 레이아웃 조각만 위치

예:

- `components/ui/button.tsx`
- `components/ui/input.tsx`
- `components/layout/app-header.tsx`
- `components/layout/shell-frame.tsx`

### `lib/`

- 앱 전체가 공통으로 의존하는 기반 코드
- Server Action, 조회 조합, repository, 세션, validator, Firebase 연결을 둔다

예:

- `lib/actions/auth.ts`
- `lib/queries/feed.ts`
- `lib/social-repository`
- `lib/session`

### `data/`

- 시드 데이터와 데모 fixture
- MVP에서 서버 데이터처럼 읽히는 정적 소스

예:

- `data/seed/users.ts`
- `data/seed/posts.ts`
- `data/seed/comments.ts`
- `data/seed/suggestions.ts`
- `data/seed/notifications.ts`

### `types/`

- 여러 레이어가 공유하는 계약 타입
- UI 전용 타입보다 feature, query, action, repository 사이 계약 타입 기준으로 관리

## 3. 의존성 규칙

허용 방향:

```text
app -> features, components, lib, types
features -> components, lib, types
components -> lib, types
lib -> data, types
data -> types
types -> nothing
```

금지 방향:

- feature -> 다른 feature 내부 직접 참조
- components -> feature 참조
- app -> `data/seed` 직접 참조
- feature -> Firebase SDK 직접 참조
- `components/ui`, `components/layout` -> action, repository 직접 호출

판정 원칙:

- 특정 기능 하나에만 속하면 `features`
- 여러 기능이 공통으로 쓰는 UI면 `components`
- 서버 mutation이면 `lib/actions`
- 서버 조회 조합이면 `lib/queries`
- 데이터 소스 접근이면 `lib/social-repository`
- 앱 전역 기반이면 `lib`
- 읽기 전용 데모 데이터면 `data`

## 4. 현재 코드 기준 매핑

현재 저장소는 아직 스타터 구조 중심이다.

```text
app/
public/
docs/
```

이 구조를 아래처럼 해석한다.

- `app/layout.tsx` -> 유지, 루트 레이아웃으로 확장
- `app/page.tsx` -> 장기적으로 `app/(main)/page.tsx`
- `app/globals.css` -> 유지, 전역 토큰과 기본 스타일 진입점
- `public/` -> 정적 에셋 저장소
- 아직 없는 `features`, `components`, `lib`, `data`, `types`는 새 기준 구조로 추가

참고:

- 홈 피드 modal permalink 구조는 `app/(main)/@modal`로 분리한다
- 기능 문서 기준으로 `explore`, `notification`, `profile edit` 라우트도 처음부터 구조에 포함한다
- `docs/plan/function/*`를 함께 참조한다

## 5. 점진적 전환 원칙

현재 코드는 거의 스타터 상태이므로, "스타터 확장"보다 "목표 구조로 바로 진입"이 맞다.

전환 순서:

1. `app/(auth)`, `app/(main)` 구조를 먼저 만든다
2. `@modal` 슬롯과 permalink 오버레이 구조를 만든다
3. 공통 UI를 `components/ui`, `components/layout` 기준으로 만든다
4. 기능별 UI를 `features/*` 기준으로 만든다
5. `lib/actions`, `lib/queries`, `lib/social-repository` 구조를 만든다
6. 시드 데이터를 `data/seed`로 정리한다
7. 세션과 validator를 `lib/session`, `lib/validators`로 정리한다

즉, 구조 전환은 "새 규칙 우선 적용, 스타터 코드는 점진 제거" 방식으로 진행한다.
