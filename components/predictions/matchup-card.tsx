'use client';

import type { CSSProperties } from 'react';
import type { User } from '@supabase/supabase-js';
import { Check, LoaderCircle, Star } from 'lucide-react';
import { HoldButton } from '@/components/effects/hold-button';
import { Stamp, type StampTone } from '@/components/effects/stamp';
import { followSpotlight } from '@/components/effects/spotlight';
import { TeamAvatar } from '@/components/shared/team-avatar';
import { Badge } from '@/components/ui/badge';
import type { MatchOfTheWeek } from '@/lib/data/match-of-the-week';
import type { PredictionMatchup, PredictionTeam } from '@/lib/data/predictions';
import type { Rivalry } from '@/lib/data/rivalries';
import {
  getLine,
  getLineResult,
  lineResultLabels,
} from '@/lib/predictions/line';
import { verdictFor } from '@/lib/predictions/slip';
import type { BankerRecord, VoteRecord } from '@/lib/predictions/votes';
import { formatScore } from '@/lib/sleeper/scores';
import { cn } from '@/lib/utils';
import { MatchupProgramme } from './matchup-programme';

type Side = 'home' | 'away';

type VoterDisplay = {
  banker: boolean;
  id: string;
  name: string;
  isCurrentUser: boolean;
};

function recordFor(team: PredictionTeam) {
  return `${team.wins}-${team.losses}${team.ties ? `-${team.ties}` : ''}`;
}

function shortName(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.length > 1 ? `${parts[0][0]}. ${parts.at(-1)}` : name;
}

/** Each side's three biggest projected starters, instead of full lineups. */
function KeyPlayers({
  team,
  finalized,
}: {
  team: PredictionTeam;
  finalized: boolean;
}) {
  const keys = [...team.starters]
    .filter(
      (player) =>
        !player.id.endsWith('-empty') && player.projectedPoints != null,
    )
    .sort((a, b) => b.projectedPoints! - a.projectedPoints!)
    .slice(0, 3);
  if (!keys.length) return <span />;
  return (
    <ul className="key-players" aria-label={`${team.ownerName}’s key players`}>
      {keys.map((player) => {
        const points = finalized ? player.actualPoints : player.projectedPoints;
        return (
          <li key={player.id}>
            <span className="truncate">{shortName(player.name)}</span>
            {points != null && (
              <span className="font-mono text-muted-foreground">
                {formatScore(points)}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function TeamHalf({
  side,
  team,
  matchup,
  selected,
  voters,
  locked,
  finalized,
  signedIn,
  disabled,
  pending,
  votersReady,
  stamp,
  onPick,
}: {
  side: Side;
  team: PredictionTeam;
  matchup: PredictionMatchup;
  selected: boolean;
  voters: VoterDisplay[];
  locked: boolean;
  finalized: boolean;
  signedIn: boolean;
  disabled: boolean;
  pending: boolean;
  votersReady: boolean;
  stamp: { text: string; tone: StampTone } | null;
  onPick: (matchup: PredictionMatchup, rosterId: number) => void;
}) {
  const score = finalized ? team.actualScore : team.projectedScore;
  return (
    <div
      className="faceoff-half"
      data-side={side}
      data-selected={selected || undefined}
    >
      <TeamAvatar
        avatar={team.avatar}
        name={team.teamName}
        className="size-9 sm:size-11"
      />
      <p className="faceoff-team">{team.teamName}</p>
      <p className="faceoff-owner">
        {team.ownerName} · {recordFor(team)}
      </p>
      <p
        className={cn(
          'faceoff-score',
          score == null && 'text-xs font-semibold text-muted-foreground',
        )}
      >
        {formatScore(score, finalized ? 2 : 1)}
      </p>
      <p className="faceoff-caption">
        {finalized ? 'Final score' : 'PPR estimate'}
      </p>
      {stamp && (
        <Stamp tone={stamp.tone} className="faceoff-stamp">
          {stamp.text}
        </Stamp>
      )}
      {!locked ? (
        <button
          type="button"
          className="faceoff-pick"
          aria-pressed={selected}
          aria-busy={pending}
          aria-label={`Pick ${team.teamName}${selected ? ', saved' : ''}`}
          disabled={disabled || pending}
          onClick={() => onPick(matchup, team.rosterId)}
        >
          {pending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : selected ? (
            <Check className="size-4" />
          ) : null}
          {pending ? 'Saving…' : selected ? 'Saved pick' : 'Pick'}
        </button>
      ) : !signedIn ? (
        <p className="faceoff-voters-note">Sign in to reveal voters</p>
      ) : !votersReady ? (
        <p className="faceoff-voters-note">
          Voter details unavailable until member data loads.
        </p>
      ) : (
        <div className="faceoff-voters">
          <p className="text-[11px] font-semibold text-foreground/80">
            {voters.length} {voters.length === 1 ? 'vote' : 'votes'}
          </p>
          {voters.length ? (
            <ul className="mt-1.5 flex flex-wrap gap-1">
              {voters.map((voter) => (
                <li
                  key={voter.id}
                  className={cn(
                    'voter-chip',
                    voter.isCurrentUser && 'voter-chip-you',
                  )}
                >
                  {voter.name}
                  {voter.banker && (
                    <span className="font-semibold text-award">×2</span>
                  )}
                  {voter.isCurrentUser && (
                    <span className="text-[10px] font-bold uppercase tracking-wide">
                      You
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-[11px] text-muted-foreground">No picks</p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * One fixture as a tug of war: the two teams share the card, and the side you
 * pick takes over more of it. Only the pick itself lives on the card; the
 * report, history and lineups open in the match programme.
 */
export function MatchupCard({
  matchup,
  lockAt,
  feature,
  locked,
  finalized,
  user,
  votes,
  profileNames,
  databaseReady,
  pendingRoster,
  feedback,
  votersReady,
  onPick,
  onRequireLogin,
  rivalry,
  bankers,
  bankerPending,
  savingPick,
  onBanker,
}: {
  matchup: PredictionMatchup;
  lockAt: string;
  feature?: MatchOfTheWeek;
  locked: boolean;
  finalized: boolean;
  user: User | null;
  votes: VoteRecord[];
  profileNames: Map<string, string>;
  databaseReady: boolean;
  pendingRoster: number | null;
  feedback?: { text: string; error: boolean };
  votersReady: boolean;
  onPick: (matchup: PredictionMatchup, rosterId: number) => void;
  onRequireLogin: () => void;
  rivalry?: Rivalry;
  bankers: BankerRecord[];
  bankerPending: boolean;
  savingPick: boolean;
  onBanker: (matchup: PredictionMatchup) => void;
}) {
  const matchupVotes = votes.filter(
    (vote) => vote.matchup_id === matchup.databaseId,
  );
  const ownVote = matchupVotes.find((vote) => vote.voter_id === user?.id);
  const isBanker = bankers.some(
    (b) => b.voter_id === user?.id && b.matchup_id === matchup.databaseId,
  );
  const pickSide: Side | undefined =
    ownVote?.selected_roster_id === matchup.home.rosterId
      ? 'home'
      : ownVote?.selected_roster_id === matchup.away.rosterId
        ? 'away'
        : undefined;
  const pickedTeam = pickSide === 'home' ? matchup.home : matchup.away;
  const verdict = ownVote
    ? verdictFor(matchup, ownVote.selected_roster_id)
    : null;
  const bankerResult = !finalized
    ? 'Your Banker · 2 points if correct'
    : verdict === 'void'
      ? 'Banker tied · 0 points'
      : verdict === 'won'
        ? 'Banker landed · 2 points'
        : verdict === 'lost'
          ? 'Banker missed · 0 points'
          : 'Banker awaiting both scores';
  const votersFor = (rosterId: number) =>
    matchupVotes
      .filter((vote) => vote.selected_roster_id === rosterId)
      .map((vote) => ({
        id: vote.voter_id,
        banker: bankers.some(
          (b) =>
            b.voter_id === vote.voter_id && b.matchup_id === matchup.databaseId,
        ),
        name: profileNames.get(vote.voter_id) ?? 'League member',
        isCurrentUser: vote.voter_id === user?.id,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  const homeVoters = votersFor(matchup.home.rosterId);
  const awayVoters = votersFor(matchup.away.rosterId);
  const totalVotes = homeVoters.length + awayVoters.length;
  const homeShare = totalVotes
    ? Math.round((homeVoters.length / totalVotes) * 100)
    : 0;
  const line = getLine(matchup);
  const lineResult = finalized ? getLineResult(matchup, line) : null;
  const memberReady = Boolean(user) && votersReady;
  const stamp: { text: string; tone: StampTone } | null = !memberReady
    ? null
    : finalized
      ? verdict === 'won'
        ? {
            text: isBanker ? 'Called it ×2' : 'Called it',
            tone: isBanker ? 'gold' : 'win',
          }
        : verdict === 'lost'
          ? { text: 'Missed', tone: 'loss' }
          : verdict === 'void'
            ? { text: 'Void', tone: 'muted' }
            : null
      : locked
        ? {
            text: isBanker ? 'Locked ×2' : 'Locked',
            tone: isBanker ? 'gold' : 'default',
          }
        : isBanker
          ? { text: 'Banker ×2', tone: 'gold' }
          : null;
  const pickDisabled =
    !databaseReady || matchup.databaseId == null || pendingRoster != null;
  const pick = (selectedMatchup: PredictionMatchup, rosterId: number) => {
    if (!user) {
      onRequireLogin();
      return;
    }
    onPick(selectedMatchup, rosterId);
  };
  const half = (side: Side) => {
    const team = matchup[side];
    return (
      <TeamHalf
        side={side}
        team={team}
        matchup={matchup}
        selected={pickSide === side}
        voters={side === 'home' ? homeVoters : awayVoters}
        locked={locked}
        finalized={finalized}
        signedIn={Boolean(user)}
        disabled={pickDisabled}
        pending={pendingRoster === team.rosterId}
        votersReady={votersReady}
        stamp={pickSide === side ? stamp : null}
        onPick={pick}
      />
    );
  };

  return (
    <article
      className={cn('faceoff-card', feature && 'spotlight-card motw-card')}
      onPointerMove={feature ? followSpotlight : undefined}
      data-matchup-id={matchup.sleeperMatchupId}
      id={`matchup-${matchup.sleeperMatchupId}`}
      data-match-of-the-week={feature ? 'true' : undefined}
      data-pick={pickSide}
      aria-labelledby={`matchup-${matchup.sleeperMatchupId}-title`}
      style={
        {
          '--home-color': matchup.home.color ?? 'var(--primary)',
          '--away-color': matchup.away.color ?? 'var(--chart-2)',
        } as CSSProperties
      }
    >
      <div className="faceoff-header">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          {feature && (
            <Badge className="h-auto gap-1.5 px-2 py-0.5 text-xs">
              <Star aria-hidden="true" /> Match of the Week
            </Badge>
          )}
          <h2
            id={`matchup-${matchup.sleeperMatchupId}-title`}
            className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground"
          >
            Matchup {matchup.sleeperMatchupId}
            <span className="sr-only">
              {' '}
              — {matchup.home.teamName} versus {matchup.away.teamName}
            </span>
          </h2>
          {line && (
            <p className="faceoff-line">
              <span className="sr-only">Line from Sleeper projections: </span>
              <span aria-hidden="true">Line </span>
              <strong>{line.label}</strong>
              {lineResult && (
                <span className="faceoff-line-result" data-result={lineResult}>
                  {lineResultLabels[lineResult]}
                </span>
              )}
            </p>
          )}
        </div>
        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          {finalized
            ? 'Final'
            : locked
              ? memberReady
                ? `${totalVotes} ${totalVotes === 1 ? 'vote' : 'votes'}`
                : 'Locked'
              : databaseReady
                ? 'Picks open'
                : 'Picks unavailable'}
        </span>
      </div>
      <div className="faceoff">
        {half('home')}
        <span className="faceoff-divider" aria-hidden="true">
          <span>v</span>
        </span>
        {half('away')}
      </div>
      <div className="faceoff-keys">
        <KeyPlayers team={matchup.home} finalized={finalized} />
        <KeyPlayers team={matchup.away} finalized={finalized} />
      </div>
      {memberReady && ownVote && (isBanker || !locked) && (
        <div className="faceoff-banker">
          {isBanker ? (
            <p className="text-sm font-semibold text-award">
              <Star className="mr-1.5 inline size-4" aria-hidden="true" />
              {bankerResult} · {pickedTeam.ownerName}
            </p>
          ) : (
            <HoldButton
              className="kick-meter"
              label={`Make ${pickedTeam.ownerName} your Banker`}
              confirmLabel={`Bank ${pickedTeam.ownerName} ×2`}
              disabled={
                !databaseReady ||
                bankerPending ||
                savingPick ||
                pendingRoster != null
              }
              onConfirm={() => onBanker(matchup)}
            >
              <Star className="size-4" aria-hidden="true" />
              {bankerPending ? 'Saving Banker…' : 'Hold to bank it ×2'}
              <span className="kick-posts" aria-hidden="true" />
            </HoldButton>
          )}
        </div>
      )}
      {feature && (
        <blockquote className="motw-quote">{feature.reason}</blockquote>
      )}
      {feedback && (feedback.error || !locked) && (
        <p
          role={feedback.error ? 'alert' : 'status'}
          className={cn(
            'px-4 pb-3 text-sm leading-5',
            feedback.error ? 'text-destructive' : 'text-primary',
          )}
        >
          {feedback.text}
        </p>
      )}
      {locked && memberReady && totalVotes > 0 && (
        <div className="league-rope">
          <div className="flex items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
            <span>
              {matchup.home.ownerName} {homeShare}%
            </span>
            <span className="ui-kicker">The league</span>
            <span>
              {100 - homeShare}% {matchup.away.ownerName}
            </span>
          </div>
          <div
            className="rope-track"
            aria-hidden="true"
            style={{ '--knot': `${100 - homeShare}%` } as CSSProperties}
          >
            <span className="rope-knot" />
          </div>
        </div>
      )}
      <div className="faceoff-footer">
        <MatchupProgramme
          matchup={matchup}
          feature={feature}
          rivalry={rivalry}
          lockAt={lockAt}
          locked={locked}
          finalized={finalized}
          receipt={
            finalized && memberReady
              ? totalVotes === 0
                ? 'No member picks were recorded for this matchup.'
                : matchup.home.actualScore === matchup.away.actualScore
                  ? `${totalVotes} managers picked a winner; the tie gives nobody a correct winner pick.`
                  : `${matchup.home.actualScore! > matchup.away.actualScore! ? homeVoters.length : awayVoters.length} of ${totalVotes} voters backed ${matchup.home.actualScore! > matchup.away.actualScore! ? matchup.home.ownerName : matchup.away.ownerName}, the winning side. The original picks stay on the record.`
              : undefined
          }
        />
      </div>
    </article>
  );
}
