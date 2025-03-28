import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/common/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/common/ui/form';
import { Input } from '@/components/common/ui/input';
import { Textarea } from '@/components/common/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/common/ui/radio-group';
import { useCheckIn } from '@/lib/hooks/use-checkin';
import { CheckInType } from '@/types/checkin-types';
import { checkInValidationSchema } from '@/lib/validation/checkin-validation';
import type { z } from 'zod';
import { Checkbox } from '@/components/common/ui/checkbox';

interface CheckInFormProps {
  activityId: string;
  allowedTypes: CheckInType[];
  onSuccess?: () => void;
}

type CheckInFormData = z.infer<typeof checkInValidationSchema>;

export const CheckInForm = ({ activityId, allowedTypes, onSuccess }: CheckInFormProps) => {
  const { submitCheckIn, isLoading } = useCheckIn(activityId);
  const [activeType, setActiveType] = useState<CheckInType>(allowedTypes[0]);

  const form = useForm<CheckInFormData>({
    resolver: zodResolver(checkInValidationSchema),
    defaultValues: {
      type: activeType,
      content: {
        type: activeType,
        content: {
          imageUrl: '',
          caption: ''
        }
      }
    }
  });

  const onSubmit = async (data: CheckInFormData) => {
    await submitCheckIn(data.type, data.content);
    onSuccess?.();
  };

  const handleTypeChange = (type: CheckInType) => {
    setActiveType(type);
    form.reset({
      type,
      content: {
        type,
        content: getDefaultContentForType(type)
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check-in Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleTypeChange(value as CheckInType);
                  }}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  {allowedTypes.map((type) => (
                    <FormItem key={type} className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value={type} />
                      </FormControl>
                      <FormLabel className="font-normal capitalize">{type.toLowerCase()}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {activeType === CheckInType.PHOTO && (
          <>
            <FormField
              control={form.control}
              name="content.content.imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter photo URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content.content.caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Add a caption" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {activeType === CheckInType.CHECKLIST && (
          <FormField
            control={form.control}
            name="content.content.items"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tasks</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {field.value?.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={(checked) => {
                            const newItems = [...field.value];
                            newItems[index] = { ...item, completed: checked as boolean };
                            field.onChange(newItems);
                          }}
                        />
                        <Input
                          value={item.text}
                          onChange={(e) => {
                            const newItems = [...field.value];
                            newItems[index] = { ...item, text: e.target.value };
                            field.onChange(newItems);
                          }}
                          placeholder="Task description"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newItems = field.value.filter((_, i) => i !== index);
                            field.onChange(newItems);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        field.onChange([...field.value, { text: '', completed: false }]);
                      }}
                    >
                      Add Task
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {activeType === CheckInType.HOURS && (
          <>
            <FormField
              control={form.control}
              name="content.content.hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hours Spent</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter hours"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content.content.notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any notes about your progress..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Check-in'}
        </Button>
      </form>
    </Form>
  );
};

function getDefaultContentForType(type: CheckInType) {
  switch (type) {
    case CheckInType.PHOTO:
      return { imageUrl: '', caption: '' };
    case CheckInType.CHECKLIST:
      return { items: [] };
    case CheckInType.HOURS:
      return { hours: 0, notes: '' };
  }
}
