import { useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ProfileFeed from '../../components/profile/profile-feed';
import ProfileHeader from '../../components/profile/profile-header';
import { toast } from '@/lib/hooks/use-toast';
import { Profile, profileSchema } from '@/lib/validation/profile-validation';
import { useAuthContext } from '@/providers/contexts/auth-context';
import { useProfile } from '@/lib/hooks/use-profile';
import { useProfileStore } from '@/providers/store';
import { IUserData } from '@/types/user-types';

const UpdateProfilePage = () => {
  const { user } = useAuthContext();
  const { updateProfile, profile: storeProfile } = useProfile();
  const { setProfile } = useProfileStore();

  // Use store profile if available, fallback to user
  const profile = storeProfile || user;

  const methods = useForm<Profile>({
    mode: 'onChange',
    resolver: zodResolver(profileSchema),
    defaultValues: useMemo(
      () => ({
        name: profile?.name || '',
        country: (profile?.country as string) || '',
        city: profile?.city || '',
        bio: profile?.bio || '',
        collaborationStatus: profile?.collaborationStatus || 'undecided',
        preferredLanguage: (profile?.preferredLanguage as string)?.toLowerCase() || 'en',
        interestsCategories: (profile?.interestsCategories || []).map((cat) => String(cat)),
        interestsCommodities: (profile?.interestsCommodities || []).map((com) => String(com)),
        gender: profile?.gender || 'other',
        goals: profile?.goals || '',
        profileImage: profile?.profileImage || '',
        githubUrl: profile?.githubUrl || '',
        linkedInUrl: profile?.linkedInUrl || '',
        instagramUrl: profile?.instagramUrl || '',
        phoneNumber: profile?.phoneNumber || '',
        isActive: profile?.isActive ?? true,
        portfolioUrl: profile?.portfolioUrl || '',
        timezone: profile?.timezone || ''
      }),
      [profile]
    )
  });

  const handleProfileUpdate = async (data: Profile) => {
    try {
      const formattedData: Partial<IUserData> = {
        ...data,
        interestsCommodities: data.interestsCommodities || [],
        profileImage: user?.profileImage || data.profileImage,
        bannerImage: user?.bannerImage
      };

      await updateProfile({
        id: user?.id as string,
        updates: formattedData
      });

      // Update local form state with new values
      methods.reset(data);

      // Update store profile
      setProfile(formattedData as IUserData);

      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
      throw error;
    }
  };

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

      // Update profile with new avatar URL
      // add logic here

      toast({
        title: 'Success',
        description: 'Avatar updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update avatar',
        variant: 'destructive'
      });
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

      // Update profile with new banner URL
      // add logic here

      toast({
        title: 'Success',
        description: 'Banner updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update banner',
        variant: 'destructive'
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="container-default flex flex-col gap-4">
        <ProfileHeader
          name={profile?.name || 'John Doe'}
          email={profile?.email || 'john.doe@example.com'}
          avatarUrl={profile?.profileImage || '/avatars/user-profile.png'}
          bannerUrl={profile?.bannerImage}
          onAvatarUpdate={handleAvatarUpdate}
          onBannerUpdate={handleBannerUpdate}
        />

        <ProfileFeed onSubmit={handleProfileUpdate} />
      </div>
    </FormProvider>
  );
};

export default UpdateProfilePage;
