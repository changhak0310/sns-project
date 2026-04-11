import { authRepository } from "@/lib/social-repository/auth-repository";
import {
  getConfirmPasswordValidationMessage,
  getEmailValidationMessage,
  getPasswordValidationMessage,
  getUsernameValidationMessage,
} from "@/lib/validators/auth";
import type { SignupResult } from "@/types/auth";

function validateUsername(username: string) {
  return getUsernameValidationMessage(username) === "";
}

function validateEmail(email: string) {
  return getEmailValidationMessage(email) === "";
}

function validatePassword(password: string) {
  return getPasswordValidationMessage(password) === "";
}

function validateConfirmPassword(password: string, confirmPassword: string) {
  return getConfirmPasswordValidationMessage(password, confirmPassword) === "";
}

export const signupService = {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,

  async signup(
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<SignupResult> {
    if (!validateUsername(username)) {
      return {
        success: false,
        message: getUsernameValidationMessage(username),
      };
    }

    if (!validateEmail(email)) {
      return {
        success: false,
        message: getEmailValidationMessage(email),
      };
    }

    if (!validatePassword(password)) {
      return {
        success: false,
        message: getPasswordValidationMessage(password),
      };
    }

    if (!validateConfirmPassword(password, confirmPassword)) {
      return {
        success: false,
        message: getConfirmPasswordValidationMessage(password, confirmPassword),
      };
    }

    try {
      return await authRepository.signup(username, email, password);
    } catch {
      return {
        success: false,
        message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      };
    }
  },
};
