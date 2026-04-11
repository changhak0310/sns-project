import type {
  LoginApiResponse,
  LogoutApiResponse,
  SignupApiResponse,
  User,
} from "@/types/auth";

type AuthApiResponse = LoginApiResponse | SignupApiResponse;
type AuthResponsePayload = {
  success?: boolean;
  data?: User;
  message?: string;
};

async function parseAuthResponse<T extends AuthApiResponse>(
  response: Response
): Promise<T> {
  const fallbackMessage =
    response.status >= 500
      ? "서버 오류가 발생했습니다."
      : "네트워크 오류가 발생했습니다. 다시 시도해주세요.";

  try {
    const payload = (await response.json()) as AuthResponsePayload;

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

async function parseLogoutResponse(
  response: Response
): Promise<LogoutApiResponse> {
  const fallbackMessage =
    response.status >= 500
      ? "서버 오류가 발생했습니다."
      : "네트워크 오류가 발생했습니다. 다시 시도해주세요.";

  try {
    const payload = (await response.json()) as Partial<LogoutApiResponse>;

    if (payload.success === true) {
      return {
        success: true,
      };
    }

    if (payload.success === false && typeof payload.message === "string") {
      return {
        success: false,
        message: payload.message,
      };
    }
  } catch {
    if (response.ok) {
      return {
        success: true,
      };
    }

    return {
      success: false,
      message: fallbackMessage,
    };
  }

  if (response.ok) {
    return {
      success: true,
    };
  }

  return {
    success: false,
    message: fallbackMessage,
  };
}

export const authRepository = {
  async login(email: string, password: string): Promise<LoginApiResponse> {
    const response = await fetch("/api/auth/login", {
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

  async logout(): Promise<LogoutApiResponse> {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    return parseLogoutResponse(response);
  },

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

    return parseAuthResponse<SignupApiResponse>(response);
  },
};
