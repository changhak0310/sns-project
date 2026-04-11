import { cn } from "@/lib/utils/cn";

const mediaRatioClasses = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/10]",
} as const;

type LoadingStateProps = {
  variant?: "card" | "list" | "inline";
  lines?: number;
  mediaRatio?: keyof typeof mediaRatioClasses;
  className?: string;
};

export function LoadingState({
  variant = "card",
  lines = 3,
  mediaRatio = "square",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--ds-radius-xl)] border border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-0)] p-5 shadow-[var(--ds-shadow-sm)]",
        className
      )}
      aria-hidden
    >
      <div className="animate-pulse space-y-4">
        {variant === "card" ? (
          <div
            className={cn(
              "rounded-[var(--ds-radius-lg)] bg-[var(--ds-color-neutral-100)]",
              mediaRatioClasses[mediaRatio]
            )}
          />
        ) : null}
        {variant === "list" ? (
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-[var(--ds-color-neutral-100)]" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 rounded-full bg-[var(--ds-color-neutral-100)]" />
              <div className="h-3 w-48 rounded-full bg-[var(--ds-color-neutral-100)]" />
            </div>
          </div>
        ) : null}
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className="h-3 rounded-full bg-[var(--ds-color-neutral-100)]"
              style={{ width: `${Math.max(55, 100 - index * 12)}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
