import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarIcon,
  Clock,
  Tag,
  Trash2,
  Plus,
  Info,
  Target,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  IActivityResult,
  IActivityRule,
  CheckinFrequencyUnit,
  IActivity,
  ActivityType,
  CheckInType,
} from "@/types/activity-types";
import { InterestCategory } from "@/types/interest-categories.enum";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { activityCategories } from "@/lib/constants/category-interests.constants";
import { useActivityStore } from "@/store/activity.store";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Activity title must be at least 3 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  category: z.nativeEnum(InterestCategory, {
    required_error: "Please select a category",
  }),
  type: z.nativeEnum(ActivityType, {
    required_error: "Please select an activity type",
  }),
  proposedDuration: z.coerce
    .number()
    .min(1, { message: "Duration must be at least 1" }),
  checkinFrequency: z.coerce
    .number()
    .min(1, { message: "Frequency must be at least 1" }),
  checkinFrequencyUnit: z.enum(["daily", "weekly", "monthly"], {
    required_error: "Please select a frequency unit",
  }),
  maxParticipants: z.coerce
    .number()
    .min(1, { message: "Must have at least 1 participant" }),
  startDate: z.date(),
  endDate: z.date(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditActivityDialogProps {
  children: React.ReactNode;
  activity: IActivityResult;
}

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

const EditActivityDialog = ({
  children,
  activity,
}: EditActivityDialogProps) => {
  const [open, setOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState<string[]>(activity.tags || []);
  const [rules, setRules] = useState<IActivityRule[]>(activity.rules || []);
  const [newRule, setNewRule] = useState("");
  const [goals, setGoals] = useState<string[]>(activity.goals || []);
  const [newGoal, setNewGoal] = useState("");
  const { updateActivity } = useActivityStore();

  const calculateEndDate = (startDate: Date, duration: number) => {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + duration);
    return endDate;
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: activity.title,
      description: activity.description,
      category: activity.category as InterestCategory,
      type: activity.type as ActivityType,
      proposedDuration: activity.proposedDuration,
      checkinFrequency: activity.checkinFrequency,
      checkinFrequencyUnit: activity.checkinFrequencyUnit,
      maxParticipants: activity.maxParticipants,
      startDate: new Date(activity.startDate),
      endDate: calculateEndDate(
        new Date(activity.startDate),
        activity.proposedDuration
      ),
    },
  });

  // Watch for changes in startDate and proposedDuration to update endDate
  const startDate = form.watch("startDate");
  const proposedDuration = form.watch("proposedDuration");

  React.useEffect(() => {
    if (startDate && proposedDuration) {
      form.setValue("endDate", calculateEndDate(startDate, proposedDuration));
    }
  }, [startDate, proposedDuration, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      const { endDate, ...dataWithoutEndDate } = data;
      const updatedActivityData: Partial<IActivity> = {
        ...dataWithoutEndDate,
        startDate: data.startDate.toISOString(),
        checkinFrequencyUnit: data.checkinFrequencyUnit as CheckinFrequencyUnit,
        type: data.type as ActivityType,
        goals,
        allowedCheckInTypes: [
          {
            type: CheckInType.TEXT,
            validation: {
              guidelines: "Please provide a text update about your progress",
              minLength: 10,
              maxLength: 1000,
            },
            isEnabled: true,
            description: "Text update",
          },
        ],
        tags,
        rules: rules.map((rule) => ({
          _id: rule._id,
          title: rule.title,
          description: rule.description || "",
          isDefault: rule.isDefault,
        })),
      };

      console.log("Updated activity data:", updatedActivityData);

      const updatedActivity = await updateActivity(
        activity._id,
        updatedActivityData
      );

      console.log("Updated activity:", updatedActivity);

      if (updatedActivity.success) {
        // Show success message
        toast.success("Activity updated successfully!");

        // Close the dialog
        setOpen(false);
      } else {
        toast.error("Failed to update activity");
      }
    } catch (error) {
      console.error("Error updating activity:", error);
      toast.error("Failed to update activity");
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    } else if (tags.includes(newTag.trim())) {
      toast.error("This tag already exists");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const addRule = () => {
    if (newRule.trim()) {
      const rule = {
        _id: Date.now().toString(),
        title: newRule.trim(),
        isDefault: false,
      };
      setRules([...rules, rule as IActivityRule]);
      setNewRule("");
    }
  };

  const removeRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule._id !== ruleId));
  };

  const toggleGoal = (goal: string) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter((g) => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };

  const addCustomGoal = () => {
    if (newGoal.trim() && !goals.includes(newGoal.trim())) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal("");
    } else if (goals.includes(newGoal.trim())) {
      toast.error("This goal already exists");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white/95 to-buddy-purple/5 backdrop-blur-sm border-2 border-white/20">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">
            Edit Your Activity
          </DialogTitle>
          <DialogDescription className="text-center text-buddy-gray-600">
            Make updates to your activity and keep your buddies engaged! 🚀
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 py-4"
          >
            {/* Basic Information Section */}
            <div className="space-y-6 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-buddy-purple/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-buddy-purple/10 to-buddy-blue/10 rounded-xl">
                  <Info className="h-5 w-5 text-buddy-purple" />
                </div>
                <h3 className="text-lg font-semibold text-buddy-gray-800">
                  Basic Information
                </h3>
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-buddy-gray-700 font-medium">
                      Activity Name 📝
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12 text-base"
                        placeholder="Enter your activity name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-buddy-gray-700 font-medium">
                      Description 📖
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        className="rounded-2xl border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 text-base"
                        placeholder="Describe what this activity is about..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-buddy-gray-700 font-medium">
                        Category 🏷️
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white/95 backdrop-blur-sm border border-buddy-purple/20">
                          {activityCategories.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-buddy-gray-700 font-medium">
                        Activity Type 🌐
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12">
                            <SelectValue placeholder="Select activity type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white/95 backdrop-blur-sm border border-buddy-purple/20">
                          <SelectItem value={ActivityType.PUBLIC}>
                            Public
                          </SelectItem>
                          <SelectItem value={ActivityType.PRIVATE}>
                            Private
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxParticipants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-buddy-gray-700 font-medium">
                        Maximum Participants 👥
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12 text-base"
                          placeholder="Enter max participants"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Schedule Details Section */}
            <div className="space-y-6 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-buddy-blue/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-buddy-blue/10 to-buddy-green/10 rounded-xl">
                  <CalendarIcon className="h-5 w-5 text-buddy-blue" />
                </div>
                <h3 className="text-lg font-semibold text-buddy-gray-800">
                  Schedule Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="proposedDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-buddy-gray-700 font-medium">
                        Duration 📅
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12 text-base"
                          placeholder="Duration in months"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="checkinFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-buddy-gray-700 font-medium">
                        Check-in Frequency 🔄
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12 text-base"
                          placeholder="Frequency number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="checkinFrequencyUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-buddy-gray-700 font-medium">
                        Frequency Unit ⏰
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white/95 backdrop-blur-sm border border-buddy-purple/20">
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-buddy-gray-700 font-medium">
                        Start Date 📅
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-4 text-left font-normal flex justify-between rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12",
                                !field.value && "text-buddy-gray-500"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a start date</span>
                              )}
                              <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 bg-white/95 backdrop-blur-sm border border-buddy-purple/20"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-buddy-gray-700 font-medium">
                        End Date 📅
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-4 text-left font-normal flex justify-between rounded-full border-2 border-buddy-gray-200/70 h-12 bg-buddy-gray-50 text-buddy-gray-500",
                                !field.value && "text-buddy-gray-500"
                              )}
                              disabled={true}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Auto-calculated</span>
                              )}
                              <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 bg-white/95 backdrop-blur-sm border border-buddy-purple/20"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-6 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-buddy-green/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-buddy-green/10 to-buddy-blue/10 rounded-xl">
                  <Tag className="h-5 w-5 text-buddy-green" />
                </div>
                <h3 className="text-lg font-semibold text-buddy-gray-800">
                  Activity Tags
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a new tag"
                    className="flex-1 rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12 text-base"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    className="shrink-0 rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white hover:shadow-lg transition-all duration-300 hover:scale-105 h-12 px-6"
                  >
                    <Plus className="h-5 w-5 mr-2" /> Add Tag
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-3 p-4 bg-gradient-to-br from-buddy-purple/5 to-buddy-blue/5 rounded-2xl border border-buddy-purple/20">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="group flex items-center gap-2 bg-white border-2 border-buddy-purple/20 text-buddy-purple px-4 py-2 rounded-full text-sm hover:bg-buddy-purple/10 hover:border-buddy-purple/40 transition-all duration-300 hover:scale-105"
                      >
                        <Tag className="h-4 w-4" />
                        <span className="font-medium">{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-buddy-gray-400 hover:text-red-500 ml-1 h-5 w-5 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Activity Rules Section */}
            <div className="space-y-6 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-buddy-blue/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-buddy-blue/10 to-buddy-purple/10 rounded-xl">
                  <Info className="h-5 w-5 text-buddy-blue" />
                </div>
                <h3 className="text-lg font-semibold text-buddy-gray-800">
                  Activity Rules
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    value={newRule}
                    onChange={(e) => setNewRule(e.target.value)}
                    placeholder="Add a new rule"
                    className="flex-1 rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12 text-base"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addRule();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addRule}
                    className="shrink-0 rounded-full bg-gradient-to-r from-buddy-blue to-buddy-purple text-white hover:shadow-lg transition-all duration-300 hover:scale-105 h-12 px-6"
                  >
                    <Plus className="h-5 w-5 mr-2" /> Add Rule
                  </Button>
                </div>

                {rules.length > 0 && (
                  <div className="space-y-3">
                    {rules.map((rule, index) => (
                      <div
                        key={rule._id}
                        className={cn(
                          "flex items-start gap-4 border-2 rounded-2xl p-4 group transition-all duration-300 hover:shadow-md",
                          rule.isDefault
                            ? "bg-gradient-to-br from-buddy-gray-50 to-buddy-gray-100 border-buddy-gray-200"
                            : "bg-white border-buddy-blue/20 hover:border-buddy-blue/40"
                        )}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-buddy-purple/10 to-buddy-blue/10 text-buddy-purple font-bold text-sm shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-buddy-gray-800">
                            {rule.title}
                          </span>
                          {rule.description && (
                            <p className="text-sm text-buddy-gray-600 mt-1">
                              {rule.description}
                            </p>
                          )}
                        </div>
                        {!rule.isDefault && (
                          <button
                            type="button"
                            onClick={() => removeRule(rule._id)}
                            className="text-buddy-gray-400 hover:text-red-500 h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                        {rule.isDefault && (
                          <span className="text-xs text-buddy-gray-500 italic bg-buddy-gray-200 px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Activity Goals Section */}
            <div className="space-y-6 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-buddy-green/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-buddy-green/10 to-buddy-purple/10 rounded-xl">
                  <Target className="h-5 w-5 text-buddy-green" />
                </div>
                <h3 className="text-lg font-semibold text-buddy-gray-800">
                  Activity Goals
                </h3>
              </div>

              <div className="space-y-3">
                {defaultGoals.map((goal) => (
                  <div
                    key={goal}
                    className={cn(
                      "flex items-start space-x-4 p-4 rounded-2xl transition-all duration-300 hover:shadow-md",
                      goals.includes(goal)
                        ? "bg-gradient-to-br from-buddy-purple/20 to-buddy-blue/20 border-2 border-buddy-purple/30"
                        : "bg-white/70 hover:bg-white/90 border-2 border-buddy-gray-200/50 hover:border-buddy-purple/30"
                    )}
                  >
                    <Checkbox
                      id={`goal-${goal}`}
                      checked={goals.includes(goal)}
                      onCheckedChange={() => toggleGoal(goal)}
                      className="mt-1 text-buddy-purple border-2 border-buddy-purple/30 data-[state=checked]:bg-buddy-purple data-[state=checked]:border-buddy-purple"
                    />
                    <Label
                      htmlFor={`goal-${goal}`}
                      className="cursor-pointer text-buddy-gray-700 font-medium leading-relaxed"
                    >
                      {goal}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Label
                  htmlFor="custom-goal"
                  className="text-buddy-gray-700 font-medium text-base"
                >
                  Add Custom Goal 🎯
                </Label>
                <div className="flex gap-3 mt-2">
                  <Input
                    id="custom-goal"
                    placeholder="E.g., Meditate for 10 minutes daily"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomGoal();
                      }
                    }}
                    className="flex-1 rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12 text-base"
                  />
                  <Button
                    type="button"
                    onClick={addCustomGoal}
                    disabled={!newGoal.trim()}
                    className="rounded-full bg-gradient-to-r from-buddy-green to-buddy-purple text-white hover:shadow-lg transition-all duration-300 hover:scale-105 h-12 px-6"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Goal
                  </Button>
                </div>
              </div>

              {goals.length > 0 && (
                <motion.div
                  className="bg-gradient-to-br from-buddy-purple/10 to-buddy-blue/10 p-6 rounded-2xl border-2 border-buddy-purple/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Label className="text-buddy-gray-700 font-semibold mb-4 block text-lg">
                    Selected Goals ✨
                  </Label>
                  <div className="space-y-3">
                    {goals.map((goal, index) => (
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

            <DialogFooter className="pt-8 border-t border-buddy-gray-200/50">
              <div className="flex gap-4 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full border-2 border-buddy-gray-300 text-buddy-gray-700 hover:bg-buddy-gray-50 hover:border-buddy-gray-400 transition-all duration-300 h-12 text-base font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white hover:shadow-lg transition-all duration-300 hover:scale-105 h-12 text-base font-semibold"
                >
                  Save Changes ✨
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditActivityDialog;
