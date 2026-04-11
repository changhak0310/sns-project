import { authRepository } from "@/lib/social-repository/auth-repository";
import type { LogoutResult } from "@/types/auth";

export const logoutService = {
  async logout(): Promise<LogoutResult> {
    try {
      const result = await authRepository.logout();

      if (result.success) {
        return {
          success: true,
        };
      }

      return {
        success: false,
        message: result.message || "로그아웃 처리 중 문제가 발생했습니다.",
      };
    } catch {
      return {
        success: false,
        message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      };
    }
  },
};
