export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return '올바른 이메일 형식을 입력해주세요.';
  }
  return '';
};

export const validateNickname = (nickname: string): string => {
  if (!nickname.trim()) {
    return '닉네임을 입력해주세요.';
  }
  return '';
};

export const validatePassword = (password: string): string => {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/;
  if (!passwordRegex.test(password)) {
    return '비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 합니다.';
  }
  return '';
};

export const validatePasswordConfirm = (password: string, passwordConfirm: string): string => {
  if (password !== passwordConfirm) {
    return '비밀번호가 일치하지 않습니다.';
  }
  return '';
};
