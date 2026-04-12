import type { LoginApiResponse, SignupApiResponse, User } from "@/types/auth";
import type { ApiResponse } from "@/types/api";

type AuthApiResponse = LoginApiResponse | SignupApiResponse;

async function parseAuthResponse<T extends AuthApiResponse>(
  response: Response
): Promise<T> {
  const status = response?.status ?? 0;
  const fallbackMessage =
    status >= 500
      ? "서버 오류가 발생했습니다."
      : status >= 400
        ? "잘못된 요청입니다. 입력을 확인해주세요."
      : "네트워크 오류가 발생했습니다. 다시 시도해주세요.";

  try {
    const payload = (await response.json()) as ApiResponse<User>;

    if (payload.success === true && payload.data) {
      return {
        success: true,
        data: payload.data,
      } as T;
    }

    if (payload.success === false && typeof payload.message === "string") {
      return {
        success: false,
        message: payload.message,
      } as T;
    }
  } catch {
    return {
      success: false,
      message: fallbackMessage,
    } as T;
  }

  return {
    success: false,
    message: fallbackMessage,
  } as T;
}

export const authRepository = {
  async login(email: string, password: string): Promise<LoginApiResponse> {
    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    return parseAuthResponse<LoginApiResponse>(response);
  },

  async signup(
    username: string,
    email: string,
    password: string
  ): Promise<SignupApiResponse> {
    const response = await fetch("/api/v1/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    return parseAuthResponse<SignupApiResponse>(response);
  },
};
