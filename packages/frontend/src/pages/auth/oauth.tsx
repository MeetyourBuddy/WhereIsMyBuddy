import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { tokenService } from '@services/token/token-service';
import { useAuthContext } from '@/providers/contexts/auth-context';
import { userService } from '@/services/api/user/user-service';

interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export const OAuthHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const extractTokens = (): AuthTokens => {
      const searchParams = new URLSearchParams(location.search);
      return {
        accessToken: searchParams.get('accessToken'),
        refreshToken: searchParams.get('refreshToken')
      };
    };

    const handleAuth = async () => {
      try {
        const { accessToken, refreshToken } = extractTokens();

        if (!accessToken || !refreshToken) {
          throw new Error('Missing authentication tokens');
        }

        tokenService.setTokens(accessToken, refreshToken);
        const { data: userData } = await userService.getMe();

        if (!userData) {
          throw new Error('User data not found');
        }

        setUser(userData);
        navigate('/onboarding');
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/signin', {
          state: { error: 'Authentication failed. Please try again.' }
        });
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuth();
  }, [location, navigate, setUser]);

  if (!isProcessing) return null;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div
          className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
          aria-label="Loading"
        />
        <p className="text-muted-foreground">Processing your login...</p>
      </div>
    </div>
  );
};

export default OAuthHandler;
