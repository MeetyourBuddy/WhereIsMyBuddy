import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { Button } from "@/components/ui/button";
// import { interestCategories } from "@/lib/constants/interest-categories.constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { activityCategories } from "@/lib/constants/category-interests.constants";

const InterestSelection = () => {
  const navigate = useNavigate();
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
      title="What are you interested in?"
      description="Select at least 3 interests to help us find the right buddies for you"
      onBack={handleBack}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <ScrollArea className="h-[500px] items-center w-full">
          {activityCategories.map((category) => (
            <div key={category.value} className="space-y-3 items-center">
              <h6 className="font-medium text-buddy-gray-800">
                {category.label}
              </h6>
              <div className="flex flex-wrap gap-2">
                {category.interests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-buddy-purple text-white"
                          : "bg-buddy-gray-100 text-buddy-gray-700 hover:bg-buddy-gray-200"
                      }`}
                      onClick={() => toggleInterest(interest, category.value)}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </ScrollArea>

        <div className="pt-4">
          <div className="text-sm text-buddy-gray-500 mb-4">
            {selectedInterests.length} of 3 minimum interests selected
          </div>
          <Button type="submit" className="w-full" size="lg">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </OnboardingLayout>
  );
};

export default InterestSelection;
