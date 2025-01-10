'use client';

import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '../ui/form';
import { Control } from 'react-hook-form';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Icons } from '../icons';

interface FormDatePickerProps {
  name: string;
  label: string;
  placeholder?: string;
  customError?: string;
  control?: Control<any>;
  required?: boolean;
  className?: string;
}

export const FormDatePicker = ({
  name,
  label,
  placeholder,
  customError,
  control: controlProp,
  required = false,
  className
}: FormDatePickerProps) => {
  const formContext = useFormContext();
  const control = controlProp || formContext?.control;

  if (!control) {
    console.error(
      'Form control is missing - FormDatePicker must be used within a FormProvider or with a control prop'
    );
    return null;
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const error = formContext?.formState?.errors[name];

        return (
          <FormItem className={cn('w-full', className)}>
            <FormLabel
              className={cn(
                'text-base font-medium text-gray-60',
                required && 'after:ml-1 after:content-["*"]',
                className
              )}
            >
              {label}
            </FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !field.value && 'text-gray-40',
                      error && 'border-destructive-50 focus-visible:ring-destructive-10',
                      className
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, 'PPP') : <span>{placeholder}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    className="w-full"
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            {error && (
              <div className="flex items-center gap-2 text-destructive-50">
                <Icons.info className="h-4 w-4" />
                <p className="text-sm text-destructive-50">
                  {(error as { message: string })?.message || customError}
                </p>
              </div>
            )}
          </FormItem>
        );
      }}
    />
  );
};
