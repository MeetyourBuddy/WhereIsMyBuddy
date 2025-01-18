import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/common/ui/button';
import { Calendar } from '@/components/common/ui/calendar';
import { Checkbox } from '@/components/common/ui/checkbox';
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
import { useActivityStore } from '@/providers/store/use-activity-store';
import { IActivity } from '@/types/activity-types';
import { toast } from '@/lib/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Biweekly' },
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

const RequiredIndicator = () => <span className="text-red-500 ml-1">*</span>;

const InfoIcon = () => <Icons.info className="w-4 h-4 text-muted-foreground ml-2" />;

// Add type for the select options
interface SelectOption {
  label: string;
  value: string;
}

interface Rule {
  rule: string;
  isDefault: boolean;
}

export const CreateActivityForm = () => {
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_CHARS = 500;
  const navigate = useNavigate();

  const { createActivity } = useActivityStore();

  // Add state to track available tag options
  const [availableTagOptions, setAvailableTagOptions] = useState<SelectOption[]>([]);

  const form = useForm<CreateActivityFormData>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      title: '',
      description: '',
      proposedDuration: 1,
      durationUnit: 'days',
      type: 'public',
      maxSize: 1,
      contactFrequency: 'daily',
      joinType: 'flexible',
      rules: [{ rule: '', isDefault: false }] as Rule[],
      tags: [],
      bannerImage: undefined,
      // checkinOptions: {
      //   photo: { enabled: false, description: '' },
      //   hours: { enabled: false, minHours: 0 },
      //   checklist: { enabled: false, items: [] }
      // },
      categories: [],
      startDate: new Date()
    }
  });

  console.log('form errors', form.formState.errors);
  const onSubmit = async (data: CreateActivityFormData) => {
    try {
      console.log('Form data:', data);
      const response = await createActivity(data as Omit<IActivity, 'id'>);

      if (response.success) {
        toast({
          title: 'Activity created successfully',
          description: 'Your activity has been created and is now live.',
          variant: 'default'
        });
        form.reset();
        navigate(`/activity`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

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

  return (
    <div className="flex flex-col h-full container-default bg-white p-8">
      <h2 className="scroll-m-20 font-extrabold tracking-tight">Create Activity</h2>

      <div className="flex items-center justify-between mt-8">
        <div className="flex flex-col items-start">
          <p className="text-xl font-bold">New Activity</p>
          <p className="text-base text-muted-foreground max-w-[400px]">
            Please enter information for your new activity here. You can always come back and edit.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <IconFrame
            icon="info"
            className="w-10 h-10 bg-white border border-gray-200 "
            iconClassName="text-muted-foreground h-5 w-5"
          />
          <IconButton rightIcon="star" label="Go Pro" className="w-[100px] h-8 rounded-full" />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex gap-4">
                <FormLabel className="w-1/3">
                  Activity Name
                  <RequiredIndicator />
                </FormLabel>
                <div className="flex flex-col w-full flex-1">
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
                <div className="flex flex-col w-full flex-1">
                  <FormControl>
                    <div className="flex-1 space-y-4">
                      {bannerImage ? (
                        <div className="relative">
                          <div
                            className="relative border-2  border-gray-200 w-full h-[200px] rounded-lg overflow-hidden cursor-pointer"
                            onClick={() => setIsImagePreviewOpen(true)}
                          >
                            <img
                              src={bannerImage}
                              alt="Banner preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex gap-2 mt-2 justify-end">
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
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-6">
                          <Icons.image className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-4">
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
                        onChange={handleImageUpload}
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
                <div className="relative w-full h-[600px]">
                  <img
                    src={bannerImage}
                    alt="Banner preview"
                    className="w-full h-full object-contain"
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
                <div className="flex flex-col w-full flex-1">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4 flex-1 flex-col"
                    >
                      <div className="flex  space-x-2 ">
                        <RadioGroupItem value="public" id="public" />
                        <Label htmlFor="public" className="flex flex-col ">
                          Public
                          <span className="text-xs text-muted-foreground mt-1">
                            Anyone can view your activity.
                          </span>
                        </Label>
                      </div>
                      <div className="flex  space-x-2">
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private" className="flex flex-col">
                          Private
                          <span className="text-xs text-muted-foreground mt-1">
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
                <div className="flex flex-col w-full flex-1">
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
                <div className="flex flex-col w-full flex-1">
                  <FormControl>
                    <div className="flex gap-4 flex-1">
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
            name="contactFrequency"
            render={({ field }) => (
              <FormItem className="flex gap-4">
                <FormLabel className="w-1/3 flex">
                  Meeting Frequency
                  <InfoIcon />
                </FormLabel>
                <div className="flex flex-col w-full flex-1">
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
                  <FormMessage />
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
                <FormLabel className="w-1/3 flex">
                  Meeting Capacity
                  <RequiredIndicator />
                  <InfoIcon />
                </FormLabel>
                <div className="flex flex-col w-full flex-1">
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
                <div className="flex flex-col w-full flex-1">
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
                <div className="flex flex-col w-full flex-1">
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        {...field}
                        placeholder="Describe your activity..."
                        className="flex-1 min-h-[150px] max-h-[150px]"
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
                <div className="flex flex-col w-full flex-1 space-y-4">
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

          {/* <FormField
            control={form.control}
            name="checkinOptions"
            render={({ field }) => (
              <FormItem className="flex items-start gap-4">
                <FormLabel className="w-1/3 flex">
                  Check-in Options
                  <InfoIcon />
                </FormLabel>
                <div className="flex flex-col w-full flex-1">
                  <FormControl>
                    <div className="space-y-4 flex-1"> */}
          {/* Photo option */}
          {/* <div className="flex space-x-2 w-full">
                        <Checkbox
                          checked={field.value?.photo?.enabled}
                          onCheckedChange={(checked) =>
                            field.onChange({
                              ...field.value,
                              photo: { ...field.value?.photo, enabled: checked as boolean }
                            })
                          }
                        />
                        <div className="flex flex-col w-full">
                          <Label>Post a photo</Label>
                          <div className="flex flex-col items-start mt-2">
                            <p className="text-xs text-muted-foreground mb-1">
                              What defines a valid photo?
                            </p>
                            <Input
                              value={field.value?.photo?.description}
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  photo: { ...field.value?.photo, description: e.target.value }
                                })
                              }
                              placeholder="Description"
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div> */}

          {/* Hours option */}
          {/* <div className="flex space-x-2 w-full">
                        <Checkbox
                          checked={field.value?.hours?.enabled}
                          onCheckedChange={(checked) =>
                            field.onChange({
                              ...field.value,
                              hours: { ...field.value?.hours, enabled: checked as boolean }
                            })
                          }
                        />
                        <div className="flex flex-col w-full">
                          <Label>Number of hours</Label>
                          <div className="flex flex-col items-start mt-2">
                            <p className="text-xs text-muted-foreground mb-1">
                              Select minimum number of hours
                            </p>
                            <Input
                              type="number"
                              value={field.value?.hours?.minHours}
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  hours: {
                                    ...field.value?.hours,
                                    minHours: parseInt(e.target.value)
                                  }
                                })
                              }
                              placeholder="Min. hours"
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div> */}

          {/* Checklist option */}
          {/* <div className="flex space-x-2 w-full">
                        <Checkbox
                          checked={field.value?.checklist?.enabled}
                          onCheckedChange={(checked) =>
                            field.onChange({
                              ...field.value,
                              checklist: { ...field.value?.checklist, enabled: checked as boolean }
                            })
                          }
                        />
                        <div className="flex flex-col w-full">
                          <Label>Checklist</Label>
                          <div className="flex flex-col items-start mt-2">
                            <p className="text-xs text-muted-foreground mb-1">
                              List items below separated by commas
                            </p>
                            <Input
                              value={field.value?.checklist?.items}
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  checklist: { ...field.value?.checklist, items: e.target.value }
                                })
                              }
                              placeholder="Item1, Item2, Item3"
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Separator /> */}

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
                <div className="flex flex-col w-full flex-1">
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
            <p className="text-sm text-red-500 flex justify-end">
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
            />
            <IconButton
              type="submit"
              className="w-[150px]"
              rightIcon="check"
              label="Publish"
              disabled={form.formState.isSubmitting}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};
