
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/layout/Container";
import { Button } from "@/components/ui/button";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  description?: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

const OnboardingLayout = ({
  children,
  currentStep,
  totalSteps,
  title,
  description,
  onBack,
  showBackButton = true,
}: OnboardingLayoutProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (currentStep === 1) {
      navigate("/signup");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-buddy-gray-100 to-white">
      <Container size="default" className="flex-1 py-8 px-4 md:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 text-buddy-gray-500 hover:text-buddy-gray-800"
                onClick={handleBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}

            <div className="flex items-center mb-2">
              <div className="w-full bg-buddy-gray-200 rounded-full h-2">
                <div
                  className="bg-buddy-purple h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
              <span className="ml-4 text-sm font-medium text-buddy-gray-600">
                {currentStep}/{totalSteps}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-buddy-gray-900">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-buddy-gray-500">{description}</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-subtle border border-buddy-gray-200 p-6">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OnboardingLayout;
