# 기능 09 - empty, loading, error 상태

## 개요

| 항목 | 내용 |
| --- | --- |
| 라우트 | 공통, `/`, `/p/[shortcode]`, `/create`, `/u/[username]` |
| 페이지 | 전체 주요 라우트와 `@modal` 슬롯 |
| 주요 액션 | 없음 |
| 핵심 데이터 | 페이지 상태, 조회 실패 상태, 이미지 로드 실패 상태 |
| 성공 후 | 주요 상태가 명확히 구분되어 사용자 혼란 감소 |

## 유저 입장

### 유저 스토리

> 나는 데이터가 없거나 늦게 오거나 실패하더라도, 지금 무슨 상태인지 쉽게 이해하고 싶다.

### 사용자가 보게 되는 것

- 피드 로딩 화면
- 피드 없음 화면
- 게시물 없음 화면
- 프로필 게시물 없음 화면
- 업로드 실패 메시지
- 이미지 로드 실패 fallback

### 사용자 흐름

1. 페이지 진입
2. 데이터 대기 시 로딩 UI 확인
3. 데이터 없음 시 빈 상태 확인
4. 실패 시 에러 메시지 또는 에러 화면 확인

### 유저 기준 핵심 규칙

- 로딩, 빈 상태, 에러 상태는 서로 다르게 보여야 한다.
- 실패해도 사용자가 다음 행동을 알 수 있어야 한다.
- 이미지 실패는 화면 전체를 깨뜨리면 안 된다.

## 개발자 입장

### 구조

#### 라우트 구조

```text
app/
  not-found.tsx
  (main)/
    loading.tsx (optional)
    error.tsx (optional)
    @modal/
      default.tsx
```

#### UI 구조

```text
components/
  layout/
    loading-state.tsx
    empty-state.tsx
    error-state.tsx
    not-found-state.tsx

  ui/
    image-fallback.tsx
```

#### 액션 구조

```text
없음
```

#### 데이터 구조

```text
UIStatus
  - isLoading
  - isEmpty
  - isError
  - errorMessage
```

### 담당 파일

| 항목 | 파일 |
| --- | --- |
| 전역 not-found | `app/not-found.tsx` |
| 메인 loading | `app/(main)/loading.tsx` (optional) |
| 메인 error | `app/(main)/error.tsx` (optional) |
| 모달 기본 fallback | `app/(main)/@modal/default.tsx` |
| 공통 상태 UI | `components/layout/*` |
| 이미지 fallback | `components/ui/image-fallback.tsx` |
| 전역 스타일 | `app/globals.css` |

### 로컬 상태

| 상태 | 설명 |
| --- | --- |
| `imageError` | 개별 이미지 실패 여부 |

상태가 아닌 값:

- `isLoading`, `isEmpty`, `isError`는 page 또는 segment의 렌더 분기다.
- `error.tsx`는 route segment error boundary이고, 별도 boolean state가 아니다.

### 구현 규칙

- 페이지마다 최소 1개의 empty state를 정의한다.
- 주요 비동기 구간에는 loading UI를 둔다.
- 에러 메시지는 사용자 중심 문구로 표현한다.
- 이미지 실패는 개별 fallback으로 처리한다.
- `error.tsx`는 Next.js 규칙에 맞게 Client Component여야 한다.
- `notFound()`를 던지는 라우트는 `not-found.tsx`와 함께 읽히도록 설계한다.
- `@modal` 슬롯은 Next.js 16 기본 요구사항에 맞게 `default.tsx`를 둔다.

### 개발자 플로우

1. 주요 페이지별 상태 분기 기준을 정한다.
2. 공통 상태 컴포넌트를 만든다.
3. 각 페이지에서 로딩/빈/에러 분기를 연결한다.
4. 이미지 컴포넌트에 fallback 전략을 넣는다.
5. 모달 슬롯의 기본 fallback과 에러 흐름을 정리한다.

### 예외 처리

- 로딩과 에러가 동시에 노출되지 않도록 분기
- 비어 있음과 실패를 혼동하지 않도록 문구 분리
- 이미지 실패 시 대체 배경 또는 아이콘 노출
- 모달 슬롯이 현재 URL과 맞지 않을 때는 `default.tsx`에서 안전하게 `null`을 반환

## 체크리스트

- [ ] 피드 로딩 UI가 존재한다
- [ ] 피드 빈 상태가 존재한다
- [ ] 게시물 없음 상태가 존재한다
- [ ] 프로필 게시물 없음 상태가 존재한다
- [ ] 업로드 실패 상태가 존재한다
- [ ] 이미지 로드 실패 fallback이 존재한다
- [ ] 전역 not-found가 존재한다
- [ ] `@modal/default.tsx`가 존재한다
