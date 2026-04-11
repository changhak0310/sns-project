"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DeletePostButtonProps } from "@/types/post-management";

export function DeletePostButton({
  isLoading,
  disabled,
  onClick,
}: DeletePostButtonProps) {
  return (
    <Button
      fullWidth
      variant="danger"
      loading={isLoading}
      disabled={disabled}
      onClick={onClick}
      leadingIcon={<Trash2 className="size-4" />}
    >
      게시글 삭제
    </Button>
  );
}
