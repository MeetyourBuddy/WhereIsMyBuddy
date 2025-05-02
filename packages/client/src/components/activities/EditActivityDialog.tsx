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
          id: rule.id,
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
        id: Date.now().toString(),
        title: newRule.trim(),
        isDefault: false,
      };
      setRules([...rules, rule as IActivityRule]);
      setNewRule("");
    }
  };

  const removeRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule.id !== ruleId));
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
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Manage Activity</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 sr-only">
            Edit the details of the activity.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Basic Information
              </h3>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                      <FormLabel>Activity Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select activity type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                      <FormLabel>Maximum Participants</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Schedule Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="proposedDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="checkinFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-in Frequency</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
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
                      <FormLabel>Frequency Unit</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal flex justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
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
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal flex justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={true}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
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

            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </h3>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} className="shrink-0">
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-gray-50">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="group flex items-center gap-1 bg-white border border-gray-200 text-buddy-purple px-3 py-1 rounded-full text-sm hover:bg-buddy-purple/5 transition-colors"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-gray-400 hover:text-red-500 ml-1 h-4 w-4 flex items-center justify-center rounded-full"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Activity Rules
              </h3>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newRule}
                    onChange={(e) => setNewRule(e.target.value)}
                    placeholder="Add a rule"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addRule();
                      }
                    }}
                  />
                  <Button type="button" onClick={addRule} className="shrink-0">
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>

                {rules.length > 0 && (
                  <div className="space-y-2" key={rules.id}>
                    {rules.map((rule, index) => (
                      <div
                        key={rule.id}
                        className={cn(
                          "flex items-start gap-3 border rounded-md p-3 group",
                          rule.isDefault ? "bg-gray-50" : "bg-white"
                        )}
                      >
                        <span className="font-medium shrink-0">
                          {index + 1}.
                        </span>
                        <span className="flex-1">{rule.title}</span>
                        {!rule.isDefault && (
                          <button
                            type="button"
                            onClick={() => removeRule(rule.id)}
                            className="text-gray-400 hover:text-red-500 h-5 w-5 flex-shrink-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                        {rule.isDefault && (
                          <span className="text-xs text-gray-500 italic">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Activity Goals
              </h3>

              <div className="space-y-3">
                {defaultGoals.map((goal) => (
                  <div
                    key={goal}
                    className={cn(
                      "flex items-start space-x-3 p-3 rounded-xl transition-all duration-200",
                      goals.includes(goal)
                        ? "bg-pastel-purple/70"
                        : "bg-white/50 hover:bg-white/80 border border-pastel-purple/20"
                    )}
                  >
                    <Checkbox
                      id={`goal-${goal}`}
                      checked={goals.includes(goal)}
                      onCheckedChange={() => toggleGoal(goal)}
                      className="mt-0.5 text-buddy-purple"
                    />
                    <Label htmlFor={`goal-${goal}`} className="cursor-pointer">
                      {goal}
                    </Label>
                  </div>
                ))}
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
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomGoal();
                      }
                    }}
                    className="flex-1 bg-white/70 border-pastel-purple/30 focus-visible:ring-buddy-purple-light transition-all duration-200"
                  />
                  <Button
                    type="button"
                    onClick={addCustomGoal}
                    disabled={!newGoal.trim()}
                    className="bg-buddy-purple hover:bg-buddy-purple-dark"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              {goals.length > 0 && (
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
                    {goals.map((goal, index) => (
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
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditActivityDialog;
