"use client";

import type { FormEvent } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AuthFormCard } from "@/features/auth/components/auth-form-card";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { AuthSwitchLink } from "@/features/auth/components/auth-switch-link";
import {
  buildAuthRedirectHref,
  resolveRedirectTo,
} from "@/lib/session/redirect";

import { useLogin } from "../hooks/use-login";
import { EmailInputField } from "./email-input-field";
import { LoginErrorMessage } from "./login-error-message";
import { LoginSubmitButton } from "./login-submit-button";
import { PasswordInputField } from "./password-input-field";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    email,
    password,
    emailError,
    passwordError,
    formError,
    isFormValid,
    isLoading,
    loginUser,
    setEmail,
    setPassword,
    login,
  } = useLogin();
  const redirectTo = resolveRedirectTo(searchParams.get("redirect"));
  const signupHref = buildAuthRedirectHref("/signup", redirectTo);

  useEffect(() => {
    if (!loginUser) {
      return;
    }

    router.replace(redirectTo);
  }, [loginUser, redirectTo, router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void login();
  }

  return (
    <AuthFormCard>
      <div className="flex flex-col gap-6">
        <AuthHeader
          title="Log in and continue where you left off."
          description="Mock auth creates a session cookie so protected routes can send you back safely."
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
          label="Need an account?"
          href={signupHref}
          actionLabel="Create one"
        />
      </div>
    </AuthFormCard>
  );
}
