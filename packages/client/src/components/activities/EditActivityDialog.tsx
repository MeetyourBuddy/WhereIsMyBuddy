import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Clock, Tag, Trash2, Plus, Info } from "lucide-react";
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
import { IActivityResult, IActivityRule } from "@/types/activity-types";

type Activity = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  frequency: string;
  startDate: Date;
  endDate: Date;
  location: string;
  time: string;
  participants: number;
  bannerImage?: string;
  tags?: string[];
  rules?: IActivityRule[];
};

interface EditActivityDialogProps {
  children: React.ReactNode;
  activity: IActivityResult;
}

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Activity title must be at least 3 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  frequency: z.string().min(1, { message: "Frequency is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  participants: z.coerce
    .number()
    .min(1, { message: "Must have at least 1 participant" }),
  startDate: z.date(),
  endDate: z.date(),
});

type FormValues = z.infer<typeof formSchema>;

const EditActivityDialog = ({
  children,
  activity,
}: EditActivityDialogProps) => {
  const [open, setOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState<string[]>(activity.tags || []);
  const [rules, setRules] = useState<IActivityRule[]>(activity.rules || []);
  const [newRule, setNewRule] = useState("");

  console.log("activity in the edit modal", activity);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: activity.title,
      description: activity.description,
      category: activity.category,
      duration: `${activity.proposedDuration} ${activity.durationUnit}`,
      frequency: `${activity.checkinFrequency} ${activity.checkinFrequencyUnit}`,
      participants: activity.participants.length,
      startDate: activity.startDate,
      endDate: activity.endedAt,
    },
  });

  const onSubmit = (data: FormValues) => {
    // In a real app, this would send the data to an API
    console.log("Updated activity data:", { ...data, tags, rules });

    // Show success message
    toast.success("Activity updated successfully!");

    // Close the dialog
    setOpen(false);
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
      setRules([...rules, rule]);
      setNewRule("");
    }
  };

  const removeRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule._id !== ruleId));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Manage Activity</DialogTitle>
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
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="participants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Participants</FormLabel>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 30 days" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Daily" />
                      </FormControl>
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

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="e.g. 6:00 AM - 6:30 AM"
                          />
                          <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div> */}
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
                  <div className="space-y-2">
                    {rules.map((rule, index) => (
                      <div
                        key={rule._id}
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
                            onClick={() => removeRule(rule._id)}
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
