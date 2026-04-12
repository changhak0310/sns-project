import type { ReactNode } from "react";
import { ImageOff } from "lucide-react";

import { cn } from "@/lib/utils/cn";

const ratioClasses = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/10]",
  wide: "aspect-[16/9]",
} as const;

type ImageFallbackProps = {
  ratio?: keyof typeof ratioClasses;
  label?: string;
  icon?: ReactNode;
  className?: string;
};

export function ImageFallback({
  ratio = "square",
  label = "Media preview",
  icon,
  className,
}: ImageFallbackProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--ds-radius-lg)] border border-dashed border-[var(--ds-ui-border-subtle)] bg-[linear-gradient(135deg,var(--ds-ui-surface-muted),var(--ds-ui-surface))]",
        ratioClasses[ratio],
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,149,112,0.18),transparent_35%)]" />
      <div className="relative flex h-full flex-col items-center justify-center gap-2 text-center text-[var(--ds-ui-text-muted)]">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-[var(--ds-ui-surface-soft)] shadow-[var(--ds-ui-shadow-sm)]">
          {icon ?? <ImageOff className="size-4" aria-hidden />}
        </span>
        <p className="text-sm font-medium">{label}</p>
      </div>
    </div>
  );
}
