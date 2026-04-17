import type { ShellFrameProps } from "@/types/app-shell";

export function ShellFrame({
  children,
  header,
  mobileNav,
  desktopSidebar,
  modal,
  shellTheme = "dark",
  onCloseMobileNav,
}: ShellFrameProps) {
  return (
    <div
      data-shell-theme={shellTheme}
      className="relative min-h-screen bg-[var(--ds-shell-bg)] text-[var(--ds-shell-text)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_24%),radial-gradient(circle_at_78%_10%,rgba(239,109,71,0.18),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_32%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px]">
        {desktopSidebar ? (
          <div className="hidden lg:block lg:shrink-0">
            {desktopSidebar}
          </div>
        ) : null}

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          {header ? <div className="sticky top-0 z-20">{header}</div> : null}
          <main className="flex-1 pb-8 lg:pb-10">{children}</main>
        </div>
      </div>

      {mobileNav ? (
        <>
          <button
            type="button"
            onClick={onCloseMobileNav}
            className="fixed inset-0 z-30 bg-[var(--ds-shell-overlay)] backdrop-blur-sm lg:hidden"
            aria-label="Close navigation"
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
