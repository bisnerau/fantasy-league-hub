'use client';
import { useState } from 'react';
import type { HalftimeActivity } from '@/lib/season/halftime-ledger';
import type { HalftimeTeam } from '@/lib/data/halftime/report';
import { formatIrishTime } from '@/lib/format/irish-time';

type ActivityTeam = HalftimeActivity['teams'][number];
const fixed = (n: number | null) => (n == null ? 'Pending' : n.toFixed(2));
const date = (n: number) => formatIrishTime(n);
const categories = [
  ['drafted', 'Drafted'],
  ['pickups', 'Pickups'],
  ['trades', 'Trades'],
  ['unassigned', 'Move-week / unassigned'],
] as const;

export function ScoringOrigin({ team }: { team: ActivityTeam }) {
  return (
    <div className="ht-origin">
      <div
        className="ht-origin-bar"
        aria-label={categories
          .map(
            ([key, label]) => `${label}: ${fixed(team.categories[key])} points`,
          )
          .join(', ')}
      >
        {categories.map(([key]) => (
          <span
            key={key}
            className={`ht-origin-${key}`}
            style={{ flexGrow: Math.max(0, team.categories[key]) }}
          />
        ))}
      </div>
      <div className="ht-origin-values">
        {categories.map(([key, label]) => (
          <span key={key}>
            <i className={`ht-origin-${key}`} />
            {label}
            <strong>{fixed(team.categories[key])}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

export function TeamActivity({ team }: { team: ActivityTeam }) {
  const move = team.definingMove;
  return (
    <div className="ht-team-activity">
      <span className="ht-eyebrow">HOW THIS TEAM WAS BUILT</span>
      <ScoringOrigin team={team} />
      {move && (
        <div className="ht-defining-move">
          <div>
            <span className="ht-eyebrow">MOST PRODUCTIVE VERIFIED MOVE</span>
            <strong>{move.title}</strong>
            <p>
              {move.kind === 'pickup'
                ? `${move.cost === 0 ? 'Free pickup' : move.cost == null ? 'Cost unavailable' : `$${move.cost} FAAB`} · ${move.starts} starts`
                : `Trade · ${move.weeks.length} full weeks reviewed`}
            </p>
          </div>
          <span>
            {fixed(move.points)}
            <small>POINTS USED</small>
          </span>
        </div>
      )}
      <p className="ht-activity-note">
        {team.additions} additions ·{' '}
        {team.faab == null
          ? 'FAAB spend unavailable'
          : `$${team.faab} FAAB spent`}
        .
        {team.incompleteReturns > 0
          ? ` ${team.incompleteReturns} acquisition return remains unverified; the best-move comparison uses complete receipts.`
          : ''}
        {team.categories.unassigned !== 0
          ? ' Move-week points stay separate where ownership changed during a scoring week.'
          : ''}
      </p>
    </div>
  );
}

export function TransactionDesk({
  activity,
  teams,
  followed,
}: {
  activity: HalftimeActivity;
  teams: HalftimeTeam[];
  followed: number | null;
}) {
  const [tab, setTab] = useState<'pickups' | 'faab' | 'origins'>('pickups');
  const [cost, setCost] = useState<'all' | 'free' | 'paid'>('all');
  const [scope, setScope] = useState<'league' | 'followed'>('league');
  const [expanded, setExpanded] = useState<string | null>(null);
  const name = (id: number) =>
    teams.find((t) => t.id === id)?.name ?? `Roster ${id}`;
  const chosen = scope === 'followed' && followed !== null ? followed : null;
  const pickups = activity.pickups
    .filter(
      (p) =>
        (chosen === null || p.rosterId === chosen) &&
        (cost === 'all' ||
          (cost === 'free' ? p.cost === 0 : p.cost !== null && p.cost > 0)),
    )
    .sort((a, b) => (b.points ?? -Infinity) - (a.points ?? -Infinity));
  const leaders = activity.teams
    .filter((t) => chosen === null || t.rosterId === chosen)
    .sort(
      (a, b) => (b.pickupPoints ?? -Infinity) - (a.pickupPoints ?? -Infinity),
    );
  const bestPaid = activity.pickups
    .filter((p) => p.cost !== null && p.cost > 0 && p.points !== null)
    .sort((a, b) => b.points! - a.points!)[0];
  const bestFree = activity.pickups
    .filter((p) => p.cost === 0 && p.points !== null)
    .sort((a, b) => b.points! - a.points!)[0];
  return (
    <section id="moves" className="ht-section ht-moves">
      <header className="ht-section-title">
        <div>
          <p className="ht-eyebrow">
            <span>05</span> THE TRANSACTION DESK
          </p>
          <h2>The moves that mattered.</h2>
        </div>
        <p className="ht-section-detail">
          The draft was only the start. Here’s what managers added, what they
          spent and the points they actually used.
        </p>
      </header>
      <div className="ht-move-leads">
        {[
          { p: bestPaid, label: 'BEST PAID PICKUP' },
          { p: bestFree, label: 'BEST FREE PICKUP' },
        ].map(({ p, label }) => {
          return (
            p && (
              <article key={label}>
                <span className="ht-eyebrow">{label}</span>
                <h3>{p.player}</h3>
                <p>
                  {name(p.rosterId)} ·{' '}
                  {p.cost === 0 ? 'Free' : `$${p.cost} FAAB`}
                </p>
                <strong>
                  {fixed(p.points)}
                  <small>STARTER POINTS</small>
                </strong>
              </article>
            )
          );
        })}
        <article>
          <span className="ht-eyebrow">BUSIEST SCOREBOARD FROM PICKUPS</span>
          <h3>
            {name(
              [...activity.teams].sort(
                (a, b) => b.categories.pickups - a.categories.pickups,
              )[0].rosterId,
            )}
          </h3>
          <p>Verified pickup contributions</p>
          <strong>
            {fixed(
              Math.max(...activity.teams.map((t) => t.categories.pickups)),
            )}
            <small>STARTER POINTS</small>
          </strong>
        </article>
      </div>
      <div className="ht-ledger-controls">
        <div className="ht-segment" aria-label="Transaction analysis">
          {[
            ['pickups', 'Best pickups'],
            ['faab', 'FAAB returns'],
            ['origins', 'Built or bought?'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={tab === id}
              onClick={() => setTab(id as typeof tab)}
            >
              {label}
            </button>
          ))}
        </div>
        <label>
          VIEW
          <select
            aria-label="Transaction teams"
            value={chosen === null ? 'league' : 'followed'}
            onChange={(e) => setScope(e.target.value as typeof scope)}
          >
            <option value="league">The whole league</option>
            <option value="followed" disabled={followed === null}>
              {followed === null
                ? 'Choose a team in the replay'
                : name(followed)}
            </option>
          </select>
        </label>
      </div>
      {tab === 'pickups' && (
        <div className="ht-pickup-ledger">
          <div className="ht-ledger-filter">
            <span>
              Ranked by points actually started · each ownership spell
              separately
            </span>
            <label>
              Cost
              <select
                aria-label="Pickup cost"
                value={cost}
                onChange={(e) => setCost(e.target.value as typeof cost)}
              >
                <option value="all">All pickups</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </label>
          </div>
          {pickups.slice(0, chosen === null ? 10 : 30).map((p, i) => (
            <div key={p.id} className="ht-pickup-entry">
              <button
                type="button"
                aria-expanded={expanded === p.id}
                onClick={() => setExpanded(expanded === p.id ? null : p.id)}
              >
                <span className="ht-ledger-position">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <strong>{p.player}</strong>
                  <small>
                    {name(p.rosterId)} · added {date(p.acquired)}
                  </small>
                </span>
                <span className="ht-ledger-cost">
                  {p.cost === 0
                    ? 'FREE'
                    : p.cost === null
                      ? 'N/A'
                      : `$${p.cost}`}
                </span>
                <span className="ht-ledger-points">
                  {fixed(p.points)}
                  <small>{p.starts} starts</small>
                </span>
                <span>{expanded === p.id ? '−' : '+'}</span>
              </button>
              {expanded === p.id && (
                <div className="ht-pickup-evidence">
                  <span className="ht-eyebrow">THE SCORING RECEIPT</span>
                  <div>
                    {p.evidence?.map((e) => (
                      <span key={e.week}>
                        <small>W{e.week}</small>
                        <strong>
                          {e.excluded
                            ? 'Excluded'
                            : e.points === null
                              ? 'Unknown'
                              : e.started
                                ? fixed(e.points)
                                : 'Bench'}
                        </strong>
                      </span>
                    ))}
                  </div>
                  <p>
                    Actual starting-lineup points only. Acquisition weeks count
                    when confirmed; departure weeks are excluded. Bench weeks
                    add no used points.
                  </p>
                </div>
              )}
            </div>
          ))}
          {!pickups.length && (
            <p className="ht-empty">No acquisitions match this filter.</p>
          )}
          <p className="ht-activity-note">
            {chosen === null ? 'Top ten of ' : ''}
            {pickups.length} matching acquisitions. An unknown return is shown
            as pending, never zero.
          </p>
        </div>
      )}
      {tab === 'faab' && (
        <div className="ht-faab-table">
          <div className="ht-faab-heading">
            <span>MANAGER</span>
            <span>SPENT</span>
            <span>ADDS</span>
            <span>POINTS USED</span>
          </div>
          {leaders.map((t) => (
            <div key={t.rosterId}>
              <strong>{name(t.rosterId)}</strong>
              <span>{t.faab === null ? 'N/A' : `$${t.faab}`}</span>
              <span>{t.additions}</span>
              <span>
                {fixed(t.pickupPoints)}
                {t.incompleteReturns > 0 && (
                  <small>{t.incompleteReturns} incomplete receipt</small>
                )}
              </span>
            </div>
          ))}
          <p className="ht-activity-note">
            Spend counts successful waiver bids once per transaction. Points
            include free pickups as well as paid claims. Keenan’s total remains
            pending because one Joe Mixon ownership spell cannot be fully
            verified; his confirmed contributions remain visible in the scoring
            breakdown.
          </p>
        </div>
      )}
      {tab === 'origins' && (
        <div className="ht-origins-list">
          {leaders.map((t) => (
            <article key={t.rosterId}>
              <header>
                <h3>{name(t.rosterId)}</h3>
                <span>
                  {Math.round((t.categories.drafted / t.total) * 100)}% from the
                  draft
                </span>
              </header>
              <ScoringOrigin team={t} />
            </article>
          ))}
          <p className="ht-activity-note">
            Drafted points come from players continuously held since the draft.
            Pickups include free agency and waivers. Trade returns begin in the
            first full scoring week after the deal; departure weeks and
            unresolved ownership stay in the separate move-week bucket. The four
            buckets reconcile to each team’s Week 1–7 points.
          </p>
        </div>
      )}
      <div className="ht-trade-evidence">
        <span className="ht-eyebrow">THE FIRST-HALF DEALS</span>
        {activity.trades.map((t) => (
          <article key={t.id}>
            <time>{t.acquired ? date(t.acquired) : 'Date unavailable'}</time>
            <div>
              {t.sides.map((s) => (
                <p key={s.rosterId}>
                  <strong>{name(s.rosterId)}</strong>
                  <span>Received {s.received.join(' + ') || 'no players'}</span>
                </p>
              ))}
            </div>
            <span className="ht-trade-status">
              {t.weeks.length
                ? `${t.weeks.length} full weeks reviewed`
                : 'Too early for a full-week review'}
            </span>
          </article>
        ))}
        <p className="ht-activity-note">
          Both deals completed during Week 7. Their first eligible full review
          week is Week 8. Acquisition-week scoring remains in the move-week
          bucket above.
        </p>
      </div>
      <div className="ht-after-whistle">
        <span className="ht-eyebrow">SINCE THE HALFTIME WHISTLE / 27 OCT</span>
        <h3>Alan has been shopping.</h3>
        <p>
          Bowers arrives from Hugo for Javonte Williams and Tucker Kraft. Chase
          Brown and Waddle arrive from Murray for Olave.
        </p>
        <span className="ht-after-note">
          After Week 7. These trades have no first-half scoring return.
        </span>
      </div>
    </section>
  );
}
