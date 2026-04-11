import { Button } from "@/components/ui/button";
import type { LogoutButtonProps } from "@/types/auth";

export function LogoutButton({
  isLoading,
  disabled,
  onClick,
}: LogoutButtonProps) {
  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      loading={isLoading}
      disabled={disabled}
      onClick={onClick}
      className="min-h-10 border border-transparent px-3 text-[var(--ds-color-error-500)] hover:bg-[var(--ds-color-error-100)] hover:text-[var(--ds-color-error-600)]"
    >
      로그아웃
    </Button>
  );
}
