import { ArrowRight, BookOpen, Crown, Skull, Users } from 'lucide-react';
import { DraftCountdown } from '@/components/draft/draft-countdown';
import { ClubhousePicks } from '@/components/predictions/clubhouse-picks';
import { TeamAvatar } from '@/components/shared/team-avatar';
import { getDashboardData } from '@/lib/data/dashboard';
import { getPredictionWeekData } from '@/lib/data/predictions';
import { draftRecapContent } from '@/lib/data/draft-recap-content';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [data, predictions] = await Promise.all([
    getDashboardData(),
    getPredictionWeekData(),
  ]);
  const champion = data.reigningChampion;
  const draft = data.draft;
  const beforeDraft =
    data.leagueStatus === 'pre_draft' || data.leagueStatus === 'drafting';
  const published =
    draftRecapContent.published && draftRecapContent.entries.length > 0;
  const showCountdown = draft && draft.status !== 'complete' && beforeDraft;

  return (
    <div className="space-y-8 sm:space-y-10">
      <header className="clubhouse-masthead">
        <div>
          <p className="ui-kicker">
            Est. 2020 <span className="mx-2">/</span>{' '}
            {data.season ? `${data.season} season` : 'The league companion'}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] sm:text-4xl">
            The clubhouse.
          </h1>
        </div>
        <p className="max-w-56 text-sm leading-6 text-muted-foreground">
          Twelve managers.
          <br className="hidden sm:block" /> Plenty to answer for.
        </p>
      </header>
      {data.mode === 'unavailable' && (
        <output className="notice">
          League details are temporarily unavailable. Your picks and the record
          book are kept separately—nothing has been replaced with demo data.
        </output>
      )}
      <ClubhousePicks
        key={`${predictions.season}-${predictions.week}`}
        data={predictions}
      />
      <section aria-labelledby="league-stories-title">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="ui-kicker">From the league</p>
            <h2
              id="league-stories-title"
              className="mt-1 text-xl font-bold tracking-tight"
            >
              The talking points.
            </h2>
          </div>
          <span className="hidden text-xs text-muted-foreground sm:block">
            The part Sleeper doesn’t do.
          </span>
        </div>
        <div
          className={
            showCountdown
              ? 'grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]'
              : ''
          }
        >
          <a href="/draft-recap" className="story-feature group">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span className="ui-kicker text-primary">
                {draftRecapContent.season} draft report &amp; season preview
              </span>
              <span>
                {published
                  ? 'Published'
                  : beforeDraft
                    ? 'After the final pick'
                    : 'Recap being prepared'}
              </span>
            </div>
            <h3 className="mt-4 max-w-xl text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              {published
                ? 'The draft is done. Here’s the verdict.'
                : 'Good draft. Famous last words.'}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              {published
                ? draftRecapContent.overview
                : 'Draft grades, team outlooks, and a Leinster comparison for every roster. Written and reviewed after the draft—not published automatically.'}
            </p>
            <span className="clubhouse-text-link mt-6">
              {published ? 'Read the draft report' : 'About the draft report'}{' '}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>
          {showCountdown && <DraftCountdown startTime={draft.startTime} />}
        </div>
      </section>
      <section aria-labelledby="bragging-rights-title">
        <div className="mb-4">
          <p className="ui-kicker">Long memories</p>
          <h2
            id="bragging-rights-title"
            className="mt-1 text-xl font-bold tracking-tight"
          >
            Bragging rights. And the opposite.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="champion-spotlight rounded-xl p-5 sm:p-6">
            <div className="flex items-center gap-2 text-award">
              <Crown className="size-4" />
              <span className="ui-kicker text-award">
                Defending champion {champion && ` / ${champion.season}`}
              </span>
            </div>
            {champion ? (
              <>
                <a
                  href={
                    champion.franchiseId
                      ? `/managers#${champion.franchiseId}`
                      : '/managers'
                  }
                  className="mt-5 flex items-center gap-4"
                >
                  <TeamAvatar
                    avatar={champion.avatar}
                    name={champion.teamName}
                    className="size-14"
                  />
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold tracking-tight">
                      {champion.teamName}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {champion.ownerName} · {champion.wins}–{champion.losses}
                    </p>
                  </div>
                </a>
                <p className="mt-4 text-sm text-muted-foreground">
                  Still the name everyone is chasing.
                </p>
              </>
            ) : (
              <p className="mt-5 text-sm text-muted-foreground">
                The defending champion is unavailable right now. Past champions
                are in the record book.
              </p>
            )}
          </div>
          <a
            href="/wall-of-shame"
            className="story-feature flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <Skull className="size-4 text-muted-foreground" />
                <span className="ui-kicker">Wall of shame</span>
              </div>
              <h3 className="mt-4 text-2xl font-bold tracking-tight">
                The season ends.
                <br />
                The evidence stays.
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Last-place finishes. Real forfeits. A league with a very long
                memory.
              </p>
            </div>
            <span className="clubhouse-text-link mt-5">
              See the evidence <ArrowRight className="size-4" />
            </span>
          </a>
        </div>
        <div className="mt-5 grid divide-y divide-border border-y border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <a href="/records" className="clubhouse-directory-link">
            <BookOpen className="size-5 text-muted-foreground" />
            <span className="flex-1">
              <span className="block font-semibold">The record book</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Champions, podiums, and the all-time table.
              </span>
            </span>
            <ArrowRight className="size-4" />
          </a>
          <a href="/managers" className="clubhouse-directory-link">
            <Users className="size-5 text-muted-foreground" />
            <span className="flex-1">
              <span className="block font-semibold">Meet the managers</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                The names behind the questionable decisions.
              </span>
            </span>
            <ArrowRight className="size-4" />
          </a>
        </div>
      </section>
      <footer className="pb-2 text-xs leading-5 text-muted-foreground">
        MAC 12 · An independent league companion. Run your team on Sleeper.
        Settle the arguments here.
      </footer>
    </div>
  );
}
