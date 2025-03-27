
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Upload, Check, X, UserRound } from "lucide-react";
import { toast } from "sonner";

import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Avatar options
const avatarOptions = [
  { id: "avatar1", url: "/avatars/3d-avatar-1.png", label: "Adventurer" },
  { id: "avatar2", url: "/avatars/3d-avatar-2.png", label: "Explorer" },
  { id: "avatar3", url: "/avatars/3d-avatar-3.png", label: "Dreamer" },
  { id: "avatar4", url: "/avatars/3d-avatar-4.png", label: "Thinker" },
  { id: "avatar5", url: "/avatars/3d-avatar-5.png", label: "Creator" },
  { id: "avatar6", url: "/avatars/3d-avatar-6.png", label: "Leader" },
];

// Placeholder URLs for 3D avatars (in a real app, you'd have actual avatar images)
for (let i = 0; i < avatarOptions.length; i++) {
  // Use placeholder images for now, in a real application these would be actual avatar images
  avatarOptions[i].url = `https://picsum.photos/id/${200 + i}/200`;
}

// Goal options
const goalOptions = [
  {
    id: "goal1",
    label: "Find regular workout partners",
    description: "Connect with others for consistent fitness activities",
  },
  {
    id: "goal2",
    label: "Discover new hobbies and interests",
    description: "Explore activities you've never tried before",
  },
  {
    id: "goal3",
    label: "Build a supportive community",
    description: "Connect with like-minded individuals in your area",
  },
  {
    id: "goal4",
    label: "Improve skills with motivated peers",
    description: "Accelerate learning by practicing with others",
  },
  {
    id: "goal5",
    label: "Organize local group activities",
    description: "Create and host events for your community",
  },
];

const formSchema = z.object({
  goals: z.array(z.string()).min(1, {
    message: "Please select at least one goal",
  }),
  profileMethod: z.enum(["upload", "avatar"]),
  uploadedImage: z.any().optional(),
  selectedAvatar: z.string().optional(),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }).optional(),
}).refine((data) => {
  // If upload is selected, make sure there's an image
  if (data.profileMethod === "upload") {
    return !!data.uploadedImage;
  }
  // If avatar is selected, make sure one is chosen
  if (data.profileMethod === "avatar") {
    return !!data.selectedAvatar;
  }
  return false;
}, {
  message: "Please upload an image or select an avatar",
  path: ["profileMethod"],
});

type FormData = z.infer<typeof formSchema>;

const ProfileCompletion = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [profileMethod, setProfileMethod] = useState<"upload" | "avatar">("avatar");
  const [completionItems, setCompletionItems] = useState({
    profilePicture: false,
    goals: false,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goals: [],
      profileMethod: "avatar",
      bio: "",
    },
  });

  const onSubmit = (data: FormData) => {
    // Validate that we have a profile image and at least one goal
    if (!completionItems.profilePicture) {
      toast.error("Please upload a profile picture or select an avatar");
      return;
    }
    
    if (!completionItems.goals) {
      toast.error("Please select at least one goal");
      return;
    }
    
    console.log("Profile completion data:", data);
    toast.success("Profile setup complete! Welcome aboard.");
    navigate("/dashboard");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
        form.setValue("uploadedImage", file);
        form.setValue("profileMethod", "upload");
        setProfileMethod("upload");
        setCompletionItems((prev) => ({ ...prev, profilePicture: true }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectAvatar = (avatarId: string, avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    form.setValue("selectedAvatar", avatarId);
    form.setValue("profileMethod", "avatar");
    setProfileMethod("avatar");
    setCompletionItems((prev) => ({ ...prev, profilePicture: true }));
  };

  const handleGoalChange = (checked: boolean | string, goalId: string) => {
    const currentGoals = form.getValues("goals");
    
    // Add or remove the goal based on the checkbox state
    const updatedGoals = checked
      ? [...currentGoals, goalId]
      : currentGoals.filter((id) => id !== goalId);
    
    form.setValue("goals", updatedGoals);
    setCompletionItems((prev) => ({ 
      ...prev, 
      goals: updatedGoals.length > 0 
    }));
  };

  const handleBack = () => {
    navigate("/onboarding/interests");
  };

  // Calculate completion percentage
  const completionPercentage = Object.values(completionItems).filter(Boolean).length * 50;

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={3}
      title="Complete your profile"
      description="Let others get to know you better"
      onBack={handleBack}
    >
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-buddy-gray-700">Profile Completion</p>
          <span className="text-sm font-bold text-buddy-purple">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-buddy-gray-200 rounded-full h-2">
          <div
            className="bg-buddy-purple h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs 
            defaultValue="avatar" 
            className="w-full" 
            value={profileMethod}
            onValueChange={(value) => setProfileMethod(value as "upload" | "avatar")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="avatar">Choose Avatar</TabsTrigger>
              <TabsTrigger value="upload">Upload Photo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="avatar" className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                {selectedAvatar ? (
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={selectedAvatar} alt="Selected Avatar" />
                    <AvatarFallback>
                      <UserRound className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-buddy-gray-200 flex items-center justify-center">
                    <UserRound className="h-12 w-12 text-buddy-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {avatarOptions.map((avatar) => (
                  <Card 
                    key={avatar.id} 
                    className={`cursor-pointer hover:border-buddy-purple transition-all ${
                      selectedAvatar === avatar.url ? 'border-2 border-buddy-purple' : ''
                    }`}
                    onClick={() => handleSelectAvatar(avatar.id, avatar.url)}
                  >
                    <CardContent className="p-3 flex flex-col items-center">
                      <Avatar className="w-16 h-16 mb-2">
                        <AvatarImage src={avatar.url} alt={avatar.label} />
                        <AvatarFallback>{avatar.label[0]}</AvatarFallback>
                      </Avatar>
                      <p className="text-xs font-medium text-center">{avatar.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="upload">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-buddy-gray-300 rounded-lg">
                {profileImage ? (
                  <div className="relative mb-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profileImage} alt="Uploaded Profile" />
                      <AvatarFallback>
                        <UserRound className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-buddy-green text-white p-1 rounded-full">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-buddy-gray-200 flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-buddy-gray-400" />
                  </div>
                )}
                
                <label
                  htmlFor="profilePicture"
                  className="cursor-pointer text-buddy-purple hover:text-buddy-purple-dark font-medium"
                >
                  {profileImage ? "Change photo" : "Upload profile picture"}
                  <input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                
                <p className="text-sm text-buddy-gray-500 mt-2">
                  JPG, PNG or GIF, max 5MB
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="space-y-4">
            <FormLabel>Your Goals</FormLabel>
            <FormDescription>
              Select at least one goal that describes what you want to achieve on this platform
            </FormDescription>
            
            <div className="space-y-3">
              {goalOptions.map((goal) => (
                <div key={goal.id} className="flex items-start space-x-2">
                  <Checkbox 
                    id={goal.id} 
                    onCheckedChange={(checked) => handleGoalChange(checked, goal.id)}
                  />
                  <div className="space-y-1">
                    <label
                      htmlFor={goal.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {goal.label}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {goal.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {form.formState.errors.goals && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.goals.message}
              </p>
            )}
          </div>
          
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio (Optional)</FormLabel>
                <FormDescription>
                  Tell others about yourself and what kinds of activities you enjoy
                </FormDescription>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="I'm passionate about finding new activities and meeting people with similar interests..."
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 mt-6">
            <p className="font-medium text-buddy-gray-800">Profile Checklist</p>
            <div className="space-y-2">
              <div className="flex items-center">
                {completionItems.profilePicture ? (
                  <Check className="h-5 w-5 text-buddy-green mr-2" />
                ) : (
                  <X className="h-5 w-5 text-buddy-gray-400 mr-2" />
                )}
                <span
                  className={`text-sm ${
                    completionItems.profilePicture ? "text-buddy-gray-800" : "text-buddy-gray-500"
                  }`}
                >
                  {profileMethod === "upload" ? "Upload profile picture" : "Choose an avatar"}
                </span>
              </div>
              <div className="flex items-center">
                {completionItems.goals ? (
                  <Check className="h-5 w-5 text-buddy-green mr-2" />
                ) : (
                  <X className="h-5 w-5 text-buddy-gray-400 mr-2" />
                )}
                <span
                  className={`text-sm ${
                    completionItems.goals ? "text-buddy-gray-800" : "text-buddy-gray-500"
                  }`}
                >
                  Select at least one goal
                </span>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={!completionItems.profilePicture || !completionItems.goals}
          >
            Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </Form>
    </OnboardingLayout>
  );
};

export default ProfileCompletion;
