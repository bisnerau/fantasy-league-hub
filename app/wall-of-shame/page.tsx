import type { Metadata } from 'next';
import { Skull } from 'lucide-react';
import Image from 'next/image';
import { TeamAvatar } from '@/components/shared/team-avatar';
import { Card } from '@/components/ui/card';
import { leagueConfig } from '@/lib/config/league.config';
import { forfeits } from '@/lib/data/wall-of-shame';
import { ownerFranchiseMap } from '@/lib/data/verified-history';
import { getLeagueUsers } from '@/lib/sleeper/client';

export const metadata: Metadata = {
  title: 'Wall of Shame',
  description:
    'Last place means a forfeit. Relive every punishment in MAC 12 history.',
};

export const revalidate = 86400;

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
            <span>{forfeits.length}</span>
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

      <section>
        <div className="mb-5">
          <p className="section-kicker">Season by season</p>
          <h2 className="mt-1 font-heading text-xl font-black">
            The hall of infamy
          </h2>
        </div>

        <div className="space-y-4">
          {forfeits.map((forfeit) => (
            <Card key={forfeit.year} className="overflow-hidden p-0">
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
                          <a href={`/managers#${forfeit.franchiseId}`} className="hover:text-primary">{forfeit.managerName.split(' ')[0]}</a>
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
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
