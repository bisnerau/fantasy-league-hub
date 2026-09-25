import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { ChampionCard } from '@/components/clubhouse/champion-card';
import { EndZone, Field } from '@/components/clubhouse/field';
import { FlagOnThePlayCard } from '@/components/clubhouse/flag-on-the-play';
import { LeadStory, TalkingPoints } from '@/components/clubhouse/lead-story';
import { LeagueWire } from '@/components/clubhouse/league-wire';
import { MatchTicket } from '@/components/clubhouse/match-ticket';
import { RankingsDeck } from '@/components/clubhouse/rankings-deck';
import { Scoreboard } from '@/components/clubhouse/scoreboard';
import { ShameSticker } from '@/components/clubhouse/shame-sticker';
import { DraftCountdown } from '@/components/draft/draft-countdown';
import { CutLineHero } from '@/components/standings/cut-line-hero';
import {
  ClubhouseMemberProvider,
  PicksHero,
  PredictionRace,
} from '@/components/predictions/clubhouse-picks';
import {
  getClubhouseEditorial,
  getLeadBesideTicket,
} from '@/lib/data/clubhouse-editorial';
import { getDashboardData } from '@/lib/data/dashboard';
import { draftRecapContent } from '@/lib/data/draft-recap-content';
import { getFlagOnThePlay } from '@/lib/data/flags-on-the-play';
import { getLeagueWire } from '@/lib/data/league-wire';
import { getMatchOfTheWeek } from '@/lib/data/match-of-the-week';
import { getLatestAuthoredReviewWeek } from '@/lib/data/matchup-newsletters';
import {
  getPredictionWeekData,
  type PredictionTeam,
  type PredictionWeekData,
} from '@/lib/data/predictions';
import { gamesPlayed, getCutLine } from '@/lib/data/standings';

export const dynamic = 'force-dynamic';

type Section = { key: string; node: ReactNode };

// Only what the lock reveal needs crosses to the client, not whole rosters.
const pickTeam = ({ rosterId, teamName }: PredictionTeam) => ({
  rosterId,
  teamName,
});

/** The most recent settled week in this league season, if there is one. */
async function getLatestSettledWeek(
  current: PredictionWeekData,
  review: PredictionWeekData | null,
) {
  if (current.finalized) return current;
  if (
    review?.finalized &&
    review.leagueId === current.leagueId &&
    review.season === current.season
  )
    return review;
  if (current.week <= 1) return null;
  const previous = await getPredictionWeekData(current.week - 1);
  return previous.finalized &&
    previous.leagueId === current.leagueId &&
    previous.season === current.season
    ? previous
    : null;
}

export default async function DashboardPage() {
  const [data, predictions] = await Promise.all([
    getDashboardData(),
    getPredictionWeekData(),
  ]);
  const draft = data.draft;
  const beforeDraft =
    data.leagueStatus === 'pre_draft' || data.leagueStatus === 'drafting';
  const published =
    draftRecapContent.published && draftRecapContent.entries.length > 0;
  const showCountdown = draft && draft.status !== 'complete' && beforeDraft;
  const latestReviewWeek = beforeDraft
    ? null
    : getLatestAuthoredReviewWeek(predictions);
  const reviewData =
    latestReviewWeek === null
      ? null
      : latestReviewWeek === predictions.week
        ? predictions
        : await getPredictionWeekData(latestReviewWeek);
  const inSeason = !beforeDraft && Boolean(predictions.season);
  const settled = inSeason
    ? await getLatestSettledWeek(predictions, reviewData)
    : null;
  const scoreboardWeek =
    settled ?? (inSeason && predictions.matchups.length ? predictions : null);
  const editorial = inSeason
    ? getClubhouseEditorial(predictions, reviewData)
    : null;
  const currentFeature = inSeason ? getMatchOfTheWeek(predictions) : null;
  const featuredMatchup = currentFeature
    ? predictions.matchups.find(
        (m) => m.sleeperMatchupId === currentFeature.sleeperMatchupId,
      )
    : undefined;
  const flag = settled ? getFlagOnThePlay(settled) : null;
  const teams = new Map(
    predictions.matchups.flatMap((m) =>
      [m.home, m.away].map(
        ({ rosterId, teamName, avatar }) =>
          [rosterId, { teamName, avatar }] as const,
      ),
    ),
  );
  const showTicket = Boolean(
    currentFeature && featuredMatchup && !predictions.finalized,
  );
  // The ticket opens onto the featured preview, so it is not told twice.
  const lead =
    editorial && showTicket ? getLeadBesideTicket(editorial) : editorial?.lead;
  const leadOnTicket = Boolean(editorial?.lead) && !lead;
  const cut =
    inSeason && data.mode !== 'unavailable'
      ? getCutLine(data.standings, data.playoffTeams)
      : null;
  const played = Math.max(0, ...data.standings.map(gamesPlayed));

  const candidates: (Section | false | null | undefined)[] = [
    beforeDraft && {
      key: 'draft',
      node: (
        <section
          aria-labelledby="draft-report-title"
          className={
            showCountdown
              ? 'grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]'
              : ''
          }
        >
          <a href="/draft-recap" className="story-feature group">
            <p className="ui-kicker text-primary">
              {draftRecapContent.season} draft report ·{' '}
              {published ? 'Published' : 'After the final pick'}
            </p>
            <h2
              id="draft-report-title"
              className="mt-3 text-2xl font-bold leading-tight tracking-tight"
            >
              {published
                ? 'The draft is done. Here’s the verdict.'
                : 'Good draft. Famous last words.'}
            </h2>
            <span className="clubhouse-text-link mt-4">
              {published ? 'Read the draft report' : 'About the draft report'}{' '}
              <ArrowRight className="size-4" />
            </span>
          </a>
          {showCountdown && <DraftCountdown startTime={draft.startTime} />}
        </section>
      ),
    },
    settled && {
      key: 'wire',
      node: <LeagueWire week={settled.week} items={getLeagueWire(settled)} />,
    },
    showTicket &&
      currentFeature &&
      featuredMatchup && {
        key: 'ticket',
        node: (
          <MatchTicket
            matchup={featuredMatchup}
            selection={currentFeature}
            week={predictions.week}
            lockAt={predictions.lockAt}
          />
        ),
      },
    scoreboardWeek && {
      key: 'scoreboard',
      node: (
        <Scoreboard
          data={scoreboardWeek}
          feature={getMatchOfTheWeek(scoreboardWeek)}
        />
      ),
    },
    cut && {
      key: 'cut',
      node: (
        <div>
          <CutLineHero cut={cut} week={played} />
          <a href="/standings" className="clubhouse-text-link mt-1 min-h-11">
            Full table <ArrowRight className="size-4" />
          </a>
        </div>
      ),
    },
    flag && { key: 'flag', node: <FlagOnThePlayCard flag={flag} /> },
    editorial &&
      (!leadOnTicket || editorial.talkingPoints.length > 0) && {
        key: 'story',
        node: (
          <div className="space-y-5">
            {!leadOnTicket && (
              <LeadStory lead={lead ?? null} week={predictions.week} />
            )}
            <TalkingPoints points={editorial.talkingPoints} />
          </div>
        ),
      },
    editorial?.ranking && {
      key: 'rankings',
      node: <RankingsDeck ranking={editorial.ranking} teams={teams} />,
    },
    {
      key: 'bragging',
      node: (
        <section aria-labelledby="bragging-title">
          <h2 id="bragging-title" className="ui-kicker">
            Bragging rights. And the opposite.
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-4">
            <ChampionCard champion={data.reigningChampion} />
            <ShameSticker />
          </div>
        </section>
      ),
    },
    { key: 'race', node: <PredictionRace /> },
  ];
  const sections = candidates.filter((section): section is Section =>
    Boolean(section),
  );

  return (
    <ClubhouseMemberProvider
      key={`${predictions.season}-${predictions.week}`}
      data={predictions}
    >
      <div className="clubhouse-field space-y-5 sm:space-y-7">
        {data.mode === 'unavailable' && (
          <output className="notice">
            League details are temporarily unavailable. Your picks and the
            record book are kept separately—nothing has been replaced with demo
            data.
          </output>
        )}
        <PicksHero
          feature={
            featuredMatchup
              ? {
                  databaseId: featuredMatchup.databaseId,
                  home: pickTeam(featuredMatchup.home),
                  away: pickTeam(featuredMatchup.away),
                }
              : null
          }
        />
        <Field sections={sections} />
        <EndZone>
          <p className="text-xs leading-5 text-muted-foreground">
            MAC 12 · An independent league companion. Run your team on Sleeper.
            Settle the arguments here.
          </p>
        </EndZone>
      </div>
    </ClubhouseMemberProvider>
  );
}
