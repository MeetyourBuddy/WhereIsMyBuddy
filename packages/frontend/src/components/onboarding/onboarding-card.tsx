import { Button } from '@/components/common/ui/button';
import { Progress } from '@/components/common/ui/progress';
import { ChevronLeft } from 'lucide-react';
import { CustomCheckbox } from './checkbox-badge';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '../common/ui/scroll-area';
import { FormDatePicker } from '../common/form/form-date-picker';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormSelect } from '../common/form/form-select';
import { useState } from 'react';
import { citiesByCountry, countries } from '@/lib/utils';
import { Country, interestCategories } from '@/lib/constants';

const onboardingData = [
  {
    title: 'Where are you based?',
    description: 'This information helps us find matches based on your time zone'
  },
  {
    title: 'What is your preferred frequency of contact?',
    description: 'This information helps us find matches that are compatible with your schedule'
  },
  {
    title: 'Tell us about your interests',
    description: 'What are you studying? What do you want to learn about?'
  }
];

// Add form schema
const onboardingSchema = z.object({
  country: z.nativeEnum(Country, {
    errorMap: () => ({ message: 'Please select a country' })
  }),
  city: z.string().min(1, 'Please select a city'),
  birthday: z.date({
    required_error: 'Please select a date'
  }),
  interests: z.array(z.string()).min(3, 'Please select at least 3 interests')
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

const OnboardingCard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange'
  });

  const { handleSubmit, watch } = methods;

  const onSubmit = (data: OnboardingFormData) => {
    console.log('Form data:', data);
    setProfile(data);

    navigate('/activity');
  };

  const handleNext = () => {
    if (currentStep < onboardingData.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Watch form values for validation
  const selectedCountry = watch('country') as Country | undefined;
  const selectedCity = watch('city');
  const selectedInterests = watch('interests') || [];

  // Get available cities based on selected country
  const availableCities = selectedCountry ? citiesByCountry[selectedCountry] : [];

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!selectedCountry && !!selectedCity;
      case 2:
        return !!watch('birthday');
      case 3:
        return selectedInterests.length >= 3;
      default:
        return false;
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-h-screen w-full items-center justify-center"
      >
        <div className="flex min-h-[904px] w-full max-w-[824px] flex-col items-center rounded-[25px] border bg-gray-5">
          <div className="relative flex w-full flex-col items-center pt-[106px]">
            <div className="absolute flex items-center justify-between space-x-6">
              {currentStep > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="h-10 w-10 rounded-full"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              )}
              <Progress
                value={((currentStep - 1) / onboardingData.length) * 100}
                className="w-[475px]"
              />
              <div className="flex items-center">
                <p className="text-center text-xl font-semibold">
                  {currentStep} / {onboardingData.length}
                </p>
              </div>
            </div>

            <div className="absolute top-[300px] mt-6 flex max-w-[600px] flex-col items-center space-y-6 text-center">
              <h1 className="text-4xl font-semibold">{onboardingData[currentStep - 1].title}</h1>
              <p className="text-xl text-muted-foreground">
                {onboardingData[currentStep - 1].description}
              </p>

              <div className="flex w-full justify-center">
                {currentStep === 1 && (
                  <div className="mt-8 flex w-[300px] flex-col space-y-4">
                    <FormSelect
                      name="country"
                      label="Country"
                      placeholder="Select a country"
                      required
                      options={countries}
                    />

                    {selectedCountry && (
                      <FormSelect
                        name="city"
                        label="City"
                        placeholder="Select a city"
                        className="pt-4"
                        required
                        options={availableCities}
                      />
                    )}
                  </div>
                )}
                {currentStep === 2 && (
                  <FormDatePicker
                    name="birthday"
                    label="What is your birthday?"
                    placeholder="Select a date"
                    control={methods.control}
                    className="mt-4 w-[300px]"
                    required
                  />
                )}
                {currentStep === 3 && (
                  <ScrollArea className="max-h-[280px] max-w-[654px]">
                    <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                      {interestCategories.map((interest) => (
                        <CustomCheckbox
                          key={interest.value}
                          value={interest.value}
                          checked={selectedInterests.includes(interest.value)}
                          onChange={() => {
                            const updatedInterests = selectedInterests.includes(interest.value)
                              ? selectedInterests.filter((i) => i !== interest.value)
                              : [...selectedInterests, interest.value];
                            methods.setValue('interests', updatedInterests);
                          }}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>

            <Button
              type={currentStep === onboardingData.length ? 'submit' : 'button'}
              onClick={currentStep === onboardingData.length ? undefined : handleNext}
              disabled={!isStepValid()}
              className="absolute top-[750px] h-[52px] w-[253px]"
            >
              {currentStep === onboardingData.length ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default OnboardingCard;
