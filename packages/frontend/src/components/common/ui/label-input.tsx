import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';

interface LabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
  setState?: (state: boolean) => void;
  state?: boolean;
}

const LabelInput = forwardRef<HTMLInputElement, LabelInputProps>(
  ({ leftLabel, rightLabel, className, setState, state, ...rest }, ref) => {
    return (
      <div className="relative flex flex-row items-center">
        <Input
          ref={ref}
          type="text"
          className={cn(
            'h-12 w-full rounded-md text-base',
            leftLabel && 'pl-[95px]',
            rightLabel && 'pr-[95px]',
            className
          )}
          {...rest}
        />

        {leftLabel && (
          <div className="absolute left-0 flex h-full max-w-[83px] items-center">
            <span className="border-neutral-light-300 text-neutral-dark-100 flex h-full w-[83px] items-center border-r px-4 text-base">
              {leftLabel}
            </span>
          </div>
        )}

        {rightLabel && (
          <div
            className="absolute right-0 flex h-full cursor-pointer items-center px-3"
            onClick={() => setState?.(!state)}
          >
            <span className="border-neutral-light-300 text-neutral-dark-100 flex h-full w-[83px] items-center border-l text-base">
              {rightLabel}
            </span>
          </div>
        )}
      </div>
    );
  }
);

// Add display name for better debugging
LabelInput.displayName = 'LabelInput';

export { LabelInput };
