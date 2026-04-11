import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { AuthLinkButtonProps } from "@/types/auth";

export function LoginLinkButton({ href, label }: AuthLinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({
          variant: "secondary",
          size: "sm",
        }),
        "min-h-10"
      )}
    >
      {label}
    </Link>
  );
}
