import { cn } from '@/lib/utils';
import { Icons } from '@/components/common/icons';

interface IconFrameProps {
  className?: string;
  icon: keyof typeof Icons;
  iconClassName?: string;
}

export const IconFrame = ({ className, icon, iconClassName }: IconFrameProps) => {
  const IconComponent = Icons[icon];

  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-gray-10',
        className
      )}
    >
      <IconComponent className={cn('h-full w-full', iconClassName)} />
    </div>
  );
};
