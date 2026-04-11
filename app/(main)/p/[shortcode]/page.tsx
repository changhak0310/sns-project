import { MessageCircleMore, Heart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageFallback } from "@/components/ui/image-fallback";
import { FoundationScreen } from "@/features/app-shell/components/foundation-screen";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ shortcode: string }>;
}) {
  const { shortcode } = await params;

  return (
    <FoundationScreen
      eyebrow="Post Detail"
      title="상세 라우트에서 뒤로가기 규칙을 검증할 수 있습니다."
      description="직접 진입한 permalink와 메인 셸 내부 상세 진입이 같은 레이아웃 계약을 공유하도록 골격만 먼저 구성했습니다."
      highlights={[
        { label: "Permalink", value: `/p/${shortcode}` },
        { label: "Layout", value: "detail" },
        { label: "Fallback", value: "home" },
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card bordered elevated className="bg-[var(--ds-color-neutral-0)]">
          <CardContent className="space-y-4">
            <ImageFallback ratio="portrait" label="Permalink media" />
            <div className="flex items-center gap-2">
              <Badge variant="soft" tone="accent">
                detail
              </Badge>
              <Badge variant="outline" tone="neutral">
                {`/p/${shortcode}`}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card bordered elevated className="bg-[var(--ds-color-neutral-0)]">
            <CardHeader>
              <CardTitle>Detail Shell</CardTitle>
              <CardDescription>
                상세 화면 본문, 반응 액션, 댓글 영역은 이후 기능 문서에서 채워집니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Badge variant="soft" tone="accent" icon={<Heart className="h-3.5 w-3.5" />}>
                Like
              </Badge>
              <Badge
                variant="soft"
                tone="neutral"
                icon={<MessageCircleMore className="h-3.5 w-3.5" />}
              >
                Comment
              </Badge>
            </CardContent>
          </Card>
          <Card bordered elevated className="bg-[var(--ds-color-neutral-50)]">
            <CardHeader>
              <CardTitle>Shortcode</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-lg font-semibold text-[var(--ds-color-primary-900)]">
                {shortcode}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </FoundationScreen>
  );
}
