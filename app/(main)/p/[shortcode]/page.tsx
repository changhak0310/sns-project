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
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] p-6 shadow-[var(--shadow-sm)]">
          <div className="aspect-[4/5] rounded-[24px] bg-[radial-gradient(circle_at_top,_rgba(255,149,112,0.22),_transparent_48%),linear-gradient(135deg,_rgba(22,28,36,0.08),_rgba(22,28,36,0.02))]" />
        </div>
        <div className="space-y-4">
          <div className="rounded-[28px] border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] p-6 shadow-[var(--shadow-sm)]">
            <p className="text-sm font-semibold text-[var(--color-neutral-800)]">
              Detail Shell
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--color-neutral-600)]">
              상세 화면 본문, 반응 액션, 댓글 영역은 이후 기능 문서에서
              채워집니다.
            </p>
          </div>
          <div className="rounded-[28px] border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-6 shadow-[var(--shadow-sm)]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-neutral-500)]">
              Shortcode
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--color-neutral-900)]">
              {shortcode}
            </p>
          </div>
        </div>
      </div>
    </FoundationScreen>
  );
}
