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

import { useSignup } from "../hooks/use-signup";
import { ConfirmPasswordInputField } from "./confirm-password-input-field";
import { EmailInputField } from "./email-input-field";
import { PasswordInputField } from "./password-input-field";
import { SignupErrorMessage } from "./signup-error-message";
import { SignupSubmitButton } from "./signup-submit-button";
import { UsernameInputField } from "./username-input-field";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    signupUser,
    setUsername,
    setEmail,
    setPassword,
    setConfirmPassword,
    signup,
  } = useSignup();
  const redirectTo = resolveRedirectTo(searchParams.get("redirect"));
  const loginHref = buildAuthRedirectHref("/login", redirectTo);

  useEffect(() => {
    if (!signupUser) {
      return;
    }

    router.replace(redirectTo);
  }, [redirectTo, router, signupUser]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void signup();
  }

  return (
    <AuthFormCard>
      <div className="flex flex-col gap-6">
        <AuthHeader
          title="Create an account and enter the protected routes."
          description="Signup also creates a mock session, so the profile page opens right after registration."
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
          label="Already have an account?"
          href={loginHref}
          actionLabel="Log in"
        />
      </div>
    </AuthFormCard>
  );
}
