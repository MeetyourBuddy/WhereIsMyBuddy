import { Button, Select, SelectItem, Progress, CheckboxGroup } from '@nextui-org/react';
import { useState } from 'react';
import Back from '../common/icons/Back';
import { CustomCheckbox } from './checkbox-badge';
import { useNavigate } from 'react-router-dom';

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

const selectComponentData = [
  ['United States', 'Canada', 'United Kingdom'],
  ['Daily', 'Weekly', 'Monthly'],
  [
    'Sports',
    'Music',
    'Travel',
    'Reading',
    'Writing',
    'Art',
    'Science',
    'History',
    'Philosophy',
    'Technology',
    'Business',
    'Finance',
    'Marketing',
    'Sales',
    'Engineering',
    'Design',
    'Health',
    'Education',
    'Politics',
    'Economics',
    'Philosophy',
    'Psychology',
    'Religion',
    'Science',
    'Space Travel',
    'Books',
    'Movies',
    'Food',
    'Other'
  ]
];

const placeholderData = ['Select a location', 'Select a frequency', 'Select your interests'];

const OnboardingCard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  //   const [selectedFrequency, setSelectedFrequency] = useState<string>('');
  //   const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const progress = (currentStep / onboardingData.length) * 100;

  const navigate = useNavigate();

  const handleNext = () => {
    if (selectedCountry) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinish = () => {
    navigate('/activity');
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex min-h-[904px] w-full max-w-[824px] flex-col items-center rounded-[25px] border border-border bg-onboarding-card">
        <div className="relative flex w-full flex-col items-center pt-[106px]">
          <div className="absolute flex items-center justify-between space-x-6">
            {currentStep > 1 && (
              <Button
                className="h-10 rounded-full bg-transparent"
                size="sm"
                variant="light"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <Back className="h-6 w-6" strokeWidth={2} stroke="#162D3A" />
              </Button>
            )}
            <Progress
              classNames={{
                base: 'w-[475px]',
                track: 'drop-shadow-md border border-default',
                indicator: 'bg-gradient-to-r from-black to-blue-500',
                label: 'tracking-wider font-medium text-default-600',
                value: 'text-foreground/60'
              }}
              radius="sm"
              size="md"
              value={progress}
            />
            <div className="flex items-center">
              <p className="text-center text-xl font-semibold">
                {currentStep} / {onboardingData.length}
              </p>
            </div>
          </div>
          <div className="absolute top-[300px] mt-6 flex max-w-[600px] flex-col items-center space-y-6 text-center">
            <h1 className="text-center text-4xl font-semibold">
              {onboardingData[currentStep - 1].title}
            </h1>
            <p className="text-center text-xl font-normal text-gray-500">
              {onboardingData[currentStep - 1].description}
            </p>

            <div className="flex w-full justify-center">
              {currentStep < onboardingData.length && (
                <Select
                  isRequired
                  selectedKeys={selectedCountry ? [selectedCountry] : []}
                  onSelectionChange={(keys) => setSelectedCountry(Array.from(keys)[0] as string)}
                  className="mt-[58px] h-12 max-w-[388px]"
                  // label="Location"
                  placeholder={placeholderData[currentStep - 1]}
                  size="md"
                  classNames={{
                    trigger: 'bg-white flex justify-end items-center',
                    value: 'text-default-700'
                  }}
                >
                  {selectComponentData[currentStep - 1].map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </Select>
              )}

              {currentStep === onboardingData.length && (
                <CheckboxGroup>
                  <div className="flex max-h-[280px] max-w-[654px] flex-row flex-wrap items-center justify-center gap-4 overflow-y-auto">
                    {selectComponentData[onboardingData.length - 1].map((interest) => (
                      <CustomCheckbox key={interest} value={interest} />
                    ))}
                  </div>
                </CheckboxGroup>
              )}
            </div>
          </div>
          <Button
            onClick={currentStep === onboardingData.length ? handleFinish : handleNext}
            isDisabled={!selectedCountry}
            className="absolute top-[750px] h-[52px] w-[253px] rounded-full border border-black bg-white text-signin-blue transition-colors hover:bg-gray-50"
          >
            {currentStep === onboardingData.length ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingCard;
