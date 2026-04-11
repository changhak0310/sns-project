import { LockKeyhole, Mail, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { InlineMessage } from "@/components/ui/inline-message";
import { Input } from "@/components/ui/input";
import { AuthFormCard } from "@/features/auth/components/auth-form-card";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { AuthSwitchLink } from "@/features/auth/components/auth-switch-link";

type SignupFormProps = {
  displayName?: string;
  email?: string;
  nameError?: string;
  emailError?: string;
  passwordError?: string;
  formError?: string;
  pending?: boolean;
  className?: string;
};

export function SignupForm({
  displayName = "Orbit Editor",
  email = "orbit@example.com",
  nameError,
  emailError,
  passwordError,
  formError,
  pending = false,
  className,
}: SignupFormProps) {
  return (
    <AuthFormCard className={className}>
      <div className="flex flex-col gap-6">
        <AuthHeader
          title="짧은 카피와 선명한 액션으로 바로 시작합니다."
          description="display name 하나만 정하면 프로필, 저장 탭, 추천 피드까지 같은 톤으로 이어집니다."
        />
        <form className="flex flex-col gap-5">
          <FormField label="이름" htmlFor="signup-name" required>
            <Input
              id="signup-name"
              type="text"
              defaultValue={displayName}
              placeholder="표시 이름"
              leadingIcon={<UserRound className="size-4" />}
              error={nameError}
            />
          </FormField>
          <FormField label="이메일" htmlFor="signup-email" required>
            <Input
              id="signup-email"
              type="email"
              defaultValue={email}
              placeholder="name@company.com"
              leadingIcon={<Mail className="size-4" />}
              error={emailError}
            />
          </FormField>
          <FormField label="비밀번호" htmlFor="signup-password" required>
            <Input
              id="signup-password"
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
            계정 만들기
          </Button>
        </form>
        <AuthSwitchLink
          label="이미 계정이 있나요?"
          href="/login"
          actionLabel="로그인"
        />
      </div>
    </AuthFormCard>
  );
}
