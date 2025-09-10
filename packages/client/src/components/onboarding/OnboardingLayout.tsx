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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-buddy-purple/5 via-white to-buddy-orange/5">
      <Container size="default" className="flex-1 py-8 px-4 md:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 text-buddy-gray-500 hover:text-white rounded-full"
                onClick={handleBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}

            <div className="flex items-center mb-6">
              <div className="w-full bg-buddy-gray-200 rounded-full h-3 shadow-inner">
                <div
                  className="bg-gradient-to-r from-buddy-purple to-buddy-orange h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
              <span className="ml-4 text-sm font-semibold text-buddy-gray-700 bg-white px-3 py-1 rounded-full shadow-sm">
                {currentStep}/{totalSteps}
              </span>
            </div>

            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text">
                {title}
              </h1>
              {description && (
                <p className="text-lg text-buddy-gray-600 leading-relaxed max-w-lg mx-auto">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-buddy-purple/10 p-8">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OnboardingLayout;
