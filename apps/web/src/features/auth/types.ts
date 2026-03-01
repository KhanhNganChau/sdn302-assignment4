export interface User {
  _id: string;
  username: string;
  admin: boolean;
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface RegisterDTO {
  username: string;
  password: string;
  admin?: boolean;
}

export interface LoginResponse {
  token: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}
