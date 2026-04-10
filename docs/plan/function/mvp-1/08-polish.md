# 기능 08 - 마감용 polish

## 개요

| 항목 | 내용 |
| --- | --- |
| 라우트 | 공통 |
| 페이지 | 전체 주요 라우트 |
| 주요 액션 | 없음 |
| 핵심 데이터 | 로딩 상태, 빈 상태, 에러 상태, 메타데이터, 접근성 상태, 반응형 품질 |
| 성공 후 | 서비스가 동작하는 수준을 넘어 완성된 제품처럼 보이도록 품질 정리 |

## 유저 입장

### 유저 스토리

> 나는 기능이 동작하는 것뿐 아니라, 화면이 안정적이고 읽기 쉽고 사용하기 편하길 원한다.

### 사용자가 보게 되는 것

- loading UI
- empty state
- error state
- not-found 화면
- 안정적인 이미지 비율
- 모바일에서도 깨지지 않는 레이아웃

### 사용자 흐름

1. 페이지 진입
2. 데이터 대기 시 로딩 UI 확인
3. 데이터 없음/실패 시 적절한 상태 UI 확인
4. 모든 화면에서 안정적인 사용 경험 유지

### 유저 기준 핵심 규칙

- 화면이 갑자기 깨지거나 비어 보이면 안 된다.
- 로딩, 실패, 빈 상태를 구분해서 보여줘야 한다.
- 모바일 사용 경험이 데스크톱보다 먼저 안정적이어야 한다.

## 개발자 입장

### 구조

#### 라우트 구조

```text
app/
  layout.tsx
  not-found.tsx
  (main)/
    loading.tsx (optional)
    error.tsx (optional)
```

#### UI 구조

```text
components/
  layout/
    empty-state.tsx
    loading-state.tsx
    error-state.tsx
    not-found-state.tsx

  ui/
    image-fallback.tsx
    button.tsx
```

#### 액션 구조

```text
없음
```

#### 데이터 구조

```text
UIQualityChecklist
  - hasLoadingState
  - hasEmptyState
  - hasErrorState
  - hasNotFoundState
  - hasFocusVisible
  - hasResponsiveLayout

Metadata
  - title
  - description
```

### 담당 파일

| 항목 | 파일 |
| --- | --- |
| 루트 메타데이터 | `app/layout.tsx` |
| 전역 not-found | `app/not-found.tsx` |
| 메인 loading | `app/(main)/loading.tsx` (optional) |
| 메인 error | `app/(main)/error.tsx` (optional) |
| 전역 스타일 | `app/globals.css` |
| 상태 UI | `components/layout/*` |
| 이미지 fallback | `components/ui/image-fallback.tsx` |
| 이미지 설정 | `next.config.ts` (optional) |

### 로컬 상태

기본적으로 새 로컬 상태는 추가하지 않는다.

상태가 아닌 값:

- `isLoading`, `isEmpty`, `isError`는 page 또는 segment의 렌더 분기다.
- 메타데이터 값은 server component의 `metadata` 또는 `generateMetadata`에서 계산한다.

### 구현 규칙

- `11-empty-loading-error.md`는 상태 UI 자체를 정의하고, `08-polish.md`는 그 상태 UI가 전체 라우트에 일관되게 연결되었는지 마감 관점에서 정리한다.
- 모든 주요 화면에 loading, empty, error 상태를 고려한다.
- 모바일 레이아웃을 먼저 맞춘다.
- 이미지 비율은 고정해서 레이아웃 점프를 막는다.
- 버튼은 default, hover, active, disabled 상태를 가진다.
- 키보드 포커스가 보이도록 유지한다.
- `metadata`와 `generateMetadata`는 Server Component에서만 사용한다.
- `error.tsx`는 Next.js 규칙에 맞게 Client Component로 작성한다.
- 외부 이미지를 실제로 사용할 경우 `next.config.ts`의 `images.remotePatterns`를 함께 맞춘다.

### 개발자 플로우

1. 각 주요 페이지에 필요한 상태 UI를 정의한다.
2. `components/layout/*`의 상태 컴포넌트를 공통으로 정리한다.
3. `not-found.tsx`, `loading.tsx`, `error.tsx`를 필요한 세그먼트에 연결한다.
4. 전역 및 페이지 메타데이터를 정리한다.
5. 모바일 기준으로 여백, 크기, 이미지 비율을 점검한다.
6. 버튼 상태와 포커스 접근성을 마지막에 정리한다.

### 예외 처리

- 로딩과 에러 상태가 동시에 보이지 않도록 분기
- 이미지 비율이 불명확하면 fallback 비율 사용
- 에러 메시지는 너무 기술적으로 노출하지 않기
- 메타데이터 누락 시 기본 메타데이터 fallback 사용

## 체크리스트

- [ ] loading UI가 주요 화면에 존재한다
- [ ] empty state가 주요 화면에 존재한다
- [ ] error state가 주요 화면에 존재한다
- [ ] not-found 처리가 존재한다
- [ ] 모바일 반응형이 안정적이다
- [ ] 이미지 비율이 안정적으로 유지된다
- [ ] 메타데이터가 설정된다
- [ ] 버튼 상태가 정리된다
- [ ] 포커스 접근성이 보인다



