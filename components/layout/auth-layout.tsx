import type { LayoutChildrenProps } from "@/types/app-shell";

export function AuthLayout({ children }: LayoutChildrenProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,149,112,0.18),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(22,28,36,0.08),_transparent_42%)]" />
      <div className="relative w-full max-w-[420px] rounded-[32px] border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] p-6 shadow-[var(--shadow-md)] sm:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-display text-3xl leading-none text-[var(--color-neutral-950)]">
              Orbit
            </p>
            <p className="mt-2 text-sm text-[var(--color-neutral-500)]">
              Clean social foundation
            </p>
          </div>
          <div className="rounded-full border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] px-3 py-1 font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-neutral-500)]">
            auth
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
