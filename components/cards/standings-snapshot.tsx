import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { TeamAvatar } from '@/components/shared/team-avatar';
import type { TeamStanding } from '@/lib/data/dashboard';

export function StandingsSnapshot({
  standings,
}: {
  standings: TeamStanding[];
}) {
  return (
    <Card className="gap-0 overflow-visible p-0">
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-4 sm:px-5">
        <div>
          <p className="section-kicker">Playoff picture</p>
          <h2 className="mt-1 font-heading text-lg font-black tracking-tight">
            Standings
          </h2>
        </div>
        <a
          href="/standings"
          className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          Full table <ArrowRight className="size-3.5" />
        </a>
      </div>
      <div>
        {standings.slice(0, 6).map((team, index) => (
          <div
            key={team.rosterId}
            className={`grid grid-cols-[24px_auto_minmax(0,1fr)_auto] items-center gap-2.5 px-4 py-2.5 sm:px-5 ${index === 5 ? 'relative border-b-2 border-dashed border-primary/30' : 'border-b border-white/[0.055]'}`}
          >
            <span
              className={`font-mono text-xs font-black ${index < 3 ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {team.rank}
            </span>
            <TeamAvatar
              avatar={team.avatar}
              name={team.teamName}
              className="size-7"
            />
            <div className="min-w-0">
              <p className="truncate text-xs font-bold">{team.teamName}</p>
              <p className="truncate text-[10px] text-muted-foreground">
                {team.ownerName}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs font-bold">
                {team.wins}-{team.losses}
              </p>
              <p className="text-[9px] text-muted-foreground">
                {team.pointsFor.toFixed(1)} PF
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
