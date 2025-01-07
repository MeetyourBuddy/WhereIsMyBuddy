import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '../ui/form';
import { Control } from 'react-hook-form';
import { Textarea } from '../ui/textarea';
import { Icons } from '../icons';

interface FormTextareaProps {
  name: string;
  label: string;
  placeholder: string;
  customError?: string;
  control?: Control<any>;
  required?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

export const FormTextarea = ({
  name,
  label,
  placeholder,
  customError,
  control: controlProp,
  required = false,
  maxLength = 400,
  showCount = true
}: FormTextareaProps) => {
  const formContext = useFormContext();
  const control = controlProp || formContext?.control;

  if (!control) {
    console.error(
      'Form control is missing - FormTextarea must be used within a FormProvider or with a control prop'
    );
    return null;
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const charCount = field.value?.length || 0;
        const isOverLimit = charCount > maxLength;
        const error = formContext?.formState?.errors[name];
        const showError = error || (isOverLimit && field.value);

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
                <Textarea
                  className={cn(
                    'bg-neutral-light-100 h-[103px] max-h-[103px] w-full text-base',
                    showError && 'border-destructive-50 focus-visible:ring-destructive-10'
                  )}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= maxLength) {
                      field.onChange(e);
                    }
                  }}
                />
                <div className="flex flex-col gap-2">
                  {showError && (
                    <div className="flex items-center gap-2 text-destructive-50">
                      <Icons.info className="h-4 w-4" />
                      <p className="text-sm">{customError}</p>
                    </div>
                  )}
                  {showCount && (
                    <div className="flex items-center justify-end gap-2 text-gray-40">
                      <Icons.info className="h-4 w-4" />
                      <p className="text-sm">
                        {charCount}/{maxLength} characters
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};
