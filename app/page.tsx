import { ArrowUpRight, CircleDollarSign, Flame, Radio, Repeat2, Sparkles, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MatchupCard } from '@/components/cards/matchup-card';
import { StandingsSnapshot } from '@/components/cards/standings-snapshot';
import { getDashboardData } from '@/lib/data/dashboard';

export const revalidate = 300;

const activityIcons = {
  trade: Repeat2,
  waiver: CircleDollarSign,
  free_agent: UserPlus,
};

export default async function Home() {
  const data = await getDashboardData();
  const highScorer = data.matchups
    .flatMap((matchup) => [
      { team: matchup.home, score: matchup.homeScore },
      { team: matchup.away, score: matchup.awayScore },
    ])
    .sort((a, b) => b.score - a.score)[0];

  return (
    <div className="space-y-6">
      {data.mode === 'demo' && (
        <output className="setup-banner">
          <span className="flex items-center gap-2 font-bold text-foreground"><Radio className="size-4 text-primary" /> Demo league on the field</span>
          <span>Add your Sleeper ID to <code>NEXT_PUBLIC_SLEEPER_LEAGUE_ID</code> and this board switches to live data automatically.</span>
        </output>
      )}

      <section className="dashboard-hero">
        <div>
          <div className="flex items-center gap-2">
            <span className="live-dot" />
            <p className="section-kicker">{data.statusLabel}</p>
          </div>
          <h1 className="mt-3 max-w-3xl font-heading text-3xl font-black leading-[0.98] tracking-[-0.045em] sm:text-5xl lg:text-[54px]">
            The league moves<br /><span className="text-primary">on Sundays.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">Scores, playoff pressure and every move that changes the week—one live board for the whole league.</p>
        </div>
        <div className="hero-record">
          <p className="section-kicker">Week’s pace setter</p>
          <div className="mt-3 flex items-end justify-between gap-5">
            <div>
              <p className="max-w-[180px] font-heading text-lg font-black leading-tight">{highScorer?.team.teamName ?? 'Kickoff pending'}</p>
              <p className="mt-1 text-xs text-muted-foreground">{highScorer?.team.ownerName ?? 'Scores arrive here'}</p>
            </div>
            <span className="score-number text-4xl text-primary sm:text-5xl">{highScorer?.score.toFixed(1) ?? '—'}</span>
          </div>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/8"><div className="h-full w-[82%] rounded-full bg-primary shadow-[0_0_14px_var(--league-primary)]" /></div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="section-kicker">Scoreboard</p>
            <h2 className="mt-1 font-heading text-xl font-black tracking-tight">This week’s matchups</h2>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground">{data.updatedAt}</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
          {data.matchups.map((matchup) => <MatchupCard key={matchup.matchupId} matchup={matchup} />)}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,.8fr)]">
        <div className="grid gap-4 md:grid-cols-2">
          <StandingsSnapshot standings={data.standings} />

          <Card className="gap-0 p-0">
            <div className="border-b border-white/8 px-4 py-4 sm:px-5">
              <p className="section-kicker">League wire</p>
              <h2 className="mt-1 font-heading text-lg font-black tracking-tight">Latest moves</h2>
            </div>
            <div className="divide-y divide-white/[0.055]">
              {data.activities.map((activity) => {
                const Icon = activityIcons[activity.type];
                return (
                  <div key={activity.id} className="group flex gap-3 px-4 py-3.5 sm:px-5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/[0.035] text-primary"><Icon className="size-4" /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2"><p className="text-xs font-bold">{activity.title}</p><span className="shrink-0 font-mono text-[9px] text-muted-foreground">{activity.time}</span></div>
                      <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-muted-foreground">{activity.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-primary/[0.09] via-card to-card p-5">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2"><Sparkles className="size-4 text-primary" /><span className="section-kicker text-primary">Season pulse</span></span><span className="font-mono text-[9px] text-muted-foreground">AUTO-DETECTED</span></div>
            <div className="mt-5 space-y-4">
              {data.narratives.map((narrative, index) => (
                <div key={narrative} className="grid grid-cols-[22px_1fr] gap-3">
                  <span className="font-mono text-xs font-black text-primary/50">0{index + 1}</span>
                  <p className="text-xs font-semibold leading-5">{narrative}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="gap-0 p-0">
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-4 sm:px-5">
              <div><p className="section-kicker">Sleeper trends</p><h2 className="mt-1 font-heading text-lg font-black">Hot on the wire</h2></div>
              <Flame className="size-5 text-accent" />
            </div>
            <div className="divide-y divide-white/[0.055]">
              {data.trending.map((player, index) => (
                <div key={player.id} className="grid grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-5">
                  <span className="font-mono text-xs font-black text-muted-foreground">{index + 1}</span>
                  <div className="min-w-0"><p className="truncate text-xs font-bold">{player.name}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{player.position} · {player.team} · {player.count.toLocaleString()} adds</p></div>
                  {player.available ? <Badge className="bg-primary/10 text-[9px] font-bold text-primary">AVAILABLE</Badge> : <span className="max-w-24 truncate text-[9px] text-muted-foreground">{player.rosteredBy}</span>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <footer className="flex flex-col justify-between gap-3 border-t border-white/8 pt-5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:flex-row">
        <span>{data.leagueName} · {data.season}</span>
        <span className="flex items-center gap-1.5">Powered by Sleeper data <ArrowUpRight className="size-3" /></span>
      </footer>
    </div>
  );
}
