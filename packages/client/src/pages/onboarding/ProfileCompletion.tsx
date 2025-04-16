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
      title="Complete your onboarding"
      description="Let others get to know you better"
      onBack={() => navigate("/onboarding/interests")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="selectedAvatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose your avatar</FormLabel>
                  <FormDescription>
                    Select a 3D avatar that represents you
                  </FormDescription>
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage
                        src={selectedAvatar || avatarOptions[0].url}
                        alt="Selected Avatar"
                      />
                      <AvatarFallback>
                        <UserRound className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">Select Avatar</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {avatarOptions.map((avatar) => (
                          <DropdownMenuItem
                            key={avatar.id}
                            onClick={() =>
                              handleSelectAvatar(avatar.id, avatar.url)
                            }
                          >
                            <Avatar className="w-8 h-8 mr-2">
                              <AvatarImage
                                src={avatar.url}
                                alt={avatar.label}
                              />
                            </Avatar>
                            {avatar.label}
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
                  <FormLabel>Bio (Optional)</FormLabel>
                  <FormDescription>
                    Tell others about yourself and what kinds of activities you
                    enjoy
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
          </div>

          <Button type="submit" className="w-full" size="lg">
            Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </Form>
    </OnboardingLayout>
  );
};

export default ProfileCompletion;
