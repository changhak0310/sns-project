import { cn } from "@/lib/utils/cn";

type DividerProps = {
  orientation?: "horizontal" | "vertical";
  inset?: boolean;
  tone?: "subtle" | "strong";
  className?: string;
};

export function Divider({
  orientation = "horizontal",
  inset = false,
  tone = "subtle",
  className,
}: DividerProps) {
  return (
    <div
      aria-hidden
      className={cn(
        orientation === "horizontal"
          ? "h-px w-full"
          : "h-full min-h-6 w-px self-stretch",
        inset && orientation === "horizontal" ? "mx-2 w-[calc(100%-1rem)]" : "",
        tone === "subtle"
          ? "bg-[var(--ds-border-subtle)]"
          : "bg-[var(--ds-border-strong)]",
        className
      )}
    />
  );
}
