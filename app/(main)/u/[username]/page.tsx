import { redirect } from "next/navigation";
import { Grid3X3 } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FoundationScreen } from "@/features/app-shell/components/foundation-screen";
import { getSessionUser } from "@/lib/session/auth-session";
import { buildLoginRedirect } from "@/lib/session/redirect";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect(buildLoginRedirect(`/u/${username}`));
  }

  return (
    <FoundationScreen
      eyebrow="Profile"
      title="프로필 라우트 골격이 준비되었습니다."
      description="세션이 연결되기 전까지는 공통 기반이 동적 프로필 세그먼트를 안전하게 감싸는지만 확인합니다."
      highlights={[
        { label: "Viewer", value: username },
        { label: "Route", value: `/u/${username}` },
        { label: "Stage", value: "profile-follow" },
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.25fr]">
        <Card bordered elevated className="bg-[var(--ds-ui-surface)]">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar
                alt={username}
                fallback={username.slice(0, 2).toUpperCase()}
                size="xl"
                ring
                status="online"
              />
              <div>
                <CardTitle>@{username}</CardTitle>
                <CardDescription>profile shell placeholder</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="soft" tone="accent">
              posts
            </Badge>
            <Badge variant="outline" tone="neutral">
              saved
            </Badge>
          </CardContent>
        </Card>
        <Card bordered elevated className="bg-[var(--ds-ui-surface)]">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Profile Grid</CardTitle>
              <Grid3X3 className="h-4 w-4 text-[var(--ds-color-neutral-500)]" aria-hidden />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-[22px] bg-[linear-gradient(140deg,rgba(239,109,71,0.14),var(--ds-ui-surface-muted))]"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </FoundationScreen>
  );
}
