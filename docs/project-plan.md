# SNS Project Overview

## 1. 프로젝트 요약

이 프로젝트는 `Next.js 16` 기반의 SNS 웹 서비스 MVP이다.  
목표는 로그인 이후 홈 피드, 게시물 상세, 게시물 작성, 프로필/팔로우, 저장 기능까지 하나의 자연스러운 흐름으로 연결하고, 이후 탐색, 알림, 프로필 수정 기능까지 확장할 수 있는 구조를 만드는 것이다.

현재 상태는 `기획/아키텍처 정리 + 개발 환경 세팅 완료` 단계이며, 실제 서비스 화면과 기능은 이제 본격적으로 구현해 나가야 하는 상태다.

## 2. 현재 상태 한눈에 보기

| 구분 | 상태 | 내용 |
| --- | --- | --- |
| 프로젝트 기본 세팅 | 완료 | `Next.js 16`, `React 19`, `TypeScript`, `Tailwind CSS 4`, `ESLint` 구성 완료 |
| 필수 보조 라이브러리 설치 | 완료 | `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`, `bcryptjs`, `server-only` 추가 완료 |
| 프로젝트 기획 문서 | 완료 | `docs/plan` 기준으로 기능/구조/라우트/디자인 시스템 문서 정리 완료 |
| 프로젝트 구조 전환 | 진행 중 | 현재 스타터 구조를 `app / features / components / lib / data / types` 기준 구조로 전환 예정 |
| 실제 서비스 화면 구현 | 예정 | 인증, 피드, 상세, 작성, 프로필 등 핵심 화면 미구현 |
| 실제 데이터/세션 흐름 구현 | 예정 | seed data, repository, server action, session helper 미구현 |

## 3. 기능 목록과 진행 상태

### 1차 MVP

| 기능 | 라우트 | 상태 | 설명 |
| --- | --- | --- | --- |
| 공통 기반과 서비스 셸 | 공통 | 진행 중 | 공통 레이아웃, 헤더, 모바일 하단 탭, 데스크톱 사이드바, 디자인 토큰 |
| 회원가입 / 로그인 / 로그아웃 | `/signup`, `/login` | 예정 | 세션 생성, 보호 라우트 진입, 안전한 redirect 처리 |
| 세션 가드 | 공통, `(main)` | 예정 | 로그인 필요 페이지 접근 제어 |
| 홈 피드 | `/` | 예정 | 게시물 리스트, 게시물 카드, 피드 진입 화면 |
| 게시물 상세 | `/p/[shortcode]` | 예정 | permalink 상세, 좋아요, 댓글 작성 |
| 피드 오버레이 상세 | `/p/[shortcode]` | 예정 | 피드 위 modal/overlay 형태 상세 진입 |
| 게시물 작성 | `/create` | 예정 | 이미지 선택, 캡션 입력, 게시물 생성 |
| 프로필 / 팔로우 | `/u/[username]` | 예정 | 사용자 정보, 게시물 그리드, 팔로우 |
| 저장 / 북마크 | `/u/[username]?tab=saved` | 예정 | 게시물 저장, Saved 탭 표시 |
| 상태 UI | 공통 | 예정 | loading, empty, error, not-found, image fallback |
| 마감 polish | 공통 | 예정 | 메타데이터, 반응형, 접근성, 시각 완성도 |

### 2차 확장

| 기능 | 라우트 | 상태 | 설명 |
| --- | --- | --- | --- |
| Explore Lite | `/explore` | 예정 | 추천 유저/추천 게시물 탐색 |
| Notification Lite | `/notifications` | 예정 | 좋아요, 댓글, 팔로우 활동 피드 |
| 프로필 수정 | `/u/[username]/edit` | 예정 | 프로필 이미지, 이름, bio 수정 |

## 4. 현재 적용 스택

### 런타임 / 프레임워크

- `Node.js 20.9+`
- `Next.js 16.2.3`
- `React 19.2.4`
- `React DOM 19.2.4`
- `TypeScript 5`

### 스타일 / UI

- `Tailwind CSS 4`
- `clsx`
- `tailwind-merge`
- `class-variance-authority`
- `lucide-react`

### 서버 / 인증 보조

- `bcryptjs`
- `server-only`

### 개발 도구

- `ESLint 9`
- `eslint-config-next`

## 5. 이번에 실제로 추가한 스택

아래 패키지는 문서에만 적어두지 않고 이번에 실제 의존성으로 추가했다.

| 패키지 | 추가 이유 |
| --- | --- |
| `clsx` | 공통 UI에서 조건부 className 조합 |
| `tailwind-merge` | Tailwind class 충돌 정리 |
| `class-variance-authority` | 버튼, 입력창, 탭 같은 variant 기반 공통 UI 구성 |
| `lucide-react` | 헤더, 네비게이션, 액션 버튼용 아이콘 |
| `bcryptjs` | 회원가입/로그인 시 비밀번호 해시 저장용 |
| `server-only` | repository, query, action 같은 서버 전용 모듈 경계 분리 |

## 6. 이 프로젝트에서 사용할 구조

```text
app/
  (auth)/
  (main)/

features/
  auth/
  feed/
  post-detail/
  post-compose/
  profile/
  explore/
  notification/

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

## 7. 아키텍처 기준

- 라우팅과 레이아웃 조합은 `app`에서 담당한다.
- 기능별 UI와 상호작용은 `features`에서 담당한다.
- 공통 UI와 레이아웃 조각은 `components`에서 담당한다.
- 조회는 `Server Component + lib/queries + lib/social-repository` 흐름으로 처리한다.
- 변경은 `Server Action + lib/actions + lib/social-repository` 흐름으로 처리한다.
- 초기 데이터는 `data/seed`로 시작하고, 이후 `lib/firebase`를 통해 실제 백엔드로 교체 가능하게 설계한다.
- `activeNav`, `activeTab`, `redirectTo`, `selectedShortcode` 같은 값은 전역 상태가 아니라 URL과 라우트에서 파생한다.

## 8. 현재 코드베이스 기준 실제 상태

현재 실제 코드베이스는 아직 스타터 상태에 가깝다.

- 현재 주요 실제 파일은 `app/layout.tsx`, `app/page.tsx`, `app/globals.css` 중심이다.
- 기본 `create-next-app` 화면이 아직 남아 있다.
- 서비스용 라우트인 `(auth)`, `(main)`, `@modal`, `features`, `lib`, `data` 구조는 아직 만들어지지 않았다.
- 즉, 지금은 "서비스 구현 완료 단계"가 아니라 "서비스 구현을 위한 기반 준비 단계"라고 보는 것이 맞다.

## 9. 다음 구현 우선순위

1. `app/(auth)`, `app/(main)` 구조 생성
2. 공통 셸과 공통 UI 구축
3. `data/seed`, `lib/social-repository`, `lib/session`, `lib/validators` 구성
4. 회원가입 / 로그인 / 세션 가드 구현
5. 홈 피드 / 게시물 상세 / 오버레이 상세 구현
6. 게시물 작성 / 프로필 / 팔로우 / 저장 구현
7. 상태 UI와 polish 정리
8. Explore / Notification / Profile Edit 확장

## 10. 최종 요약

이 프로젝트는 인스타그램 스타일의 SNS MVP를 만드는 프로젝트다.  
현재는 개발 환경 세팅과 문서 기준 정리가 끝난 상태이고, 실제 핵심 기능은 앞으로 구현해야 한다.

적용 스택은 지금 기준으로 `Next.js 16 + React 19 + TypeScript + Tailwind CSS 4`이며,  
공통 UI와 인증 구현에 필요한 `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`, `bcryptjs`, `server-only`도 이미 추가해 두었다.

핵심 기능은 인증, 피드, 상세, 작성, 프로필, 팔로우, 저장이고,  
확장 기능은 탐색, 알림, 프로필 수정이다.  
전체 구조는 `App Router + Server Component + Server Action + Repository` 패턴으로 진행한다.
