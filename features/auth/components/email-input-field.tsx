import { Mail } from "lucide-react";

import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { SignupFieldProps } from "@/types/auth";

export function EmailInputField({
  value,
  fieldErrorMessage,
  disabled = false,
  onChange,
}: SignupFieldProps) {
  return (
    <FormField label="이메일" htmlFor="signup-email" required>
      <Input
        id="signup-email"
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
