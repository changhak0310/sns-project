"use client";

import { FormField } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import type { CaptionInputProps } from "@/types/post-management";

export function CaptionInput({
  value,
  fieldErrorMessage,
  disabled = false,
  onChange,
}: CaptionInputProps) {
  return (
    <FormField
      label="캡션"
      description="공백만 입력한 상태는 저장할 수 없습니다."
      htmlFor="post-caption"
      required
    >
      <Textarea
        id="post-caption"
        value={value}
        disabled={disabled}
        error={fieldErrorMessage}
        resize="none"
        placeholder="사진과 함께 남길 캡션을 입력해 주세요."
        onChange={(event) => onChange(event.target.value)}
      />
    </FormField>
  );
}
