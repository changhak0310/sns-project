import { authRepository } from "@/lib/social-repository/auth-repository";
import {
  getEmailValidationMessage,
  getPasswordValidationMessage,
} from "@/lib/validators/auth";
import type { LoginResult } from "@/types/auth";

function validateEmail(email: string) {
  return getEmailValidationMessage(email) === "";
}

function validatePassword(password: string) {
  return getPasswordValidationMessage(password) === "";
}

export const loginService = {
  validateEmail,
  validatePassword,

  async login(email: string, password: string): Promise<LoginResult> {
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

    try {
      return await authRepository.login(email, password);
    } catch {
      return {
        success: false,
        message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      };
    }
  },
};
