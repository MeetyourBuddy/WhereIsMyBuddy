import { Loader2 } from 'lucide-react';

interface LoadingFallbackProps {
  text?: string;
  className?: string;
}

export function LoadingFallback({ text = 'Loading...', className = '' }: LoadingFallbackProps) {
  return (
    <div
      className={`flex min-h-[100px] flex-col items-center justify-center space-y-2 ${className}`}
    >
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
