import { Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type SafeImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function SafeImage({ src, alt, className, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

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
