"use client";

import { InlineMessage } from "@/components/ui/inline-message";
import type { PostActionErrorMessageProps } from "@/types/post-management";

export function PostActionErrorMessage({ message }: PostActionErrorMessageProps) {
  return <InlineMessage tone="error" message={message} className="w-full" />;
}
