import { ProfileCard } from '@/components/profile/profile-card';
import { useAuthContext } from '@/providers/contexts/auth-context';
import { useProfile } from '@/lib/hooks/use-profile';
import { IUserData } from '@/types/user-types';

const UserProfileCard = () => {
  const { profile: storeProfile } = useProfile();
  const { user } = useAuthContext();

  const profile = (storeProfile || user) as IUserData;

  if (!profile) return null;

  return (
    <div className="flex h-screen items-center justify-center">
      <ProfileCard profile={profile} />
    </div>
  );
};

export default UserProfileCard;
