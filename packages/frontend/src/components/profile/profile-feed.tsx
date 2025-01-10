import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Button } from '@/components/common/ui/button';
import { Edit2, Globe, User, Link, Settings, Lock, Target } from 'lucide-react';
import { FormInput } from '@/components/common/form/form-input';
import { useFormContext } from 'react-hook-form';
import { FormTextarea } from '@/components/common/form/form-textarea';
import { FormSelect } from '@/components/common/form/form-select';
import { QRCodeSection } from '@/components/common/qr-code/qr-code';
import { FormMultiSelect } from '@/components/common/form/form-multi-select';
import { type Profile } from '@/lib/validation/profile-validation';
import {
  Country,
  getCommoditiesForCategory,
  interestCategories,
  InterestCategory
} from '@/lib/constants';
import { useState } from 'react';
import { citiesByCountry, countries } from '@/lib/utils';
import { toast } from '@/lib/hooks/use-toast';

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

const ProfileFeed = ({ onSubmit }: ProfileFeedProps) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useFormContext<Profile>();
  const {
    watch,
    handleSubmit,
    formState: { isDirty, errors }
  } = methods;

  const selectedCountry = watch('country') as Country | undefined;
  const availableCities = selectedCountry ? citiesByCountry[selectedCountry] : [];

  const handleFormSubmit = async (data: Profile) => {
    if (!isDirty) {
      console.log('Form is not dirty, skipping submission');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(data);
      setEditingSection(null);
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="mb-6 space-y-6">
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

      {/* Preferences Section */}
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
                watch('interestsCategories')?.flatMap((category) =>
                  getCommoditiesForCategory(category as InterestCategory)
                ) || []
              }
            />
          </div>
        </div>
      </ProfileSection>

      {/* Private Information Section */}
      <ProfileSection
        title="Private Information"
        icon={<Lock className="h-5 w-5" />}
        sectionKey="private"
        isEditing={editingSection === 'private'}
        onEditClick={handleEditClick}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            name="dateOfBirth"
            hasInputIcon={true}
            leftIcon="calendar"
            label="What is your birthday?"
            placeholder="Select a date"
            customError="Date of birth is required"
            disabled
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
