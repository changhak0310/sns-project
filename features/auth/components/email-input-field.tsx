import { Mail } from "lucide-react";

import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { AuthFieldProps } from "@/types/auth";

export function EmailInputField({
  value,
  fieldErrorMessage,
  disabled = false,
  onChange,
}: AuthFieldProps) {
  return (
    <FormField label="이메일" htmlFor="auth-email" required>
      <Input
        id="auth-email"
        type="email"
        value={value}
        placeholder="name@company.com"
        leadingIcon={<Mail className="size-4" />}
        error={fieldErrorMessage}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </FormField>
  );
}
