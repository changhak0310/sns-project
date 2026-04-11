"use client";

import { useDeferredValue, useEffect, useRef, useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InlineMessage } from "@/components/ui/inline-message";
import type {
  Post,
  PostComposerFormProps,
  PostImageInput,
} from "@/types/post-management";

import { CaptionInput } from "./caption-input";
import { CreatePostSubmitButton } from "./create-post-submit-button";
import { EditPostSubmitButton } from "./edit-post-submit-button";
import { PostFormErrorMessage } from "./post-form-error-message";
import { PostImagePicker } from "./post-image-picker";
import { PostPreview } from "./post-preview";

const MAX_POST_IMAGES = 10;
const IMAGES_REQUIRED_MESSAGE = "사진을 1장 이상 선택해 주세요.";
const IMAGES_MAX_MESSAGE = "사진은 최대 10장까지 업로드할 수 있습니다.";
const CAPTION_REQUIRED_MESSAGE = "게시글 내용을 입력해 주세요.";
const GENERIC_FORM_ERROR_MESSAGE = "게시글 처리 중 문제가 발생했습니다.";

function getImagesErrorMessage(images: PostImageInput[]) {
  if (!images.length) {
    return IMAGES_REQUIRED_MESSAGE;
  }

  if (images.length > MAX_POST_IMAGES) {
    return IMAGES_MAX_MESSAGE;
  }

  return "";
}

function getCaptionErrorMessage(caption: string) {
  return caption.trim() ? "" : CAPTION_REQUIRED_MESSAGE;
}

function toInitialImages(initialPost?: Post | null) {
  if (!initialPost) {
    return [];
  }

  return initialPost.imageUrls.map((previewUrl) => ({
    file: null,
    previewUrl,
    source: "remote" as const,
  }));
}

function createInitialComposerState(
  mode: PostComposerFormProps["mode"],
  initialPost?: Post | null
) {
  const images = mode === "edit" ? toInitialImages(initialPost) : [];
  const caption = mode === "edit" ? initialPost?.caption ?? "" : "";
  const imagesError = getImagesErrorMessage(images);
  const captionError = getCaptionErrorMessage(caption);

  return {
    images,
    caption,
    imagesError: "",
    captionError: "",
    formError: "",
    isFormValid: !imagesError && !captionError,
    isLoading: false,
    savedPost: null as Post | null,
  };
}

function createShortcode() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8);
}

function buildSavedPost(
  mode: PostComposerFormProps["mode"],
  initialPost: Post | null | undefined,
  images: PostImageInput[],
  caption: string
) {
  const now = new Date().toISOString();

  return {
    id: mode === "edit" ? initialPost?.id ?? Date.now() : Date.now(),
    shortcode:
      mode === "edit" ? initialPost?.shortcode ?? createShortcode() : createShortcode(),
    caption: caption.trim(),
    imageUrls: images.map((image) => image.previewUrl),
    likeCount: initialPost?.likeCount ?? 0,
    commentCount: initialPost?.commentCount ?? 0,
    createdAt: initialPost?.createdAt ?? now,
    updatedAt: now,
  } satisfies Post;
}

export function PostComposerForm({ mode, initialPost = null }: PostComposerFormProps) {
  const initialState = createInitialComposerState(mode, initialPost);
  const [images, setImagesState] = useState<PostImageInput[]>(initialState.images);
  const [caption, setCaptionState] = useState(initialState.caption);
  const [imagesError, setImagesError] = useState(initialState.imagesError);
  const [captionError, setCaptionError] = useState(initialState.captionError);
  const [formError, setFormError] = useState(initialState.formError);
  const [isFormValid, setIsFormValid] = useState(initialState.isFormValid);
  const [isLoading, setIsLoading] = useState(initialState.isLoading);
  const [savedPost, setSavedPost] = useState<Post | null>(initialState.savedPost);
  const localPreviewUrlsRef = useRef<string[]>([]);
  const deferredCaption = useDeferredValue(caption);
  const editingPostId = mode === "edit" ? initialPost?.id ?? null : null;

  useEffect(() => {
    const nextInitialState = createInitialComposerState(mode, initialPost);

    setImagesState(nextInitialState.images);
    setCaptionState(nextInitialState.caption);
    setImagesError(nextInitialState.imagesError);
    setCaptionError(nextInitialState.captionError);
    setFormError(nextInitialState.formError);
    setIsFormValid(nextInitialState.isFormValid);
    setIsLoading(nextInitialState.isLoading);
    setSavedPost(nextInitialState.savedPost);
  }, [initialPost, mode]);

  useEffect(() => {
    const nextLocalPreviewUrls = images
      .filter((image) => image.source === "local")
      .map((image) => image.previewUrl);

    for (const previewUrl of localPreviewUrlsRef.current) {
      if (!nextLocalPreviewUrls.includes(previewUrl)) {
        URL.revokeObjectURL(previewUrl);
      }
    }

    localPreviewUrlsRef.current = nextLocalPreviewUrls;
  }, [images]);

  useEffect(() => {
    return () => {
      for (const previewUrl of localPreviewUrlsRef.current) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  function syncFormValidity(nextImages: PostImageInput[], nextCaption: string) {
    setIsFormValid(
      !getImagesErrorMessage(nextImages) && !getCaptionErrorMessage(nextCaption)
    );
  }

  function resetPostComposerState() {
    const nextInitialState = createInitialComposerState(mode, initialPost);

    setImagesState(nextInitialState.images);
    setCaptionState(nextInitialState.caption);
    setImagesError(nextInitialState.imagesError);
    setCaptionError(nextInitialState.captionError);
    setFormError(nextInitialState.formError);
    setIsFormValid(nextInitialState.isFormValid);
    setIsLoading(nextInitialState.isLoading);
    setSavedPost(nextInitialState.savedPost);
  }

  function setImages(imagesValue: PostImageInput[]) {
    const nextImagesError = getImagesErrorMessage(imagesValue);

    setImagesState(imagesValue);
    setImagesError(nextImagesError);
    setFormError("");
    setSavedPost(null);
    syncFormValidity(imagesValue, caption);
  }

  function setCaption(value: string) {
    const nextCaptionError = getCaptionErrorMessage(value);

    setCaptionState(value);
    setCaptionError(nextCaptionError);
    setFormError("");
    setSavedPost(null);
    syncFormValidity(images, value);
  }

  async function submit(modeValue: PostComposerFormProps["mode"]) {
    const nextImagesError = getImagesErrorMessage(images);
    const nextCaptionError = getCaptionErrorMessage(caption);

    setImagesError(nextImagesError);
    setCaptionError(nextCaptionError);

    if (nextImagesError || nextCaptionError) {
      setIsFormValid(false);
      return;
    }

    if (modeValue === "edit" && editingPostId === null) {
      return;
    }

    setIsLoading(true);
    setFormError("");
    setSavedPost(null);

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 240);
      });

      setSavedPost(buildSavedPost(modeValue, initialPost, images, caption));
    } catch {
      setFormError(GENERIC_FORM_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  }

  async function createPost() {
    if (mode !== "create") {
      return;
    }

    await submit("create");
  }

  async function updatePost() {
    if (mode !== "edit") {
      return;
    }

    await submit("edit");
  }

  const resetLabel = mode === "edit" ? "원본으로 되돌리기" : "초기화";

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
      <div className="space-y-5 rounded-[var(--ds-radius-xl)] border border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-0)] p-5 shadow-[var(--ds-shadow-sm)]">
        <PostImagePicker
          images={images}
          maxImages={MAX_POST_IMAGES}
          fieldErrorMessage={imagesError}
          disabled={isLoading}
          onChange={setImages}
        />
        <CaptionInput
          value={caption}
          fieldErrorMessage={captionError}
          disabled={isLoading}
          onChange={setCaption}
        />
        {formError ? <PostFormErrorMessage message={formError} /> : null}
        {savedPost ? (
          <InlineMessage
            tone="success"
            className="w-full"
            icon={<CheckCircle2 className="size-4" />}
            message={
              mode === "create"
                ? `게시글이 저장되었습니다. shortcode: ${savedPost.shortcode}`
                : `게시글이 수정되었습니다. shortcode: ${savedPost.shortcode}`
            }
          />
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          {mode === "create" ? (
            <CreatePostSubmitButton
              isLoading={isLoading}
              disabled={!isFormValid || isLoading}
              onClick={() => {
                void createPost();
              }}
            />
          ) : (
            <EditPostSubmitButton
              isLoading={isLoading}
              disabled={!isFormValid || isLoading}
              onClick={() => {
                void updatePost();
              }}
            />
          )}
          <Button
            variant="secondary"
            disabled={isLoading}
            onClick={resetPostComposerState}
            leadingIcon={<RotateCcw className="size-4" />}
          >
            {resetLabel}
          </Button>
        </div>
      </div>

      <PostPreview images={images} caption={deferredCaption} />
    </div>
  );
}
