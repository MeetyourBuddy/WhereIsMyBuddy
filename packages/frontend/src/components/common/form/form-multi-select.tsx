import { Icons } from '../icons';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';

import { FormField, FormItem, FormLabel, FormControl } from '../ui/form';
import { Control } from 'react-hook-form';
import { MultiSelect } from '../ui/multi-select';

interface FormMultiSelectProps {
  name: string;
  label: string;
  placeholder: string;
  customError?: string;
  control?: Control<any>;
  required?: boolean;
  options: {
    label: string;
    value: string;
  }[];
  maxCount?: number;
}

export const FormMultiSelect = ({
  name,
  label,
  placeholder,
  customError,
  control: controlProp,
  required = false,
  options,
  maxCount = 5
}: FormMultiSelectProps) => {
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
        <FormItem>
          <FormLabel
            className={cn(
              'text-base font-medium text-gray-60',
              required && 'after:ml-1 after:content-["*"]'
            )}
          >
            {label}
          </FormLabel>
          <FormControl>
            <MultiSelect
              options={options}
              onValueChange={field.onChange}
              defaultValue={field.value}
              placeholder={placeholder}
              variant="inverted"
              animation={2}
              maxCount={maxCount}
              className={cn(showError && 'border-destructive-50 focus-visible:ring-destructive-10')}
            />
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
