
import React from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Users, Calendar, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/common/Card";

const OnboardingWelcome = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/onboarding/basic-info");
  };

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={3}
      title="Welcome to Where is My Buddy!"
      description="Let's set up your profile so you can start finding buddies for your activities"
      showBackButton={false}
    >
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6 text-center">
            <div className="bg-buddy-purple/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-buddy-purple" />
            </div>
            <h3 className="font-semibold mb-2">Find Buddies</h3>
            <p className="text-sm text-buddy-gray-500">
              Connect with like-minded people who share your interests
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="bg-buddy-green/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-buddy-green" />
            </div>
            <h3 className="font-semibold mb-2">Join Activities</h3>
            <p className="text-sm text-buddy-gray-500">
              Discover and participate in activities near you
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="bg-buddy-orange/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="h-6 w-6 text-buddy-orange" />
            </div>
            <h3 className="font-semibold mb-2">Share Moments</h3>
            <p className="text-sm text-buddy-gray-500">
              Create memories and share your experiences
            </p>
          </Card>
        </div>

        <div className="bg-buddy-gray-100 p-6 rounded-lg">
          <h3 className="font-semibold mb-4">What you'll need to set up:</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="bg-white rounded-full p-1 mr-3 mt-0.5">
                <div className="bg-buddy-purple rounded-full w-3 h-3"></div>
              </div>
              <div>
                <p className="font-medium">Basic Information</p>
                <p className="text-sm text-buddy-gray-500">
                  We'll ask for some basic details to help personalize your experience
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-white rounded-full p-1 mr-3 mt-0.5">
                <div className="bg-buddy-purple rounded-full w-3 h-3"></div>
              </div>
              <div>
                <p className="font-medium">Your Interests</p>
                <p className="text-sm text-buddy-gray-500">
                  Select interests to help us match you with compatible buddies
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-white rounded-full p-1 mr-3 mt-0.5">
                <div className="bg-buddy-purple rounded-full w-3 h-3"></div>
              </div>
              <div>
                <p className="font-medium">Profile Picture & Bio</p>
                <p className="text-sm text-buddy-gray-500">
                  Add a photo and short description to complete your profile
                </p>
              </div>
            </li>
          </ul>
        </div>

        <Button onClick={handleContinue} className="w-full" size="lg">
          Let's Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingWelcome;
