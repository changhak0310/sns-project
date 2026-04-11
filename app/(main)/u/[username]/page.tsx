import { FoundationScreen } from "@/features/app-shell/components/foundation-screen";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

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
        <div className="rounded-[28px] border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] p-6 shadow-[var(--shadow-sm)]">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-[var(--color-accent-100)] font-display text-2xl text-[var(--color-primary-900)]">
              {username.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--color-neutral-900)]">
                @{username}
              </p>
              <p className="text-sm text-[var(--color-neutral-500)]">
                profile shell placeholder
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-[28px] border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] p-6 shadow-[var(--shadow-sm)]">
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square rounded-[22px] bg-[linear-gradient(140deg,_rgba(255,149,112,0.16),_rgba(22,28,36,0.08))]"
              />
            ))}
          </div>
        </div>
      </div>
    </FoundationScreen>
  );
}
