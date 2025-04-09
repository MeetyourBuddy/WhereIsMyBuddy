import Cookies from 'js-cookie';
import { COOKIE_CONFIG } from '../api/config';

class TokenService {
  setTokens(accessToken: string, refreshToken?: string): void {
    try {
      const accessTokenExpiry = new Date();
      accessTokenExpiry.setSeconds(
        accessTokenExpiry.getSeconds() + COOKIE_CONFIG.token.options.expires
      );

      // Ensure we're setting the cookie with the correct path and domain
      Cookies.set(COOKIE_CONFIG.token.name, accessToken, {
        ...COOKIE_CONFIG.token.options,
        expires: accessTokenExpiry,
        path: '/',
        sameSite: 'strict',
        secure: import.meta.env.PROD
      });

      if (refreshToken) {
        const refreshTokenExpiry = new Date();
        refreshTokenExpiry.setSeconds(
          refreshTokenExpiry.getSeconds() + COOKIE_CONFIG.refreshToken.options.expires
        );

        Cookies.set(COOKIE_CONFIG.refreshToken.name, refreshToken, {
          ...COOKIE_CONFIG.refreshToken.options,
          expires: refreshTokenExpiry,
          path: '/',
          sameSite: 'strict',
          secure: import.meta.env.PROD
        });
      }

      // Verify tokens were set
      const storedAccessToken = Cookies.get(COOKIE_CONFIG.token.name);
      if (!storedAccessToken) {
        throw new Error('Failed to set access token');
      }
    } catch (error) {
      console.error('Error setting tokens:', error);
      throw error;
    }
  }

  getAccessToken(): string | undefined {
    return Cookies.get(COOKIE_CONFIG.token.name);
  }

  getRefreshToken(): string | undefined {
    console.log('refreshToken', Cookies.get(COOKIE_CONFIG.refreshToken.name));
    return Cookies.get(COOKIE_CONFIG.refreshToken.name);
  }

  clearTokens(): void {
    Cookies.remove(COOKIE_CONFIG.token.name, { path: '/' });
    Cookies.remove(COOKIE_CONFIG.refreshToken.name, { path: '/' });
  }
}

export const tokenService = new TokenService();
