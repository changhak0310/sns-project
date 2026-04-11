"use client";

import type { FormEvent } from "react";

import { AuthFormCard } from "@/features/auth/components/auth-form-card";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { AuthSwitchLink } from "@/features/auth/components/auth-switch-link";

import { useLogin } from "../hooks/use-login";
import { EmailInputField } from "./email-input-field";
import { LoginErrorMessage } from "./login-error-message";
import { LoginSubmitButton } from "./login-submit-button";
import { PasswordInputField } from "./password-input-field";

export function LoginForm() {
  const {
    email,
    password,
    emailError,
    passwordError,
    formError,
    isFormValid,
    isLoading,
    setEmail,
    setPassword,
    login,
  } = useLogin();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void login();
  }

  return (
    <AuthFormCard>
      <div className="flex flex-col gap-6">
        <AuthHeader
          title="빠르게 돌아와서 바로 읽고, 바로 반응하세요."
          description="가볍게 로그인하고 오늘의 피드와 저장한 아카이브를 이어서 확인합니다."
        />
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
          {formError ? <LoginErrorMessage message={formError} /> : null}
          <LoginSubmitButton
            isLoading={isLoading}
            disabled={!isFormValid || isLoading}
            onClick={() => {
              void login();
            }}
          />
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
