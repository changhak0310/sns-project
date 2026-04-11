"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageFallback } from "@/components/ui/image-fallback";
import type { PostPreviewProps } from "@/types/post-management";

export function PostPreview({ images, caption }: PostPreviewProps) {
  const previewImages = images.slice(0, 4);
  const mainImage = previewImages[0];
  const sideImages = previewImages.slice(1);
  const trimmedCaption = caption.trim();

  return (
    <Card bordered elevated className="bg-[var(--ds-color-neutral-0)]">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>미리보기</CardTitle>
            <CardDescription>
              선택한 이미지와 캡션이 카드 형태로 즉시 반영됩니다.
            </CardDescription>
          </div>
          <Badge variant="soft" tone="accent">
            preview
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {mainImage ? (
          <div className="space-y-3">
            <div
              role="img"
              aria-label="게시글 대표 이미지 미리보기"
              className="aspect-[4/5] rounded-[var(--ds-radius-lg)] bg-cover bg-center"
              style={{ backgroundImage: `url("${mainImage.previewUrl}")` }}
            />
            {sideImages.length ? (
              <div className="grid grid-cols-3 gap-3">
                {sideImages.map((image, index) => (
                  <div
                    key={`${image.previewUrl}-${index}`}
                    role="img"
                    aria-label={`추가 이미지 ${index + 1}`}
                    className="aspect-square rounded-[var(--ds-radius-md)] bg-cover bg-center"
                    style={{ backgroundImage: `url("${image.previewUrl}")` }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <ImageFallback ratio="portrait" label="이미지를 선택하면 포스트 카드에 반영됩니다." />
        )}

        <div className="flex items-center gap-3">
          <Avatar alt="preview-user" fallback="PR" ring />
          <div>
            <p className="text-sm font-semibold text-[var(--ds-color-primary-900)]">
              @preview-user
            </p>
            <p className="text-xs text-[var(--ds-color-neutral-500)]">방금 전</p>
          </div>
        </div>

        <p className="text-sm leading-7 text-[var(--ds-color-neutral-700)]">
          {trimmedCaption || "캡션을 입력하면 이 영역에서 바로 읽을 수 있습니다."}
        </p>
      </CardContent>
    </Card>
  );
}
