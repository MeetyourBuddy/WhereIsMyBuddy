import Cookies from 'js-cookie';
import { COOKIE_CONFIG } from '../api/config';
import { TokenPair } from '@/types/auth-types';

class TokenService {
  setTokens(accessToken: string, refreshToken?: string): void {
    Cookies.set(COOKIE_CONFIG.token.name, accessToken, COOKIE_CONFIG.token.options);

    if (refreshToken) {
      Cookies.set(
        COOKIE_CONFIG.refreshToken.name,
        refreshToken,
        COOKIE_CONFIG.refreshToken.options
      );
    }
  }

  getAccessToken(): string | undefined {
    return Cookies.get(COOKIE_CONFIG.token.name);
  }

  getRefreshToken(): string | undefined {
    return Cookies.get(COOKIE_CONFIG.refreshToken.name);
  }

  clearTokens(): void {
    Cookies.remove(COOKIE_CONFIG.token.name, { path: '/' });
    Cookies.remove(COOKIE_CONFIG.refreshToken.name, { path: '/' });
  }
}

export const tokenService = new TokenService();
