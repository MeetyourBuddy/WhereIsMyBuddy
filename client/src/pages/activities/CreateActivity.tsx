import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Calendar,
  Globe,
  Target,
  AlertCircle,
  Plus,
  X,
  Tag,
  Shield,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/layout/Container";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { motion } from "framer-motion";

/** Short-lived validation toast so it doesn't cover the Continue button */
const validationToast = (message: string) =>
  toast.error(message, { duration: 3000, position: "top-center" });
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  ActivityType,
  DayOfWeek,
  CheckInType,
  CheckInTypeConfig,
  CheckinFrequencyUnit,
  IActivity,
  IActivityResult,
} from "@/types/activity-types";
import {
  activityCategories,
  mapToBackendCategory,
} from "@/lib/constants/category-interests.constants";
import { useActivityStore } from "@/store/activity.store";
import { ApiResponse } from "@/types";
import { useScrollToTopImmediate } from "@/hooks/use-scroll-to-top";

const STEPS = [
  {
    title: "Basic Information",
    description: "Name your activity and provide details",
    icon: <AlertCircle className="h-5 w-5" />,
  },
  {
    title: "Schedule",
    description: "Set duration and frequency",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    title: "Visibility",
    description: "Choose who can join this activity",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    title: "Goals",
    description: "Define what you want to achieve",
    icon: <Target className="h-5 w-5" />,
  },
  {
    title: "Review & Create",
    description: "Finalize your activity setup",
    icon: <Check className="h-5 w-5" />,
  },
];

// Default activity banner images
const defaultBannerImages = [
  {
    value:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
    label: "Fitness Banner",
    category: "Fitness",
    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
  },
  {
    value:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    label: "Coding Banner",
    category: "Technology",
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
  },
  {
    value:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop",
    label: "Reading Banner",
    category: "Reading",
    src: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop",
  },
  {
    value:
      "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=1200&auto=format&fit=crop",
    label: "Art Banner",
    category: "Arts",
    src: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    value:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop",
    label: "Language Banner",
    category: "Language",
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    value:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
    label: "Meditation Banner",
    category: "Meditation",
    src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
  },
  {
    value:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop",
    label: "Cooking Banner",
    category: "Cooking",
    src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop",
  },
  {
    value:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop",
    label: "Finance Banner",
    category: "Finance",
    src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    value:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
    label: "General Banner",
    category: "Other",
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
  },
];

// Default system rules
const defaultSystemRules = [
  {
    id: "rule-respect",
    title: "Respect & Courtesy",
    description:
      "Treat all participants with respect and courtesy. No harassment or inappropriate behavior will be tolerated.",
    isDefault: true,
  },
  {
    id: "rule-privacy",
    title: "Privacy & Confidentiality",
    description:
      "Respect others' privacy. Do not share personal information or content from this activity without explicit permission.",
    isDefault: true,
  },
  {
    id: "rule-participation",
    title: "Active Participation",
    description:
      "Commit to regular and active participation. If you cannot attend, notify the group in advance.",
    isDefault: true,
  },
];

const defaultGoals = [
  "Complete daily/weekly check-ins",
  "Achieve personal milestones",
  "Support and motivate others",
  "Learn and improve consistently",
  "Build healthy habits",
  "Track progress regularly",
  "Share experiences with the group",
  "Meet activity completion targets",
];

interface FormData {
  name: string;
  description: string;
  category: string;
  visibility: "public" | "private";
  duration: string;
  frequency: "daily" | "weekly" | "monthly";
  daysOfWeek: string[];
  checkinDatesOfMonth: number[];
  startDate: Date;
  goals: string[];
  customGoal: string;
  tags: string[];
  customTag: string;
  rules: {
    id: string;
    title: string;
    description: string;
    isDefault: boolean;
  }[];
  customRule: {
    title: string;
    description: string;
  };
  bannerImage: string;
  useBannerUpload: boolean;
  bannerImageFile: File | null;
  allowedCheckInTypes: CheckInTypeConfig[];
  inviteEmails: string[];
  inviteEmailInput: string;
  maxParticipants: number;
}

interface FormChangeEvent {
  target: {
    name: string;
    value: string | Date | number[] | string[] | boolean;
  };
}

const CreateActivity = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  // Scroll to top on mount and when step changes
  useScrollToTopImmediate([currentStep]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    category: "",
    visibility: "public",
    duration: "1",
    frequency: "weekly",
    daysOfWeek: [],
    checkinDatesOfMonth: [],
    startDate: new Date(),
    goals: [],
    customGoal: "",
    tags: [],
    customTag: "",
    rules: [...defaultSystemRules],
    customRule: {
      title: "",
      description: "",
    },
    bannerImage: "",
    useBannerUpload: false,
    bannerImageFile: null,
    allowedCheckInTypes: [
      {
        type: CheckInType.PHOTO,
        validation: {
          guidelines: "Upload a clear photo of your progress",
          requiredElements: ["timestamp"],
        },
        isEnabled: true,
        description: "Photo check-in",
      },
    ],
    inviteEmails: [],
    inviteEmailInput: "",
    maxParticipants: 1,
  });

  const { createActivity, isLoading } = useActivityStore();

  // Get available tags based on selected category
  const getAvailableTags = () => {
    const selectedCategory = activityCategories.find(
      (cat) => cat.name === formData.category
    );

    return [...(selectedCategory?.interests || [])];
  };

  // Get available banner images based on selected category
  const getAvailableBanners = () => {
    // If no category is selected, return all banners
    if (!formData.category) {
      return defaultBannerImages;
    }

    // Filter banners based on selected category
    return defaultBannerImages.filter(
      (banner) =>
        banner.category.toLowerCase() === formData.category.toLowerCase()
    );
  };

  const handleChange = (e: FormChangeEvent) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFrequencyChange = (value: "daily" | "weekly" | "monthly") => {
    setFormData((prev) => ({
      ...prev,
      frequency: value,
      // Reset check-in related fields based on frequency
      daysOfWeek: value === "weekly" ? prev.daysOfWeek : [],
      checkinDatesOfMonth: value === "monthly" ? prev.checkinDatesOfMonth : [],
    }));
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit(e as React.FormEvent);
    }
  };

  // Add validation function
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Basic Information
        if (!formData.name.trim()) {
          validationToast("Activity name is required");
          return false;
        }
        if (!formData.category) {
          validationToast("Please select a category");
          return false;
        }

        if (!formData.tags.length) {
          validationToast("Please select at least one tag");
          return false;
        }

        if (!formData.description.trim()) {
          validationToast("Please provide a description");
          return false;
        }

        if (!formData.bannerImage) {
          validationToast("Please select a banner image for your activity");
          return false;
        }

        return true;

      case 1: // Schedule
        if (!formData.startDate) {
          validationToast("Start date is required");
          return false;
        }

        if (formData.duration === "0") {
          validationToast("Please select a duration for your activity");
          return false;
        }

        if (formData.maxParticipants === 0) {
          validationToast("Please select a maximum number of participants");
          return false;
        }

        if (
          formData.frequency === "weekly" &&
          formData.daysOfWeek.length === 0
        ) {
          validationToast("Please select at least one day for weekly check-ins");
          return false;
        }
        if (
          formData.frequency === "monthly" &&
          formData.checkinDatesOfMonth.length === 0
        ) {
          validationToast("Please select at least one date for monthly check-ins");
          return false;
        }
        return true;

      case 2: // Visibility
        if (!formData.visibility) {
          validationToast("Please select activity visibility");
          return false;
        }
        return true;

      case 3: // Goals
        if (formData.goals.length === 0) {
          validationToast("Please add at least one goal");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const getCheckinConfig = () => {
    const config = {
      checkinFrequency: 1,
      checkinFrequencyUnit: formData.frequency,
    };

    switch (formData.frequency) {
      case "daily":
        return config;

      case "weekly":
        return {
          ...config,
          checkinFrequency: formData.daysOfWeek.length,
          checkinDays: formData.daysOfWeek,
        };

      case "monthly":
        return {
          ...config,
          checkinFrequency: formData.checkinDatesOfMonth.length || 1,
          checkinDatesOfMonth: formData.checkinDatesOfMonth,
        };

      default:
        throw new Error("Invalid check-in frequency");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    try {
      console.log("Form data category:", formData.category);

      if (!formData.category) {
        toast.error("Please select a category");
        return;
      }

      const checkinConfig = getCheckinConfig();

      const activityData = {
        title: formData.name,
        description: formData.description,
        category: mapToBackendCategory(formData.category),
        type: formData.visibility as ActivityType,
        proposedDuration: parseInt(formData.duration.replace(/\D/g, '') || '1'),
        goals: formData.goals,
        rules: formData.rules.map((rule) => ({
          title: rule.title,
          description: rule.description,
          isDefault: rule.isDefault,
        })),
        tags: formData.tags,
        startDate: formData.startDate,
        ...checkinConfig,
        allowedCheckInTypes: formData.allowedCheckInTypes,
        bannerImage: formData.bannerImage,
        maxParticipants: Number(formData.maxParticipants),
        inviteEmails: formData.inviteEmails,
      };

      console.log("Creating activity with data:", activityData);

      const activity = await createActivity(
        activityData as unknown as IActivity
      );

      console.log("Activity created in the client:", activity);

      if (activity.success) {
        toast.success("Activity created successfully");
        navigate(`/activities/${activity.data._id}`);
      }
    } catch (error: Error | unknown) {
      console.error("Activity creation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create activity"
      );
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate("/activities");
    }
  };

  const toggleDayOfWeek = (day: string) => {
    setFormData((prev) => {
      const days = [...prev.daysOfWeek];
      if (days.includes(day)) {
        return { ...prev, daysOfWeek: days.filter((d) => d !== day) };
      } else {
        return { ...prev, daysOfWeek: [...days, day] };
      }
    });
  };

  const toggleGoal = (goal: string) => {
    setFormData((prev) => {
      const goals = [...prev.goals];
      if (goals.includes(goal)) {
        return { ...prev, goals: goals.filter((g) => g !== goal) };
      } else {
        return { ...prev, goals: [...goals, goal] };
      }
    });
  };

  const toggleTag = (tag: string) => {
    setFormData((prev) => {
      const tags = [...prev.tags];
      // Check if tag exists (case insensitive)
      const tagIndex = tags.findIndex(
        (t) => t.toLowerCase() === tag.toLowerCase()
      );

      if (tagIndex >= 0) {
        // Remove tag if it exists
        return { ...prev, tags: tags.filter((_, i) => i !== tagIndex) };
      } else {
        // Add tag if it doesn't exist
        return { ...prev, tags: [...tags, tag] };
      }
    });
  };

  const handleAddCustomTag = () => {
    const newTag = formData.customTag.trim();
    if (!newTag) return;

    // Check if tag already exists (case insensitive)
    if (
      formData.tags.some((tag) => tag.toLowerCase() === newTag.toLowerCase())
    ) {
      toast.error("This tag already exists");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, newTag],
      customTag: "", // Reset custom tag input
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomTag();
    }
  };

  const addCustomRule = () => {
    if (
      formData.customRule.title.trim() &&
      formData.customRule.description.trim()
    ) {
      const newRule = {
        id: `rule-custom-${Date.now()}`,
        title: formData.customRule.title,
        description: formData.customRule.description,
        isDefault: false,
      };

      setFormData((prev) => ({
        ...prev,
        rules: [...prev.rules, newRule],
        customRule: {
          title: "",
          description: "",
        },
      }));
    }
  };

  const removeCustomRule = (ruleId: string) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter((rule) => rule.id !== ruleId),
    }));
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        bannerImageFile: file,
        useBannerUpload: true,
        bannerImage: "", // Clear selected default banner
      }));
    }
  };

  // Add custom goal handler
  const handleAddCustomGoal = () => {
    if (!formData.customGoal.trim()) {
      toast.error("Please enter a goal");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      goals: [...prev.goals, prev.customGoal.trim()],
      customGoal: "", // Reset custom goal input
    }));
  };

  // Add custom rule handler
  const handleAddCustomRule = () => {
    if (
      !formData.customRule.title.trim() ||
      !formData.customRule.description.trim()
    ) {
      toast.error("Both title and description are required for custom rules");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      rules: [
        ...prev.rules,
        {
          id: `custom-rule-${Date.now()}`, // Generate unique ID
          title: formData.customRule.title.trim(),
          description: formData.customRule.description.trim(),
          isDefault: false,
        },
      ],
      customRule: {
        // Reset custom rule inputs
        title: "",
        description: "",
      },
    }));
  };

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Add invite email handler
  const handleAddInviteEmail = () => {
    const email = formData.inviteEmailInput.trim();
    
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (formData.inviteEmails.includes(email)) {
      toast.error("This email is already in the list");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      inviteEmails: [...prev.inviteEmails, email],
      inviteEmailInput: "",
    }));
  };

  // Remove invite email handler
  const handleRemoveInviteEmail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      inviteEmails: prev.inviteEmails.filter((_, i) => i !== index),
    }));
  };

  // Update the custom rule form fields
  const handleCustomRuleChange = (
    field: "title" | "description",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      customRule: {
        ...prev.customRule,
        [field]: value,
      },
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-gradient-to-br from-buddy-purple/10 to-buddy-blue/10 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-buddy-purple" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-buddy-gray-800 mb-2">
                Basic Information
              </h2>
              <p className="text-sm text-buddy-gray-600">
                Let's start with the basics! Tell us about your activity and
                what makes it special.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <Label
                  htmlFor="activity-name"
                  className="text-buddy-gray-700 font-semibold text-base"
                >
                  Activity Name <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-buddy-gray-500 mt-1 mb-2">
                  Choose a catchy name that will attract participants
                </p>
                <Input
                  id="activity-name"
                  placeholder="E.g., Morning Yoga, Coding Club, Book Reading Group"
                  value={formData.name}
                  onChange={(e) =>
                    handleChange({
                      target: { name: "name", value: e.target.value },
                    })
                  }
                  className="rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12 text-base"
                />
              </div>

              <div>
                <Label
                  htmlFor="category"
                  className="text-buddy-gray-700 font-semibold text-base"
                >
                  Category <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-buddy-gray-500 mt-1 mb-2">
                  What type of activity is this? This helps people find your
                  activity
                </p>
                <Select
                  value={formData.category}
                  onValueChange={(value: string) => {
                    if (!value) return; // Prevent empty selection
                    console.log("Category selected:", value);
                    handleChange({ target: { name: "category", value } });
                  }}
                >
                  <SelectTrigger className="rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-sm border border-buddy-purple/20">
                    {activityCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-buddy-gray-700 font-semibold text-base mb-2 block">
                  Activity Tags <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-buddy-gray-500 mb-3">
                  Select tags to help others discover your activity. The more
                  specific, the better
                </p>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {getAvailableTags().map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        variant={
                          formData.tags.includes(tag) ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => toggleTag(tag)}
                        className={cn(
                          "rounded-full transition-all duration-300 hover:scale-105",
                          formData.tags.includes(tag)
                            ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-lg"
                            : "border-2 border-buddy-gray-300 text-buddy-gray-700 hover:border-buddy-purple hover:bg-buddy-purple/10"
                        )}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Input
                      placeholder="Add a custom tag"
                      value={formData.customTag}
                      onChange={(e) =>
                        handleChange({
                          target: { name: "customTag", value: e.target.value },
                        })
                      }
                      onKeyPress={handleTagKeyPress}
                      className="flex-1 rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12 text-base"
                    />
                    <Button
                      type="button"
                      onClick={handleAddCustomTag}
                      disabled={!formData.customTag.trim()}
                      className="rounded-full bg-gradient-to-r from-buddy-green to-buddy-purple text-white hover:shadow-lg transition-all duration-300 hover:scale-105 h-12 px-6"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Tag
                    </Button>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold mb-2 text-buddy-gray-700">
                        Selected Tags
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {formData.tags.map((tag) => (
                          <div
                            key={tag}
                            className="flex items-center gap-2 bg-gradient-to-r from-buddy-purple/10 to-buddy-blue/10 text-buddy-purple px-4 py-2 rounded-full border border-buddy-purple/20 hover:shadow-md transition-all duration-300"
                          >
                            <span className="font-medium">{tag}</span>
                            <X
                              className="h-4 w-4 cursor-pointer hover:text-red-500 transition-colors"
                              onClick={() => toggleTag(tag)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="description"
                  className="text-buddy-gray-700 font-semibold text-base"
                >
                  Description <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-buddy-gray-500 mt-1 mb-2">
                  Tell people what your activity is about and why they should
                  join
                </p>
                <Textarea
                  id="description"
                  placeholder="Describe what this activity is about, what participants will do, and what makes it special..."
                  value={formData.description}
                  onChange={(e) =>
                    handleChange({
                      target: { name: "description", value: e.target.value },
                    })
                  }
                  className="min-h-32 rounded-2xl border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 text-base"
                />
              </div>

              <div>
                <Label className="text-buddy-gray-700 font-semibold text-base mb-2 block">
                  Activity Banner <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-buddy-gray-500 mb-3">
                  Choose a beautiful banner that represents your activity. This
                  will be the first thing people see
                </p>
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getAvailableBanners().map((banner) => (
                      <div
                        key={banner?.value || `banner-${Math.random()}`}
                        className={cn(
                          "relative border-2 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 aspect-video hover:shadow-lg hover:scale-105",
                          formData.bannerImage === banner?.value &&
                            !formData.useBannerUpload
                            ? "ring-2 ring-buddy-purple border-buddy-purple shadow-lg"
                            : "border-buddy-gray-200/50 hover:border-buddy-purple/50"
                        )}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            bannerImage: banner?.value || "",
                            useBannerUpload: false,
                            bannerImageFile: null,
                          }))
                        }
                      >
                        {banner && (
                          <>
                            <img
                              src={banner.src}
                              alt={banner.label || "Banner image"}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-sm p-3">
                              <p className="font-medium">
                                {banner.label || "Banner"}
                              </p>
                            </div>
                            {formData.bannerImage === banner.value &&
                              !formData.useBannerUpload && (
                                <div className="absolute top-3 right-3 bg-gradient-to-r from-buddy-purple to-buddy-blue rounded-full p-2 shadow-lg">
                                  <Check className="h-5 w-5 text-white" />
                                </div>
                              )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label htmlFor="banner-upload" className="cursor-pointer">
                      <div
                        className={cn(
                          "flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-all duration-300 hover:shadow-lg",
                          formData.useBannerUpload
                            ? "bg-gradient-to-br from-buddy-purple/20 to-buddy-blue/20 border-buddy-purple"
                            : "bg-white/70 border-buddy-gray-300/50 hover:bg-buddy-purple/10 hover:border-buddy-purple/50"
                        )}
                      >
                        {formData.bannerImageFile ? (
                          <div className="space-y-3 text-center">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-buddy-green to-buddy-blue rounded-full flex items-center justify-center">
                              <Check className="h-8 w-8 text-white" />
                            </div>
                            <p className="text-base font-semibold text-buddy-gray-800">
                              {formData.bannerImageFile.name}
                            </p>
                            <p className="text-sm text-buddy-gray-500">
                              {Math.round(formData.bannerImageFile.size / 1024)}{" "}
                              KB
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-buddy-purple/20 to-buddy-blue/20 rounded-full flex items-center justify-center mb-4">
                              <Image className="h-8 w-8 text-buddy-purple" />
                            </div>
                            <p className="text-base font-semibold text-buddy-gray-800 mb-2">
                              Upload a custom banner image
                            </p>
                            <p className="text-sm text-buddy-gray-500">
                              Recommended size: 1200 x 600 pixels
                            </p>
                          </>
                        )}
                      </div>
                    </Label>
                    <Input
                      id="banner-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleBannerImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-gradient-to-br from-buddy-blue/10 to-buddy-green/10 rounded-xl">
                  <Clock className="h-6 w-6 text-buddy-blue" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-buddy-gray-800 mb-2">
                Schedule & Timing
              </h2>
              <p className="text-sm text-buddy-gray-600">
                Set the perfect schedule for your activity. When will it start
                and how often will participants check in?
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-buddy-gray-700 font-semibold text-base">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-buddy-gray-500">
                  When should your activity begin? Choose a date that works for
                  you and your participants
                </p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12 justify-start text-left font-normal",
                        !formData.startDate && "text-buddy-gray-500"
                      )}
                    >
                      <Calendar className="mr-3 h-5 w-5" />
                      {formData.startDate ? (
                        format(formData.startDate, "PPP")
                      ) : (
                        <span>Select a start date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white/95 backdrop-blur-sm border border-buddy-purple/20"
                    align="start"
                  >
                    <CalendarComponent
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => {
                        handleChange({
                          target: { name: "startDate", value: date },
                        });
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-buddy-gray-700 font-semibold text-base">
                    Duration <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-buddy-gray-500">
                    How long should this activity run?
                  </p>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) =>
                      handleChange({ target: { name: "duration", value } })
                    }
                  >
                    <SelectTrigger className="rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-sm border border-buddy-purple/20">
                      <SelectItem value="1month">1 Month</SelectItem>
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="12months">12 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-buddy-gray-700 font-semibold text-base">
                    Max Participants <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-buddy-gray-500">
                    How many people can join?
                  </p>
                  <Input
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "maxParticipants",
                          value: e.target.value,
                        },
                      })
                    }
                    className="rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12 text-base"
                    placeholder="Enter max participants"
                  />
                </div>
              </div>

              <div>
                <Label className="text-buddy-gray-700 font-semibold text-base">
                  Check-in Frequency <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-buddy-gray-500 mb-3">
                  How often should participants check in? This helps keep
                  everyone motivated
                </p>
                <RadioGroup
                  value={formData.frequency}
                  onValueChange={handleFrequencyChange}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {[
                    {
                      value: "daily",
                      label: "Daily",
                      desc: "Every day",
                    },
                    {
                      value: "weekly",
                      label: "Weekly",
                      desc: "Once a week",
                    },
                    {
                      value: "monthly",
                      label: "Monthly",
                      desc: "Once a month",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      htmlFor={`frequency-${option.value}`}
                      className={cn(
                        "flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                        formData.frequency === option.value
                          ? "bg-gradient-to-br from-buddy-purple/20 to-buddy-blue/20 border-buddy-purple shadow-lg"
                          : "bg-white/70 border-buddy-gray-200/50 hover:border-buddy-purple/50 hover:bg-white/90"
                      )}
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`frequency-${option.value}`}
                        className="text-buddy-purple border-2 border-buddy-purple/30 data-[state=checked]:bg-buddy-purple data-[state=checked]:border-buddy-purple"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-buddy-gray-800 text-base">
                          {option.label}
                        </div>
                        <p className="text-sm text-buddy-gray-500 mt-1">
                          {option.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {formData.frequency === "weekly" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <Label className="text-buddy-gray-700 font-semibold text-base mb-2 block">
                      Days of the Week <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-sm text-buddy-gray-500 mb-3">
                      Which days should participants check in? Select all that
                      apply
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                      "sunday",
                    ].map((day) => (
                      <label
                        key={day}
                        htmlFor={`day-${day}`}
                        className={cn(
                          "flex items-center space-x-3 p-3 rounded-2xl border-2 transition-all duration-300 hover:shadow-md cursor-pointer",
                          formData.daysOfWeek.includes(day)
                            ? "bg-gradient-to-br from-buddy-purple/20 to-buddy-blue/20 border-buddy-purple"
                            : "bg-white/70 border-buddy-gray-200/50 hover:border-buddy-purple/50"
                        )}
                      >
                        <Checkbox
                          id={`day-${day}`}
                          checked={formData.daysOfWeek.includes(day)}
                          onCheckedChange={() => toggleDayOfWeek(day)}
                          className="text-buddy-purple border-2 border-buddy-purple/30 data-[state=checked]:bg-buddy-purple data-[state=checked]:border-buddy-purple"
                        />
                        <span className="capitalize w-full font-medium text-buddy-gray-700">
                          {day}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}

              {formData.frequency === "monthly" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <Label className="text-buddy-gray-700 font-semibold text-base mb-2 block">
                      Check-in Dates <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-sm text-buddy-gray-500 mb-3">
                      Which dates of the month should participants check in?
                      Select all that apply
                    </p>
                  </div>
                  <div className="grid grid-cols-7 gap-2 p-6 bg-gradient-to-br from-buddy-purple/5 to-buddy-blue/5 rounded-2xl border border-buddy-purple/20">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                      <label
                        key={date}
                        htmlFor={`date-${date}`}
                        className={cn(
                          "flex items-center justify-center p-3 rounded-2xl transition-all duration-300 hover:shadow-md cursor-pointer",
                          formData.checkinDatesOfMonth.includes(date)
                            ? "bg-gradient-to-br from-buddy-purple to-buddy-blue text-white shadow-lg"
                            : "bg-white/70 hover:bg-white/90 border border-buddy-gray-200/50 hover:border-buddy-purple/50"
                        )}
                      >
                        <Checkbox
                          id={`date-${date}`}
                          checked={formData.checkinDatesOfMonth.includes(date)}
                          onCheckedChange={(checked) => {
                            const newDates = checked
                              ? [...formData.checkinDatesOfMonth, date]
                              : formData.checkinDatesOfMonth.filter(
                                  (d) => d !== date
                                );
                            handleChange({
                              target: {
                                name: "checkinDatesOfMonth",
                                value: newDates,
                              },
                            });
                          }}
                          className="hidden"
                        />
                        <span className="w-full text-center font-medium">
                          {date}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-gradient-to-br from-buddy-green/10 to-buddy-blue/10 rounded-xl">
                  <Globe className="h-6 w-6 text-buddy-green" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-buddy-gray-800 mb-2">
                Activity Visibility
              </h2>
              <p className="text-sm text-buddy-gray-600">
                Who can discover and join your activity? Choose the visibility
                that works best for your goals
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <Label className="text-buddy-gray-700 font-semibold text-base mb-4 block">
                  Activity Visibility
                </Label>
                <RadioGroup
                  value={formData.visibility}
                  onValueChange={(value: "public" | "private") =>
                    handleChange({ target: { name: "visibility", value } })
                  }
                  className="space-y-4"
                >
                  <label
                    htmlFor="visibility-public"
                    className={cn(
                      "flex items-start space-x-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                      formData.visibility === "public"
                        ? "bg-gradient-to-br from-buddy-green/20 to-buddy-blue/20 border-buddy-green shadow-lg"
                        : "bg-white/70 border-buddy-gray-200/50 hover:border-buddy-green/50 hover:bg-white/90"
                    )}
                  >
                    <RadioGroupItem
                      value="public"
                      id="visibility-public"
                      className="mt-1 text-buddy-green border-2 border-buddy-green/30 data-[state=checked]:bg-buddy-green data-[state=checked]:border-buddy-green"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-buddy-gray-800 text-base mb-2">
                        Public Activity
                      </div>
                      <p className="text-buddy-gray-600 leading-relaxed">
                        Anyone can discover and request to join this activity.
                        Great for building a community and finding new
                        participants
                      </p>
                    </div>
                  </label>
                  <label
                    htmlFor="visibility-private"
                    className={cn(
                      "flex items-start space-x-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                      formData.visibility === "private"
                        ? "bg-gradient-to-br from-buddy-purple/20 to-buddy-blue/20 border-buddy-purple shadow-lg"
                        : "bg-white/70 border-buddy-gray-200/50 hover:border-buddy-purple/50 hover:bg-white/90"
                    )}
                  >
                    <RadioGroupItem
                      value="private"
                      id="visibility-private"
                      className="mt-1 text-buddy-purple border-2 border-buddy-purple/30 data-[state=checked]:bg-buddy-purple data-[state=checked]:border-buddy-purple"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-buddy-gray-800 text-base mb-2">
                        Private Activity
                      </div>
                      <p className="text-buddy-gray-600 leading-relaxed">
                        Only people you invite will be able to join this
                        activity. Perfect for close-knit groups and personal
                        projects
                      </p>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              {formData.visibility === "private" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <Label
                      htmlFor="invite-emails"
                      className="text-buddy-gray-700 font-semibold text-base"
                    >
                      Invite People (Optional)
                    </Label>
                    <p className="text-sm text-buddy-gray-500 mt-1 mb-2">
                      Want to invite specific people right away? Enter their
                      email addresses below. These emails will be saved and used to send invitations.
                    </p>
                    <div className="flex gap-3">
                      <Input
                        id="invite-emails"
                        type="email"
                        placeholder="Enter email address (e.g., john@example.com)"
                        value={formData.inviteEmailInput}
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: "inviteEmailInput",
                              value: e.target.value,
                            },
                          })
                        }
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddInviteEmail();
                          }
                        }}
                        className="flex-1 rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12 text-base"
                      />
                      <Button
                        type="button"
                        onClick={handleAddInviteEmail}
                        disabled={!formData.inviteEmailInput.trim() || !isValidEmail(formData.inviteEmailInput.trim())}
                        className="rounded-full bg-gradient-to-r from-buddy-green to-buddy-purple text-white hover:shadow-lg transition-all duration-300 hover:scale-105 h-12 px-6"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add
                      </Button>
                    </div>
                    {formData.inviteEmails.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold mb-2 text-buddy-gray-700">
                          Invited Emails ({formData.inviteEmails.length})
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {formData.inviteEmails.map((email, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 bg-gradient-to-r from-buddy-purple/10 to-buddy-blue/10 text-buddy-purple px-4 py-2 rounded-full border border-buddy-purple/20 hover:shadow-md transition-all duration-300"
                            >
                              <span className="font-medium text-sm">{email}</span>
                              <X
                                className="h-4 w-4 cursor-pointer hover:text-red-500 transition-colors"
                                onClick={() => handleRemoveInviteEmail(index)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-sm text-buddy-gray-500 mt-2">
                      💡 You can also invite people after creating the activity
                    </p>
                  </div>
                </motion.div>
              )}

              <div>
                <Label className="text-buddy-gray-700 font-semibold text-base mb-2 block">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-buddy-blue" />
                    Activity Rules
                  </div>
                </Label>
                <p className="text-sm text-buddy-gray-500 mb-4">
                  All activities include these default rules to ensure a
                  positive experience for everyone
                </p>

                <div className="space-y-4 mb-6">
                  {formData.rules
                    .filter((rule) => rule.isDefault)
                    .map((rule, index) => (
                      <div
                        key={rule.id}
                        className="bg-gradient-to-br from-buddy-gray-50 to-buddy-gray-100 p-6 rounded-2xl border-2 border-buddy-gray-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-buddy-blue/20 to-buddy-purple/20 text-buddy-blue font-bold text-sm shrink-0">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-buddy-gray-800 text-lg">
                              {rule.title}
                            </h4>
                            <p className="text-buddy-gray-600 mt-2 leading-relaxed">
                              {rule.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {formData.rules.filter((rule) => !rule.isDefault).length >
                  0 && (
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-buddy-gray-700 text-lg">
                      Your Custom Rules
                    </h4>
                    {formData.rules
                      .filter((rule) => !rule.isDefault)
                      .map((rule, index) => (
                        <div
                          key={rule.id}
                          className="bg-white/80 p-6 rounded-2xl border-2 border-buddy-purple/20 relative group hover:shadow-md transition-all duration-300"
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-3 right-3 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 text-buddy-gray-500 hover:text-red-500 rounded-full"
                            onClick={() => removeCustomRule(rule.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="flex items-start gap-4 pr-8">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-buddy-purple/20 to-buddy-blue/20 text-buddy-purple font-bold text-sm shrink-0">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-buddy-gray-800 text-lg">
                                {rule.title}
                              </h4>
                              <p className="text-buddy-gray-600 mt-2 leading-relaxed">
                                {rule.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                <div className="bg-gradient-to-br from-buddy-purple/10 to-buddy-blue/10 p-6 rounded-2xl border-2 border-buddy-purple/20 space-y-4">
                  <h4 className="font-semibold text-buddy-gray-700 text-lg">
                    Add Custom Rule
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="rule-title"
                        className="text-buddy-gray-700 font-medium text-base"
                      >
                        Rule Title
                      </Label>
                      <Input
                        id="rule-title"
                        placeholder="E.g., Be on time"
                        value={formData.customRule.title}
                        onChange={(e) =>
                          handleCustomRuleChange("title", e.target.value)
                        }
                        className="mt-2 rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12 text-base"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="rule-description"
                        className="text-buddy-gray-700 font-medium text-base"
                      >
                        Rule Description
                      </Label>
                      <Textarea
                        id="rule-description"
                        placeholder="E.g., Please arrive 5 minutes before the scheduled time"
                        value={formData.customRule.description}
                        onChange={(e) =>
                          handleCustomRuleChange("description", e.target.value)
                        }
                        className="mt-2 min-h-24 rounded-2xl border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 text-base"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={addCustomRule}
                      disabled={
                        !formData.customRule.title.trim() ||
                        !formData.customRule.description.trim()
                      }
                      className="w-full rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white hover:shadow-lg transition-all duration-300 hover:scale-105 h-12 text-base font-semibold"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Rule
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-gradient-to-br from-buddy-green/10 to-buddy-purple/10 rounded-xl">
                  <Target className="h-6 w-6 text-buddy-green" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-buddy-gray-800 mb-2">
                Activity Goals
              </h2>
              <p className="text-sm text-buddy-gray-600">
                What do you want to achieve with this activity? Set clear goals
                to keep everyone motivated and focused
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <Label className="text-buddy-gray-700 font-semibold text-base mb-2 block">
                  Activity Goals <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-buddy-gray-500 mb-4">
                  Select goals that align with your activity or add custom ones
                  that are specific to your needs
                </p>

                <div className="space-y-4">
                  {defaultGoals.map((goal) => (
                    <label
                      key={goal}
                      htmlFor={`goal-${goal}`}
                      className={cn(
                        "flex items-start space-x-4 p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-md cursor-pointer",
                        formData.goals.includes(goal)
                          ? "bg-gradient-to-br from-buddy-purple/20 to-buddy-blue/20 border-buddy-purple"
                          : "bg-white/70 border-buddy-gray-200/50 hover:border-buddy-purple/50 hover:bg-white/90"
                      )}
                    >
                      <Checkbox
                        id={`goal-${goal}`}
                        checked={formData.goals.includes(goal)}
                        onCheckedChange={() => toggleGoal(goal)}
                        className="mt-1 text-buddy-purple border-2 border-buddy-purple/30 data-[state=checked]:bg-buddy-purple data-[state=checked]:border-buddy-purple"
                      />
                      <span className="font-medium text-buddy-gray-700 leading-relaxed flex-1">
                        {goal}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="custom-goal"
                  className="text-buddy-gray-700 font-semibold text-base"
                >
                  Add Custom Goal
                </Label>
                <p className="text-sm text-buddy-gray-500 mt-1 mb-2">
                  Have a specific goal in mind? Add it here to make your
                  activity even more personalized
                </p>
                <div className="flex gap-3">
                  <Input
                    id="custom-goal"
                    placeholder="E.g., Meditate for 10 minutes daily"
                    value={formData.customGoal}
                    onChange={(e) =>
                      handleChange({
                        target: { name: "customGoal", value: e.target.value },
                      })
                    }
                    className="flex-1 rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12 text-base"
                  />
                  <Button
                    type="button"
                    onClick={handleAddCustomGoal}
                    disabled={!formData.customGoal.trim()}
                    className="rounded-full bg-gradient-to-r from-buddy-green to-buddy-purple text-white hover:shadow-lg transition-all duration-300 hover:scale-105 h-12 px-6"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Goal
                  </Button>
                </div>
              </div>

              {formData.goals.length > 0 && (
                <motion.div
                  className="bg-gradient-to-br from-buddy-purple/10 to-buddy-blue/10 p-6 rounded-2xl border-2 border-buddy-purple/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Label className="text-buddy-gray-700 font-semibold mb-3 block text-lg">
                    Selected Goals
                  </Label>
                  <div className="space-y-3">
                    {formData.goals.map((goal, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white/80 p-4 rounded-2xl border border-buddy-purple/20 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-buddy-purple to-buddy-blue flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="text-buddy-gray-700 font-medium">
                            {goal}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-50 text-buddy-gray-500 hover:text-red-500 rounded-full transition-colors"
                          onClick={() => toggleGoal(goal)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-buddy-green to-buddy-blue rounded-full flex items-center justify-center shadow-2xl">
                  <Check className="h-10 w-10 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-buddy-gray-800 mb-2">
                Almost There!
              </h2>
              <p className="text-base text-buddy-gray-600 max-w-2xl mx-auto">
                Review your activity details below. Everything looks perfect?
                Let's create your amazing activity and start building your
                community
              </p>
            </div>

            <div className="bg-gradient-to-br from-white/90 to-buddy-purple/5 backdrop-blur-sm rounded-2xl p-6 space-y-5 border-2 border-white/20 shadow-2xl">
              {/* Banner preview if selected */}
              {(formData.bannerImage || formData.bannerImageFile) && (
                <div className="w-full rounded-2xl overflow-hidden h-48 mb-6 shadow-lg">
                  {formData.useBannerUpload && formData.bannerImageFile ? (
                    <div className="w-full h-full bg-gradient-to-br from-buddy-gray-100 to-buddy-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-buddy-green to-buddy-blue rounded-full flex items-center justify-center mx-auto mb-3">
                          <Check className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-buddy-gray-600 font-medium">
                          Custom banner selected
                        </p>
                      </div>
                    </div>
                  ) : formData.bannerImage ? (
                    <img
                      src={
                        defaultBannerImages.find(
                          (b) => b.value === formData.bannerImage
                        )?.src || "/placeholder.svg"
                      }
                      alt="Activity banner"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-buddy-blue/20 to-buddy-blue/10 p-4 rounded-2xl border border-buddy-blue/20">
                  <p className="text-sm text-buddy-gray-500 font-medium mb-2">
                    Activity Name
                  </p>
                  <p className="font-semibold text-buddy-gray-800 text-lg">
                    {formData.name}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-buddy-purple/20 to-buddy-purple/10 p-4 rounded-2xl border border-buddy-purple/20">
                  <p className="text-sm text-buddy-gray-500 font-medium mb-2">
                    Category
                  </p>
                  <p className="font-semibold text-buddy-gray-800 text-lg capitalize">
                    {formData.category}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-buddy-green/20 to-buddy-green/10 p-4 rounded-2xl border border-buddy-green/20">
                  <p className="text-sm text-buddy-gray-500 font-medium mb-2">
                    Visibility
                  </p>
                  <p className="font-semibold text-buddy-gray-800 text-lg capitalize">
                    {formData.visibility}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-buddy-yellow/20 to-buddy-yellow/10 p-4 rounded-2xl border border-buddy-yellow/20">
                  <p className="text-sm text-buddy-gray-500 font-medium mb-2">
                    Start Date
                  </p>
                  <p className="font-semibold text-buddy-gray-800 text-lg">
                    {formData.startDate
                      ? format(formData.startDate, "PPP")
                      : "Not specified"}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-buddy-green/20 to-buddy-green/10 p-4 rounded-2xl border border-buddy-green/20">
                  <p className="text-sm text-buddy-gray-500 font-medium mb-2">
                    Duration
                  </p>
                  <p className="font-semibold text-buddy-gray-800 text-lg capitalize">
                    {formData.duration.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-buddy-pink/20 to-buddy-pink/10 p-4 rounded-2xl border border-buddy-pink/20">
                  <p className="text-sm text-buddy-gray-500 font-medium mb-2">
                    Frequency
                  </p>
                  <p className="font-semibold text-buddy-gray-800 text-lg capitalize">
                    {formData.frequency}
                  </p>
                </div>
              </div>

              {formData.tags.length > 0 && (
                <div className="bg-gradient-to-br from-buddy-purple/10 to-buddy-blue/10 p-6 rounded-2xl border border-buddy-purple/20">
                  <p className="text-sm text-buddy-gray-500 font-medium mb-4">
                    Activity Tags
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-buddy-purple/20 to-buddy-blue/20 text-buddy-purple text-sm rounded-full px-4 py-2 flex items-center border border-buddy-purple/20"
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {formData.goals.length > 0 && (
                <div className="bg-gradient-to-br from-buddy-green/10 to-buddy-blue/10 p-6 rounded-2xl border border-buddy-green/20">
                  <p className="text-sm text-buddy-gray-500 font-medium mb-4">
                    Activity Goals
                  </p>
                  <div className="space-y-2">
                    {formData.goals.map((goal, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-buddy-green to-buddy-blue flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="text-buddy-gray-700 font-medium">
                          {goal}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.rules.length > defaultSystemRules.length && (
                <div className="bg-gradient-to-br from-buddy-blue/10 to-buddy-purple/10 p-6 rounded-2xl border border-buddy-blue/20">
                  <p className="text-sm text-buddy-gray-500 font-medium mb-4">
                    Custom Rules
                  </p>
                  <div className="space-y-2">
                    {formData.rules
                      .filter((rule) => !rule.isDefault)
                      .map((rule, index) => (
                        <div key={rule.id} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-buddy-blue to-buddy-purple flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="text-buddy-gray-700 font-medium">
                            {rule.title}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {formData.description && (
                <div className="bg-gradient-to-br from-buddy-gray-50 to-buddy-gray-100 p-6 rounded-2xl border border-buddy-gray-200">
                  <p className="text-sm text-buddy-gray-500 font-medium mb-3">
                    Description
                  </p>
                  <p className="text-buddy-gray-800 leading-relaxed">
                    {formData.description}
                  </p>
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-base text-buddy-gray-600 leading-relaxed">
                Ready to start your activity? Click "Create Activity" below to
                launch it and invite your buddies to join the fun!
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Container className="py-6 bg-gradient-to-br from-buddy-purple/5 via-white to-buddy-blue/5 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent mb-2">
            Create Your Activity
          </h1>
          <p className="text-base text-buddy-gray-600 max-w-2xl mx-auto">
            Let's build something amazing together! Follow these simple steps to
            create an activity that will inspire and motivate your buddies.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Vertical Stepper */}
          <div className="md:w-1/3 lg:w-1/4">
            <Card
              variant="glass"
              className="sticky top-20 bg-gradient-to-br from-white/95 to-buddy-purple/10 backdrop-blur-sm border-2 border-white/20 shadow-2xl"
            >
              <Card.Content className="p-0">
                <div className="p-3">
                  <h3 className="text-base font-semibold text-buddy-gray-800 mb-3 text-center">
                    Progress
                  </h3>
                  <div className="space-y-2">
                    {STEPS.map((step, index) => (
                      <div
                        key={index}
                        className={cn(
                          "relative",
                          index !== STEPS.length - 1 &&
                            "after:content-[''] after:absolute after:left-[24px] after:top-[48px] after:w-0.5 after:h-[calc(100%-8px)] after:bg-gradient-to-b from-buddy-purple/30 to-buddy-blue/30"
                        )}
                      >
                        <div
                          className={cn(
                            "flex items-start px-3 py-3 relative z-10 rounded-xl transition-all duration-300 cursor-pointer group",
                            index === currentStep
                              ? "bg-gradient-to-br from-buddy-purple/20 to-buddy-blue/20 border-2 border-buddy-purple/30 shadow-lg"
                              : index < currentStep
                                ? "bg-gradient-to-br from-buddy-green/10 to-buddy-blue/10 hover:from-buddy-green/20 hover:to-buddy-blue/20"
                                : "bg-white/50 hover:bg-white/80 border border-buddy-gray-200/50 hover:border-buddy-purple/30"
                          )}
                          onClick={() => {
                            // Allow navigation to previous steps but not ahead
                            if (index <= currentStep) {
                              setCurrentStep(index);
                            }
                          }}
                        >
                          <div
                            className={cn(
                              "flex items-center justify-center rounded-full w-10 h-10 shrink-0 transition-all duration-300 shadow-lg",
                              index === currentStep
                                ? "bg-gradient-to-br from-buddy-purple to-buddy-blue text-white shadow-xl shadow-buddy-purple/30"
                                : index < currentStep
                                  ? "bg-gradient-to-br from-buddy-green to-buddy-blue text-white"
                                  : "bg-buddy-gray-100 text-buddy-gray-500 group-hover:bg-buddy-purple/20 group-hover:text-buddy-purple"
                            )}
                          >
                            {index < currentStep ? (
                              <Check className="h-5 w-5" />
                            ) : (
                              <div className="scale-90">{step.icon}</div>
                            )}
                          </div>

                          <div className="ml-3">
                            <p
                              className={cn(
                                "font-semibold transition-colors text-sm",
                                index <= currentStep
                                  ? "text-buddy-gray-800"
                                  : "text-buddy-gray-500"
                              )}
                            >
                              {step.title}
                            </p>
                            <p className="text-xs text-buddy-gray-500 mt-0.5 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Form Content */}
          <div className="md:w-2/3 lg:w-3/4">
            <Card className="bg-gradient-to-br from-white/95 to-buddy-purple/5 backdrop-blur-sm border-2 border-white/20 shadow-2xl">
              <Card.Content className="p-6">
                <form onSubmit={(e) => e.preventDefault()}>
                  {renderStepContent()}

                  <div className="h-px bg-gradient-to-r from-transparent via-buddy-gray-200 to-transparent my-6"></div>

                  <div className="flex justify-between gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="rounded-full border-2 border-buddy-gray-300 text-buddy-gray-700 hover:bg-buddy-gray-50 hover:border-buddy-gray-400 transition-all duration-300 h-10 px-6 text-sm font-medium"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {currentStep === 0 ? "Cancel" : "Back"}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleContinue}
                      disabled={isLoading}
                      className="rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white hover:shadow-lg transition-all duration-300 hover:scale-105 h-10 px-6 text-sm font-semibold"
                    >
                      {isLoading && currentStep === STEPS.length - 1
                        ? "Creating..."
                        : currentStep === STEPS.length - 1
                          ? "Create Activity"
                          : "Continue"}
                      {currentStep !== STEPS.length - 1 && (
                        <ArrowRight className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </div>
                </form>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CreateActivity;
