# 기능 04 - 게시물 작성

## 개요

| 항목 | 내용 |
| --- | --- |
| 라우트 | `/create` |
| 페이지 | `app/(main)/create/page.tsx` |
| 주요 액션 | `createPostAction` |
| 핵심 데이터 | 현재 작성자 정보, 선택된 이미지 값, 캡션 입력값 |
| 성공 후 | 새 게시물 permalink인 `/p/[shortcode]`로 이동 |

## 유저 입장

### 유저 스토리

> 나는 이미지를 고르고 캡션을 작성해서 바로 게시물을 올리고 싶다.

### 사용자가 보게 되는 것

- 이미지 선택 영역
- 캡션 입력창
- 글자 수 표시
- 제출 버튼

### 사용자 흐름

1. `/create` 진입
2. 이미지 선택
3. 캡션 입력
4. 제출
5. 성공 후 작성 결과 화면 이동

### 유저 기준 핵심 규칙

- 빈 입력으로는 제출할 수 없어야 한다.
- 제출 실패 시 입력값이 사라지면 안 된다.
- 작성 후 결과를 바로 확인할 수 있어야 한다.

## 개발자 입장

### 구조

#### 라우트 구조

```text
app/
  (main)/
    create/
      page.tsx
```

#### UI 구조

```text
features/
  post-compose/
    components/
      create-post-form.tsx
      preset-image-picker.tsx
      caption-input.tsx
      post-preview.tsx

components/
  ui/
    textarea.tsx
    button.tsx
```

#### 액션 구조

```text
lib/actions/post.ts
  - createPostAction
```

#### 데이터 구조

```text
CreatePostInput
  - authorId
  - imageUrl
  - caption

CreatePostResult
  - shortcode
  - imageUrl
```

추가 규칙:

- `authorId`는 폼 입력이 아니라 현재 세션에서 결정한다.
- `shortcode`는 서버에서 생성한다.
- 1차는 실제 파일 업로드 없이, 사전에 허용한 demo 이미지 선택 방식으로 구현한다.

### 담당 파일

| 항목 | 파일 |
| --- | --- |
| 페이지 | `app/(main)/create/page.tsx` |
| 작성 폼 | `features/post-compose/components/create-post-form.tsx` |
| 이미지 선택 | `features/post-compose/components/preset-image-picker.tsx` |
| 캡션 입력 | `features/post-compose/components/caption-input.tsx` |
| 미리보기 | `features/post-compose/components/post-preview.tsx` |
| 액션 | `lib/actions/post.ts` |
| validator | `lib/validators/post.ts` |
| repository | `lib/social-repository/*` |

### 로컬 상태

| 상태 | 설명 |
| --- | --- |
| `selectedImageUrl` | 선택된 이미지 값 |
| `caption` | 캡션 입력값 |
| `isSubmitting` | 제출 중 여부 |
| `submitError` | 작성 실패 메시지 |

### 구현 규칙

- 작성 폼은 최소 입력만 받는다.
- 1차는 파일 업로드, drag-and-drop, 별도 `route.ts` 업로드 엔드포인트 없이 간다.
- 이미지는 preset 목록 중 하나를 고르는 방식으로 제한한다.
- 캡션은 trim 후 최소 1자 이상이어야 하며, 최대 길이는 validator에서 고정한다. 시작 값은 300자로 둔다.
- 성공 시 새 게시물을 볼 수 있는 경로 `/p/[shortcode]`로 이동시킨다.
- page는 직접 시드 데이터를 읽지 않고 action과 repository를 통해 게시물을 생성한다.
- 외부 이미지를 나중에 허용할 경우 `next.config.ts`의 `images.remotePatterns`까지 같이 수정한다.

### 개발자 플로우

1. `page.tsx`가 작성 폼을 렌더링한다.
2. 사용자가 preset 이미지와 캡션을 입력한다.
3. 제출 시 `createPostAction`이 입력과 세션을 검증한다.
4. 검증 통과 시 repository가 새 게시물을 생성하고 `shortcode`를 반환한다.
5. 성공 시 `/p/[shortcode]`로 리다이렉트한다.

### 예외 처리

- 이미지 미선택 시 제출 불가
- 공백 캡션만 있을 경우 제출 불가
- 작성 실패 시 입력값 유지
- 허용되지 않은 이미지 참조값은 에러 반환
- 세션이 없으면 `/login?redirect=/create` 흐름으로 보호한다

## 체크리스트

- [ ] `/create` 페이지가 렌더링된다
- [ ] 이미지 선택 UI가 존재한다
- [ ] 캡션 입력 UI가 존재한다
- [ ] 잘못된 입력 시 제출이 막힌다
- [ ] `createPostAction`이 새 게시물을 생성한다
- [ ] 성공 시 `/p/[shortcode]`로 이동한다
- [ ] 실패 시 입력값이 유지된다
