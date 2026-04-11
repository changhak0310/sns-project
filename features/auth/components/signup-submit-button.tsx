import { Button } from "@/components/ui/button";
import type { SignupSubmitButtonProps } from "@/types/auth";

export function SignupSubmitButton({
  isLoading,
  disabled,
  onClick,
}: SignupSubmitButtonProps) {
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
      계정 만들기
    </Button>
  );
}
