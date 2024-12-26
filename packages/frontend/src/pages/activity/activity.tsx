import { useAuth } from '@/libs/hooks/use-auth';

import { useAuthContext } from '@/providers/contexts/auth-context';
import { Button } from '@nextui-org/react';

const Activity = () => {
  const { logout } = useAuth();
  const { user } = useAuthContext();

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Activity</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default Activity;
