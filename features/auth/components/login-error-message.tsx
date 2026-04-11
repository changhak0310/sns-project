import { InlineMessage } from "@/components/ui/inline-message";
import type { LoginErrorMessageProps } from "@/types/auth";

export function LoginErrorMessage({ message }: LoginErrorMessageProps) {
  return <InlineMessage tone="error" message={message} />;
}
