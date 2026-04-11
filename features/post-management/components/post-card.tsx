import { Heart, MessageCircleMore } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { PostCardProps } from "@/types/post-management";

import { PostActionMenu } from "./post-action-menu";

function formatPostDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function PostCard({
  post,
  editHref,
  canEdit,
  canDelete,
  className,
}: PostCardProps) {
  const previewImages = post.imageUrls.slice(0, 4);
  const mainImage = previewImages[0];
  const supportingImages = previewImages.slice(1, 4);

  return (
    <Card
      bordered
      elevated
      className={cn("overflow-hidden bg-[var(--ds-color-neutral-0)]", className)}
    >
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar alt="preview-user" fallback="PU" ring />
            <div>
              <p className="text-sm font-semibold text-[var(--ds-color-primary-900)]">
                @preview-user
              </p>
              <p className="text-xs text-[var(--ds-color-neutral-500)]">
                {formatPostDate(post.updatedAt)}
              </p>
            </div>
          </div>
          <PostActionMenu
            postId={post.id}
            editHref={editHref}
            canEdit={canEdit}
            canDelete={canDelete}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {mainImage ? (
          <div className="space-y-3">
            <div
              role="img"
              aria-label={`${post.shortcode} 대표 이미지`}
              className="aspect-[4/5] rounded-[var(--ds-radius-lg)] bg-cover bg-center"
              style={{ backgroundImage: `url("${mainImage}")` }}
            />
            {supportingImages.length ? (
              <div className="grid grid-cols-3 gap-3">
                {supportingImages.map((imageUrl, index) => (
                  <div
                    key={`${imageUrl}-${index}`}
                    role="img"
                    aria-label={`추가 이미지 ${index + 1}`}
                    className="aspect-square rounded-[var(--ds-radius-md)] bg-cover bg-center"
                    style={{ backgroundImage: `url("${imageUrl}")` }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="soft" tone="accent">
            {post.shortcode}
          </Badge>
          <Badge variant="outline" tone="neutral">
            preview
          </Badge>
        </div>

        <p className="text-sm leading-7 text-[var(--ds-color-neutral-700)]">{post.caption}</p>

        <div className="flex items-center gap-4 text-sm text-[var(--ds-color-neutral-600)]">
          <span className="inline-flex items-center gap-1.5">
            <Heart className="size-4" aria-hidden />
            {post.likeCount}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageCircleMore className="size-4" aria-hidden />
            {post.commentCount}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
