import { InlineMessage } from "@/components/ui/inline-message";
import type { SignupErrorMessageProps } from "@/types/auth";

export function SignupErrorMessage({ message }: SignupErrorMessageProps) {
  return <InlineMessage tone="error" message={message} />;
}
