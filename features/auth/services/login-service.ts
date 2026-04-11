import { authRepository } from "@/lib/social-repository/auth-repository";
import {
  getEmailValidationMessage,
  getPasswordValidationMessage,
} from "@/lib/validators/auth";
import type { LoginResult } from "@/types/auth";

const NETWORK_ERROR_MESSAGE =
  "\uB124\uD2B8\uC6CC\uD06C \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.";

function validateEmail(email: string) {
  return getEmailValidationMessage(email) === "";
}

function validatePassword(password: string) {
  return getPasswordValidationMessage(password) === "";
}

function getLoginValidationMessage(email: string, password: string) {
  const emailMessage = getEmailValidationMessage(email);

  if (emailMessage) {
    return emailMessage;
  }

  return getPasswordValidationMessage(password);
}

export const loginService = {
  validateEmail,
  validatePassword,

  async login(email: string, password: string): Promise<LoginResult> {
    const validationMessage = getLoginValidationMessage(email, password);

    if (validationMessage) {
      return {
        success: false,
        message: validationMessage,
      };
    }

    try {
      return await authRepository.login(email, password);
    } catch {
      return {
        success: false,
        message: NETWORK_ERROR_MESSAGE,
      };
    }
  },
};
