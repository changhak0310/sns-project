import { authRepository } from "@/lib/social-repository/auth-repository";
import {
  getConfirmPasswordValidationMessage,
  getEmailValidationMessage,
  getPasswordValidationMessage,
  getUsernameValidationMessage,
} from "@/lib/validators/auth";
import type { SignupResult } from "@/types/auth";

const NETWORK_ERROR_MESSAGE =
  "\uB124\uD2B8\uC6CC\uD06C \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.";

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

function getSignupValidationMessage(
  username: string,
  email: string,
  password: string,
  confirmPassword: string
) {
  const usernameMessage = getUsernameValidationMessage(username);

  if (usernameMessage) {
    return usernameMessage;
  }

  const emailMessage = getEmailValidationMessage(email);

  if (emailMessage) {
    return emailMessage;
  }

  const passwordMessage = getPasswordValidationMessage(password);

  if (passwordMessage) {
    return passwordMessage;
  }

  return getConfirmPasswordValidationMessage(password, confirmPassword);
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
    const validationMessage = getSignupValidationMessage(
      username,
      email,
      password,
      confirmPassword
    );

    if (validationMessage) {
      return {
        success: false,
        message: validationMessage,
      };
    }

    try {
      return await authRepository.signup(username, email, password);
    } catch {
      return {
        success: false,
        message: NETWORK_ERROR_MESSAGE,
      };
    }
  },
};
