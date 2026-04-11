"use client";

import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PostSubmitButtonProps } from "@/types/post-management";

export function CreatePostSubmitButton({
  isLoading,
  disabled,
  onClick,
}: PostSubmitButtonProps) {
  return (
    <Button
      fullWidth
      loading={isLoading}
      disabled={disabled}
      onClick={onClick}
      leadingIcon={<Send className="size-4" />}
    >
      게시글 올리기
    </Button>
  );
}
