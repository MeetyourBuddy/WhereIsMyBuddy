import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '../ui/form';
import { Control } from 'react-hook-form';
import { Icons } from '../icons';
import { CountryDropdown } from '../ui/country-dropdown';

interface FormCountryDropdownProps {
  name: string;
  label: string;
  placeholder: string;
  customError?: string;
  control?: Control<any>;
  required?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

export const FormCountryDropdown = ({
  name,
  label,
  placeholder,
  customError,
  control: controlProp,
  required = false
}: FormCountryDropdownProps) => {
  const formContext = useFormContext();
  const control = controlProp || formContext?.control;

  if (!control) {
    console.error(
      'Form control is missing - FormCountryDropdown must be used within a FormProvider or with a control prop'
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
                'text-base font-medium text-gray-60',
                required && 'after:ml-1 after:content-["*"]'
              )}
            >
              {label}
            </FormLabel>
            <FormControl>
              <div className="space-y-2">
                <CountryDropdown
                  className={cn(
                    'w-full bg-gray-10',
                    showError && 'border-destructive-50 focus-visible:ring-destructive-10'
                  )}
                  placeholder={placeholder}
                  {...field}
                  onChange={(value) => field.onChange(value)}
                />
              </div>
            </FormControl>
            {showError && (
              <div className="flex items-center gap-2">
                <Icons.info className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">{customError}</p>
              </div>
            )}
          </FormItem>
        );
      }}
    />
  );
};
