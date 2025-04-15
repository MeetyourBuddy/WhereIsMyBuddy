
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { Button } from "@/components/ui/button";

// Predefined interests
const interestCategories = [
  {
    name: "Fitness",
    options: ["Running", "Yoga", "Weight Training", "Cycling", "Swimming", "HIIT", "Pilates", "Tennis"],
  },
  {
    name: "Personal Growth",
    options: ["Reading", "Meditation", "Journaling", "Learning Languages", "Coding", "Art", "Music", "Public Speaking"],
  },
  {
    name: "Lifestyle",
    options: ["Cooking", "Gardening", "Photography", "Travel", "Fashion", "DIY Projects", "Volunteering", "Board Games"],
  },
];

const InterestSelection = () => {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedInterests.length < 3) {
      toast.error("Please select at least 3 interests");
      return;
    }

    console.log("Selected interests:", selectedInterests);
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
        {interestCategories.map((category) => (
          <div key={category.name} className="space-y-3">
            <h3 className="font-medium text-buddy-gray-800">{category.name}</h3>
            <div className="flex flex-wrap gap-2">
              {category.options.map((interest) => {
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
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

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
