import { Icons } from '../icons';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { IconInput } from '../ui/icon-input';
import { LabelInput } from '../ui/label-input';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '../ui/form';
import { Control } from 'react-hook-form';

interface FormInputProps {
  name: string;
  label: string;
  placeholder: string;
  customError?: string;
  hasInputIcon?: boolean;
  hasLabelInput?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  leftLabel?: string;
  rightLabel?: string;
  control?: Control<any>;
  required?: boolean;
  disabled?: boolean;
  type?: string;
}

export const FormInput = ({
  name,
  label,
  placeholder,
  customError,
  hasInputIcon = false,
  hasLabelInput = false,
  leftIcon,
  rightIcon,
  leftLabel,
  rightLabel,
  control: controlProp,
  disabled = false,
  required = false,
  type = 'text'
}: FormInputProps) => {
  const formContext = useFormContext();
  const control = controlProp || formContext?.control;

  if (!control) {
    console.error(
      'Form control is missing - FormInput must be used within a FormProvider or with a control prop'
    );
    return null;
  }

  const errors = formContext?.formState?.errors || {};
  const inputError = errors[name];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel
            className={cn('text-base font-medium text-gray-60', required && 'after:content-["*"]')}
          >
            {label}
          </FormLabel>
          <FormControl>
            {hasInputIcon ? (
              <IconInput
                placeholder={placeholder}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
                type={type}
                className={cn(
                  'w-full bg-gray-10',
                  inputError && 'border-destructive-50 focus-visible:ring-destructive-10',
                  disabled && 'bg-gray-10'
                )}
                {...field}
              />
            ) : hasLabelInput ? (
              <LabelInput
                placeholder={placeholder}
                leftLabel={leftLabel}
                rightLabel={rightLabel}
                type={type}
                className={cn(
                  'w-full bg-gray-10',
                  inputError && 'border-destructive-50 focus-visible:ring-destructive-10',
                  disabled && 'bg-gray-10'
                )}
                {...field}
              />
            ) : (
              <Input
                placeholder={placeholder}
                className={cn(
                  'w-full bg-gray-10',
                  inputError && 'border-destructive-50 focus-visible:ring-destructive-10',
                  disabled && 'bg-gray-10'
                )}
                {...field}
                type={type}
              />
            )}
          </FormControl>
          {inputError && (
            <div className="flex flex-row items-center gap-2">
              <Icons.info className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">
                {customError || (inputError as { message: string }).message}
              </p>
            </div>
          )}
        </FormItem>
      )}
    />
  );
};
