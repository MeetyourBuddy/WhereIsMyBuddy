import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/ui/avatar';
import { cn } from '@/lib/utils';

interface AvatarStackProps {
  users: Array<{
    name: string;
    image?: string;
  }>;
  maxCount?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarStack({ users, maxCount = 3, size = 'md', className }: AvatarStackProps) {
  const visibleUsers = users.slice(0, maxCount);
  const remainingCount = users.length - maxCount;
  const hasMoreUsers = remainingCount > 0;

  const sizeClasses = {
    sm: 'h-6 w-6 -ml-2 first:ml-0',
    md: 'h-8 w-8 -ml-3 first:ml-0',
    lg: 'h-10 w-10 -ml-4 first:ml-0'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn('flex items-center', className)}>
      {visibleUsers.map((user, index) => (
        <Avatar
          key={index}
          className={cn('border-2 border-background bg-warning-50 ring-0', sizeClasses[size])}
        >
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      ))}
      {hasMoreUsers && (
        <div
          className={cn(
            'z-[10] flex items-center justify-center rounded-full border-2 border-background bg-muted-foreground font-medium text-muted-foreground',
            sizeClasses[size]
          )}
        >
          <span className="text-xs text-white">+{remainingCount}</span>
        </div>
      )}
    </div>
  );
}
