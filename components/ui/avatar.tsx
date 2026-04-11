import { UserRound } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--ds-color-neutral-100)] text-[var(--ds-color-primary-900)]",
  {
    variants: {
      size: {
        xs: "size-8 text-xs",
        sm: "size-10 text-sm",
        md: "size-12 text-base",
        lg: "size-14 text-lg",
        xl: "size-20 text-xl",
        "2xl": "size-24 text-2xl",
      },
      ring: {
        true: "ring-2 ring-[var(--ds-color-neutral-0)] shadow-[var(--ds-shadow-sm)]",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      ring: false,
    },
  }
);

const statusTone = {
  online: "bg-[var(--ds-color-success-500)]",
  away: "bg-[var(--ds-color-warning-500)]",
  busy: "bg-[var(--ds-color-error-500)]",
} as const;

type AvatarProps = VariantProps<typeof avatarVariants> & {
  src?: string;
  alt: string;
  fallback?: string;
  status?: keyof typeof statusTone;
  className?: string;
};

function getInitials(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({
  src,
  alt,
  size,
  ring,
  fallback,
  status,
  className,
}: AvatarProps) {
  const label = fallback ?? getInitials(alt);

  return (
    <span className={cn(avatarVariants({ size, ring }), className)}>
      {src ? (
        <span
          role="img"
          aria-label={alt}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${src}")` }}
        />
      ) : label ? (
        <span className="font-semibold tracking-[-0.02em]">{label}</span>
      ) : (
        <UserRound className="size-1/2" aria-hidden />
      )}
      {status ? (
        <span
          aria-hidden
          className={cn(
            "absolute bottom-0.5 right-0.5 size-3 rounded-full border-2 border-[var(--ds-color-neutral-0)]",
            statusTone[status]
          )}
        />
      ) : null}
    </span>
  );
}
