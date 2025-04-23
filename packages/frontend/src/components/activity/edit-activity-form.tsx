import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/common/ui/button';
import { Calendar } from '@/components/common/ui/calendar';
// import { Checkbox } from '@/components/common/ui/checkbox';
import { Input } from '@/components/common/ui/input';
import { Label } from '@/components/common/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/common/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/common/ui/select';
import { Separator } from '@/components/common/ui/separator';
import { Textarea } from '@/components/common/ui/textarea';
import { IconButton } from '../common/ui/icon-button';
import { IconFrame } from '../common/ui/icon-frame';
import { Icons } from '../common/icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/components/common/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createActivitySchema,
  type CreateActivityFormData
} from '@/lib/validation/activity-validation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/common/ui/form';
import { MultiSelect } from '../common/ui/multi-select';
import { InterestCategory } from '@/lib/constants/category-interests-constants';
import { getCommoditiesForCategory } from '@/lib/constants/category-interests-constants';
import { interestCategories } from '@/lib/constants/category-interests-constants';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useActivity } from '@/hooks/use-activity';
import { IActivity } from '@/types/activity-types';
import { toast } from '@/lib/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  DurationUnit,
  ActivityType,
  CheckinFrequency,
  JoinType
} from '@/lib/validation/activity-validation';

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'other', label: 'Other' }
];

const joinTypeOptions = [
  { value: 'fixed', label: 'Fixed' },
  { value: 'flexible', label: 'Flexible' }
];
const unitOptions = [
  { value: 'days', label: 'Day(s)' },
  { value: 'weeks', label: 'Week(s)' },
  { value: 'months', label: 'Month(s)' }
];

const RequiredIndicator = () => <span className="ml-1 text-red-500">*</span>;

const InfoIcon = () => <Icons.info className="ml-2 h-4 w-4 text-muted-foreground" />;

// Add type for the select options
interface SelectOption {
  label: string;
  value: string;
}

interface Rule {
  rule: string;
  isDefault: boolean;
}

export const EditActivityForm = ({ id }: { id: string }) => {
  const { getActivity, updateActivity } = useActivity();
  const { data: activityData, isLoading } = getActivity(id);
  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_CHARS = 500;
  const navigate = useNavigate();

  // Add state to track available tag options
  const [availableTagOptions, setAvailableTagOptions] = useState<SelectOption[]>([]);

  const form = useForm<CreateActivityFormData>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      title: '',
      description: '',
      proposedDuration: 1,
      durationUnit: DurationUnit.DAYS,
      maxSize: 1,
      type: ActivityType.PUBLIC,
      checkinFrequency: 1,
      checkinFrequencyUnit: CheckinFrequency.DAILY,
      checkinDays: [],
      checkinDateOfMonth: [],
      checkinDayOfWeek: [],
      checkinWeekOfMonth: [],
      bannerImage: undefined,
      startDate: new Date(),
      joinType: JoinType.FLEXIBLE,
      categories: [],
      tags: [],
      rules: [{ rule: '', isDefault: false }],
      allowedCheckInTypes: {
        photo: {
          description: 'Photo',
          type: 'photo',
          isEnabled: true
        }
      }
    }
  });

  useEffect(() => {
    if (activityData?.success && activityData.data?.activity) {
      const activity = activityData.data.activity;
      form.reset({
        title: activity.title,
        description: activity.description,
        proposedDuration: activity.proposedDuration,
        durationUnit: activity.durationUnit,
        maxSize: activity.maxSize,
        type: activity.type,
        checkinFrequency: activity.checkinFrequency,
        checkinFrequencyUnit: activity.checkinFrequencyUnit,
        checkinDays: activity.checkinDays,
        checkinDateOfMonth: activity.checkinDateOfMonth,
        checkinDayOfWeek: activity.checkinDayOfWeek,
        checkinWeekOfMonth: activity.checkinWeekOfMonth,
        bannerImage: activity.bannerImage,
        startDate: new Date(activity.startDate),
        joinType: activity.joinType,
        categories: activity.categories,
        tags: activity.tags,
        rules: activity.rules,
        allowedCheckInTypes: activity.allowedCheckInTypes
      });

      if (activity.bannerImage) {
        setBannerImage(activity.bannerImage);
      }

      if (activity.categories?.length) {
        const newTagOptions = activity.categories.map((category) => ({
          label: category,
          value: category
        }));
        setAvailableTagOptions(newTagOptions);
      }
    }
  }, [activityData]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBannerImage(imageUrl);
    }
  };

  const handleDeleteImage = () => {
    if (bannerImage) {
      URL.revokeObjectURL(bannerImage); // Clean up the object URL
    }
    setBannerImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (bannerImage) {
        URL.revokeObjectURL(bannerImage);
      }
    };
  }, [bannerImage]);

  // Add loading state
  if (isLoading) {
    return (
      <div className="container-default flex h-full items-center justify-center bg-white p-8">
        <Icons.loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container-default flex h-full flex-col bg-white p-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <p className="text-xl font-bold">Edit Activity</p>
          <p className="max-w-[400px] text-base text-muted-foreground">
            Update your activity information below.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <IconFrame
            icon="info"
            className="h-10 w-10 border border-gray-200 bg-white"
            iconClassName="text-muted-foreground h-5 w-5"
          />
          <IconButton rightIcon="star" label="Go Pro" className="h-8 w-[100px] rounded-full" />
        </div>
      </div>

      <Form {...form}>
        <form className="mt-8 space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex gap-4">
                <FormLabel className="w-1/3">
                  Activity Name
                  <RequiredIndicator />
                </FormLabel>
                <div className="flex w-full flex-1 flex-col items-start">
                  <FormControl>
                    <Input {...field} placeholder="Enter activity name" />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Separator />
          <FormField
            control={form.control}
            name="bannerImage"
            render={({ field }) => (
              <FormItem className="flex gap-4">
                <FormLabel className="w-1/3">Top Banner Image</FormLabel>
                <div className="flex w-full flex-1 flex-col">
                  <FormControl>
                    <div className="flex-1 space-y-4">
                      {bannerImage ? (
                        <div className="relative">
                          <div
                            className="relative h-[200px] w-full cursor-pointer overflow-hidden rounded-lg border-2 border-gray-200"
                            onClick={() => setIsImagePreviewOpen(true)}
                          >
                            <img
                              src={bannerImage}
                              alt="Banner preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="mt-2 flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-[100px]"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              className="w-[100px]"
                              variant="destructive"
                              size="sm"
                              onClick={handleDeleteImage}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-6">
                          <Icons.image className="mb-2 h-8 w-8 text-muted-foreground" />
                          <p className="mb-4 text-sm text-muted-foreground">
                            Upload a banner image for your activity
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Upload Image
                          </Button>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          handleImageUpload(e);
                          // Store the file name or URL in the form
                          if (e.target.files?.[0]) {
                            field.onChange(e.target.files[0].name);
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Image Preview Dialog */}
          <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
            <DialogTitle className="sr-only">Image Preview</DialogTitle>
            <DialogDescription className="sr-only">Image Preview</DialogDescription>
            <DialogContent className="max-w-4xl p-0">
              {bannerImage && (
                <div className="relative h-[600px] w-full">
                  <img
                    src={bannerImage}
                    alt="Banner preview"
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Separator />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="flex gap-4">
                <FormLabel className="w-1/3">
                  Page Type
                  <RequiredIndicator />
                </FormLabel>
                <div className="flex w-full flex-1 flex-col">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-1 flex-col gap-4"
                    >
                      <div className="flex space-x-2">
                        <RadioGroupItem value="public" id="public" />
                        <Label htmlFor="public" className="flex flex-col">
                          Public
                          <span className="mt-1 text-xs text-muted-foreground">
                            Anyone can view your activity.
                          </span>
                        </Label>
                      </div>
                      <div className="flex space-x-2">
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private" className="flex flex-col">
                          Private
                          <span className="mt-1 text-xs text-muted-foreground">
                            Only member the group can view the details of this activity.
                          </span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex gap-4">
                <FormLabel className="w-1/3">
                  Start Date
                  <RequiredIndicator />
                </FormLabel>
                <div className="flex w-full flex-1 flex-col">
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'PPP') : <span>Select a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name="proposedDuration"
            render={({ field }) => (
              <FormItem className="flex gap-4">
                <FormLabel className="w-1/3">
                  Proposed Duration
                  <RequiredIndicator />
                </FormLabel>
                <div className="flex w-full flex-1 flex-col">
                  <FormControl>
                    <div className="flex flex-1 gap-4">
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        min={1}
                        max={365}
                      />
                      <FormField
                        control={form.control}
                        name="durationUnit"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {unitOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name="checkinFrequencyUnit"
            render={({ field }) => (
              <FormItem className="flex gap-4">
                <FormLabel className="flex w-1/3">
                  Check-in Frequency
                  <InfoIcon />
                </FormLabel>
                <div className="flex w-full flex-1 gap-4">
                  <FormControl>
                    <Input
                      type="number"
                      value={form.watch('checkinFrequency')}
                      onChange={(e) => form.setValue('checkinFrequency', Number(e.target.value))}
                      min={1}
                      className="w-24"
                    />
                  </FormControl>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <Separator />

          {/* Add this section after the check-in frequency field */}
          <FormField
            control={form.control}
            name="checkinDays"
            render={({ field }) => (
              <FormItem className="flex gap-4">
                <FormLabel className="flex w-1/3">
                  Check-in Schedule
                  <InfoIcon />
                </FormLabel>
                <div className="flex w-full flex-1 flex-col space-y-4">
                  {form.watch('checkinFrequencyUnit') === 'weekly' && (
                    <FormControl>
                      <MultiSelect
                        placeholder="Select days of the week"
                        options={[
                          { label: 'Monday', value: 'monday' },
                          { label: 'Tuesday', value: 'tuesday' },
                          { label: 'Wednesday', value: 'wednesday' },
                          { label: 'Thursday', value: 'thursday' },
                          { label: 'Friday', value: 'friday' },
                          { label: 'Saturday', value: 'saturday' },
                          { label: 'Sunday', value: 'sunday' }
                        ]}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      />
                    </FormControl>
                  )}

                  {form.watch('checkinFrequencyUnit') === 'monthly' && (
                    <FormField
                      control={form.control}
                      name="checkinDateOfMonth"
                      render={({ field }) => (
                        <FormControl>
                          <MultiSelect
                            placeholder="Select days of the month"
                            options={Array.from({ length: 31 }, (_, i) => ({
                              label: `${i + 1}`,
                              value: `${i + 1}`
                            }))}
                            onValueChange={(values) => {
                              // Convert string values to numbers
                              const numberValues = values.map((v) => parseInt(v, 10));
                              field.onChange(numberValues);
                            }}
                            defaultValue={field.value?.map((v) => v.toString())}
                          />
                        </FormControl>
                      )}
                    />
                  )}
                </div>
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name="maxSize"
            render={({ field }) => (
              <FormItem className="flex gap-4">
                <FormLabel className="flex w-1/3">
                  Meeting Capacity
                  <RequiredIndicator />
                  <InfoIcon />
                </FormLabel>
                <div className="flex w-full flex-1 flex-col">
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      min={1}
                      placeholder="Enter maximum participants"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name="joinType"
            render={({ field }) => (
              <FormItem className="flex gap-4">
                <FormLabel className="w-1/3">
                  <div className="flex items-center">
                    Join Type
                    <InfoIcon />
                  </div>
                </FormLabel>
                <div className="flex w-full flex-1 flex-col">
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select join type" />
                      </SelectTrigger>
                      <SelectContent>
                        {joinTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex items-start gap-4">
                <FormLabel className="w-1/3">
                  <div className="flex items-center">
                    Description
                    <RequiredIndicator />
                    <InfoIcon />
                  </div>
                </FormLabel>
                <div className="flex w-full flex-1 flex-col">
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        {...field}
                        placeholder="Describe your activity..."
                        className="max-h-[150px] min-h-[150px] flex-1"
                        maxLength={MAX_CHARS}
                      />
                      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
                        {MAX_CHARS - (field.value?.length || 0)} characters remaining
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="flex gap-4">
                <FormLabel className="w-1/3">
                  <div className="flex items-center">
                    Interests/Tags
                    <RequiredIndicator />
                    <InfoIcon />
                  </div>
                </FormLabel>
                <div className="flex w-full flex-1 flex-col space-y-4">
                  <FormControl>
                    {/* Categories */}
                    <FormField
                      control={form.control}
                      name="categories"
                      render={({ field: categoryField }) => (
                        <MultiSelect
                          placeholder="Select interest groups"
                          maxCount={8}
                          options={interestCategories.map((interest) => ({
                            label: interest.label,
                            value: interest.value
                          }))}
                          onValueChange={(values) => {
                            categoryField.onChange(values);
                            // Update available tags based on selected categories
                            const newTagOptions =
                              values &&
                              values.flatMap((category) =>
                                getCommoditiesForCategory(category as InterestCategory).map(
                                  (item) => ({
                                    label: item.label,
                                    value: item.value
                                  })
                                )
                              );
                            setAvailableTagOptions(newTagOptions);
                            // Reset tags when categories change
                            form.setValue('tags', []);
                          }}
                          defaultValue={categoryField.value}
                        />
                      )}
                    />
                  </FormControl>

                  <FormControl>
                    {/* Tags/Interests */}
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <MultiSelect
                          placeholder="Select interests/tags"
                          maxCount={8}
                          options={availableTagOptions}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!form.watch('categories')?.length}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name="allowedCheckInTypes"
            render={({ field }) => (
              <FormItem className="flex gap-4">
                <FormLabel className="flex w-1/3">
                  Allowed Check-in Types
                  <InfoIcon />
                </FormLabel>
                <div className="flex w-full flex-1 flex-col">
                  <FormControl>
                    <MultiSelect
                      placeholder="Select check-in types"
                      options={[
                        { label: 'Photo', value: 'photo' },
                        { label: 'Checklist', value: 'checklist' },
                        { label: 'Hours', value: 'hours' },
                        { label: 'Text', value: 'text' },
                        { label: 'Other', value: 'other' }
                      ]}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name="rules"
            render={({ field }) => (
              <FormItem className="flex items-start gap-4">
                <FormLabel className="w-1/3">
                  <div className="flex items-center">
                    Rules
                    <InfoIcon />
                  </div>
                </FormLabel>
                <div className="flex w-full flex-1 flex-col">
                  <FormControl>
                    <div className="space-y-2">
                      {field.value?.map((ruleItem: Rule, index: number) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={ruleItem.rule}
                            onChange={(e) => {
                              const newRules = [...field.value];
                              newRules[index] = {
                                ...newRules[index],
                                rule: e.target.value
                              };
                              field.onChange(newRules);
                            }}
                            placeholder={`Rule ${index + 1}`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newRules = field.value.filter((_, i) => i !== index);
                              field.onChange(newRules);
                            }}
                          >
                            <Icons.delete className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-[150px]"
                        onClick={() => {
                          const newRule: Rule = { rule: '', isDefault: false };
                          field.onChange([...field.value, newRule]);
                        }}
                      >
                        Add Rule
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {form.formState?.errors && Object.keys(form.formState.errors).length > 0 && (
            <p className="flex justify-end text-sm text-red-500">
              You have errors in your form. Please fix them before submitting.
            </p>
          )}
          <div className="flex justify-end gap-4 pt-4">
            <IconButton
              variant="outline"
              type="button"
              className="w-[150px]"
              rightIcon="x"
              label="Cancel"
              onClick={() => navigate(`/activity/${id}`)}
            />
            <IconButton
              type="submit"
              className="w-[150px]"
              rightIcon="save"
              label="Save"
              disabled={form.formState.isSubmitting}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};
