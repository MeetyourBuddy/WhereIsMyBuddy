import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Users,
  Calendar,
  ArrowRight,
  Heart,
  Sparkles,
  Star,
} from "lucide-react";
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
      title="Welcome to Where is My Buddy! 🎉"
      description="Let's create your amazing profile so you can start finding incredible buddies for your adventures"
      showBackButton={false}
    >
      <div className="space-y-8">
        {/* Welcome Message */}
        <div className="text-center space-y-4">
          <p className="text-buddy-gray-600 text-lg">
            Ready to embark on an exciting journey of connections and
            activities?
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-buddy-purple/5 border-buddy-purple/20">
            <div className="bg-gradient-to-br from-buddy-purple/20 to-buddy-purple/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Users className="h-8 w-8 text-buddy-purple" />
            </div>
            <h3 className="font-bold text-lg mb-3 text-buddy-gray-900">
              Find Amazing Buddies
            </h3>
            <p className="text-sm text-buddy-gray-600 leading-relaxed">
              Connect with like-minded people who share your passions and create
              lasting friendships
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-buddy-green/5 border-buddy-green/20">
            <div className="bg-gradient-to-br from-buddy-green/20 to-buddy-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Calendar className="h-8 w-8 text-buddy-green" />
            </div>
            <h3 className="font-bold text-lg mb-3 text-buddy-gray-900">
              Join Fun Activities
            </h3>
            <p className="text-sm text-buddy-gray-600 leading-relaxed">
              Discover exciting activities near you and participate in
              adventures that match your interests
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-buddy-orange/5 border-buddy-orange/20">
            <div className="bg-gradient-to-br from-buddy-orange/20 to-buddy-orange/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Camera className="h-8 w-8 text-buddy-orange" />
            </div>
            <h3 className="font-bold text-lg mb-3 text-buddy-gray-900">
              Share Beautiful Moments
            </h3>
            <p className="text-sm text-buddy-gray-600 leading-relaxed">
              Create unforgettable memories and share your amazing experiences
              with your buddy community
            </p>
          </Card>
        </div>

        <div className="bg-gradient-to-br from-buddy-purple/5 to-buddy-orange/5 p-8 rounded-2xl border border-buddy-purple/10">
          <h3 className="font-bold text-xl mb-6 text-center text-buddy-gray-900">
            ✨ Your Journey Starts Here
          </h3>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-br from-buddy-purple to-buddy-purple/80 rounded-full p-2 shadow-lg">
                <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                  <span className="text-buddy-purple font-bold text-sm">1</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-buddy-gray-900 mb-1">
                  Tell Us About Yourself
                </p>
                <p className="text-sm text-buddy-gray-600 leading-relaxed">
                  Share your location and birth date so we can personalize your
                  experience and find local buddies
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-br from-buddy-green to-buddy-green/80 rounded-full p-2 shadow-lg">
                <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                  <span className="text-buddy-green font-bold text-sm">2</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-buddy-gray-900 mb-1">
                  Choose Your Interests
                </p>
                <p className="text-sm text-buddy-gray-600 leading-relaxed">
                  Select activities you love to help us match you with amazing
                  people who share your passions
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-br from-buddy-orange to-buddy-orange/80 rounded-full p-2 shadow-lg">
                <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                  <span className="text-buddy-orange font-bold text-sm">3</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-buddy-gray-900 mb-1">
                  Complete Your Profile
                </p>
                <p className="text-sm text-buddy-gray-600 leading-relaxed">
                  Pick a cool avatar and write a bio to let others know the
                  amazing person you are
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-buddy-gray-600">
            This will only take a few minutes, and we'll make it fun! 🚀
          </p>
          <Button
            onClick={handleContinue}
            className="w-full rounded-full bg-gradient-to-r from-buddy-purple to-buddy-orange hover:from-buddy-purple/90 hover:to-buddy-orange/90 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            size="lg"
          >
            Let's Create Magic Together! <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingWelcome;
