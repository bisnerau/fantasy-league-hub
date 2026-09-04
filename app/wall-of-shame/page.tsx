import type { Metadata } from 'next';
import {
  Beer,
  Camera,
  CheckCircle2,
  MapPin,
  Ship,
  Shirt,
  Skull,
  UtensilsCrossed,
} from 'lucide-react';
import Image from 'next/image';
import { TeamAvatar } from '@/components/shared/team-avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { leagueConfig } from '@/lib/config/league.config';
import { activeForfeit, forfeits } from '@/lib/data/wall-of-shame';
import { ownerFranchiseMap } from '@/lib/data/verified-history';
import { getLeagueUsers } from '@/lib/sleeper/client';

export const metadata: Metadata = {
  title: 'Wall of Shame',
  description:
    'Last place means a forfeit. Relive every punishment in MAC 12 history.',
};

export const revalidate = 86400;

const requirementIcons = [Ship, Shirt, Beer, Camera, CheckCircle2];

async function getFranchiseAvatars(): Promise<Record<string, string | null>> {
  if (!leagueConfig.sleeperLeagueId) return {};
  try {
    const users = await getLeagueUsers(leagueConfig.sleeperLeagueId);
    const avatars: Record<string, string | null> = {};
    for (const user of users) {
      const franchiseId = ownerFranchiseMap[user.user_id];
      if (franchiseId) {
        avatars[franchiseId] =
          leagueConfig.teamAvatarOverrides[user.user_id] ??
          user.metadata?.avatar ??
          user.avatar ??
          null;
      }
    }
    return avatars;
  } catch {
    return {};
  }
}

export default async function WallOfShamePage() {
  const avatars = await getFranchiseAvatars();
  const completedForfeits = forfeits.filter((f) => f.forfeit && f.managerName);
  const totalVictims = new Set(forfeits.map((f) => f.franchiseId)).size;
  const totalForfeits = forfeits.length + 1;

  return (
    <div className="space-y-7">
      <section className="records-hero">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <Skull className="size-4 text-primary" />
            <p className="section-kicker text-primary">
              The forfeit archive · 2020–present
            </p>
          </div>
          <h1 className="mt-3 max-w-3xl font-heading text-3xl font-black leading-none tracking-[-0.045em] sm:text-5xl">
            Last place has
            <br />
            <span className="text-primary">consequences.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Every season, the bottom of the table pays the price. This is where
            those moments live forever.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-2 sm:max-w-md lg:ml-auto lg:w-full">
          <div className="record-stat">
            <span>{totalForfeits}</span>
            <small>Forfeits</small>
          </div>
          <div className="record-stat">
            <span>{totalVictims}</span>
            <small>Victims</small>
          </div>
          <div className="record-stat">
            <span>{completedForfeits.length}</span>
            <small>Documented</small>
          </div>
        </div>
      </section>

      <section aria-labelledby="active-forfeit-title">
        <Card className="relative gap-0 overflow-hidden border-primary/25 bg-card/95 py-0 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
          <div className="pointer-events-none absolute -right-28 -top-36 size-80 rounded-full border-[60px] border-primary/[0.045]" />

          <div className="relative grid lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,.75fr)]">
            <div className="p-5 sm:p-7 lg:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="h-6 bg-primary px-2.5 text-[10px] font-black uppercase tracking-[0.12em] text-primary-foreground">
                  {activeForfeit.year} forfeit
                </Badge>
                <Badge
                  variant="outline"
                  className="h-6 border-emerald-300/20 bg-emerald-300/[0.06] px-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-300"
                >
                  <span className="live-dot" />
                  {activeForfeit.status}
                </Badge>
              </div>

              <h2
                id="active-forfeit-title"
                className="mt-5 font-heading text-3xl font-black tracking-[-0.045em] sm:text-4xl"
              >
                {activeForfeit.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {activeForfeit.summary}
              </p>

              <ol className="mt-7 space-y-1">
                {activeForfeit.requirements.map((requirement, index) => {
                  const Icon = requirementIcons[index];
                  return (
                    <li
                      key={requirement.title}
                      className="grid grid-cols-[36px_1fr] gap-3 rounded-xl border border-transparent px-1 py-3 sm:grid-cols-[40px_1fr] sm:gap-4 sm:px-2"
                    >
                      <span className="flex size-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/[0.08] text-primary sm:size-10">
                        <Icon className="size-4" />
                      </span>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-[9px] font-black text-primary/70">
                            0{index + 1}
                          </span>
                          <h3 className="text-sm font-semibold text-foreground">
                            {requirement.title}
                          </h3>
                        </div>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-[13px]">
                          {requirement.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <aside className="border-t border-white/[0.07] bg-black/[0.12] p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-8">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <p className="section-kicker text-primary">
                  Approved departures
                </p>
              </div>
              <h3 className="mt-2 font-heading text-xl font-black">
                Pick your punishment
              </h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Comparable journeys, wherever the loser calls home.
              </p>

              <div className="mt-6 space-y-2.5">
                {activeForfeit.destinations.map((destination) => (
                  <div
                    key={destination.city}
                    className="rounded-xl border border-white/[0.075] bg-white/[0.025] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-foreground">
                        {destination.city}
                      </span>
                      <Ship className="size-3.5 text-primary" />
                    </div>
                    <p className="mt-2 text-sm font-medium">
                      {destination.route}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                      {destination.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-white/[0.018] p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Last-place finisher
                </p>
                <p className="mt-2 font-heading text-lg font-black text-foreground">
                  {activeForfeit.loser}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  The standings will decide their fate.
                </p>
              </div>
            </aside>
          </div>

          <div className="relative flex flex-col gap-2 border-t border-primary/15 bg-primary/[0.045] px-5 py-3 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-8">
            <span className="flex items-center gap-2">
              <UtensilsCrossed className="size-3.5 text-primary" />
              Burger, alcohol-free beer and cardboard company included.
            </span>
            <strong className="text-[9px] uppercase tracking-[0.14em] text-primary">
              No shortcuts · Full game required
            </strong>
          </div>
        </Card>
      </section>

      <section>
        <div className="mb-5">
          <p className="section-kicker">Season by season</p>
          <h2 className="mt-1 font-heading text-xl font-black">
            The hall of infamy
          </h2>
        </div>

        <div className="space-y-4">
          {forfeits.map((forfeit) => (
            <a
              key={forfeit.year}
              href={`/managers#${forfeit.franchiseId}`}
              className="block overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm"
            >
              <div className="flex flex-col md:flex-row">
                {forfeit.image ? (
                  <div className="relative aspect-[4/3] w-full shrink-0 md:aspect-square md:w-72">
                    <Image
                      src={forfeit.image}
                      alt={`${forfeit.managerName || forfeit.teamName} - ${forfeit.year} forfeit`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] w-full shrink-0 items-center justify-center bg-white/[0.02] md:aspect-square md:w-72">
                    <Skull className="size-12 text-white/10" />
                  </div>
                )}

                <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xl font-black text-primary">
                      {forfeit.year}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                      Season {forfeit.year - 2019}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2.5">
                    <TeamAvatar
                      avatar={avatars[forfeit.franchiseId] ?? null}
                      name={forfeit.teamName}
                      className="size-8"
                    />
                    <div>
                      <span className="font-heading text-lg font-black">
                        {forfeit.teamName}
                      </span>
                      {forfeit.managerName && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {forfeit.managerName.split(' ')[0]}
                          {forfeit.record ? ` · ${forfeit.record}` : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  {forfeit.forfeit ? (
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                      {forfeit.forfeit}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm italic text-muted-foreground/50">
                      Forfeit details coming soon...
                    </p>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
