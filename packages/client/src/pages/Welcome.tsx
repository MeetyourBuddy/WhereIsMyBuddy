
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, UserPlus, Calendar, Users, CheckCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/layout/Container";
import { Card } from "@/components/common/Card";

const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <UserPlus className="h-12 w-12 text-buddy-blue" />,
      title: "Connect with Buddies",
      description: "Find accountability partners who share your interests and goals."
    },
    {
      icon: <Calendar className="h-12 w-12 text-buddy-green" />,
      title: "Activity Scheduling",
      description: "Plan and schedule activities with your buddies to stay consistent."
    },
    {
      icon: <Users className="h-12 w-12 text-buddy-orange" />,
      title: "Group Challenges",
      description: "Join group challenges to motivate each other and track progress together."
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-buddy-purple" />,
      title: "Achievement Tracking",
      description: "Track your progress and celebrate milestones with your buddies."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-buddy-purple/5 to-buddy-blue/5">
      <div className="pt-16 pb-24">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6 animate-fade-in">
              <div className="flex flex-col items-center">
                <Heart className="h-16 w-16 text-buddy-purple fill-buddy-purple mb-2" />
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-normal text-buddy-gray-700">Where is</span>
                  <span className="text-4xl md:text-5xl font-bold text-buddy-purple -mt-1">my Buddy?</span>
                </div>
              </div>
            </div>
            <p className="text-lg text-buddy-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
              We're excited to help you find accountability partners for all your activities.
              Let's get you started on your journey to more consistent and enjoyable activities!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 text-center animate-fade-in" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-buddy-gray-800">{feature.title}</h3>
                  <p className="text-buddy-gray-600">{feature.description}</p>
                </Card>
              ))}
            </div>
            
            <Button 
              size="lg" 
              onClick={() => navigate("/getting-started")}
              className="animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              Get Started <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Welcome;
