import { Button } from '@/components/common/ui/button';
import { Progress } from '@/components/common/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/common/ui/select';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { CustomCheckbox } from './checkbox-badge';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '../common/ui/scroll-area';

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
  const [selectedFrequency, setSelectedFrequency] = useState<string>('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const progress = (currentStep / onboardingData.length) * 100;
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep === 1 && selectedCountry) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2 && selectedFrequency) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinish = () => {
    navigate('/activity');
  };

  const handleInterestChange = (interest: string) => {
    setSelectedInterests((prev) => [...prev, interest]);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
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
            <Progress value={progress} className="w-[475px]" />
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
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="mt-[58px] h-12 w-[388px] bg-white">
                    <SelectValue placeholder={placeholderData[0]} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectComponentData[0].map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {currentStep === 2 && (
                <Select value={selectedFrequency} onValueChange={setSelectedFrequency}>
                  <SelectTrigger className="mt-[58px] h-12 w-[388px] bg-white">
                    <SelectValue placeholder={placeholderData[1]} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectComponentData[1].map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {currentStep === 3 && (
                <ScrollArea className="max-h-[280px] max-w-[654px]">
                  <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                    {selectComponentData[onboardingData.length - 1].map((interest) => (
                      <CustomCheckbox
                        key={interest}
                        value={interest}
                        checked={selectedInterests.includes(interest)}
                        onChange={() => handleInterestChange(interest)}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>

          <Button
            onClick={currentStep === onboardingData.length ? handleFinish : handleNext}
            disabled={
              currentStep === 1
                ? !selectedCountry
                : currentStep === 2
                  ? !selectedFrequency
                  : selectedInterests.length < 3
            }
            className="absolute top-[750px] h-[52px] w-[253px]"
          >
            {currentStep === onboardingData.length ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingCard;
