export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface GoogleUser {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
}
