import { Icons } from '../icons';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';

import { FormField, FormItem, FormLabel, FormControl } from '../ui/form';
import { Control } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface FormSelectProps {
  name: string;
  label: string;
  placeholder: string;
  customError?: string;
  control?: Control<any>;
  required?: boolean;
  disabled?: boolean;
  options: {
    label: string;
    value: string;
  }[];
  className?: string;
}

export const FormSelect = ({
  name,
  label,
  placeholder,
  customError,
  control: controlProp,
  required = false,
  disabled = false,
  className,
  options
}: FormSelectProps) => {
  const formContext = useFormContext();
  const control = controlProp || formContext?.control;

  if (!control) {
    console.error(
      'Form control is missing - FormSelect must be used within a FormProvider or with a control prop'
    );
    return null;
  }

  const errors = formContext?.formState?.errors || {};
  const showError = errors[name];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
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
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
              <SelectTrigger
                className={cn(
                  'w-full bg-gray-10',
                  showError && 'border-destructive focus-visible:ring-destructive-10'
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {showError && (
            <div className="flex items-center gap-2">
              <Icons.info className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">{customError}</p>
            </div>
          )}
        </FormItem>
      )}
    />
  );
};
