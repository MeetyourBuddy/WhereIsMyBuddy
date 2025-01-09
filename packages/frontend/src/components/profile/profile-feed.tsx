import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Button } from '@/components/common/ui/button';
import { Edit2, Globe, User, Link, Settings, Lock, Target, X } from 'lucide-react';
import { FormInput } from '@/components/common/form/form-input';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextarea } from '@/components/common/form/form-textarea';
import { FormSelect } from '@/components/common/form/form-select';
import { QRCodeSection } from '@/components/common/qr-code/qr-code';
import { FormMultiSelect } from '@/components/common/form/form-multi-select';
import { profileSchema, type Profile } from '@/lib/validation/profile-validation';
import {
  Country,
  getCommoditiesForCategory,
  interestCategories,
  InterestCategory
} from '@/lib/constants';
import { useEffect, useState } from 'react';
import { citiesByCountry, countries } from '@/lib/utils';
import { useAuthContext } from '@/providers/contexts/auth-context';
import { FormDatePicker } from '../common/form/form-date-picker';

interface ProfileSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  sectionKey: string;
  isEditing: boolean;
  onEditClick: (sectionKey: string) => void;
}

interface ProfileFeedProps {
  onSubmit: (data: Profile) => Promise<void>;
}

const ProfileSection = ({
  title,
  icon,
  children,
  sectionKey,
  isEditing,
  onEditClick
}: ProfileSectionProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={() => onEditClick(sectionKey)}>
          <Edit2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className={!isEditing ? 'pointer-events-none opacity-60' : ''}>{children}</div>
      </CardContent>
    </Card>
  );
};

const ProfileFeed = () => {
  const { user } = useAuthContext();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('profile here here', user);

  const methods = useForm<Profile>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      country: user?.country || '',
      city: user?.city || '',
      collaborationStatus: user?.collaborationStatus || 'undecided',
      preferredLanguage: user?.preferredLanguage?.toLowerCase() || 'en',
      interestsCategories: user?.interestsCategories || [],
      interestsCommodities: user?.interestsCommodities || [],
      profileLink: user?.profileLink || ''
    }
  });

  // Update form when profile changes
  useEffect(() => {
    if (user) {
      methods.reset(user);
    }
  }, [user, methods]);

  const selectedCountry = methods.watch('country') as Country | undefined;
  const availableCities = selectedCountry ? citiesByCountry[selectedCountry] : [];

  const onSubmit = async (data: Profile) => {
    try {
      console.log(data);
      setSavedData(data);
      setEditingSection(null); // Close edit mode after saving
      // setProfile(data);
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (sectionKey: string) => {
    if (editingSection === sectionKey) {
      setEditingSection(null);
    } else {
      setEditingSection(sectionKey);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mb-6 space-y-6">
        <ProfileSection
          title="Personal Information"
          icon={<User className="h-5 w-5" />}
          sectionKey="personal"
          isEditing={editingSection === 'personal'}
          onEditClick={handleEditClick}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput
              name="name"
              label="Name"
              placeholder="Your name"
              customError="Name is required"
              required
            />
            <FormSelect
              name="country"
              label="Country"
              placeholder="Select a country"
              required
              options={countries}
              customError="Country is required"
            />
            <FormInput
              name="email"
              label="Email"
              placeholder="Your email"
              customError="Email is required"
              required
            />
            <FormSelect
              name="city"
              label="City"
              placeholder="Your city"
              customError="City is required"
              required
              options={availableCities}
            />
          </div>
        </ProfileSection>

      {/* Profile Details Section */}
      <ProfileSection
        title="Profile Details"
        icon={<Globe className="h-5 w-5" />}
        sectionKey="profile"
        isEditing={editingSection === 'profile'}
        onEditClick={handleEditClick}
      >
        <div className="space-y-4">
          <FormTextarea name="bio" label="Bio" placeholder="Tell us about yourself" />
          <FormInput
            name="profileLink"
            label="Profile Link"
            placeholder="Your profile URL"
            customError="Profile link is required"
            disabled={true}
            hasInputIcon={true}
            rightIcon="copy"
          />
          <FormSelect
            name="collaborationStatus"
            label="Collaboration Status"
            placeholder="Select status"
            options={[
              { label: 'Open', value: 'open' },
              { label: 'Closed', value: 'closed' },
              { label: 'Undecided', value: 'undecided' }
            ]}
          />
          <QRCodeSection />
        </div>
      </ProfileSection>

      {/* Social Links Section */}
      <ProfileSection
        title="Social & Professional Links"
        icon={<Link className="h-5 w-5" />}
        sectionKey="social"
        isEditing={editingSection === 'social'}
        onEditClick={handleEditClick}
      >
        <div className="space-y-4">
          {['Portfolio', 'GitHub', 'LinkedIn'].map((platform) => (
            <FormInput
              key={platform}
              name={`${platform.toLowerCase()}Url`}
              label={platform}
              placeholder={`Your ${platform} URL`}
              hasLabelInput={true}
              leftLabel="https://"
            />
          ))}
        </div>
      </ProfileSection>

        <ProfileSection
          title="Preferences"
          icon={<Settings className="h-5 w-5" />}
          sectionKey="preferences"
          isEditing={editingSection === 'preferences'}
          onEditClick={handleEditClick}
        >
          <div className="space-y-4">
            <FormSelect
              name="preferredLanguage"
              label="Preferred Language"
              placeholder="Select language"
              options={[
                { label: 'English', value: 'en' },
                { label: 'Spanish', value: 'es' },
                { label: 'French', value: 'fr' }
              ]}
            />
            <div className="space-y-2">
              <FormMultiSelect
                name="interestsCategories"
                label="Categories"
                placeholder="Your categories"
                maxCount={10}
                required
                customError="Categories are required"
                options={interestCategories.map((interest) => ({
                  label: interest.label,
                  value: interest.value
                }))}
              />
              <FormMultiSelect
                name="interestsCommodities"
                label="Interests"
                placeholder="Your interests"
                maxCount={10}
                required
                customError="Interests are required"
                options={
                  methods
                    .watch('interestsCategories')
                    ?.flatMap((category) =>
                      getCommoditiesForCategory(category as InterestCategory)
                    ) || []
                }
              />
            </div>
          </div>
        </ProfileSection>

        <ProfileSection
          title="Private Information"
          icon={<Lock className="h-5 w-5" />}
          sectionKey="private"
          isEditing={editingSection === 'private'}
          onEditClick={handleEditClick}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormDatePicker
              name="dateOfBirth"
              label="What is your birthday?"
              placeholder="Select a date"
              control={methods.control}
              required
            />
            <FormSelect
              name="gender"
              label="Gender"
              placeholder="Select gender"
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Other', value: 'other' },
                { label: 'Prefer not to say', value: 'prefer-not-to-say' }
              ]}
            />
          </div>
        </ProfileSection>

      {/* Aspirations Section */}
      <ProfileSection
        title="Aspirations"
        icon={<Target className="h-5 w-5" />}
        sectionKey="aspirations"
        isEditing={editingSection === 'aspirations'}
        onEditClick={handleEditClick}
      >
        <FormTextarea name="goals" label="Collaboration Goals" placeholder="What are your goals?" />
      </ProfileSection>

      <Button
        type="submit"
        className="w-full"
        disabled={!isDirty || isSubmitting}
        onClick={() => console.log('Button clicked', { isDirty, isSubmitting })}
      >
        {isSubmitting ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  );
};

export default ProfileFeed;
