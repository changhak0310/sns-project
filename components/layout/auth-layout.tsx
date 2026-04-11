import { AuthShell } from "@/components/layout/auth-shell";
import type { LayoutChildrenProps } from "@/types/app-shell";

export function AuthLayout({ children }: LayoutChildrenProps) {
  return (
    <AuthShell>{children}</AuthShell>
  );
}
