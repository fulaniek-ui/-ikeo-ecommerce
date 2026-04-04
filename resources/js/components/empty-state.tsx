import { Link } from '@inertiajs/react';
import type { LucideIcon} from 'lucide-react';
import { Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = Ghost,
  actionLabel,
  actionHref,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in duration-500",
      className
    )}>
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-black/40 border border-zinc-100 dark:border-zinc-800 transition-transform hover:scale-110 duration-500">
          <Icon className="h-10 w-10 text-zinc-400 dark:text-zinc-500" />
        </div>
      </div>
      
      <h3 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground max-w-[320px] mx-auto mb-8 text-sm leading-relaxed">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Button asChild className="rounded-xl h-11 px-8 font-bold shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 transition-all hover:-translate-y-0.5">
          <Link href={actionHref}>
            {actionLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}
