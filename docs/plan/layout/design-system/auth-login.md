# 로그인 화면 디자인 명세

> 기준 문서:
> - [design-system.md](../design-system.md)
> - [screen-patterns.md](./screen-patterns.md)

## 1. 적용 범위

이 문서는 로그인 화면(`/login`)에 적용하는 디자인 기준을 정의한다.

- 구현 디렉터리: `features/auth/components`
- 레이아웃 기준: `components/layout`
- 공통 UI 기준: `components/ui`

## 2. 화면 무드와 레이아웃

| 항목 | 기준 |
| --- | --- |
| 화면 무드 | 기본은 `focus`, 다크 인증 화면은 `focus-dark`를 사용한다. 전체 인상은 인스타그램처럼 가볍고 빠르게 읽히는 인증 화면을 지향한다. |
| 기본 레이아웃 | 중앙 정렬 단일 카드 레이아웃을 사용한다. |
| 카드 폭 | 모바일 `calc(100% - 32px)`, 최대 `420px`를 기준으로 한다. |
| 카드 padding | 모바일 `24px`, 데스크톱 `32px`를 기준으로 한다. |
| 정보 순서 | `제목 -> 설명 -> email -> password -> CTA -> 전환 링크` 순서를 따른다. |
| 카드 스타일 | 화이트 surface, 얇은 보더, 낮은 그림자, 상단 브랜드 영역을 기본으로 한다. |
| CTA 스타일 | 주 액션은 또렷한 solid tone을 사용하고, 보조 강조만 accent tone 또는 약한 gradient를 허용한다. |
| 확장 규칙 | 데스크톱에서도 2열로 나누지 않고 단일 카드 레이아웃을 유지한다. |

## 3. 컴포넌트 적용 기준

| 요소 | 기본 컴포넌트 | 기준 |
| --- | --- | --- |
| `LoginPage` | `components/layout/auth-shell.tsx` | 화면 중앙 정렬과 화면 폭 제어만 담당한다. |
| `LoginForm` | `features/auth/components` | 인증 카드 내부 조합만 담당하고, 입력 간 간격은 촘촘하지 않게 유지한다. |
| `EmailInputField` | `components/ui/input.tsx` | `type="email"`, 한 줄 입력, `emailError -> fieldErrorMessage`를 전달한다. 배경은 화이트, 보더는 얇고 선명하게 유지한다. |
| `PasswordInputField` | `components/ui/input.tsx` | `type="password"`, 한 줄 입력, `passwordError -> fieldErrorMessage`를 전달한다. 배경은 화이트, 보더는 얇고 선명하게 유지한다. |
| `LoginSubmitButton` | `components/ui/button.tsx` | primary variant, full width 기준을 사용한다. 색상은 강한 contrast를 우선하고 과한 입체 효과는 피한다. |
| `LoginErrorMessage` | `features/auth/components` | 폼 영역 에러 메시지로 노출하고 alert tone을 사용한다. |
| 카드 래퍼 | `features/auth/components/auth-form-card.tsx` | 입력/버튼/링크를 단일 surface로 묶는다. |

## 4. 상태별 디자인 규칙

| 상태 | 표현 방식 |
| --- | --- |
| 기본 | clean 또는 focus mood card + subtle border + muted placeholder |
| focus | 입력 보더 강조 + clean focus ring |
| error | 필드 하단 에러 메시지 + 에러 보더 |
| pending | CTA 비활성 + 로딩 텍스트 또는 스피너 |
| disabled | 명도 낮춤 + 클릭 차단 |

## 5. 오픈 소스 라이브러리 사용 기준

| 항목 | 기준 |
| --- | --- |
| 사용 원칙 | 오픈 소스 라이브러리 기반 디자인을 사용할 수 있다. |
| 적용 방식 | 라이브러리 스타일을 그대로 쓰지 않고 프로젝트 토큰, variant, 상태 규칙에 맞게 래핑해서 사용한다. |
| 우선 순위 | 공통 UI/레이아웃 재사용 가능 여부를 먼저 확인하고, 부족한 경우에만 라이브러리 컴포넌트를 도입한다. |
| 권장 방향 | `shadcn/ui`, Radix UI 같은 범용 라이브러리를 기반으로 하되, 로그인 화면은 인스타그램처럼 가벼운 social auth 인상을 유지하도록 spacing, border, tone을 다시 조정한다. |
| 참조 기준 | 토큰/무드는 [design-system.md](../design-system.md), 화면 패턴은 [screen-patterns.md](./screen-patterns.md)를 우선 적용한다. |
