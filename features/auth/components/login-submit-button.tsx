import { Button } from "@/components/ui/button";
import type { LoginSubmitButtonProps } from "@/types/auth";

export function LoginSubmitButton({
  isLoading,
  disabled,
  onClick,
}: LoginSubmitButtonProps) {
  return (
    <Button
      type="submit"
      fullWidth
      loading={isLoading}
      disabled={disabled}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
    >
      로그인
    </Button>
  );
}
