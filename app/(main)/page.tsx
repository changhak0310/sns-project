import Link from "next/link";
import { ArrowRight, Smartphone, Waypoints } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { FoundationScreen } from "@/features/app-shell/components/foundation-screen";
import { cn } from "@/lib/utils/cn";

export default function HomePage() {
  return (
    <FoundationScreen
      eyebrow="Common Foundation"
      title="메인 셸 공통 기반을 먼저 고정했습니다."
      description="Root layout, auth/main route group, 헤더, 모바일 메뉴, 데스크톱 사이드바, 공통 토큰이 이제 같은 구조를 공유합니다."
      highlights={[
        { label: "Groups", value: "(auth) / (main)" },
        { label: "Hook", value: "useAppShell()" },
        { label: "Service", value: "shellService" },
      ]}
    >
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card bordered elevated className="bg-[var(--ds-color-neutral-0)]">
          <CardHeader className="gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Main Shell Preview</CardTitle>
                <CardDescription>
                  공통 기반 단계에서는 실제 기능 대신 구조, 위계, 레이아웃 리듬을 먼저 맞춥니다.
                </CardDescription>
              </div>
              <Badge variant="outline" tone="neutral">
                MVP-1
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-[24px] border border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-50)] p-5">
                <p className="text-sm font-semibold text-[var(--ds-color-primary-900)]">
                  App Shell State
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--ds-color-neutral-600)]">
                  모바일 메뉴 열림 여부와 데스크톱 사이드바 축소 여부를 공통 훅이 소유합니다.
                </p>
              </article>
              <article className="rounded-[24px] border border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-50)] p-5">
                <p className="text-sm font-semibold text-[var(--ds-color-primary-900)]">
                  Route-aware Layout
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--ds-color-neutral-600)]">
                  인증 경로와 메인 경로를 분리하고, 서브 라우트에서는 뒤로가기 버튼을 노출합니다.
                </p>
              </article>
            </div>
            <Divider />
            <div className="flex flex-wrap gap-3">
              <Link
                href="/design-system"
                className={cn(buttonVariants({ variant: "secondary" }))}
              >
                <Smartphone className="h-4 w-4" aria-hidden />
                <span>디자인 시스템</span>
              </Link>
              <Link href="/create" className={cn(buttonVariants({ variant: "ghost" }))}>
                <Waypoints className="h-4 w-4" aria-hidden />
                <span>작성 프리뷰</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card
          bordered
          elevated
          className="bg-[linear-gradient(180deg,var(--ds-mood-discover-bg),rgba(255,255,255,0.88))]"
        >
          <CardHeader>
            <CardTitle>Next Pieces</CardTitle>
            <CardDescription>
              공통 기반 다음에는 실제 feature 구현이 이 셸 위에 얹힙니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "회원가입과 로그인에서 세션 사용자명을 셸에 연결합니다.",
              "홈 피드, 작성, 프로필 기능이 이 셸 위에 얹힙니다.",
              "향후 셸 네비게이션 명세가 활성 탭 규칙을 더 세밀하게 확장합니다.",
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-[20px] border border-[var(--ds-border-subtle)] bg-[rgba(255,255,255,0.78)] px-4 py-4"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--ds-color-neutral-0)] text-sm font-semibold text-[var(--ds-color-accent-500)]">
                  0{index + 1}
                </span>
                <p className="text-sm leading-6 text-[var(--ds-color-neutral-700)]">
                  {item}
                </p>
              </div>
            ))}
            <Link
              href="/u/preview-user"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ds-color-accent-500)]"
            >
              프로필 라우트 보기
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </CardContent>
        </Card>
      </div>
    </FoundationScreen>
  );
}
