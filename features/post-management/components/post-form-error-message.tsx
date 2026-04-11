"use client";

import { InlineMessage } from "@/components/ui/inline-message";
import type { PostFormErrorMessageProps } from "@/types/post-management";

export function PostFormErrorMessage({ message }: PostFormErrorMessageProps) {
  return <InlineMessage tone="error" message={message} className="w-full" />;
}
