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
} from "@/types/activity-types";
import {
  activityCategories,
  mapToBackendCategory,
} from "@/lib/constants/category-interests.constants";
import { useActivityStore } from "@/store/activity.store";

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

// const activityCategories = [
//   { value: "fitness", label: "Fitness & Exercise" },
//   { value: "coding", label: "Coding & Technology" },
//   { value: "reading", label: "Reading & Learning" },
//   { value: "art", label: "Art & Creativity" },
//   { value: "language", label: "Language Learning" },
//   { value: "meditation", label: "Meditation & Mindfulness" },
//   { value: "cooking", label: "Cooking & Nutrition" },
//   { value: "finance", label: "Finance & Investing" },
//   { value: "other", label: "Other" },
// ];

interface CategoryOption {
  label: string;
  value: string;
}

const activityTags = [
  // Fitness & Exercise related tags
  { value: "cardio", label: "Cardio", category: "Fitness" },
  { value: "strength", label: "Strength Training", category: "Fitness" },
  { value: "yoga", label: "Yoga", category: "Fitness" },
  { value: "running", label: "Running", category: "Fitness" },
  { value: "cycling", label: "Cycling", category: "Fitness" },
  { value: "hiit", label: "HIIT", category: "Fitness" },

  // Coding & Technology related tags
  { value: "webdev", label: "Web Development", category: "Technology" },
  { value: "mobile", label: "Mobile Development", category: "Technology" },
  { value: "data", label: "Data Science", category: "Technology" },
  { value: "ai", label: "AI & Machine Learning", category: "Technology" },
  { value: "devops", label: "DevOps", category: "Technology" },

  // Reading & Learning related tags
  { value: "fiction", label: "Fiction", category: "Reading" },
  { value: "nonfiction", label: "Non-Fiction", category: "Reading" },
  { value: "biography", label: "Biography", category: "Reading" },
  { value: "selfhelp", label: "Self-Help", category: "Reading" },
  { value: "research", label: "Research", category: "Reading" },

  // Art & Creativity related tags
  { value: "drawing", label: "Drawing", category: "Art" },
  { value: "painting", label: "Painting", category: "Art" },
  { value: "crafts", label: "Crafts", category: "Art" },
  { value: "music", label: "Music", category: "Art" },
  { value: "writing", label: "Writing", category: "Art" },

  // Language Learning related tags
  { value: "beginner", label: "Beginner", category: "Language" },
  { value: "intermediate", label: "Intermediate", category: "Language" },
  { value: "advanced", label: "Advanced", category: "Language" },
  {
    value: "conversation",
    label: "Conversation Practice",
    category: "Language",
  },
  { value: "grammar", label: "Grammar Focus", category: "Language" },

  // Meditation & Mindfulness related tags
  { value: "breathing", label: "Breathing Techniques", category: "Meditation" },
  { value: "guided", label: "Guided Meditation", category: "Meditation" },
  { value: "mindfulness", label: "Mindfulness", category: "Meditation" },
  { value: "relaxation", label: "Relaxation", category: "Meditation" },

  // Cooking & Nutrition related tags
  { value: "vegan", label: "Vegan", category: "Cooking" },
  { value: "vegetarian", label: "Vegetarian", category: "Cooking" },
  { value: "baking", label: "Baking", category: "Cooking" },
  { value: "mealprep", label: "Meal Prep", category: "Cooking" },
  { value: "healthy", label: "Healthy Eating", category: "cooking" },

  // Finance & Investing related tags
  { value: "budgeting", label: "Budgeting", category: "Finance" },
  { value: "investing", label: "Investing", category: "Finance" },
  { value: "stocks", label: "Stocks", category: "Finance" },
  { value: "crypto", label: "Cryptocurrency", category: "Finance" },
  { value: "saving", label: "Saving", category: "Finance" },

  // General tags
  { value: "beginner", label: "Beginner-Friendly", category: "General" },
  { value: "challenge", label: "Challenge", category: "General" },
  { value: "social", label: "Social", category: "General" },
  { value: "solo", label: "Solo", category: "General" },
  { value: "community", label: "Community", category: "General" },
  { value: "accountability", label: "Accountability", category: "general" },
];

// Default activity banner images
const defaultBannerImages = [
  {
    value: "fitness-banner",
    label: "Fitness Banner",
    category: "Fitness",
    src: "/placeholder.svg",
  },
  {
    value: "coding-banner",
    label: "Coding Banner",
    category: "Technology",
    src: "/placeholder.svg",
  },
  {
    value: "reading-banner",
    label: "Reading Banner",
    category: "Reading",
    src: "/placeholder.svg",
  },
  {
    value: "art-banner",
    label: "Art Banner",
    category: "Art",
    src: "/placeholder.svg",
  },
  {
    value: "language-banner",
    label: "Language Banner",
    category: "Language",
    src: "/placeholder.svg",
  },
  {
    value: "meditation-banner",
    label: "Meditation Banner",
    category: "Meditation",
    src: "/placeholder.svg",
  },
  {
    value: "cooking-banner",
    label: "Cooking Banner",
    category: "Cooking",
    src: "/placeholder.svg",
  },
  {
    value: "finance-banner",
    label: "Finance Banner",
    category: "Finance",
    src: "/placeholder.svg",
  },
  {
    value: "general-banner",
    label: "General Banner",
    category: "Other",
    src: "/placeholder.svg",
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
  inviteEmails: string;
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
    inviteEmails: "",
  });

  const { createActivity, isLoading } = useActivityStore();

  // Get available tags based on selected category
  const getAvailableTags = () => {
    if (!formData.category) {
      return activityTags.filter((tag) => tag.category === "general");
    }

    return [
      ...activityTags.filter((tag) => tag.category === formData.category),
      ...activityTags.filter((tag) => tag.category === "general"),
    ];
  };

  // Get available banner images based on selected category
  const getAvailableBanners = () => {
    // Make sure this function always returns an array, even if empty
    return [
      { value: "Yoga", label: "Yoga", src: "/images/banners/yoga.jpg" },
      {
        value: "Technology",
        label: "Technology",
        src: "/images/banners/coding.jpg",
      },
      {
        value: "Reading",
        label: "Reading",
        src: "/images/banners/reading.jpg",
      },
      {
        value: "Fitness",
        label: "Fitness",
        src: "/images/banners/fitness.jpg",
      },
      {
        value: "Meditation",
        label: "Meditation",
        src: "/images/banners/meditation.jpg",
      },
      {
        value: "Cooking",
        label: "Cooking",
        src: "/images/banners/cooking.jpg",
      },
    ];
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
          toast.error("Activity name is required");
          return false;
        }
        if (!formData.category) {
          toast.error("Please select a category");
          return false;
        }
        return true;

      case 1: // Schedule
        if (!formData.startDate) {
          toast.error("Start date is required");
          return false;
        }
        if (
          formData.frequency === "weekly" &&
          formData.daysOfWeek.length === 0
        ) {
          toast.error("Please select at least one day for weekly check-ins");
          return false;
        }
        if (
          formData.frequency === "monthly" &&
          formData.checkinDatesOfMonth.length === 0
        ) {
          toast.error("Please select at least one date for monthly check-ins");
          return false;
        }
        return true;

      case 2: // Visibility
        if (!formData.visibility) {
          toast.error("Please select activity visibility");
          return false;
        }
        return true;

      case 3: // Goals
        if (formData.goals.length === 0) {
          toast.error("Please add at least one goal");
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
        proposedDuration: parseInt(formData.duration),
        goals: formData.goals,
        rules: formData.rules.map((rule) => ({
          title: rule.title,
          description: rule.description,
          isDefault: rule.isDefault,
        })),
        startDate: formData.startDate,
        ...checkinConfig,
        allowedCheckInTypes: formData.allowedCheckInTypes,
      };

      console.log("Creating activity with data:", activityData);

      const activity = await createActivity(
        activityData as unknown as IActivity
      );

      if (activity) {
        toast.success("Activity created successfully");
        navigate("/activities");
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
            <div>
              <Label
                htmlFor="activity-name"
                className="text-buddy-gray-700 font-medium"
              >
                Activity Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="activity-name"
                placeholder="E.g., Morning Yoga, Coding Club, Book Reading Group"
                value={formData.name}
                onChange={(e) =>
                  handleChange({
                    target: { name: "name", value: e.target.value },
                  })
                }
                className="mt-1 bg-white/70 border-pastel-purple/30 focus-visible:ring-buddy-purple-light transition-all duration-200"
              />
            </div>

            <div>
              <Label
                htmlFor="category"
                className="text-buddy-gray-700 font-medium"
              >
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value: string) => {
                  if (!value) return; // Prevent empty selection
                  console.log("Category selected:", value);
                  handleChange({ target: { name: "category", value } });
                }}
              >
                <SelectTrigger className="mt-1 bg-white/70 border-pastel-purple/30 focus:ring-buddy-purple-light transition-all duration-200">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-sm border-pastel-purple/30">
                  {activityCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-buddy-gray-700 font-medium mb-2 block">
                Activity Tags
              </Label>
              <p className="text-sm text-buddy-gray-500 mb-4">
                Select tags to help others discover your activity
              </p>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {getAvailableTags().map((tag) => (
                    <Button
                      key={tag.value}
                      type="button"
                      variant={
                        formData.tags.includes(tag.value)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => toggleTag(tag.value)}
                      className="rounded-full"
                    >
                      {tag.label}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom tag"
                    value={formData.customTag}
                    onChange={(e) =>
                      handleChange({
                        target: { name: "customTag", value: e.target.value },
                      })
                    }
                    onKeyPress={handleTagKeyPress}
                  />
                  <Button
                    type="button"
                    onClick={handleAddCustomTag}
                    disabled={!formData.customTag.trim()}
                  >
                    Add
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Selected Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <div
                          key={tag}
                          className="flex items-center gap-1 bg-buddy-purple/10 text-buddy-purple px-3 py-1 rounded-full"
                        >
                          <span>{tag}</span>
                          <X
                            className="h-4 w-4 cursor-pointer hover:text-buddy-purple-dark"
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
                className="text-buddy-gray-700 font-medium"
              >
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what this activity is about..."
                value={formData.description}
                onChange={(e) =>
                  handleChange({
                    target: { name: "description", value: e.target.value },
                  })
                }
                className="mt-1 min-h-24 bg-white/70 border-pastel-purple/30 focus-visible:ring-buddy-purple-light transition-all duration-200"
              />
            </div>

            <div>
              <Label className="text-buddy-gray-700 font-medium mb-2 block">
                Activity Banner
              </Label>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getAvailableBanners().map((banner) => (
                    <div
                      key={banner?.value || `banner-${Math.random()}`}
                      className={cn(
                        "relative border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 aspect-video",
                        formData.bannerImage === banner?.value &&
                          !formData.useBannerUpload
                          ? "ring-2 ring-buddy-purple border-transparent"
                          : "border-pastel-purple/30 hover:border-pastel-purple/60"
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
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2">
                            {banner.label || "Banner"}
                          </div>
                          {formData.bannerImage === banner.value &&
                            !formData.useBannerUpload && (
                              <div className="absolute top-2 right-2 bg-buddy-purple rounded-full p-1">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="banner-upload" className="cursor-pointer">
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-all",
                        formData.useBannerUpload
                          ? "bg-pastel-purple/30 border-buddy-purple"
                          : "bg-white/50 border-pastel-purple/40 hover:bg-pastel-purple/10 hover:border-pastel-purple"
                      )}
                    >
                      {formData.bannerImageFile ? (
                        <div className="space-y-2 text-center">
                          <Check className="mx-auto h-8 w-8 text-buddy-green" />
                          <p className="text-sm font-medium">
                            {formData.bannerImageFile.name}
                          </p>
                          <p className="text-xs text-buddy-gray-500">
                            {Math.round(formData.bannerImageFile.size / 1024)}{" "}
                            KB
                          </p>
                        </div>
                      ) : (
                        <>
                          <Image className="mx-auto h-8 w-8 text-buddy-gray-500 mb-2" />
                          <p className="text-sm font-medium">
                            Upload a custom banner image
                          </p>
                          <p className="text-xs text-buddy-gray-500 mt-1">
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
            <div className="space-y-2">
              <Label className="text-buddy-gray-700 font-medium">
                Start Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full bg-white/70 border-pastel-purple/30 focus:ring-buddy-purple-light transition-all duration-200 justify-start text-left font-normal",
                      !formData.startDate && "text-buddy-gray-500"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      format(formData.startDate, "PPP")
                    ) : (
                      <span>Select a start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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

            <div>
              <Label className="text-buddy-gray-700 font-medium">
                Duration
              </Label>
              <Select
                value={formData.duration}
                onValueChange={(value) =>
                  handleChange({ target: { name: "duration", value } })
                }
              >
                <SelectTrigger className="mt-1 bg-white/70 border-pastel-purple/30">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">1 Month</SelectItem>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="12months">12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-buddy-gray-700 font-medium">
                Frequency
              </Label>
              <RadioGroup
                value={formData.frequency}
                onValueChange={handleFrequencyChange}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
              >
                {[
                  { value: "daily", label: "Daily" },
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2 bg-white/50 p-3 rounded-xl border border-pastel-purple/20 hover:border-pastel-purple/40 hover:bg-white/80 transition-all duration-200"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`frequency-${option.value}`}
                      className="text-buddy-purple"
                    />
                    <Label
                      htmlFor={`frequency-${option.value}`}
                      className="cursor-pointer w-full"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {formData.frequency === "weekly" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <Label className="text-buddy-gray-700 font-medium mb-2 block">
                  Days of the Week
                </Label>
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
                    <div
                      key={day}
                      className={cn(
                        "flex items-center space-x-2 p-2 rounded-lg transition-all duration-200",
                        formData.daysOfWeek.includes(day)
                          ? "bg-pastel-purple text-buddy-gray-800"
                          : "bg-white/50 hover:bg-white/80 border border-pastel-purple/20"
                      )}
                    >
                      <Checkbox
                        id={`day-${day}`}
                        checked={formData.daysOfWeek.includes(day)}
                        onCheckedChange={() => toggleDayOfWeek(day)}
                        className="text-buddy-purple"
                      />
                      <Label
                        htmlFor={`day-${day}`}
                        className="capitalize cursor-pointer w-full"
                      >
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {formData.frequency === "monthly" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <Label className="text-buddy-gray-700 font-medium mb-2 block">
                  Check-in Dates
                </Label>
                <div className="grid grid-cols-7 gap-2 p-4 bg-white/50 rounded-xl border border-pastel-purple/20">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                    <div
                      key={date}
                      className={cn(
                        "flex items-center justify-center p-2 rounded-lg transition-all duration-200",
                        formData.checkinDatesOfMonth.includes(date)
                          ? "bg-pastel-purple text-buddy-gray-800"
                          : "hover:bg-white/80"
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
                      <Label
                        htmlFor={`date-${date}`}
                        className="cursor-pointer w-full text-center"
                      >
                        {date}
                      </Label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
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
            <div>
              <Label className="text-buddy-gray-700 font-medium">
                Activity Visibility
              </Label>
              <RadioGroup
                value={formData.visibility}
                onValueChange={(value: "public" | "private") =>
                  handleChange({ target: { name: "visibility", value } })
                }
                className="space-y-4 mt-3"
              >
                <div className="flex items-start space-x-3 p-4 rounded-xl bg-white/50 border border-pastel-purple/20 hover:border-pastel-purple/40 hover:bg-white/80 transition-all duration-200">
                  <RadioGroupItem
                    value="public"
                    id="visibility-public"
                    className="mt-1 text-buddy-purple"
                  />
                  <div>
                    <Label
                      htmlFor="visibility-public"
                      className="cursor-pointer font-medium text-buddy-gray-800"
                    >
                      Public Activity
                    </Label>
                    <p className="text-sm text-buddy-gray-500 mt-1">
                      Anyone can discover and request to join this activity
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 rounded-xl bg-white/50 border border-pastel-purple/20 hover:border-pastel-purple/40 hover:bg-white/80 transition-all duration-200">
                  <RadioGroupItem
                    value="private"
                    id="visibility-private"
                    className="mt-1 text-buddy-purple"
                  />
                  <div>
                    <Label
                      htmlFor="visibility-private"
                      className="cursor-pointer font-medium text-buddy-gray-800"
                    >
                      Private Activity
                    </Label>
                    <p className="text-sm text-buddy-gray-500 mt-1">
                      Only people you invite will be able to join this activity
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {formData.visibility === "private" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <Label
                  htmlFor="invite-emails"
                  className="text-buddy-gray-700 font-medium"
                >
                  Invite People (Optional)
                </Label>
                <Textarea
                  id="invite-emails"
                  placeholder="Enter email addresses separated by commas"
                  value={formData.inviteEmails}
                  onChange={(e) =>
                    handleChange({
                      target: { name: "inviteEmails", value: e.target.value },
                    })
                  }
                  className="mt-1 min-h-24 bg-white/70 border-pastel-purple/30 focus-visible:ring-buddy-purple-light transition-all duration-200"
                />
                <p className="text-sm text-buddy-gray-500 mt-1">
                  You can also invite people after creating the activity
                </p>
              </motion.div>
            )}

            <div>
              <Label className="text-buddy-gray-700 font-medium mb-2 block">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-buddy-gray-600" />
                  Activity Rules
                </div>
              </Label>
              <p className="text-sm text-buddy-gray-500 mb-4">
                All activities include the following default rules that cannot
                be modified:
              </p>

              <div className="space-y-3 mb-4">
                {formData.rules
                  .filter((rule) => rule.isDefault)
                  .map((rule) => (
                    <div
                      key={rule.id}
                      className="bg-white/50 p-4 rounded-lg border border-pastel-purple/20"
                    >
                      <h4 className="font-medium text-buddy-gray-800">
                        {rule.title}
                      </h4>
                      <p className="text-sm text-buddy-gray-600 mt-1">
                        {rule.description}
                      </p>
                    </div>
                  ))}
              </div>

              {formData.rules.filter((rule) => !rule.isDefault).length > 0 && (
                <div className="space-y-3 mb-4">
                  <h4 className="font-medium text-buddy-gray-700">
                    Custom Rules:
                  </h4>
                  {formData.rules
                    .filter((rule) => !rule.isDefault)
                    .map((rule) => (
                      <div
                        key={rule.id}
                        className="bg-white/70 p-4 rounded-lg border border-pastel-purple/30 relative group"
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeCustomRule(rule.id)}
                        >
                          <X className="h-4 w-4 text-buddy-gray-500" />
                        </Button>
                        <h4 className="font-medium text-buddy-gray-800 pr-6">
                          {rule.title}
                        </h4>
                        <p className="text-sm text-buddy-gray-600 mt-1">
                          {rule.description}
                        </p>
                      </div>
                    ))}
                </div>
              )}

              <div className="bg-white/70 p-4 rounded-lg border border-pastel-purple/30 space-y-3">
                <h4 className="font-medium text-buddy-gray-700">
                  Add Custom Rule:
                </h4>
                <div className="space-y-3">
                  <div>
                    <Label
                      htmlFor="rule-title"
                      className="text-sm text-buddy-gray-600"
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
                      className="mt-1 bg-white border-pastel-purple/30"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="rule-description"
                      className="text-sm text-buddy-gray-600"
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
                      className="mt-1 min-h-20 bg-white border-pastel-purple/30"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={addCustomRule}
                    disabled={
                      !formData.customRule.title.trim() ||
                      !formData.customRule.description.trim()
                    }
                    className="w-full bg-buddy-purple hover:bg-buddy-purple-dark"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
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
            <div>
              <Label className="text-buddy-gray-700 font-medium mb-2 block">
                Activity Goals
              </Label>
              <p className="text-sm text-buddy-gray-500 mb-4">
                Select goals for this activity or add custom ones
              </p>

              <div className="space-y-3">
                {defaultGoals.map((goal) => (
                  <div
                    key={goal}
                    className={cn(
                      "flex items-start space-x-3 p-3 rounded-xl transition-all duration-200",
                      formData.goals.includes(goal)
                        ? "bg-pastel-purple/70"
                        : "bg-white/50 hover:bg-white/80 border border-pastel-purple/20"
                    )}
                  >
                    <Checkbox
                      id={`goal-${goal}`}
                      checked={formData.goals.includes(goal)}
                      onCheckedChange={() => toggleGoal(goal)}
                      className="mt-0.5 text-buddy-purple"
                    />
                    <Label htmlFor={`goal-${goal}`} className="cursor-pointer">
                      {goal}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label
                htmlFor="custom-goal"
                className="text-buddy-gray-700 font-medium"
              >
                Add Custom Goal
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="custom-goal"
                  placeholder="E.g., Meditate for 10 minutes daily"
                  value={formData.customGoal}
                  onChange={(e) =>
                    handleChange({
                      target: { name: "customGoal", value: e.target.value },
                    })
                  }
                  className="flex-1 bg-white/70 border-pastel-purple/30 focus-visible:ring-buddy-purple-light transition-all duration-200"
                />
                <Button
                  type="button"
                  onClick={handleAddCustomGoal}
                  disabled={!formData.customGoal.trim()}
                  className="bg-buddy-purple hover:bg-buddy-purple-dark"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            {formData.goals.length > 0 && (
              <motion.div
                className="bg-white/70 p-4 rounded-xl border border-pastel-purple/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Label className="text-buddy-gray-700 font-medium mb-2 block">
                  Selected Goals
                </Label>
                <div className="space-y-2">
                  {formData.goals.map((goal, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-pastel-purple/40 p-2 rounded-lg"
                    >
                      <span className="text-buddy-gray-700">{goal}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-pastel-purple/60 text-buddy-gray-500"
                        onClick={() => toggleGoal(goal)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
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
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-pastel-green rounded-full flex items-center justify-center">
                <Check className="h-10 w-10 text-buddy-green" />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-center text-buddy-gray-800">
              Activity Summary
            </h3>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 space-y-4 border border-pastel-purple/20">
              {/* Banner preview if selected */}
              {(formData.bannerImage || formData.bannerImageFile) && (
                <div className="w-full rounded-lg overflow-hidden h-40 mb-4">
                  {formData.useBannerUpload && formData.bannerImageFile ? (
                    <div className="w-full h-full bg-buddy-gray-100 flex items-center justify-center">
                      <p className="text-buddy-gray-500">
                        Custom banner selected
                      </p>
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
                <div className="bg-pastel-blue/50 p-3 rounded-lg">
                  <p className="text-sm text-buddy-gray-500">Name</p>
                  <p className="font-medium text-buddy-gray-800">
                    {formData.name}
                  </p>
                </div>
                <div className="bg-pastel-purple/50 p-3 rounded-lg">
                  <p className="text-sm text-buddy-gray-500">Category</p>
                  <p className="font-medium text-buddy-gray-800 capitalize">
                    {formData.category}
                  </p>
                </div>
                <div className="bg-pastel-peach/50 p-3 rounded-lg">
                  <p className="text-sm text-buddy-gray-500">Visibility</p>
                  <p className="font-medium text-buddy-gray-800 capitalize">
                    {formData.visibility}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-pastel-yellow/50 p-3 rounded-lg">
                  <p className="text-sm text-buddy-gray-500">Start Date</p>
                  <p className="font-medium text-buddy-gray-800">
                    {formData.startDate
                      ? format(formData.startDate, "PPP")
                      : "Not specified"}
                  </p>
                </div>
                <div className="bg-pastel-green/50 p-3 rounded-lg">
                  <p className="text-sm text-buddy-gray-500">Duration</p>
                  <p className="font-medium text-buddy-gray-800 capitalize">
                    {formData.duration.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                </div>
                <div className="bg-pastel-pink/50 p-3 rounded-lg">
                  <p className="text-sm text-buddy-gray-500">Frequency</p>
                  <p className="font-medium text-buddy-gray-800 capitalize">
                    {formData.frequency}
                  </p>
                </div>
              </div>

              {formData.tags.length > 0 && (
                <div className="bg-white/70 p-3 rounded-lg">
                  <p className="text-sm text-buddy-gray-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-pastel-purple/40 text-buddy-gray-700 text-xs rounded-full px-3 py-1 flex items-center"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {formData.goals.length > 0 && (
                <div className="bg-white/70 p-3 rounded-lg">
                  <p className="text-sm text-buddy-gray-500 mb-2">Goals</p>
                  <ul className="list-disc pl-5 text-buddy-gray-700 space-y-1">
                    {formData.goals.map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))}
                  </ul>
                </div>
              )}

              {formData.rules.length > defaultSystemRules.length && (
                <div className="bg-white/70 p-3 rounded-lg">
                  <p className="text-sm text-buddy-gray-500 mb-2">
                    Custom Rules
                  </p>
                  <ul className="list-disc pl-5 text-buddy-gray-700 space-y-1">
                    {formData.rules
                      .filter((rule) => !rule.isDefault)
                      .map((rule) => (
                        <li key={rule.id}>{rule.title}</li>
                      ))}
                  </ul>
                </div>
              )}

              {formData.description && (
                <div className="bg-white/70 p-3 rounded-lg">
                  <p className="text-sm text-buddy-gray-500">Description</p>
                  <p className="text-buddy-gray-800">{formData.description}</p>
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-buddy-gray-600">
                Ready to start your activity? Click "Create Activity" below to
                launch it and invite your buddies.
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Container className="py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-buddy-gray-800 mb-6">
          Create New Activity
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Vertical Stepper */}
          <div className="md:w-1/3 lg:w-1/4">
            <Card
              variant="glass"
              className="sticky top-20 bg-gradient-to-br from-white to-pastel-purple/30 backdrop-blur-sm border border-white/50"
            >
              <Card.Content className="p-0">
                <div className="py-2">
                  {STEPS.map((step, index) => (
                    <div
                      key={index}
                      className={cn(
                        "relative",
                        index !== STEPS.length - 1 &&
                          "after:content-[''] after:absolute after:left-[22px] after:top-[40px] after:w-0.5 after:h-[calc(100%-16px)] after:bg-buddy-gray-200"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-start px-4 py-3 relative z-10",
                          index === currentStep
                            ? "bg-pastel-purple/40 rounded-lg"
                            : "",
                          index < currentStep
                            ? "text-buddy-gray-700"
                            : "text-buddy-gray-500",
                          "transition-all duration-300 hover:bg-pastel-purple/20 rounded-lg cursor-pointer"
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
                            "flex items-center justify-center rounded-full w-9 h-9 shrink-0 transition-all duration-300",
                            index === currentStep
                              ? "bg-buddy-purple text-white shadow-md shadow-buddy-purple/30"
                              : index < currentStep
                                ? "bg-buddy-green text-white"
                                : "bg-buddy-gray-100 text-buddy-gray-500"
                          )}
                        >
                          {index < currentStep ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            step.icon
                          )}
                        </div>

                        <div className="ml-3">
                          <p
                            className={cn(
                              "font-medium transition-colors",
                              index <= currentStep
                                ? "text-buddy-gray-800"
                                : "text-buddy-gray-500"
                            )}
                          >
                            {step.title}
                          </p>
                          <p className="text-xs text-buddy-gray-500 mt-0.5">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Form Content */}
          <div className="md:w-2/3 lg:w-3/4">
            <Card className="bg-gradient-to-br from-white/90 to-pastel-blue/30 backdrop-blur-sm border border-white/50 shadow-md">
              <Card.Content className="p-6">
                <form onSubmit={(e) => e.preventDefault()}>
                  {renderStepContent()}

                  <div className="h-px bg-gradient-to-r from-transparent via-buddy-gray-200 to-transparent my-6"></div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="border-buddy-purple/30 text-buddy-gray-700 hover:bg-buddy-purple/10 transition-all duration-200"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {currentStep === 0 ? "Cancel" : "Back"}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleContinue}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-buddy-purple to-buddy-purple-light hover:from-buddy-purple-dark hover:to-buddy-purple text-white transition-all duration-300"
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
