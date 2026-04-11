import { Layers3, SquarePen } from "lucide-react";

import { POST_MANAGEMENT_PREVIEW_POST } from "@/data/seed/posts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InlineMessage } from "@/components/ui/inline-message";

import { PostCard } from "./post-card";
import { PostComposerForm } from "./post-composer-form";

export function CreatePostPage() {
  return (
    <section className="mx-auto flex w-full max-w-[var(--ds-content-wide)] flex-col gap-5 px-4 py-6 lg:px-6 lg:py-8">
      <Card
        padding="lg"
        radius="xl"
        bordered
        elevated
        className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,255,255,0.82))]"
      >
        <CardHeader className="gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="soft" tone="accent">
              04-post-management
            </Badge>
            <Badge variant="outline" tone="neutral">
              create
            </Badge>
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr] xl:items-end">
            <div className="space-y-3">
              <h1 className="max-w-3xl font-display text-4xl leading-[1.02] tracking-[-0.06em] text-[var(--ds-color-primary-900)] lg:text-6xl">
                이미지 선택, 캡션 작성, 액션 버튼까지 한 화면에서 닫았습니다.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[var(--ds-color-neutral-600)] lg:text-base">
                `PostComposerForm`이 이미지 선택기, 캡션 입력, 미리보기, 제출 상태를 한 번에 묶습니다.
                오른쪽 카드에서는 `PostCard`와 `PostActionMenu`를 같이 확인할 수 있습니다.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[24px] border border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-50)] px-4 py-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ds-color-neutral-500)]">
                  Route
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--ds-color-primary-900)]">
                  /create
                </p>
              </div>
              <div className="rounded-[24px] border border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-50)] px-4 py-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ds-color-neutral-500)]">
                  Scope
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--ds-color-primary-900)]">
                  create + edit wrapper + card menu
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <PostComposerForm mode="create" />

        <div className="space-y-4">
          <Card bordered elevated className="bg-[var(--ds-color-neutral-0)]">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Action Menu Preview</CardTitle>
                  <CardDescription>
                    게시글 카드 상단의 `...` 메뉴에서 수정 링크와 삭제 버튼 조합을 확인할 수 있습니다.
                  </CardDescription>
                </div>
                <Layers3 className="size-5 text-[var(--ds-color-neutral-500)]" aria-hidden />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <PostCard
                post={POST_MANAGEMENT_PREVIEW_POST}
                editHref="#edit-post-preview"
                canEdit
                canDelete
              />
            </CardContent>
          </Card>

          <InlineMessage
            tone="warning"
            icon={<SquarePen className="size-4" />}
            message="EditPostPage 컴포넌트도 같은 feature 디렉터리에 준비했습니다. 다만 route-design 문서에 전용 post edit 경로가 아직 정의되지 않아 이번 단계에서는 라우트 연결 대신 컴포넌트만 추가했습니다."
          />
        </div>
      </div>
    </section>
  );
}
