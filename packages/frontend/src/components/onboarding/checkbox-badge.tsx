import { Checkbox } from '@/components/common/ui/checkbox';
import { cn } from '@/lib/utils';

export const CustomCheckbox = ({
  value,
  checked,
  onChange
}: {
  value: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => {
  return (
    <div className="relative">
      <Checkbox
        id={value}
        value={value}
        aria-label="options"
        className="peer absolute h-0 w-0 opacity-0"
        checked={checked}
        onCheckedChange={onChange}
      />
      <label
        htmlFor={value}
        className={cn(
          'flex cursor-pointer flex-row items-center justify-center gap-2 rounded-full border-2 border-gray-200 px-4 py-2',
          'peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5'
        )}
      >
        {value}
      </label>
    </div>
  );
};
