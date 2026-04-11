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
    <div className="relative min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px]">
        {desktopSidebar ? (
          <div className="hidden lg:sticky lg:top-0 lg:block lg:self-start">
            {desktopSidebar}
          </div>
        ) : null}

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          {header ? <div className="sticky top-0 z-20">{header}</div> : null}
          <main className="flex-1 pb-8">{children}</main>
        </div>
      </div>

      {mobileNav ? (
        <>
          <button
            type="button"
            onClick={onCloseMobileNav}
            className="fixed inset-0 z-30 bg-[var(--color-overlay)] lg:hidden"
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
