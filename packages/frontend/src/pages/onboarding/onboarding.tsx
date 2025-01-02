import Logo_alt from '@/components/common/icons/Logo_alt';
import OnboardingCard from '@/components/onboarding/onboarding-card';

const Onboarding = () => {
  return (
    <div className="m-0 flex flex-row p-0">
      <div className="m-6 flex flex-col">
        <Logo_alt className="h-10 w-10" />
      </div>
      <div className="w-full">
        <OnboardingCard />
      </div>
    </div>
  );
};

export default Onboarding;
