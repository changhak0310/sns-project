const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESERVED_USERNAMES = new Set(["undefined", "null"]);

export function getUsernameValidationMessage(username: string) {
  if (username.trim().length === 0) {
    return "유저 이름을 입력해주세요";
  }

  if (username.length > 16) {
    return "유저 이름은 16자 이내여야 합니다.";
  }

  if (/\s/.test(username)) {
    return "유저 이름에 띄어쓰기를 사용할 수 없습니다.";
  }

  if (RESERVED_USERNAMES.has(username.toLowerCase())) {
    return "사용할 수 없는 유저 이름입니다.";
  }

  return "";
}

export function getEmailValidationMessage(email: string) {
  if (!EMAIL_REGEX.test(email)) {
    return "이메일 형식과 맞지 않음";
  }

  return "";
}

export function getPasswordValidationMessage(password: string) {
  if (password.length === 0) {
    return "비밀번호를 입력해주세요";
  }

  return "";
}

export function getConfirmPasswordValidationMessage(
  password: string,
  confirmPassword: string
) {
  if (confirmPassword.length === 0) {
    return "비밀번호를 다시 입력해주세요";
  }

  if (password !== confirmPassword) {
    return "비밀번호가 일치하지 않습니다.";
  }

  return "";
}
