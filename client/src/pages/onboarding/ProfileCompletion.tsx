import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowRight,
  Upload,
  Check,
  X,
  UserRound,
  Sparkles,
  Camera,
  Palette,
  Star,
} from "lucide-react";
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

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOnboardingStore } from "@/store/onboarding.store";

// Keep only the avatar options
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

import { useScrollToTopImmediate } from "@/hooks/use-scroll-to-top";

const formSchema = z.object({
  selectedAvatar: z.string({ required_error: "Please select an avatar" }),
  bio: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const ProfileCompletion = () => {
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const { completeOnboarding } = useOnboardingStore();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: "",
    },
  });

  const userBasicInfo = localStorage.getItem("userBasicInfo");
  const userInterests = localStorage.getItem("userInterests");
  const userCategories = localStorage.getItem("userCategories");

  const onSubmit = async (data: FormData) => {
    if (!selectedAvatar) {
      toast.error("Please select an avatar");
      return;
    }

    const updatedData = {
      interestsCategories: JSON.parse(userInterests),
      interestsCommodities: JSON.parse(userCategories),
      ...JSON.parse(userBasicInfo),
      avatar: selectedAvatar,
      bio: data.bio,
    };

    await completeOnboarding(updatedData);
    toast.success("Profile setup complete! Welcome aboard.");
    navigate("/dashboard");
  };

  const handleSelectAvatar = (avatarId: string, avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    form.setValue("selectedAvatar", avatarId);
  };

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={3}
      title="Let's finish your amazing profile! 🎨"
      description="Add the final touches to make your profile shine and attract awesome buddies"
      onBack={() => navigate("/onboarding/interests")}
    >
      <div className="space-y-6">
        {/* Progress indicator */}
        <div className="bg-gradient-to-r from-buddy-orange/10 to-buddy-purple/10 p-4 rounded-2xl border border-buddy-orange/20">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-buddy-orange to-buddy-orange/80 rounded-full p-2">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-buddy-gray-900">
                Step 3: Profile Completion
              </p>
              <p className="text-sm text-buddy-gray-600">
                Add your personal touch to complete your profile
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="selectedAvatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-buddy-gray-900 font-semibold flex items-center space-x-2">
                      <Camera className="h-4 w-4 text-buddy-purple" />
                      <span>Choose your perfect avatar</span>
                    </FormLabel>
                    <FormDescription className="text-buddy-gray-600">
                      🎭 Pick an avatar that represents your personality and
                      style
                    </FormDescription>
                    <div className="flex flex-col items-center space-y-6">
                      <div className="relative">
                        <Avatar className="w-32 h-32 ring-4 ring-buddy-purple/20 shadow-lg">
                          <AvatarImage
                            src={selectedAvatar || avatarOptions[0].url}
                            alt="Selected Avatar"
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gradient-to-br from-buddy-purple to-buddy-orange text-white text-2xl font-bold">
                            <UserRound className="h-16 w-16" />
                          </AvatarFallback>
                        </Avatar>
                        {selectedAvatar && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-buddy-green rounded-full flex items-center justify-center">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="rounded-full border-2 border-buddy-purple/20 hover:border-buddy-purple transition-colors px-6 py-3"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Select Avatar
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-2xl border-2 border-buddy-purple/20 p-2">
                          {avatarOptions.map((avatar) => (
                            <DropdownMenuItem
                              key={avatar.id}
                              onClick={() =>
                                handleSelectAvatar(avatar.id, avatar.url)
                              }
                              className="rounded-xl p-3 hover:bg-buddy-purple/10"
                            >
                              <Avatar className="w-10 h-10 mr-3 ring-2 ring-buddy-purple/20">
                                <AvatarImage
                                  src={avatar.url}
                                  alt={avatar.label}
                                  className="object-cover"
                                />
                                <AvatarFallback className="bg-buddy-purple text-white text-sm">
                                  {avatar.label.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-buddy-gray-900">
                                  {avatar.label}
                                </p>
                                <p className="text-xs text-buddy-gray-500">
                                  3D Avatar
                                </p>
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-buddy-gray-900 font-semibold flex items-center space-x-2">
                      <Star className="h-4 w-4 text-buddy-orange" />
                      <span>Tell your story (Optional)</span>
                    </FormLabel>
                    <FormDescription className="text-buddy-gray-600">
                      ✨ Share what makes you unique and what activities you
                      love
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Hi! I'm passionate about exploring new activities and meeting amazing people. I love hiking, photography, and trying new cuisines. Looking forward to creating unforgettable memories with awesome buddies! 🌟"
                        className="min-h-[120px] rounded-2xl border-2 border-buddy-orange/20 focus:border-buddy-orange transition-colors resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-6 space-y-4">
              <div className="bg-gradient-to-r from-buddy-green/10 to-buddy-blue/10 p-6 rounded-2xl border border-buddy-green/20">
                <div className="text-center space-y-3">
                  <h3 className="font-bold text-lg text-buddy-gray-900">
                    You're Almost There!
                  </h3>
                  <p className="text-sm text-buddy-gray-600">
                    Your amazing profile is ready to help you find incredible
                    buddies and create unforgettable experiences!
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-buddy-purple to-buddy-orange hover:from-buddy-purple/90 hover:to-buddy-orange/90 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                size="lg"
              >
                Complete My Profile & Start Exploring!{" "}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </OnboardingLayout>
  );
};

export default ProfileCompletion;
