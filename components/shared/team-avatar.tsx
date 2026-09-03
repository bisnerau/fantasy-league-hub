import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export function TeamAvatar({
  avatar,
  name,
  className,
  style,
}: {
  avatar: string | null;
  name: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const source = avatar
    ? avatar.startsWith('http')
      ? avatar
      : `https://sleepercdn.com/avatars/thumbs/${avatar}`
    : undefined;
  const initials = name
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2);

  return (
    <Avatar
      className={cn('size-9 border border-white/10 bg-muted', className)}
      style={style}
    >
      {source && <AvatarImage src={source} alt="" />}
      <AvatarFallback className="bg-gradient-to-br from-primary/25 to-secondary/25 font-heading text-[10px] font-black text-foreground">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
