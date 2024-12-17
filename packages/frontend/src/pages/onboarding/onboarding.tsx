import { useAuth } from '@/libs/hooks/use-auth';
import { useAuthContext } from '@/providers/contexts/auth-context';
import { Button } from '@nextui-org/react';

const Onboarding = () => {
  const { logout } = useAuth();
  const { user } = useAuthContext();

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <h1>
        Onboarding {user.name} with ID: {user._id} and email: {user.email}
      </h1>
      <Button color="danger" onPress={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Onboarding;
