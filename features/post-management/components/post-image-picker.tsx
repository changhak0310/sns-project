"use client";

import { useId, useRef } from "react";
import { ImagePlus, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { IconButton } from "@/components/ui/icon-button";
import { ImageFallback } from "@/components/ui/image-fallback";
import type { PostImageInput, PostImagePickerProps } from "@/types/post-management";

function createLocalImageInput(file: File): PostImageInput {
  return {
    file,
    previewUrl: URL.createObjectURL(file),
    source: "local",
  };
}

export function PostImagePicker({
  images,
  maxImages,
  fieldErrorMessage,
  disabled = false,
  onChange,
}: PostImagePickerProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const isAtLimit = images.length >= maxImages;

  function handleOpenPicker() {
    if (disabled || isAtLimit) {
      return;
    }

    inputRef.current?.click();
  }

  function handleFilesSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    onChange([...images, ...files.map(createLocalImageInput)]);
    event.target.value = "";
  }

  function handleRemoveImage(index: number) {
    onChange(images.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <FormField
      label="사진"
      description={`최대 ${maxImages}장까지 선택할 수 있습니다.`}
      error={fieldErrorMessage}
      required
    >
      <input
        ref={inputRef}
        id={inputId}
        hidden
        type="file"
        accept="image/*"
        multiple
        disabled={disabled || isAtLimit}
        onChange={handleFilesSelected}
      />

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--ds-radius-lg)] border border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-50)] px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="soft" tone="accent">
              {images.length} / {maxImages}
            </Badge>
            <Badge variant="outline" tone="neutral">
              이미지 선택
            </Badge>
          </div>
          <Button
            variant="secondary"
            disabled={disabled || isAtLimit}
            onClick={handleOpenPicker}
            leadingIcon={<ImagePlus className="size-4" />}
          >
            사진 추가
          </Button>
        </div>

        {images.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {images.map((image, index) => (
              <div
                key={`${image.previewUrl}-${index}`}
                className="overflow-hidden rounded-[var(--ds-radius-lg)] border border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-0)]"
              >
                <div className="relative">
                  <div
                    role="img"
                    aria-label={`선택한 이미지 ${index + 1}`}
                    className="aspect-[4/5] bg-cover bg-center"
                    style={{ backgroundImage: `url("${image.previewUrl}")` }}
                  />
                  <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
                    <Badge
                      variant="soft"
                      tone={image.source === "local" ? "accent" : "neutral"}
                    >
                      {image.source === "local" ? "new" : "keep"}
                    </Badge>
                    <IconButton
                      size="sm"
                      tone="danger"
                      icon={<X className="size-4" />}
                      label={`이미지 ${index + 1} 삭제`}
                      disabled={disabled}
                      onClick={() => handleRemoveImage(index)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 rounded-[var(--ds-radius-xl)] border border-dashed border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-0)] p-4">
            <ImageFallback ratio="portrait" label="선택한 이미지가 여기에 미리 보입니다." />
            <Button
              variant="secondary"
              fullWidth
              disabled={disabled}
              onClick={handleOpenPicker}
              leadingIcon={<ImagePlus className="size-4" />}
            >
              첫 번째 사진 선택
            </Button>
          </div>
        )}
      </div>
    </FormField>
  );
}
