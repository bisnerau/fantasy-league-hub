import { cn } from '@/lib/utils';

// Adapted from React Bits SplitFlapText (MIT + Commons Clause) as CSS only.
// Each character is keyed by its value, so React remounts only the cells that
// change and the mount animation flaps just those digits.
export function SplitFlap({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <span className={cn('split-flap', className)} aria-hidden="true">
      {value.split('').map((character, index) => (
        <span key={`${index}-${character}`} className="split-flap-cell">
          {character}
        </span>
      ))}
    </span>
  );
}
