# 공통 UI 컴포넌트

> 구현 디렉터리: `components/ui`

## 1. 규칙

- 공통 UI는 기능 정책 없이 Props 기반으로만 동작한다
- 상태 표현은 토큰으로만 조합한다
- 공통 UI는 repository, action, session mutation을 직접 호출하지 않는다
- feature 전용 상호작용이 붙기 시작하면 `features/*/components`로 올린다

## 2. 컴포넌트 목록

### Button

| 항목 | 내용 |
| --- | --- |
| 역할 | 서비스 내 주요 액션 버튼의 기본 단위 |
| Props | `variant / size / disabled / loading / fullWidth / leadingIcon / trailingIcon` |
| Variants | `primary` / `secondary` / `ghost` / `outline` / `danger` |
| Sizes | `sm / md / lg` |
| loading 상태 | 텍스트 대신 스피너 표시 + 클릭 이벤트 차단 |

### IconButton

| 항목 | 내용 |
| --- | --- |
| 역할 | 좋아요, 저장, 닫기, 뒤로가기 같은 아이콘 액션 |
| Props | `icon / label / active / disabled / loading / size / tone` |
| Sizes | `sm / md / lg` |
| 접근성 | `aria-label` 필수 |

### Input

| 항목 | 내용 |
| --- | --- |
| 역할 | 이메일, 이름, 검색, 짧은 텍스트 입력 |
| Props | `value / placeholder / error / leadingIcon / trailingIcon / disabled` |
| Variants | `default` / `quiet` / `search` |
| 에러 상태 | 하단 에러 텍스트 + 에러 보더 |

### Textarea

| 항목 | 내용 |
| --- | --- |
| 역할 | 캡션, bio, 긴 텍스트 입력 |
| Props | `value / placeholder / maxLength / showCounter / resize / disabled` |
| 높이 | 최소 140px |
| 카운터 | 현재 글자 수 / 최대 길이 |

### FormField

| 항목 | 내용 |
| --- | --- |
| 역할 | label + description + field + error 조합 래퍼 |
| Props | `label / description / error / required / htmlFor` |
| 사용처 | 로그인, 회원가입, 작성, 프로필 수정 |

### Avatar

| 항목 | 내용 |
| --- | --- |
| 역할 | 프로필 이미지 표시 |
| Props | `src / alt / size / ring / fallback / status` |
| Sizes | `xs / sm / md / lg / xl / 2xl` |
| fallback | 이니셜 또는 기본 아이콘 표시 |

### Badge

| 항목 | 내용 |
| --- | --- |
| 역할 | 상태, 추천, 저장, draft 같은 짧은 라벨 표시 |
| Props | `variant / tone / icon / size` |
| Variants | `solid` / `soft` / `outline` |

### Card

| 항목 | 내용 |
| --- | --- |
| 역할 | 피드 카드, 추천 카드, 정보 카드의 기본 컨테이너 |
| Props | `padding / radius / bordered / elevated / interactive` |
| 규칙 | surface + subtle border + shadow 조합 |

### Tabs

| 항목 | 내용 |
| --- | --- |
| 역할 | 프로필 탭, 알림 필터, 탐색 섹션 전환 |
| Props | `items / value / onChange / variant / size` |
| Variants | `underline` / `pill` / `segmented` |

### Sheet

| 항목 | 내용 |
| --- | --- |
| 역할 | 모바일 메뉴, 옵션 패널, 보조 정보 노출 |
| Props | `open / title / side / onClose / size` |
| 동작 | 오버레이 클릭 시 닫힘 |

### ModalFrame

| 항목 | 내용 |
| --- | --- |
| 역할 | 게시물 상세 오버레이, 공통 dialog shell |
| Props | `open / title / onClose / size / showCloseButton` |
| 규칙 | 모바일은 bottom sheet, 데스크톱은 centered panel 기준 |

### EmptyState

| 항목 | 내용 |
| --- | --- |
| 역할 | 데이터가 없을 때 비어 있는 상태 안내 |
| Props | `title / description / actionText / visual / tone` |
| 사용처 | 피드 없음, 저장 없음, 알림 없음 |

### LoadingState

| 항목 | 내용 |
| --- | --- |
| 역할 | 초기 로딩과 재조회 중 구조 유지용 placeholder |
| Props | `variant / lines / mediaRatio` |
| 사용처 | 피드 카드 skeleton, 프로필 skeleton |

### ErrorState

| 항목 | 내용 |
| --- | --- |
| 역할 | 복구 가능한 실패 상태 안내 |
| Props | `title / description / retryAction / tone` |
| 사용처 | 조회 실패, 모달 내부 에러 |

### InlineMessage

| 항목 | 내용 |
| --- | --- |
| 역할 | 폼 하단 안내 또는 검증 메시지 |
| Props | `tone / icon / message` |
| 사용처 | 로그인 실패, 작성 실패, 수정 실패 |

### ImageFallback

| 항목 | 내용 |
| --- | --- |
| 역할 | 이미지 누락/실패 시 대체 UI |
| Props | `ratio / label / icon` |
| 사용처 | 게시물 이미지, 썸네일, 프로필 이미지 |

### Divider

| 항목 | 내용 |
| --- | --- |
| 역할 | 카드 내부나 섹션 사이 약한 분리선 |
| Props | `orientation / inset / tone` |
| 사용처 | 상세 메타 구역, form section 구분 |
