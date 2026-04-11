import { SquarePen } from "lucide-react";

import { POST_MANAGEMENT_EDIT_PREVIEW_POST } from "@/data/seed/posts";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InlineMessage } from "@/components/ui/inline-message";
import type { Post } from "@/types/post-management";

import { PostComposerForm } from "./post-composer-form";

type EditPostPageProps = {
  initialPost?: Post | null;
};

export function EditPostPage({
  initialPost = POST_MANAGEMENT_EDIT_PREVIEW_POST,
}: EditPostPageProps) {
  return (
    <section className="mx-auto flex w-full max-w-[var(--ds-content-wide)] flex-col gap-5 px-4 py-6 lg:px-6 lg:py-8">
      <Card
        padding="lg"
        radius="xl"
        bordered
        elevated
        className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,255,255,0.82))]"
      >
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="soft" tone="accent">
              04-post-management
            </Badge>
            <Badge variant="outline" tone="neutral">
              edit
            </Badge>
          </div>
          <div className="space-y-3">
            <CardTitle className="font-display text-4xl tracking-[-0.05em] lg:text-5xl">
              기존 게시글을 초기값으로 채운 편집 화면입니다.
            </CardTitle>
            <CardDescription className="max-w-3xl text-sm leading-7 lg:text-base">
              `initialPost.imageUrls`를 원격 이미지 입력으로 변환하고, 캡션과 편집 대상 ID를 함께 유지하는
              `edit` 모드 래퍼 컴포넌트입니다.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <InlineMessage
        tone="warning"
        icon={<SquarePen className="size-4" />}
        message="전용 post edit route는 아직 route-design 문서에 정의되지 않았습니다. 이 컴포넌트는 후속 라우트 합의가 끝나면 그대로 연결할 수 있도록 feature 계층에 준비해 둔 상태입니다."
      />

      <PostComposerForm mode="edit" initialPost={initialPost} />
    </section>
  );
}
