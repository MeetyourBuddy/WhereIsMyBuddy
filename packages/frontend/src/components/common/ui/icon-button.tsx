import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Icons } from '../icons';

type IconButtonVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'link'
  | null
  | undefined;

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  leftIcon?: string;
  rightIcon?: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  label?: string;
  iconClassName?: string;
  variant?: IconButtonVariant;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { leftIcon, rightIcon, className, onClick, type, label, variant, iconClassName, ...rest },
    ref
  ) => {
    const LeftIcon = Icons[leftIcon as keyof typeof Icons];
    const RightIcon = Icons[rightIcon as keyof typeof Icons];

    return (
      <Button
        ref={ref}
        type={type}
        variant={variant}
        className={cn('w-full rounded-xl', className)}
        onClick={onClick}
        {...rest}
      >
        {leftIcon && <LeftIcon className={cn('h-6 w-6', iconClassName)} />}
        {label}
        {rightIcon && (
          <div className="flex items-center">
            <RightIcon className={cn('', iconClassName)} />
          </div>
        )}
      </Button>
    );
  }
);

// Add display name for better debugging
IconButton.displayName = 'IconButton';

export { IconButton };
