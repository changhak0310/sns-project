import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

type AuthHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  className?: string;
};

export function AuthHeader({
  eyebrow = "Orbit",
  title,
  description,
  className,
}: AuthHeaderProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Badge variant="soft" tone="accent" size="sm">
        {eyebrow}
      </Badge>
      <div className="space-y-2">
        <h1 className="font-display text-[28px] leading-[1.15] tracking-[-0.04em] text-[var(--ds-color-primary-900)] sm:text-[32px]">
          {title}
        </h1>
        <p className="text-sm leading-6 text-[var(--ds-color-neutral-600)]">
          {description}
        </p>
      </div>
    </div>
  );
}
