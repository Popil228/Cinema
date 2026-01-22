export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  phoneNum: string;
  password: string;
  confirmPassword: string;
}

export interface UserDto {
  id: number;
  email: string;
  phoneNum: string;
  role: number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: UserDto;
}
