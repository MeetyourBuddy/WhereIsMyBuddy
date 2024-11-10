export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IUser {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse extends TokenPair {
  user: IUser;
}

export interface LogoutResponse {
  message: string;
}
