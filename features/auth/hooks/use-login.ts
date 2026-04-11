"use client";

import { useState } from "react";

import {
  getEmailValidationMessage,
  getPasswordValidationMessage,
} from "@/lib/validators/auth";
import type { LoginState, UseLoginReturn } from "@/types/auth";

import { loginService } from "../services/login-service";

const initialLoginState: LoginState = {
  email: "",
  password: "",
  emailError: "",
  passwordError: "",
  formError: "",
  isFormValid: false,
  isLoading: false,
  loginUser: null,
};

function getValidationState(values: { email: string; password: string }) {
  const emailValid = loginService.validateEmail(values.email);
  const passwordValid = loginService.validatePassword(values.password);

  return {
    emailError: emailValid ? "" : getEmailValidationMessage(values.email),
    passwordError: passwordValid
      ? ""
      : getPasswordValidationMessage(values.password),
    isFormValid: emailValid && passwordValid,
  };
}

export function useLogin(): UseLoginReturn {
  const [state, setState] = useState<LoginState>(initialLoginState);

  function updateFormState(
    nextValues: Partial<Pick<LoginState, "email" | "password">>
  ) {
    setState((current) => {
      const mergedValues = {
        email: nextValues.email ?? current.email,
        password: nextValues.password ?? current.password,
      };
      const validationState = getValidationState(mergedValues);

      return {
        ...current,
        ...mergedValues,
        ...validationState,
        formError: "",
        loginUser: null,
      };
    });
  }

  function setEmail(value: string) {
    updateFormState({ email: value });
  }

  function setPassword(value: string) {
    updateFormState({ password: value });
  }

  async function login() {
    if (!state.isFormValid || state.isLoading) {
      return;
    }

    setState((current) => ({
      ...current,
      isLoading: true,
      formError: "",
      loginUser: null,
    }));

    const result = await loginService.login(state.email, state.password);

    setState((current) => ({
      ...current,
      isLoading: false,
      formError: result.success ? "" : result.message,
      loginUser: result.success ? result.data : null,
    }));
  }

  function resetLoginState() {
    setState(initialLoginState);
  }

  return {
    ...state,
    setEmail,
    setPassword,
    login,
    resetLoginState,
  };
}
