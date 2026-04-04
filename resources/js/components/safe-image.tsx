import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Image as ImageIcon } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function SafeImage({ src, alt, className, fallback, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);
  
  const defaultFallback = 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=300&auto=format&fit=crop'; // Modern chair placeholder

  if (!src || error) {
    return (
      <div className={cn("flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-zinc-400 rounded-md", className)}>
        <ImageIcon className="w-1/3 h-1/3 opacity-20" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
