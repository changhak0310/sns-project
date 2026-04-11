import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type AuthSwitchLinkProps = {
  label: string;
  href: string;
  actionLabel: string;
  className?: string;
};

export function AuthSwitchLink({
  label,
  href,
  actionLabel,
  className,
}: AuthSwitchLinkProps) {
  return (
    <p className={cn("text-center text-sm leading-6 text-[var(--ds-color-neutral-600)]", className)}>
      {label}{" "}
      <Link
        href={href}
        className="font-semibold text-[var(--ds-color-accent-500)] transition-colors duration-200 hover:text-[var(--ds-color-accent-400)]"
      >
        {actionLabel}
      </Link>
    </p>
  );
}
