import { InlineMessage } from "@/components/ui/inline-message";
import type { LogoutErrorMessageProps } from "@/types/auth";

export function LogoutErrorMessage({ message }: LogoutErrorMessageProps) {
  return <InlineMessage tone="error" message={message} />;
}
