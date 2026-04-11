import { authRepository } from "@/lib/social-repository/auth-repository";
import type { LogoutResult } from "@/types/auth";

const NETWORK_ERROR_MESSAGE =
  "\uB124\uD2B8\uC6CC\uD06C \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.";

function createLogoutFailureResult(
  message: string = NETWORK_ERROR_MESSAGE
): LogoutResult {
  return {
    success: false,
    message,
  };
}

export const logoutService = {
  async logout(): Promise<LogoutResult> {
    try {
      const result = await authRepository.logout();

      if (result.success) {
        return result;
      }

      return createLogoutFailureResult(result.message);
    } catch {
      return createLogoutFailureResult();
    }
  },
};
