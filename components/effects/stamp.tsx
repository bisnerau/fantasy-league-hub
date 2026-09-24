import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type StampTone = 'default' | 'gold' | 'win' | 'loss' | 'muted';

// A rubber stamp that thumps down once on mount (static under reduced motion).
export function Stamp({
  children,
  tone = 'default',
  className,
}: {
  children: ReactNode;
  tone?: StampTone;
  className?: string;
}) {
  return (
    <span className={cn('stamp', className)} data-tone={tone}>
      {children}
    </span>
  );
}
