
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, UserPlus, Users, Calendar, Target, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/layout/Container";
import { Card } from "@/components/common/Card";
import { Separator } from "@/components/ui/separator";

const GettingStarted = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Find Your Buddies",
      icon: <Search className="h-16 w-16 text-buddy-purple" />,
      description: "Search for buddies with similar interests, location, and availability. You can send connection requests and build your buddy network.",
      bullets: [
        "Search by interests, location, or activity type",
        "View detailed buddy profiles with compatibility scores",
        "Send personalized connection requests",
        "Manage your buddy network from the dashboard"
      ]
    },
    {
      title: "Create Activities",
      icon: <Calendar className="h-16 w-16 text-buddy-blue" />,
      description: "Set up activities with clear goals, schedules, and invite your buddies to join. Track progress together and motivate each other.",
      bullets: [
        "Define activity details, duration, and frequency",
        "Set measurable goals to track progress",
        "Schedule sessions with calendar integration",
        "Invite buddies to participate"
      ]
    },
    {
      title: "Join Challenges",
      icon: <Target className="h-16 w-16 text-buddy-green" />,
      description: "Participate in community challenges to stay motivated. Compete, collaborate, and celebrate achievements with your buddies.",
      bullets: [
        "Browse popular challenges by category",
        "See who else is participating",
        "Track your ranking and progress",
        "Earn badges and achievements"
      ]
    },
    {
      title: "Stay Accountable",
      icon: <Users className="h-16 w-16 text-buddy-orange" />,
      description: "Use check-ins, progress tracking, and buddy notifications to maintain consistency and celebrate milestones together.",
      bullets: [
        "Regular check-ins with your buddies",
        "Receive gentle reminders before scheduled activities",
        "Monitor progress with visual charts and statistics",
        "Share achievements and milestones"
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate("/welcome");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-purple/30 via-white to-pastel-blue/30 py-12 relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzUxRTkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTIwIDM1YzguMjg0IDAgMTUtNi43MTYgMTUtMTUtOC04LjI4NC02LjcxNi0xNS0xNS0xNS04LjI4NCAwLTE1IDYuNzE2LTE1IDE1IDAgOC4yODQgNi43MTYgMTUgMTUgMTV6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-75 pointer-events-none"></div>
      
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={handleBack} 
              className="mr-4 hover:bg-buddy-purple/5 rounded-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <div className="w-full bg-buddy-gray-200/60 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-buddy-purple to-buddy-blue h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-buddy-gray-500">
                <span>Getting Started</span>
                <span>{currentStep + 1} of {steps.length}</span>
              </div>
            </div>
          </div>

          <Card className="p-8 animate-fade-in rounded-2xl border border-white/80 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-gradient-to-br from-buddy-purple/10 to-buddy-blue/10 rounded-full p-5 mb-4 transform hover:scale-105 transition-transform duration-300">
                {steps[currentStep].icon}
              </div>
              <h2 className="text-2xl font-bold mt-4 bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">
                {steps[currentStep].title}
              </h2>
              <p className="text-buddy-gray-600 text-center mt-2 max-w-2xl">
                {steps[currentStep].description}
              </p>
            </div>

            <Separator className="my-6 bg-buddy-gray-200/50" />

            <div className="grid gap-4 mb-8">
              {steps[currentStep].bullets.map((bullet, index) => (
                <div key={index} className="flex items-start group hover:bg-buddy-gray-50/50 p-2 rounded-lg transition-colors duration-200">
                  <div className="bg-buddy-purple/10 rounded-full p-1 mr-3 mt-0.5 group-hover:bg-buddy-purple/20 transition-colors duration-200">
                    <CheckCircleIcon className="h-4 w-4 text-buddy-purple" />
                  </div>
                  <p className="text-buddy-gray-700">{bullet}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleBack} 
                className="rounded-full border-buddy-gray-200 hover:bg-buddy-purple/5 hover:text-buddy-purple transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {currentStep === 0 ? "Back to Welcome" : "Previous Step"}
              </Button>
              <Button 
                onClick={handleNext}
                className="rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white px-6 button-shine hover:shadow-md transition-all duration-200"
              >
                {currentStep === steps.length - 1 ? "Go to Dashboard" : "Next Step"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
};

// Helper icon component
const CheckCircleIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default GettingStarted;
