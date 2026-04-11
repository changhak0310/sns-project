import { FoundationScreen } from "@/features/app-shell/components/foundation-screen";

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
      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
        <section className="rounded-[32px] border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] p-6 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--color-neutral-900)]">
                Main Shell Preview
              </p>
              <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
                공통 기반 단계에서 실제 기능 대신 구조와 톤만 확인합니다.
              </p>
            </div>
            <div className="rounded-full border border-[var(--color-neutral-200)] px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-neutral-500)]">
              MVP-1
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <article className="rounded-[24px] border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-5">
              <p className="text-sm font-semibold text-[var(--color-neutral-800)]">
                App Shell State
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--color-neutral-600)]">
                모바일 메뉴 열림 여부와 데스크톱 사이드바 축소 여부를 공통
                훅이 소유합니다.
              </p>
            </article>
            <article className="rounded-[24px] border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-5">
              <p className="text-sm font-semibold text-[var(--color-neutral-800)]">
                Route-aware Layout
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--color-neutral-600)]">
                인증 경로와 메인 경로를 분리하고, 서브 라우트에서는 뒤로가기를
                노출합니다.
              </p>
            </article>
          </div>
        </section>

        <aside className="rounded-[32px] border border-[var(--color-neutral-200)] bg-[var(--color-highlight-soft)] p-6 shadow-[var(--shadow-sm)]">
          <p className="text-sm font-semibold text-[var(--color-neutral-900)]">
            Next Pieces
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-neutral-700)]">
            <li>회원가입과 로그인에서 세션 사용자명을 셸에 연결합니다.</li>
            <li>홈 피드, 작성, 프로필 기능이 이 셸 위에 얹힙니다.</li>
            <li>향후 셸 네비게이션 명세가 활성 탭 규칙을 더 세밀하게 확장합니다.</li>
          </ul>
        </aside>
      </div>
    </FoundationScreen>
  );
}
