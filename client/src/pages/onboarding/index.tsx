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

const OnboardingWelcome = () => {
  const navigate = useNavigate();
  useScrollToTopImmediate();

  const handleContinue = () => {
    navigate("/onboarding/basic-info");
  };

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={3}
      title="Welcome to Buddy! 🎉"
      description="Let's set up your profile so we can connect you with accountability partners who share your goals"
      showBackButton={false}
    >
      <div className="space-y-8">
        {/* Simplified welcome with key benefits */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center space-x-3 p-4 rounded-xl bg-buddy-purple/5">
            <div className="bg-buddy-purple/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5 text-buddy-purple" />
            </div>
            <p className="text-sm text-buddy-gray-700 font-medium">
              Find accountability partners
            </p>
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-xl bg-buddy-green/5">
            <div className="bg-buddy-green/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar className="h-5 w-5 text-buddy-green" />
            </div>
            <p className="text-sm text-buddy-gray-700 font-medium">
              Join goal-based activities
            </p>
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-xl bg-buddy-orange/5">
            <div className="bg-buddy-orange/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="h-5 w-5 text-buddy-orange" />
            </div>
            <p className="text-sm text-buddy-gray-700 font-medium">
              Track progress together
            </p>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-buddy-gray-600">
            This will only take about 2 minutes 🚀
          </p>
          <Button
            onClick={handleContinue}
            className="w-full rounded-full bg-gradient-to-r from-buddy-purple to-buddy-orange hover:from-buddy-purple/90 hover:to-buddy-orange/90 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            size="lg"
          >
            Let's Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingWelcome;
