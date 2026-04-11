import Link from "next/link";
import { PencilLine } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { EditPostLinkButtonProps } from "@/types/post-management";

export function EditPostLinkButton({ href, disabled = false }: EditPostLinkButtonProps) {
  const className = cn(
    buttonVariants({ variant: "secondary", fullWidth: true }),
    "justify-center"
  );

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={cn(className, "pointer-events-none opacity-55")}
      >
        <PencilLine className="size-4" aria-hidden />
        <span>수정하기</span>
      </span>
    );
  }

  return (
    <Link href={href} className={className}>
      <PencilLine className="size-4" aria-hidden />
      <span>수정하기</span>
    </Link>
  );
}
