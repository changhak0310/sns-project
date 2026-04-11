import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type AuthShellProps = {
  children: ReactNode;
  mood?: "focus" | "focus-dark";
  className?: string;
};

export function AuthShell({
  children,
  mood = "focus",
  className,
}: AuthShellProps) {
  const isDark = mood === "focus-dark";

  return (
    <section
      data-mood={mood}
      className={cn(
        "relative flex min-h-[560px] items-center justify-center overflow-hidden rounded-[var(--ds-radius-xl)] border px-4 py-10 sm:px-6",
        isDark
          ? "border-[rgba(255,255,255,0.08)] bg-[var(--ds-mood-focus-dark-bg)] text-[var(--ds-mood-focus-dark-fg)]"
          : "border-[var(--ds-border-subtle)] bg-[var(--ds-mood-focus-bg)] text-[var(--ds-color-primary-900)]",
        className
      )}
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-0",
          isDark
            ? "bg-[radial-gradient(circle_at_top,rgba(255,149,112,0.18),transparent_28%)]"
            : "bg-[radial-gradient(circle_at_top,rgba(255,149,112,0.12),transparent_34%)]"
        )}
      />
      <div className="relative w-full max-w-[420px]">{children}</div>
    </section>
  );
}
