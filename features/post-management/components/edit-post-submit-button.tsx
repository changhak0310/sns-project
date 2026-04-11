"use client";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PostSubmitButtonProps } from "@/types/post-management";

export function EditPostSubmitButton({
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
      leadingIcon={<Save className="size-4" />}
    >
      변경사항 저장
    </Button>
  );
}
