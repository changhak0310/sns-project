import { LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { InlineMessage } from "@/components/ui/inline-message";
import { Input } from "@/components/ui/input";
import { AuthFormCard } from "@/features/auth/components/auth-form-card";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { AuthSwitchLink } from "@/features/auth/components/auth-switch-link";

type LoginFormProps = {
  email?: string;
  emailError?: string;
  passwordError?: string;
  formError?: string;
  pending?: boolean;
  className?: string;
};

export function LoginForm({
  email = "orbit@example.com",
  emailError,
  passwordError,
  formError,
  pending = false,
  className,
}: LoginFormProps) {
  return (
    <AuthFormCard className={className}>
      <div className="flex flex-col gap-6">
        <AuthHeader
          title="빠르게 돌아와서 바로 읽고, 바로 반응하세요."
          description="가볍게 로그인하고 오늘의 피드와 저장한 아카이브를 이어서 확인합니다."
        />
        <form className="flex flex-col gap-5">
          <FormField label="이메일" htmlFor="login-email" required>
            <Input
              id="login-email"
              type="email"
              defaultValue={email}
              placeholder="name@company.com"
              leadingIcon={<Mail className="size-4" />}
              error={emailError}
            />
          </FormField>
          <FormField label="비밀번호" htmlFor="login-password" required>
            <Input
              id="login-password"
              type="password"
              defaultValue="password"
              placeholder="비밀번호"
              leadingIcon={<LockKeyhole className="size-4" />}
              error={passwordError}
            />
          </FormField>
          {formError ? (
            <InlineMessage tone="error" message={formError} />
          ) : null}
          <Button fullWidth loading={pending}>
            로그인
          </Button>
        </form>
        <AuthSwitchLink
          label="처음이신가요?"
          href="/signup"
          actionLabel="계정 만들기"
        />
      </div>
    </AuthFormCard>
  );
}
