"use client";

import { useRef, useState } from "react";

import { useSession } from "@/lib/session/session-provider";
import {
  getEmailValidationMessage,
  getPasswordValidationMessage,
} from "@/lib/validators/auth";
import type {
  LoginState,
  SessionUser,
  UseLoginReturn,
  User,
} from "@/types/auth";

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

function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    avatarUrl: user.avatarUrl,
  };
}

export function useLogin(): UseLoginReturn {
  const [state, setState] = useState<LoginState>(initialLoginState);
  const stateRef = useRef(state);
  const submitLockRef = useRef(false);
  const { setSessionUser } = useSession();

  stateRef.current = state;

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
    const snapshot = stateRef.current;

    if (!snapshot.isFormValid || submitLockRef.current) {
      return;
    }

    submitLockRef.current = true;

    setState((current) => ({
      ...current,
      isLoading: true,
      formError: "",
      loginUser: null,
    }));

    try {
      const result = await loginService.login(
        snapshot.email,
        snapshot.password
      );

      if (result.success) {
        setSessionUser(toSessionUser(result.data));
      }

      setState((current) => ({
        ...current,
        isLoading: false,
        formError: result.success ? "" : result.message,
        loginUser: result.success ? result.data : null,
      }));
    } finally {
      submitLockRef.current = false;
    }
  }

  function resetLoginState() {
    submitLockRef.current = false;
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
