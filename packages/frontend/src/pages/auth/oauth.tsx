import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { tokenService } from '@services/token/token-service';
import { useAuthContext } from '@/providers/contexts/auth-context';
import { authService } from '@/services/api/auth/auth-service';

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
        const { data: userData } = await authService.getMe();

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
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div
          className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          aria-label="Loading"
        />
        <p className="text-muted-foreground">Processing your login...</p>
      </div>
    </div>
  );
};

export default OAuthHandler;
