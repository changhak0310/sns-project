# Orbit SNS MVP

Next.js 16 기반 SNS 웹 서비스 MVP입니다. 인증, 메인 앱 셸, 홈 피드, 게시물 상세/작성 골격, 프로필 라우트, 디자인 시스템, 공개 API의 기본 흐름을 한 프로젝트 안에서 검증합니다.

현재 데이터는 실제 DB가 아니라 서버 메모리 기반 mock store/repository로 동작합니다. 개발 서버를 재시작하면 회원가입, 게시물 작성, 좋아요, 저장, 팔로우 같은 변경 사항은 초기 상태로 돌아갑니다.

## 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| Framework | Next.js 16.2.3 App Router |
| UI | React 19.2.4, TypeScript 5 |
| Styling | Tailwind CSS 4, CSS design tokens |
| UI helpers | class-variance-authority, clsx, tailwind-merge, lucide-react |
| Auth/session | httpOnly cookie session, mock auth store |
| Tooling | ESLint 9, Node.js test runner |

Next.js 16 기준으로 `params`, `searchParams`, `cookies()`는 async 패턴을 사용합니다. 관련 규칙은 `node_modules/next/dist/docs/`의 App Router 문서를 기준으로 봅니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

프로덕션 빌드는 아래 명령으로 확인합니다.

```bash
npm run build
npm run start
```

## 테스트 계정

mock store에 기본 계정이 들어 있습니다.

| email | password | username |
| --- | --- | --- |
| `preview@orbit.local` | `orbit123` | `preview-user` |
| `team@orbit.local` | `orbit123` | `orbit-team` |
| `city@orbit.local` | `orbit123` | `city.frames` |
| `mina@orbit.local` | `orbit123` | `studio.mina` |

새 계정은 `/signup`에서 만들 수 있지만, 서버 메모리에만 저장됩니다.

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | Next.js 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드 결과 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run test` | Node.js test runner 기반 테스트 실행 |

## 주요 화면

| Route | 상태 | 설명 |
| --- | --- | --- |
| `/` | 구현 | 최신 피드를 보여주는 메인 진입 화면 |
| `/login` | 구현 | 로그인 폼, 세션 존재 시 redirect |
| `/signup` | 구현 | 회원가입 폼, 가입 후 세션 생성 |
| `/create` | 골격 | 게시물 작성 화면 레이아웃과 폼 밀도 검증 |
| `/p/[shortcode]` | 골격 | 게시물 permalink 상세 화면 골격 |
| `/u/[username]` | 골격 | 로그인 필요 프로필 화면 골격 |
| `/design-system` | 구현 | 공통 UI 컴포넌트와 디자인 토큰 쇼케이스 |

`/explore`, `/notifications`, `/u/[username]/edit`는 API와 계획 문서가 먼저 잡혀 있고, 화면 구현은 다음 단계입니다.

## API

응답은 `lib/api/route-utils.ts`의 공통 형태를 따릅니다. 인증이 필요한 API는 `sns-auth-session` httpOnly 쿠키를 사용합니다.

| Method | Path | 설명 |
| --- | --- | --- |
| `POST` | `/api/v1/auth/signup` | 회원가입 및 세션 생성 |
| `POST` | `/api/v1/auth/login` | 로그인 및 세션 생성 |
| `POST` | `/api/v1/auth/logout` | 로그아웃 및 세션 삭제 |
| `GET` | `/api/v1/auth/me` | 현재 세션 사용자 조회 |
| `GET` | `/api/v1/feed?limit=&cursor=` | 피드 조회 |
| `GET` | `/api/v1/posts/[shortcode]` | 게시물 상세 조회 |
| `POST` | `/api/v1/posts` | 게시물 생성 |
| `POST` | `/api/v1/posts/[shortcode]/comments` | 댓글 생성 |
| `PUT` | `/api/v1/posts/[shortcode]/like` | 좋아요 |
| `DELETE` | `/api/v1/posts/[shortcode]/like` | 좋아요 취소 |
| `PUT` | `/api/v1/posts/[shortcode]/save` | 저장 |
| `DELETE` | `/api/v1/posts/[shortcode]/save` | 저장 취소 |
| `GET` | `/api/v1/users/[username]?tab=posts\|saved` | 프로필 조회 |
| `PUT` | `/api/v1/users/[username]/follow` | 팔로우 |
| `DELETE` | `/api/v1/users/[username]/follow` | 언팔로우 |
| `PATCH` | `/api/v1/me/profile` | 내 프로필 수정 |
| `GET` | `/api/v1/explore?q=` | 유저/게시물 탐색 데이터 조회 |
| `GET` | `/api/v1/notifications?filter=all\|like\|comment\|follow` | 알림 조회 |

`/api/auth/login`, `/api/auth/signup`, `/api/auth/logout`, `/api/auth/me`는 기존 호출 호환을 위한 alias입니다. 새 코드는 `/api/v1/auth/*`를 우선 사용합니다.

## 프로젝트 구조

```text
app/
  (auth)/          인증 화면 라우트
  (main)/          로그인 이후 앱 셸 라우트
  api/             Route Handler 기반 공개 API

components/
  layout/          공통 레이아웃 조각
  ui/              버튼, 카드, 입력, 배지 등 공통 UI

features/
  app-shell/       메인 앱 셸과 네비게이션 상태
  auth/            로그인, 회원가입, 로그아웃 UI/hooks/services
  design-system/   디자인 시스템 쇼케이스
  feed/            피드 카드와 mock feed service

lib/
  api/             API 응답/에러/세션 유틸
  session/         쿠키 세션 관리와 Provider
  social-repository/ in-memory SNS repository
  validators/      auth/social 입력 검증
  utils/           공통 유틸리티

types/             공통 타입 계약
docs/              기획, 라우트, API, 디자인 시스템 문서
__tests__/         문서/구조 회귀 테스트
```

## 개발 메모

- `app`은 라우트 조립과 레이아웃 경계를 담당합니다.
- 기능별 UI와 상태 흐름은 `features/*`에 둡니다.
- 여러 기능에서 재사용하는 UI는 `components/ui`, 공통 셸 조각은 `components/layout`에 둡니다.
- 데이터 접근은 `lib/social-repository`를 단일 진입점으로 사용합니다.
- 현재 인증은 예제용 평문 비밀번호 mock store입니다. 실제 배포 전에는 영속 DB, 해시 저장, CSRF/보안 정책을 별도로 적용해야 합니다.
- 상세 기능 계획은 `docs/plan` 아래 문서를 기준으로 관리합니다.
