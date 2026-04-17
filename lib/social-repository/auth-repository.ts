import type {
  LoginApiResponse,
  LogoutApiResponse,
  SignupApiResponse,
  User,
} from "@/types/auth";
import type { ApiResponse } from "@/types/api";

type AuthApiResponse = LoginApiResponse | SignupApiResponse;

async function parseAuthResponse<T extends AuthApiResponse>(
  response: Response
): Promise<T> {
  const status = response?.status ?? 0;
  const fallbackMessage =
    status >= 500
      ? "?쒕쾭 ?ㅻ쪟媛 諛쒖깮?덉뒿?덈떎."
      : status >= 400
        ? "?섎せ???붿껌?낅땲?? ?낅젰???뺤씤?댁＜?몄슂."
        : "?ㅽ듃?뚰겕 ?ㅻ쪟媛 諛쒖깮?덉뒿?덈떎. ?ㅼ떆 ?쒕룄?댁＜?몄슂.";

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

async function parseLogoutResponse(
  response: Response
): Promise<LogoutApiResponse> {
  const fallbackMessage =
    response.status >= 500
      ? "?쒕쾭 ?ㅻ쪟媛 諛쒖깮?덉뒿?덈떎."
      : "?ㅽ듃?뚰겕 ?ㅻ쪟媛 諛쒖깮?덉뒿?덈떎. ?ㅼ떆 ?쒕룄?댁＜?몄슂.";

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
