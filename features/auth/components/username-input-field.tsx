import { AtSign } from "lucide-react";

import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { SignupFieldProps } from "@/types/auth";

export function UsernameInputField({
  value,
  fieldErrorMessage,
  disabled = false,
  onChange,
}: SignupFieldProps) {
  return (
    <FormField label="유저 이름" htmlFor="signup-username" required>
      <Input
        id="signup-username"
        type="text"
        value={value}
        placeholder="orbit-editor"
        leadingIcon={<AtSign className="size-4" />}
        error={fieldErrorMessage}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </FormField>
  );
}
