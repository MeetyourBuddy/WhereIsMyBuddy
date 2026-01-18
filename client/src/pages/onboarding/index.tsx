import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  ArrowRight,
  Heart,
} from "lucide-react";
import { toast } from "sonner";

import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { useScrollToTopImmediate } from "@/hooks/use-scroll-to-top";
import { useOnboardingStore } from "@/store/onboarding.store";

const OnboardingWelcome = () => {
  const navigate = useNavigate();
  useScrollToTopImmediate();
  const { skipOnboarding } = useOnboardingStore();

  const handleContinue = () => {
    navigate("/onboarding/basic-info");
  };

  const handleSkip = async () => {
    try {
      await skipOnboarding();
      toast.success("You can complete your profile later from Settings");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to skip onboarding. Please try again.");
    }
  };

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={3}
      title="Welcome to Buddy"
      description="Let's set up your profile so we can connect you with accountability partners who share your goals"
      showBackButton={false}
    >
      <div className="space-y-8">
        {/* Simplified welcome with key benefits */}
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-buddy-purple/5 border border-buddy-purple/10">
            <div className="flex items-start space-x-4">
              <div className="bg-buddy-purple/10 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="h-8 w-8 text-buddy-purple" />
              </div>
              <div className="flex-1">
                <p className="text-lg text-buddy-gray-900 font-semibold mb-1">
                  Find accountability partners
                </p>
                <p className="text-sm text-buddy-gray-600">
                  Connect with people who share your goals and keep each other motivated
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-buddy-green/5 border border-buddy-green/10">
            <div className="flex items-start space-x-4">
              <div className="bg-buddy-green/10 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="h-8 w-8 text-buddy-green" />
              </div>
              <div className="flex-1">
                <p className="text-lg text-buddy-gray-900 font-semibold mb-1">
                  Join goal-based activities
                </p>
                <p className="text-sm text-buddy-gray-600">
                  Participate in challenges and activities that align with your interests
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-buddy-orange/5 border border-buddy-orange/10">
            <div className="flex items-start space-x-4">
              <div className="bg-buddy-orange/10 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="h-8 w-8 text-buddy-orange" />
              </div>
              <div className="flex-1">
                <p className="text-lg text-buddy-gray-900 font-semibold mb-1">
                  Track progress together
                </p>
                <p className="text-sm text-buddy-gray-600">
                  Monitor your achievements and celebrate milestones with your partners
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-buddy-gray-600">
            This takes about 2 minutes
          </p>
          <Button
            onClick={handleContinue}
            className="w-full rounded-full bg-gradient-to-r from-buddy-purple to-buddy-orange hover:from-buddy-purple/90 hover:to-buddy-orange/90 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            size="lg"
          >
            Let's Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="w-full text-buddy-gray-500 hover:text-buddy-gray-700"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingWelcome;
