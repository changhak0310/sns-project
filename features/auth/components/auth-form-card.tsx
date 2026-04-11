import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

type AuthFormCardProps = {
  children: ReactNode;
  className?: string;
};

export function AuthFormCard({ children, className }: AuthFormCardProps) {
  return (
    <Card
      padding="none"
      radius="xl"
      bordered
      elevated
      className={cn(
        "mx-auto w-full max-w-[420px] overflow-hidden border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-0)] p-6 shadow-[var(--ds-shadow-md)] sm:p-8",
        className
      )}
    >
      {children}
    </Card>
  );
}
