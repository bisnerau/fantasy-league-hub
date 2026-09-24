import { Crown } from 'lucide-react';
import { TeamAvatar } from '@/components/shared/team-avatar';
import type { DashboardData } from '@/lib/data/dashboard';

// Styled after React Bits ReflectiveCard and ProfileCard: a foil trading card
// whose sheen moves with scrolling, in CSS only.
export function ChampionCard({
  champion,
}: {
  champion: DashboardData['reigningChampion'];
}) {
  if (!champion)
    return (
      <a href="/records" className="trading-card">
        <span className="trading-card-foil">
          <Crown className="size-3.5" aria-hidden="true" /> Champion
        </span>
        <span className="mt-auto text-sm text-muted-foreground">
          The defending champion is unavailable right now. Past champions are in
          the record book.
        </span>
      </a>
    );
  return (
    <a
      href={
        champion.franchiseId ? `/managers#${champion.franchiseId}` : '/managers'
      }
      className="trading-card"
      aria-label={`Defending champion ${champion.season}: ${champion.teamName}, ${champion.ownerName}, ${champion.wins}–${champion.losses}`}
    >
      <span className="holo-sheen" aria-hidden="true" />
      <span className="trading-card-foil">
        <Crown className="size-3.5" aria-hidden="true" /> Champion{' '}
        {champion.season}
      </span>
      <TeamAvatar
        avatar={champion.avatar}
        name={champion.teamName}
        className="mx-auto mt-4 size-16 ring-2 ring-award/60"
      />
      <span className="mt-3 block text-center text-base font-black leading-tight tracking-tight">
        <span className="shiny-text">{champion.teamName}</span>
      </span>
      <span className="mt-1 block text-center text-xs text-muted-foreground">
        {champion.ownerName}
      </span>
      <span className="trading-card-stats">
        <span>
          <strong>{champion.wins}</strong> W
        </span>
        <span>
          <strong>{champion.losses}</strong> L
        </span>
      </span>
    </a>
  );
}
