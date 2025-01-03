import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Textarea } from '@/components/common/ui/textarea';
import { Button } from '@/components/common/ui/button';
import { Label } from '@/components/common/ui/label';
import { Edit2, Globe, User, Link, Settings, Lock, Target } from 'lucide-react';
import { FormCountryDropdown } from '@/components/common/form/form-country-select';
import { FormPhoneInput } from '@/components/common/form/form-phone-input';
import { FormInput } from '@/components/common/form/form-input';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormTextarea } from '@/components/common/form/form-textarea';
import { FormSelect } from '@/components/common/form/form-select';
import { QRCodeSection } from '@/components/common/qr-code/qr-code';
import { FormMultiSelect } from '@/components/common/form/form-multi-select';
import { selectComponentData } from '@/components/onboarding/onboarding-card';

interface ProfileSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

// Add schema definition
const profileSchema = z.object({
  name: z.string().min(2),
  country: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  bio: z.string(),
  profileLink: z.string().url().optional(),
  collaborationStatus: z.enum(['open', 'closed', 'undecided']),
  portfolio: z.string().url().optional(),
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  preferredLanguage: z.enum(['en', 'es', 'fr']),
  interests: z.string(),
  age: z.number().min(13).optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']),
  goals: z.string()
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileSection = ({ title, icon, children }: ProfileSectionProps) => {
  const {
    formState: { errors }
  } = useFormContext<ProfileFormData>();

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <Button variant="ghost" size="icon">
          <Edit2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

const ProfileFeed = () => {
  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      // Add your default values here
      collaborationStatus: 'undecided',
      preferredLanguage: 'en'
    }
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mb-6 space-y-6">
        <ProfileSection title="Personal Information" icon={<User className="h-5 w-5" />}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput
              name="name"
              label="Name"
              placeholder="Your name"
              customError="Name is required"
              required
            />
            <FormCountryDropdown
              name="country"
              label="Country"
              placeholder="Your country"
              customError="Country is required"
              required
            />
            <FormInput
              name="email"
              label="Email"
              placeholder="Your email"
              customError="Email is required"
              required
            />
            <FormPhoneInput
              name="phone"
              label="Phone (optional)"
              placeholder="Your phone number"
              customError="Phone is required"
            />
          </div>
        </ProfileSection>

        <ProfileSection title="Profile Details" icon={<Globe className="h-5 w-5" />}>
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

        <ProfileSection title="Social & Professional Links" icon={<Link className="h-5 w-5" />}>
          <div className="space-y-4">
            {['Portfolio', 'GitHub', 'LinkedIn'].map((platform) => (
              <FormInput
                name={platform.toLowerCase()}
                label={platform}
                placeholder={`Your ${platform} URL`}
                hasLabelInput={true}
                leftLabel="https://"
              />
            ))}
          </div>
        </ProfileSection>

        <ProfileSection title="Preferences" icon={<Settings className="h-5 w-5" />}>
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
                name="categories"
                label="Categories"
                placeholder="Your categories"
                maxCount={10}
                options={selectComponentData[2].map((interest) => ({
                  label: interest,
                  value: interest
                }))}
              />
              <FormMultiSelect
                name="interests"
                label="Interests"
                placeholder="Your interests"
                maxCount={10}
                options={selectComponentData[2].map((interest) => ({
                  label: interest,
                  value: interest
                }))}
              />
            </div>
          </div>
        </ProfileSection>

        <ProfileSection title="Private Information" icon={<Lock className="h-5 w-5" />}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput name="age" label="Age" placeholder="Your age" type="number" />
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

        <ProfileSection title="Aspirations" icon={<Target className="h-5 w-5" />}>
          <FormTextarea
            name="goals"
            label="Collaboration Goals"
            placeholder="What are your goals?"
          />
        </ProfileSection>

        <Button type="submit" className="w-full">
          Save Profile
        </Button>
      </form>
    </FormProvider>
  );
};

export default ProfileFeed;
