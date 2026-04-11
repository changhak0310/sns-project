import type { ShellFrameProps } from "@/types/app-shell";

export function ShellFrame({
  children,
  header,
  mobileNav,
  desktopSidebar,
  modal,
  onCloseMobileNav,
}: ShellFrameProps) {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,149,112,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.34),transparent_28%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] gap-0 lg:px-4 lg:py-4">
        {desktopSidebar ? (
          <div className="hidden lg:sticky lg:top-0 lg:block lg:self-start">
            {desktopSidebar}
          </div>
        ) : null}

        <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:overflow-hidden lg:rounded-[36px] lg:border lg:border-[var(--ds-border-subtle)] lg:bg-[rgba(255,255,255,0.68)] lg:shadow-[var(--ds-shadow-md)] lg:backdrop-blur-xl">
          {header ? <div className="sticky top-0 z-20">{header}</div> : null}
          <main className="flex-1 pb-8 lg:pb-10">{children}</main>
        </div>
      </div>

      {mobileNav ? (
        <>
          <button
            type="button"
            onClick={onCloseMobileNav}
            className="fixed inset-0 z-30 bg-[var(--color-overlay)] backdrop-blur-sm lg:hidden"
            aria-label="모바일 메뉴 닫기"
          />
          <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
            {mobileNav}
          </div>
        </>
      ) : null}

      {modal}
    </div>
  );
}
