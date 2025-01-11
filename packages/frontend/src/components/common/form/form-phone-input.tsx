import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '../ui/form';
import { Control } from 'react-hook-form';
import { Icons } from '../icons';
import { PhoneInput } from '../ui/phone-input';

interface FormPhoneInputProps {
  name: string;
  label: string;
  placeholder: string;
  customError?: string;
  control?: Control<any>;
  required?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

export const FormPhoneInput = ({
  name,
  label,
  placeholder,
  customError,
  control: controlProp,
  required = false
}: FormPhoneInputProps) => {
  const formContext = useFormContext();
  const control = controlProp || formContext?.control;

  if (!control) {
    console.error(
      'Form control is missing - FormPhoneInput must be used within a FormProvider or with a control prop'
    );
    return null;
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const error = formContext?.formState?.errors[name];
        const showError = error;

        return (
          <FormItem className="w-full">
            <FormLabel
              className={cn(
                'text-neutral-dark-600 text-base font-medium',
                required && 'after:ml-1 after:content-["*"]'
              )}
            >
              {label}
            </FormLabel>
            <FormControl>
              <div className="space-y-2">
                <PhoneInput
                  className={cn(
                    'bg-neutral-light-100 h-12 w-full',
                    showError && 'border-error-500 focus-visible:ring-error-100'
                  )}
                  placeholder={placeholder}
                  {...field}
                  onChange={(value) => field.onChange(value)}
                />
              </div>
            </FormControl>
            {showError && (
              <div className="text-destructive-500 flex items-center gap-2">
                <Icons.info className="h-4 w-4" />
                <p className="text-sm">{customError}</p>
              </div>
            )}
          </FormItem>
        );
      }}
    />
  );
};
