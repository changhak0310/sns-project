export type User = {
  id: number;
  email: string;
  name: string;
  username: string;
  avatarUrl: string;
  accessToken: string;
};

export type SessionUser = Pick<
  User,
  "id" | "email" | "username" | "name" | "avatarUrl"
>;

export type AuthResult =
  | {
      success: true;
      data: User;
    }
  | {
      success: false;
      message: string;
    };

export type SignupResult = AuthResult;
export type SignupApiResponse = SignupResult;
export type LoginResult = AuthResult;
export type LoginApiResponse = LoginResult;

export type AuthFieldProps = {
  value: string;
  fieldErrorMessage?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export type SignupFieldProps = AuthFieldProps;
export type LoginFieldProps = AuthFieldProps;

export type AuthSubmitButtonProps = {
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
};

export type SignupSubmitButtonProps = AuthSubmitButtonProps;
export type LoginSubmitButtonProps = AuthSubmitButtonProps;

export type AuthErrorMessageProps = {
  message: string;
};

export type SignupErrorMessageProps = AuthErrorMessageProps;
export type LoginErrorMessageProps = AuthErrorMessageProps;

export type SignupState = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  usernameError: string;
  emailError: string;
  passwordError: string;
  confirmPasswordError: string;
  formError: string;
  isFormValid: boolean;
  isLoading: boolean;
  signupUser: User | null;
};

export type SignupActions = {
  setUsername: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  signup: () => Promise<void>;
  resetSignupState: () => void;
};

export type UseSignupReturn = SignupState & SignupActions;

export type LoginState = {
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
  formError: string;
  isFormValid: boolean;
  isLoading: boolean;
  loginUser: User | null;
};

export type LoginActions = {
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  login: () => Promise<void>;
  resetLoginState: () => void;
};

export type UseLoginReturn = LoginState & LoginActions;

export type AuthActionAreaProps = {
  loginHref: string;
  profileHref: string;
};

export type AuthLinkButtonProps = {
  href: string;
  label: string;
};

export type LogoutButtonProps = {
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
};

export type LogoutErrorMessageProps = {
  message: string;
};

export type LogoutResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export type LogoutApiResponse = LogoutResult;

export type LogoutState = {
  actionError: string;
  isLoading: boolean;
};

export type LogoutComputed = {
  sessionUser: SessionUser | null;
};

export type LogoutActions = {
  logout: () => Promise<void>;
};

export type UseLogoutReturn = LogoutState & LogoutComputed & LogoutActions;
