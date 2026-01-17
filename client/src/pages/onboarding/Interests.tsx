import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, Heart, Sparkles, Target, Users } from "lucide-react";

import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { Button } from "@/components/ui/button";
// import { interestCategories } from "@/lib/constants/interest-categories.constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { activityCategories } from "@/lib/constants/category-interests.constants";
import { useScrollToTopImmediate } from "@/hooks/use-scroll-to-top";

const InterestSelection = () => {
  const navigate = useNavigate();
  useScrollToTopImmediate();
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>(
    []
  );

  const [categories, setCategories] = React.useState<string[]>([]);

  const toggleInterest = (interest: string, categoryName: string) => {
    setSelectedInterests((prev) => {
      const newInterests = prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest];

      // Update categories based on whether any interests in the category are selected
      setCategories((prevCategories) => {
        const hasInterestsInCategory = activityCategories
          .find((cat) => cat.value === categoryName)
          ?.interests.some((opt) => newInterests.includes(opt));

        if (hasInterestsInCategory && !prevCategories.includes(categoryName)) {
          return [...prevCategories, categoryName];
        } else if (
          !hasInterestsInCategory &&
          prevCategories.includes(categoryName)
        ) {
          return prevCategories.filter((cat) => cat !== categoryName);
        }
        return prevCategories;
      });

      return newInterests;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedInterests.length < 3) {
      toast.error("Please select at least 3 interests");
      return;
    }

    console.log("Selected interests:", selectedInterests, categories);

    localStorage.setItem("userInterests", JSON.stringify(selectedInterests));
    localStorage.setItem("userCategories", JSON.stringify(categories));

    toast.success("Interests saved!");
    navigate("/onboarding/profile-completion");
  };

  const handleBack = () => {
    navigate("/onboarding");
  };

  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={3}
      title="What makes you excited? ✨"
      description="Choose your passions so we can connect you with amazing people who share your interests"
      onBack={handleBack}
    >
      <div className="space-y-6">
        {/* Progress indicator */}
        <div className="bg-gradient-to-r from-buddy-green/10 to-buddy-blue/10 p-4 rounded-2xl border border-buddy-green/20">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-buddy-green to-buddy-green/80 rounded-full p-2">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-buddy-gray-900">
                Step 2: Your Interests
              </p>
              <p className="text-sm text-buddy-gray-600">
                Help us find your perfect buddy matches
              </p>
            </div>
          </div>
        </div>

        {/* Interest counter */}
        <div className="bg-gradient-to-r from-buddy-purple/10 to-buddy-orange/10 p-4 rounded-2xl border border-buddy-purple/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-buddy-purple" />
              <span className="font-semibold text-buddy-gray-900">
                Selected Interests
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  selectedInterests.length >= 3
                    ? "bg-buddy-green text-white"
                    : "bg-buddy-gray-200 text-buddy-gray-600"
                }`}
              >
                {selectedInterests.length}
              </div>
              <span className="text-sm text-buddy-gray-600">/ 3 minimum</span>
            </div>
          </div>
          {selectedInterests.length >= 3 && (
            <div className="mt-3 flex items-center space-x-2 text-buddy-green">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">
                Perfect! You're ready to find amazing buddies!
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ScrollArea className="h-[400px] items-center w-full">
            <div className="space-y-6">
              {activityCategories.map((category) => (
                <div key={category.value} className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-buddy-purple to-buddy-orange rounded-full"></div>
                    <h6 className="font-bold text-lg text-buddy-gray-900">
                      {category.label}
                    </h6>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {category.interests.map((interest) => {
                      const isSelected = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                            isSelected
                              ? "bg-gradient-to-r from-buddy-purple to-buddy-orange text-white shadow-lg"
                              : "bg-buddy-gray-100 text-buddy-gray-700 hover:bg-buddy-gray-200 border-2 border-transparent hover:border-buddy-purple/20"
                          }`}
                          onClick={() =>
                            toggleInterest(interest, category.value)
                          }
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="pt-6 space-y-4">
            {selectedInterests.length < 3 && (
              <div className="bg-gradient-to-r from-buddy-orange/10 to-buddy-red/10 p-4 rounded-2xl border border-buddy-orange/20">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-buddy-orange" />
                  <p className="text-sm text-buddy-gray-700">
                    <span className="font-semibold">Almost there!</span> Select{" "}
                    {3 - selectedInterests.length} more interest
                    {3 - selectedInterests.length > 1 ? "s" : ""} to continue.
                  </p>
                </div>
              </div>
            )}

            {selectedInterests.length >= 3 && (
              <div className="bg-gradient-to-r from-buddy-green/10 to-buddy-blue/10 p-4 rounded-2xl border border-buddy-green/20">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-buddy-green" />
                  <p className="text-sm text-buddy-gray-700">
                    <span className="font-semibold">Excellent choices!</span>{" "}
                    We'll use these to find amazing buddies who share your
                    passions.
                  </p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={selectedInterests.length < 3}
              className="w-full rounded-full bg-gradient-to-r from-buddy-blue to-buddy-purple hover:from-buddy-blue/90 hover:to-buddy-purple/90 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              size="lg"
            >
              Continue to Profile <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
};

export default InterestSelection;
