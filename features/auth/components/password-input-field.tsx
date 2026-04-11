import { LockKeyhole } from "lucide-react";

import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { AuthFieldProps } from "@/types/auth";

export function PasswordInputField({
  value,
  fieldErrorMessage,
  disabled = false,
  onChange,
}: AuthFieldProps) {
  return (
    <FormField label="비밀번호" htmlFor="auth-password" required>
      <Input
        id="auth-password"
        type="password"
        value={value}
        placeholder="비밀번호"
        leadingIcon={<LockKeyhole className="size-4" />}
        error={fieldErrorMessage}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </FormField>
  );
}
