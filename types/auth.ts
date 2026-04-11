export type User = {
  id: number;
  email: string;
  name: string;
  username: string;
  avatarUrl: string;
  accessToken: string;
};

export type SignupResult =
  | {
      success: true;
      data: User;
    }
  | {
      success: false;
      message: string;
    };

export type SignupApiResponse = SignupResult;

export type SignupFieldProps = {
  value: string;
  fieldErrorMessage?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export type SignupSubmitButtonProps = {
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
};

export type SignupErrorMessageProps = {
  message: string;
};

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
