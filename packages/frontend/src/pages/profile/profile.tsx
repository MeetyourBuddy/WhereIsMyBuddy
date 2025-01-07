import ProfileFeed from '../../components/profile/profile-feed';
import ProfileHeader from '../../components/profile/profile-header';
import { useProfileStore } from '@/providers/store';
const Profile = () => {
  const { profile, setProfile } = useProfileStore();

  const handleAvatarUpdate = async (previewUrl: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload avatar');

      const { avatarUrl } = await response.json();
    } catch (error) {
      throw error;
    }
  };

  const handleBannerUpdate = async (previewUrl: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('banner', file);

      const response = await fetch('/api/profile/banner', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload banner');

      const { bannerUrl } = await response.json();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ProfileHeader
        name="John Doe"
        role="Software Engineer"
        avatarUrl="/avatars/user-profile.png"
        onAvatarUpdate={handleAvatarUpdate}
        onBannerUpdate={handleBannerUpdate}
      />
      <ProfileFeed />
    </div>
  );
};

export default Profile;
