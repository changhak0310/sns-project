import type { SignupApiResponse } from "@/types/auth";

async function parseSignupResponse(response: Response): Promise<SignupApiResponse> {
  const fallbackMessage =
    response.status >= 500
      ? "서버 오류가 발생했습니다."
      : "네트워크 오류가 발생했습니다. 다시 시도해주세요.";

  try {
    const payload = (await response.json()) as Partial<SignupApiResponse>;

    if (payload.success === true && payload.data) {
      return {
        success: true,
        data: payload.data,
      };
    }

    if (payload.success === false && typeof payload.message === "string") {
      return {
        success: false,
        message: payload.message,
      };
    }
  } catch {
    return {
      success: false,
      message: fallbackMessage,
    };
  }

  return {
    success: false,
    message: fallbackMessage,
  };
}

export const authRepository = {
  async signup(
    username: string,
    email: string,
    password: string
  ): Promise<SignupApiResponse> {
    const response = await fetch("/api/auth/signup", {
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

    return parseSignupResponse(response);
  },
};
