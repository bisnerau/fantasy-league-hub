import { Radio } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { TeamAvatar } from '@/components/shared/team-avatar';
import type { MatchupCard as MatchupCardType } from '@/lib/data/dashboard';

function TeamRow({
  team,
  score,
  leader,
}: {
  team: MatchupCardType['home'];
  score: number;
  leader: boolean;
}) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
      <TeamAvatar avatar={team.avatar} name={team.teamName} />
      <div className="min-w-0">
        <p className="truncate text-sm font-bold">{team.teamName}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{team.wins}-{team.losses} · #{team.rank}</p>
      </div>
      <span className={`score-number text-2xl ${leader ? 'text-foreground' : 'text-muted-foreground'}`}>{score.toFixed(1)}</span>
    </div>
  );
}

export function MatchupCard({ matchup }: { matchup: MatchupCardType }) {
  return (
    <Card className="matchup-card relative gap-0 p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Matchup {matchup.matchupId}</span>
        {matchup.state === 'live' ? (
          <Badge className="gap-1 border-primary/20 bg-primary/10 text-[9px] font-black uppercase tracking-widest text-primary"><Radio className="size-2.5" /> Live</Badge>
        ) : (
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Final</span>
        )}
      </div>
      <div className="space-y-4">
        <TeamRow team={matchup.home} score={matchup.homeScore} leader={matchup.homeScore >= matchup.awayScore} />
        <div className="ml-12 h-px bg-white/8" />
        <TeamRow team={matchup.away} score={matchup.awayScore} leader={matchup.awayScore >= matchup.homeScore} />
      </div>
    </Card>
  );
}
