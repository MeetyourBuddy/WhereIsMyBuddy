import { forwardRef } from 'react';
import { Icons } from '../icons';
import { cn } from '@/lib/utils';
import { Input } from './input';

interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: string;
  rightIcon?: string;
  className?: string;
  setState?: (state: boolean) => void;
  state?: boolean;
}

const IconInput = forwardRef<HTMLInputElement, IconInputProps>(
  ({ leftIcon = '', rightIcon = '', className, setState, state, ...rest }, ref) => {
    const LeftIcon = Icons[leftIcon as keyof typeof Icons];
    const RightIcon = Icons[rightIcon as keyof typeof Icons];

    return (
      <div className="relative flex flex-row items-center gap-2">
        {leftIcon && <LeftIcon className="text-neutral-dark-100 absolute left-3 h-6 w-6" />}
        <Input
          ref={ref}
          type="text"
          className={cn('h-12 w-full rounded-md', leftIcon && 'pl-11', className)}
          {...rest}
        />
        {rightIcon && (
          <div
            className="absolute right-3 m-0 flex cursor-pointer items-center justify-center"
            onClick={() => setState?.(!state)}
          >
            <RightIcon className="text-neutral-dark-100 h-6 w-6" />
          </div>
        )}
      </div>
    );
  }
);

// Add display name for better debugging
IconInput.displayName = 'IconInput';

export { IconInput };
