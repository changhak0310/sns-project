# 기능 14 - 프로필 수정

## 개요

| 항목 | 내용 |
| --- | --- |
| 라우트 | `/u/[username]/edit` |
| 페이지 | `app/(main)/u/[username]/edit/page.tsx` |
| 주요 액션 | `updateProfileAction` |
| 핵심 데이터 | 프로필 이미지, display name, bio |
| 성공 후 | 수정된 프로필 정보가 본인 프로필에 반영 |

## 유저 입장

### 유저 스토리

> 나는 내 프로필 사진, 이름, 소개글을 수정해서 계정을 내 스타일에 맞게 바꾸고 싶다.

### 사용자가 보게 되는 것

- 프로필 이미지 수정 영역
- display name 입력창
- bio 입력창
- 저장 버튼
- 저장 성공/실패 메시지

### 사용자 흐름

1. `/u/[username]/edit` 진입
2. 프로필 이미지, 이름, bio 수정
3. 저장 버튼 클릭
4. 성공 시 프로필 페이지로 복귀

### 유저 기준 핵심 규칙

- 자기 프로필에서만 수정할 수 있어야 한다.
- 저장 실패 시 입력값이 사라지면 안 된다.
- 저장 후 프로필에 바로 반영돼야 한다.
- 사용자명은 이 단계에서 바꾸지 않는다.

## 개발자 입장

### 구조

#### 라우트 구조

```text
app/
  (main)/
    u/
      [username]/
        edit/
          page.tsx
```

#### UI 구조

```text
features/
  profile/
    components/
      edit-profile-form.tsx
      profile-image-picker.tsx
```

#### 액션 구조

```text
lib/actions/profile.ts
  - updateProfileAction
```

#### 데이터 구조

```text
ProfileEditInput
  - avatarUrl
  - displayName
  - bio

ProfileEditView
  - username
  - avatarUrl
  - displayName
  - bio
```

추가 규칙:

- `username`은 수정 대상 식별자이며, 이 문서 범위에서는 편집 항목이 아니다.
- 1차는 실제 파일 업로드 없이, preset avatar 선택 또는 허용된 demo 이미지 값 선택 방식으로 구현한다.
- `displayName`과 `bio` 검증 규칙은 validator에서 단일 소스로 관리한다.

### 담당 파일

| 항목 | 파일 |
| --- | --- |
| 페이지 | `app/(main)/u/[username]/edit/page.tsx` |
| 수정 폼 | `features/profile/components/edit-profile-form.tsx` |
| 이미지 선택 | `features/profile/components/profile-image-picker.tsx` |
| 액션 | `lib/actions/profile.ts` |
| validator | `lib/validators/profile.ts` |
| repository | `lib/social-repository/*` |

### 로컬 상태

| 상태 | 설명 |
| --- | --- |
| `selectedAvatarUrl` | 현재 선택된 프로필 이미지 값 |
| `displayName` | 표시 이름 입력값 |
| `bio` | 자기소개 입력값 |
| `isSubmitting` | 저장 중 여부 |
| `submitError` | 저장 실패 메시지 |

상태가 아닌 값:

- `username`은 async `params`에서 파생한다.
- `isOwner`는 현재 세션 사용자와 `params.username` 비교로 계산한다.

### 구현 규칙

- `(main)` 레이아웃이 로그인 여부를 가드하고, edit page는 본인 프로필 여부를 한 번 더 확인한다.
- `page.tsx`가 `params`를 읽을 때는 Next.js 16 규칙에 맞게 async `params`를 처리한다.
- 수정 대상이 본인이 아니면 edit 화면을 렌더링하지 않고 `/u/[username]`로 보낸다.
- 수정 범위는 `avatarUrl`, `displayName`, `bio`로 제한한다.
- `displayName`은 trim 후 비어 있지 않아야 한다.
- `bio`는 trim 후 저장하며, 최대 길이는 validator에서 고정한다. 1차 기준은 160자로 둔다.
- 실제 업로드, crop UI, 별도 `route.ts` 업로드 엔드포인트는 2차 확장으로 미룬다.
- 저장 성공 시 `/u/[username]`로 리다이렉트하고 최신 프로필 데이터를 재검증한다.
- page와 feature는 직접 시드 데이터를 읽지 않고 repository를 통해 수정한다.

### 개발자 플로우

1. `page.tsx`가 async `params`에서 `username`을 읽는다.
2. 현재 세션 사용자와 `username` 일치 여부를 확인한다.
3. 본인 프로필이면 기존 프로필 값을 폼에 채운다.
4. 저장 시 `updateProfileAction`이 입력을 검증한다.
5. 검증 통과 시 repository가 프로필 정보를 저장한다.
6. 성공 시 `/u/[username]`으로 리다이렉트하고 최신 값을 보여준다.

### 예외 처리

- 세션이 없으면 `/login?redirect=/u/[username]/edit` 흐름으로 보호한다
- 자기 프로필이 아니면 `/u/[username]`로 리다이렉트한다
- 저장 실패 시 입력값 유지
- 허용되지 않은 avatar 값은 에러 반환
- display name이 비어 있으면 저장 불가
- bio 길이 초과 시 저장 불가

## 체크리스트

- [ ] `/u/[username]/edit` 페이지가 렌더링된다
- [ ] 프로필 이미지, display name, bio 입력 UI가 존재한다
- [ ] 자기 프로필에서만 접근 가능하다
- [ ] `username`은 수정 대상 식별자로만 사용되고 입력 항목은 아니다
- [ ] `updateProfileAction`이 프로필을 수정한다
- [ ] 저장 성공 시 `/u/[username]` 프로필 화면에 반영된다
- [ ] 저장 실패 시 입력값이 유지된다
