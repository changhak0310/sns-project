import { ShieldCheck } from "lucide-react";

import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { SignupFieldProps } from "@/types/auth";

export function ConfirmPasswordInputField({
  value,
  fieldErrorMessage,
  disabled = false,
  onChange,
}: SignupFieldProps) {
  return (
    <FormField label="비밀번호 확인" htmlFor="signup-confirm-password" required>
      <Input
        id="signup-confirm-password"
        type="password"
        value={value}
        placeholder="비밀번호를 다시 입력해주세요"
        leadingIcon={<ShieldCheck className="size-4" />}
        error={fieldErrorMessage}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </FormField>
  );
}
