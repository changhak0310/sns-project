"use client";

import type { FormEvent } from "react";

import { AuthFormCard } from "@/features/auth/components/auth-form-card";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { AuthSwitchLink } from "@/features/auth/components/auth-switch-link";

import { useSignup } from "../hooks/use-signup";
import { ConfirmPasswordInputField } from "./confirm-password-input-field";
import { EmailInputField } from "./email-input-field";
import { PasswordInputField } from "./password-input-field";
import { SignupErrorMessage } from "./signup-error-message";
import { SignupSubmitButton } from "./signup-submit-button";
import { UsernameInputField } from "./username-input-field";

export function SignupForm() {
  const {
    username,
    email,
    password,
    confirmPassword,
    usernameError,
    emailError,
    passwordError,
    confirmPasswordError,
    formError,
    isFormValid,
    isLoading,
    setUsername,
    setEmail,
    setPassword,
    setConfirmPassword,
    signup,
  } = useSignup();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void signup();
  }

  return (
    <AuthFormCard>
      <div className="flex flex-col gap-6">
        <AuthHeader
          title="짧은 정보만 정확히 입력하고 바로 계정을 만드세요."
          description="유저 이름, 이메일, 비밀번호를 한 번에 정리하고 같은 흐름 안에서 회원가입을 완료합니다."
        />
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <UsernameInputField
            value={username}
            fieldErrorMessage={usernameError}
            disabled={isLoading}
            onChange={setUsername}
          />
          <EmailInputField
            value={email}
            fieldErrorMessage={emailError}
            disabled={isLoading}
            onChange={setEmail}
          />
          <PasswordInputField
            value={password}
            fieldErrorMessage={passwordError}
            disabled={isLoading}
            onChange={setPassword}
          />
          <ConfirmPasswordInputField
            value={confirmPassword}
            fieldErrorMessage={confirmPasswordError}
            disabled={isLoading}
            onChange={setConfirmPassword}
          />
          {formError ? <SignupErrorMessage message={formError} /> : null}
          <SignupSubmitButton
            isLoading={isLoading}
            disabled={!isFormValid || isLoading}
            onClick={() => {
              void signup();
            }}
          />
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
