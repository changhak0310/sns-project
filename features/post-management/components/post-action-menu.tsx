"use client";

import { useEffect, useRef, useState } from "react";
import { Ellipsis, ShieldAlert } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import type { PostActionMenuProps } from "@/types/post-management";

import { DeletePostButton } from "./delete-post-button";
import { EditPostLinkButton } from "./edit-post-link-button";
import { PostActionErrorMessage } from "./post-action-error-message";

const DELETE_ERROR_MESSAGE = "게시글 삭제 중 문제가 발생했습니다.";

export function PostActionMenu({
  postId,
  editHref,
  canEdit,
  canDelete,
}: PostActionMenuProps) {
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [actionMenuError, setActionMenuError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActionMenuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current?.contains(event.target as Node)) {
        return;
      }

      setIsActionMenuOpen(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsActionMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isActionMenuOpen]);

  async function deletePost() {
    if (!canDelete || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setActionMenuError("");

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 220);
      });

      setIsActionMenuOpen(false);
    } catch {
      setActionMenuError(DELETE_ERROR_MESSAGE);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <IconButton
        size="sm"
        icon={<Ellipsis className="size-4" />}
        label={`게시글 ${postId} 메뉴 열기`}
        onClick={() => {
          setActionMenuError("");
          setIsActionMenuOpen((currentValue) => !currentValue);
        }}
      />

      {isActionMenuOpen ? (
        <Card
          padding="sm"
          radius="lg"
          bordered
          elevated
          className="absolute right-0 top-12 z-20 w-[240px] bg-[var(--ds-color-neutral-0)] shadow-[var(--ds-shadow-md)]"
        >
          <CardContent className="space-y-3">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ds-color-neutral-500)]">
              <ShieldAlert className="size-4" aria-hidden />
              Post #{postId}
            </p>
            {canEdit ? <EditPostLinkButton href={editHref} /> : null}
            {canDelete ? (
              <DeletePostButton
                isLoading={isDeleting}
                disabled={isDeleting}
                onClick={() => {
                  void deletePost();
                }}
              />
            ) : null}
            {actionMenuError ? <PostActionErrorMessage message={actionMenuError} /> : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
