"use client";

import { useRef, useState } from "react";

import { useSession } from "@/lib/session/session-provider";
import {
  getConfirmPasswordValidationMessage,
  getEmailValidationMessage,
  getPasswordValidationMessage,
  getUsernameValidationMessage,
} from "@/lib/validators/auth";
import type {
  SessionUser,
  SignupState,
  UseSignupReturn,
  User,
} from "@/types/auth";

import { signupService } from "../services/signup-service";

const initialSignupState: SignupState = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  usernameError: "",
  emailError: "",
  passwordError: "",
  confirmPasswordError: "",
  formError: "",
  isFormValid: false,
  isLoading: false,
  signupUser: null,
};

function getValidationState(values: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const usernameValid = signupService.validateUsername(values.username);
  const emailValid = signupService.validateEmail(values.email);
  const passwordValid = signupService.validatePassword(values.password);
  const confirmPasswordValid = signupService.validateConfirmPassword(
    values.password,
    values.confirmPassword
  );

  return {
    usernameError: usernameValid
      ? ""
      : getUsernameValidationMessage(values.username),
    emailError: emailValid ? "" : getEmailValidationMessage(values.email),
    passwordError: passwordValid
      ? ""
      : getPasswordValidationMessage(values.password),
    confirmPasswordError: confirmPasswordValid
      ? ""
      : getConfirmPasswordValidationMessage(
          values.password,
          values.confirmPassword
        ),
    isFormValid:
      usernameValid && emailValid && passwordValid && confirmPasswordValid,
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

export function useSignup(): UseSignupReturn {
  const [state, setState] = useState<SignupState>(initialSignupState);
  const stateRef = useRef(state);
  const submitLockRef = useRef(false);
  const { setSessionUser } = useSession();

  stateRef.current = state;

  function updateFormState(
    nextValues: Partial<
      Pick<SignupState, "username" | "email" | "password" | "confirmPassword">
    >
  ) {
    setState((current) => {
      const mergedValues = {
        username: nextValues.username ?? current.username,
        email: nextValues.email ?? current.email,
        password: nextValues.password ?? current.password,
        confirmPassword: nextValues.confirmPassword ?? current.confirmPassword,
      };
      const validationState = getValidationState(mergedValues);

      return {
        ...current,
        ...mergedValues,
        ...validationState,
        formError: "",
        signupUser: null,
      };
    });
  }

  function setUsername(value: string) {
    updateFormState({ username: value });
  }

  function setEmail(value: string) {
    updateFormState({ email: value });
  }

  function setPassword(value: string) {
    updateFormState({ password: value });
  }

  function setConfirmPassword(value: string) {
    updateFormState({ confirmPassword: value });
  }

  async function signup() {
    const snapshot = stateRef.current;

    if (!snapshot.isFormValid || submitLockRef.current) {
      return;
    }

    submitLockRef.current = true;

    setState((current) => ({
      ...current,
      isLoading: true,
      formError: "",
      signupUser: null,
    }));

    try {
      const result = await signupService.signup(
        snapshot.username,
        snapshot.email,
        snapshot.password,
        snapshot.confirmPassword
      );

      if (result.success) {
        setSessionUser(toSessionUser(result.data));
      }

      setState((current) => ({
        ...current,
        isLoading: false,
        formError: result.success ? "" : result.message,
        signupUser: result.success ? result.data : null,
      }));
    } finally {
      submitLockRef.current = false;
    }
  }

  function resetSignupState() {
    submitLockRef.current = false;
    setState(initialSignupState);
  }

  return {
    ...state,
    setUsername,
    setEmail,
    setPassword,
    setConfirmPassword,
    signup,
    resetSignupState,
  };
}
