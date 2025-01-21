import { ProfileCard } from '@/components/profile/profile-card';
import { useAuthContext } from '@/providers/contexts/auth-context';
import { useProfile } from '@/lib/hooks/use-profile';
import { IUserData } from '@/types/user-types';
import { IconButton } from '@/components/common/ui/icon-button';
import { useNavigate } from 'react-router-dom';

const UserProfileCard = () => {
  const { profile: storeProfile } = useProfile();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const profile = (storeProfile || user) as IUserData;

  if (!profile) return null;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="mt-6 flex w-full items-center justify-end">
        <IconButton
          onClick={() => navigate('/profile/update')}
          rightIcon="edit"
          label="Edit Profile"
          className="w-[150px]"
        />
      </div>
      <ProfileCard profile={profile} />
    </div>
  );
};

export default UserProfileCard;
