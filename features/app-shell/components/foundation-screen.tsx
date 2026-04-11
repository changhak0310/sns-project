import type { ReactNode } from "react";
import Link from "next/link";
import { Layers3, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { cn } from "@/lib/utils/cn";

type FoundationScreenProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: Array<{
    label: string;
    value: string;
  }>;
  children?: ReactNode;
};

export function FoundationScreen({
  eyebrow,
  title,
  description,
  highlights,
  children,
}: FoundationScreenProps) {
  return (
    <section className="mx-auto flex w-full max-w-[var(--ds-content-default)] flex-col gap-5 px-4 py-6 lg:px-6 lg:py-8">
      <Card
        padding="lg"
        radius="xl"
        bordered
        elevated
        className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.75))]"
      >
        <CardHeader className="gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="soft" tone="accent" size="sm">
              {eyebrow}
            </Badge>
            <Badge variant="outline" tone="neutral" size="sm">
              00-common-foundation
            </Badge>
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr] xl:items-end">
            <div className="space-y-4">
              <div className="space-y-3">
                <h1 className="max-w-3xl font-display text-4xl leading-[1.02] tracking-[-0.06em] text-[var(--ds-color-primary-900)] lg:text-6xl">
                  {title}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-[var(--ds-color-neutral-600)] lg:text-base">
                  {description}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/design-system"
                  className={buttonVariants({ variant: "secondary", size: "md" })}
                >
                  <Sparkles className="h-4 w-4" aria-hidden />
                  <span>디자인 시스템 보기</span>
                </Link>
                <Link
                  href="/u/preview-user"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "md" }),
                    "border border-transparent"
                  )}
                >
                  <Layers3 className="h-4 w-4" aria-hidden />
                  <span>프로필 프리뷰</span>
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-50)] px-4 py-4"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ds-color-neutral-500)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--ds-color-primary-900)]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <Divider />
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-[24px] border border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-0)] p-4">
              <p className="text-sm font-semibold text-[var(--ds-color-primary-900)]">
                Header + Content
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--ds-color-neutral-600)]">
                스티키 헤더와 읽기 좋은 본문 폭을 한 구조로 고정합니다.
              </p>
            </div>
            <div className="rounded-[24px] border border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-0)] p-4">
              <p className="text-sm font-semibold text-[var(--ds-color-primary-900)]">
                Mobile + Desktop
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--ds-color-neutral-600)]">
                모바일 시트형 내비와 데스크톱 사이드바가 같은 정보 구조를 공유합니다.
              </p>
            </div>
            <div className="rounded-[24px] border border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-0)] p-4">
              <p className="text-sm font-semibold text-[var(--ds-color-primary-900)]">
                Route-aware shell
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--ds-color-neutral-600)]">
                서브 라우트에서는 뒤로가기와 상세 레이아웃 톤이 함께 반응합니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {children}
    </section>
  );
}
