import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { AuthLinkButtonProps } from "@/types/auth";

export function ProfileLinkButton({ href, label }: AuthLinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({
          variant: "outline",
          size: "sm",
        }),
        "min-h-10 border-[var(--ds-border-subtle)] bg-[rgba(255,255,255,0.72)]"
      )}
    >
      {label}
    </Link>
  );
}
