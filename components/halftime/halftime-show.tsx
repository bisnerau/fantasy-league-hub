'use client';

import {
  useEffect,
  useRef,
  useState,
  useMemo,
  type CSSProperties,
} from 'react';
import Image from 'next/image';
import { flushSync } from 'react-dom';
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Play,
  RotateCcw,
  Trophy,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { HalftimeReport, HalftimeTeam } from '@/lib/data/halftime/report';
import { useHalftimeBallots } from './use-halftime-ballots';
import { TransactionDesk, TeamActivity } from './transaction-desk';
import { ManagerReceipts } from './manager-receipts';
import { saveReportCard } from './save-report-card';
import { AwardsStage } from './awards-stage';
import { RugbyReveal } from './rugby-reveal';
import { useHalftimeReducedMotion } from './use-reduced-motion';
import { SecondHalfBallot } from './second-half-ballot';
import { useSecondHalfBallot } from './use-second-half-ballot';
import { formatIrishTime } from '@/lib/format/irish-time';
import { AudioPlayer } from '@/components/return-of-the-mac/audio-player';
import { macEpisodes, macEpisodeHref } from '@/lib/data/return-of-the-mac';

// Mackorcle's halftime episode plays under his awards ceremony. The archive
// keeps it hidden until the reveal; the commissioner preview still hears it.
const halftimeTape = macEpisodes.find(
  (e) => e.slug === '2026-halftime-special',
);

const two = (n: number) => String(n).padStart(2, '0');
const ordinal = (n: number) =>
  `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : (['th', 'st', 'nd', 'rd'][n % 10] ?? 'th')}`;
const chapters = [
  ['replay', 'Roll the tape'],
  ['teams', 'Team reports'],
  ['schedule', 'The schedule'],
  ['receipts', 'The receipts'],
  ['moves', 'The moves'],
  ['honours', 'The honours'],
  ['second-half', 'The second half'],
] as const;

function Portrait({
  team,
  size = 'normal',
}: {
  team: HalftimeTeam;
  size?: 'normal' | 'large';
}) {
  return (
    <span className={`ht-portrait ht-portrait-${size}`}>
      <Image src={team.avatar} alt="" width={65} height={65} unoptimized />
    </span>
  );
}

function Sparkline({ scores, label }: { scores: number[]; label: string }) {
  const points = scores
    .map((score, i) => `${8 + i * 36},${86 - (score / 180) * 74}`)
    .join(' ');
  return (
    <svg className="ht-spark" viewBox="0 0 232 100" aria-label={label}>
      <path d="M8 25H224 M8 50H224 M8 75H224" className="ht-spark-grid" />
      <polygon points={`8,94 ${points} 224,94`} className="ht-spark-fill" />
      <polyline points={points} className="ht-spark-line" />
      {scores.map((score, i) => (
        <circle
          key={i}
          cx={8 + i * 36}
          cy={86 - (score / 180) * 74}
          r={i === 6 ? 4 : 2}
        />
      ))}
    </svg>
  );
}

function SectionTitle({
  number,
  label,
  title,
  detail,
}: {
  number: string;
  label: string;
  title: string;
  detail: string;
}) {
  return (
    <header className="ht-section-title ht-reveal">
      <div>
        <p className="ht-eyebrow">
          <span>{number}</span> {label}
        </p>
        <h2>{title}</h2>
      </div>
      <p className="ht-section-detail">{detail}</p>
    </header>
  );
}

export function HalftimeShow({ report }: { report: HalftimeReport }) {
  const root = useRef<HTMLDivElement>(null);
  const rugbyTarget = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const chapterNav = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<HalftimeTeam | null>(null);
  const [rugbyEntry, setRugbyEntry] = useState(false);
  const [rugbyManager, setRugbyManager] = useState<number | null>(null);
  const [chapter, setChapter] = useState('replay');
  const [actual, setActual] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'set' | 'move' | 'spotlight'>(
    'idle',
  );
  // Undefined until the viewer chooses: signed-in managers follow their own
  // team; choosing "The whole league" stores null.
  const [followChoice, setFollowed] = useState<number | null>();
  const [spotlight, setSpotlight] = useState<number | null>(null);
  const [finder, setFinder] = useState('');
  const [exportState, setExportState] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const transition = useRef<ViewTransition | null>(null);
  const [replaying, setReplaying] = useState(false);
  const [source, setSource] = useState<'ai' | 'consensus' | 'own'>('ai');
  const [allPlay, setAllPlay] = useState(false);
  const [receipt, setReceipt] = useState(10);
  const [revealed, setRevealed] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const reduceMotion = useHalftimeReducedMotion();
  const ballots = useHalftimeBallots(report.leagueId, report.teams);
  const followed =
    followChoice === undefined ? ballots.ownRosterId : followChoice;
  const teams = useMemo(
    () => [...report.teams].sort((a, b) => a.rank - b.rank),
    [report.teams],
  );
  const rosterIds = useMemo(
    () => report.teams.map((t) => t.id),
    [report.teams],
  );
  const secondHalf = useSecondHalfBallot(
    report.leagueId,
    report.season,
    report.secondHalf.lockAt,
    rosterIds,
  );
  const aiOrder = useMemo(
    () => [...teams].sort((a, b) => a.ai - b.ai).map((t) => t.id),
    [teams],
  );
  // An auth change immediately removes any previously visible private ballot.
  const effectiveSource =
    source === 'consensus' && ballots.consensus.length
      ? 'consensus'
      : source === 'own' && ballots.own.length
        ? 'own'
        : 'ai';
  const order =
    effectiveSource === 'consensus'
      ? ballots.consensus
      : effectiveSource === 'own'
        ? ballots.own
        : aiOrder;
  const sourceName =
    effectiveSource === 'ai'
      ? 'AI forecast'
      : effectiveSource === 'own'
        ? 'Your ballot'
        : 'Managers’ consensus';
  const error = teams.reduce(
    (sum, t) => sum + Math.abs(order.indexOf(t.id) + 1 - t.rank),
    0,
  );
  const exact = teams.filter((t) => order.indexOf(t.id) + 1 === t.rank).length;
  const apOrder = [...teams].sort(
    (a, b) =>
      b.allPlay[0] + b.allPlay[2] / 2 - (a.allPlay[0] + a.allPlay[2] / 2) ||
      b.points - a.points,
  );
  const receiptTeam = teams.find((t) => t.id === receipt)!;

  useEffect(() => {
    if (phase === 'idle') return;
    const timer = window.setTimeout(
      () => {
        if (phase === 'set') {
          setActual(true);
          setPhase('move');
        } else if (phase === 'move') {
          setReplaying(false);
          if (!actual) {
            setSpotlight(null);
            setPhase('idle');
            return;
          }
          setSpotlight(
            followed ??
              [...teams].sort(
                (a, b) =>
                  Math.abs(order.indexOf(b.id) + 1 - b.rank) -
                  Math.abs(order.indexOf(a.id) + 1 - a.rank),
              )[0].id,
          );
          setPhase('spotlight');
        } else {
          setSpotlight(null);
          setPhase('idle');
        }
      },
      phase === 'set' ? 450 : phase === 'move' ? 1400 : 2600,
    );
    return () => window.clearTimeout(timer);
  }, [phase, followed, order, teams, actual]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('ht-seen');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    el.querySelectorAll('.ht-reveal').forEach((node) => observer.observe(node));
    // The current chapter is the latest section inside the reading band, so
    // a section that changes height cannot leave a stale chapter selected.
    const order = [...el.querySelectorAll('section[id]')].map((n) => n.id);
    const inBand = new Set<string>();
    const sections = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        });
        const current = order.findLast((id) => inBand.has(id));
        if (current) setChapter(current);
      },
      { rootMargin: '-20% 0px -55% 0px' },
    );
    el.querySelectorAll('section[id]').forEach((node) =>
      sections.observe(node),
    );
    return () => {
      observer.disconnect();
      sections.disconnect();
    };
  }, []);

  // Keep the active chapter visible in the sideways-scrolling phone bar
  // without moving the page itself.
  useEffect(() => {
    const nav = chapterNav.current;
    const link = nav?.querySelector('[aria-current="location"]');
    if (!nav || !link || nav.scrollWidth <= nav.clientWidth) return;
    const navBox = nav.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    nav.scrollTo({
      left:
        nav.scrollLeft +
        linkBox.left -
        navBox.left -
        (navBox.width - linkBox.width) / 2,
      behavior: motionPaused || reduceMotion ? 'auto' : 'smooth',
    });
  }, [chapter, motionPaused, reduceMotion]);

  function motionAllowed() {
    return !motionPaused && !reduceMotion;
  }
  function morphReport(next: HalftimeTeam | null) {
    transition.current?.skipTransition();
    if (
      !document.startViewTransition ||
      !motionAllowed() ||
      !opener.current?.matches('.ht-team-card')
    ) {
      setSelected(next);
      return;
    }
    document.documentElement.setAttribute('data-ht-transition', 'report');
    const nextTransition = document.startViewTransition(() => {
      flushSync(() => setSelected(next));
    });
    transition.current = nextTransition;
    void nextTransition.finished
      .catch(() => {})
      .finally(() => {
        if (transition.current !== nextTransition) return;
        document.documentElement.removeAttribute('data-ht-transition');
        if (!next) opener.current?.removeAttribute('data-ht-origin');
        transition.current = null;
      });
  }
  function openTeam(team: HalftimeTeam, target: HTMLElement, rugby = false) {
    setRugbyEntry(rugby);
    opener.current?.removeAttribute('data-ht-origin');
    opener.current = target;
    setExportState('idle');
    target.setAttribute('data-ht-origin', 'true');
    morphReport(team);
  }
  function changeSource(value: typeof source) {
    setSource(value);
    setActual(false);
    setReplaying(false);
    setPhase('idle');
    setSpotlight(null);
  }
  function playReplay() {
    setSpotlight(null);
    if (!motionAllowed()) {
      setActual(!actual);
      setPhase('idle');
      setReplaying(false);
      return;
    }
    if (actual) {
      setActual(false);
      setReplaying(true);
      setPhase('move');
    } else {
      setReplaying(true);
      setPhase('set');
    }
  }
  function skipReplay() {
    setPhase('idle');
    setReplaying(false);
    if (phase === 'set') setActual(true);
    setSpotlight(null);
  }
  const filteredTeams = teams.filter((t) =>
    `${t.name} ${t.team}`.toLowerCase().includes(finder.toLowerCase().trim()),
  );
  const followedTeam = teams.find((t) => t.id === followed);
  // The signed-in manager's own line for the hero.
  const ownTeam = teams.find((t) => t.id === ballots.ownRosterId);
  const managerScores = ballots.insights?.scores.filter((s) => !s.ai) ?? [];
  const ownScore = managerScores.find(
    (s) => JSON.stringify(s.rankings) === JSON.stringify(ballots.own),
  );
  const ownPlace = ownScore
    ? 1 + managerScores.filter((s) => s.error < ownScore.error).length
    : null;
  const featuredTeam = teams.find((t) => t.id === spotlight);
  // The followed team's story waits for the reveal so it never gives away
  // the Week 7 position before "Reveal Week 7" is pressed.
  const storyTeam = featuredTeam ?? (actual ? followedTeam : undefined);

  return (
    <div
      ref={root}
      className="halftime"
      data-report-open={Boolean(selected)}
      data-replay-phase={phase}
      data-motion={motionPaused ? 'paused' : 'on'}
    >
      <div className="ht-edition">
        <span>
          <span className="ht-status-dot" /> HALFTIME EDITION{' '}
          <span className="ht-dim">/ 30 OCTOBER 2026</span>
        </span>
        <button
          type="button"
          onClick={() => setMotionPaused(!motionPaused)}
          aria-pressed={motionPaused}
        >
          Pause motion
        </button>
      </div>

      <header className="ht-hero">
        <div className="ht-hero-grid" aria-hidden="true" />
        <div className="ht-hero-top">
          <span className="ht-wordmark">
            MAC<span>12</span> <i>STUDIOS</i>
          </span>
          <span className="ht-issue">
            2026 SEASON
            <br />
            THE MIDSEASON SPECIAL
          </span>
        </div>
        <div className="ht-hero-main">
          <div className="ht-hero-copy">
            <p className="ht-eyebrow">
              <span className="ht-live-line" /> SEVEN DOWN. SEVEN TO GO.
            </p>
            <h1>
              <span>THE</span>
              <span>HALFTIME</span>
              <span className="ht-title-outline">
                SHOW<span className="ht-title-period">.</span>
              </span>
            </h1>
            <p className="ht-deck">
              Twelve managers. A table full of receipts.
              <br />
              And a few predictions we’d like back.
            </p>
            <a className="ht-button ht-button-gold" href="#replay">
              <Play size={15} fill="currentColor" /> Start the show{' '}
              <ArrowDown size={16} />
            </a>
            {ownTeam && (
              <div className="ht-your-half">
                <span className="ht-eyebrow">YOUR HALF</span>
                <button
                  type="button"
                  className="ht-your-team"
                  aria-label={`Open your report: ${ownTeam.team}`}
                  onClick={(e) => openTeam(ownTeam, e.currentTarget)}
                >
                  <Portrait team={ownTeam} />
                  <span>
                    <strong>{ownTeam.team}</strong>
                    <small>
                      {ordinal(ownTeam.rank)} at halfway · the AI said{' '}
                      {ordinal(ownTeam.ai)}
                    </small>
                  </span>
                  <ArrowUpRight size={18} />
                </button>
                <dl>
                  <div>
                    <dt>Your September ballot</dt>
                    <dd>
                      {ownScore && ownPlace
                        ? `${ownScore.error} places out · ${ordinal(ownPlace)} of ${managerScores.length}`
                        : ballots.status === 'ready'
                          ? 'No ballot filed'
                          : ballots.status === 'error'
                            ? 'Unavailable right now'
                            : 'Checking…'}
                    </dd>
                  </div>
                  <div>
                    <dt>Your second-half ballot</dt>
                    <dd>
                      <a href="#second-half">
                        {secondHalf.status === 'error'
                          ? 'Unavailable right now'
                          : secondHalf.status !== 'ready'
                            ? 'Checking…'
                            : secondHalf.locked
                              ? 'Locked · see every call'
                              : secondHalf.own
                                ? 'Filed · change it until the lock'
                                : `Not filed · locks ${formatIrishTime(report.secondHalf.lockAt, { weekday: 'short', date: false, time: true })}`}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
          <div className="ht-lead-stories">
            <div className="ht-halftime-marker">
              <span>
                07<span>/14</span>
              </span>
              <div>
                THE HALFWAY CHECKPOINT
                <small>Seven regular-season weeks left.</small>
              </div>
            </div>
            {[
              {
                id: 10,
                label: 'THE PACESETTER',
                stat: '6–1',
                title: 'Shane leads both tables.',
                detail: 'First in the league. First in all-play.',
              },
              {
                id: 3,
                label: 'THE REBUTTAL',
                stat: '↑7',
                title: 'Keenan kept the receipt.',
                detail: 'Predicted twelfth. Sitting fifth.',
              },
              {
                id: 1,
                label: 'THE APOLOGY',
                stat: '↓8',
                title: 'Burns has some explaining to do.',
                detail: 'The AI backed him for second. He’s tenth.',
              },
            ].map((story) => (
              <button
                type="button"
                className="ht-lead-story"
                key={story.id}
                onClick={(e) =>
                  openTeam(
                    teams.find((t) => t.id === story.id)!,
                    e.currentTarget,
                  )
                }
              >
                <span className="ht-lead-stat">{story.stat}</span>
                <span>
                  <small>{story.label}</small>
                  <strong>{story.title}</strong>
                  <span>{story.detail}</span>
                </span>
                <ArrowUpRight size={18} />
              </button>
            ))}
          </div>
        </div>
        <div className="ht-hero-bottom">
          <span>
            <span className="ht-status-dot" /> THE WEEK 7 CHECKPOINT
          </span>
          <span>
            42 GAMES PLAYED <i>/</i> 12 TEAMS <i>/</i> ONE VERY LONG MEMORY
          </span>
        </div>
      </header>

      <nav
        ref={chapterNav}
        className="ht-chapter-nav"
        aria-label="Halftime chapters"
      >
        {chapters.map(([id, name], i) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={chapter === id ? 'location' : undefined}
          >
            <span>{two(i + 1)}</span>
            {name}
          </a>
        ))}
      </nav>

      <section id="replay" className="ht-section">
        <SectionTitle
          number="01"
          label="EXPECTATION / REALITY"
          title="Roll the tape."
          detail="September had opinions. October has the table. Watch the original forecast meet the first seven weeks."
        />
        <div className="ht-replay-layout">
          <div className="ht-board ht-reveal">
            <div className="ht-board-toolbar">
              <label className="ht-select-label">
                THE ORIGINAL CALL
                <select
                  value={effectiveSource}
                  onChange={(e) =>
                    changeSource(e.target.value as typeof source)
                  }
                  aria-label="Prediction source"
                  disabled={replaying}
                >
                  <option value="ai">AI preseason forecast</option>
                  <option
                    value="consensus"
                    disabled={!ballots.consensus.length}
                  >
                    Managers’ consensus
                    {ballots.count ? ` (${ballots.count}/12)` : ''}
                  </option>
                  <option value="own" disabled={!ballots.own.length}>
                    Your preseason ballot
                  </option>
                </select>
              </label>
              <button
                type="button"
                className={`ht-replay-button ${actual ? 'ht-is-revealed' : ''}`}
                disabled={replaying}
                onClick={playReplay}
              >
                {actual ? (
                  <RotateCcw size={15} />
                ) : (
                  <Play size={15} fill="currentColor" />
                )}
                {actual ? 'Rewind' : 'Reveal Week 7'}
              </button>
            </div>
            <div className="ht-replay-director">
              <label>
                FOLLOW A TEAM
                <select
                  aria-label="Follow a team"
                  value={followed ?? ''}
                  onChange={(e) => {
                    setFollowed(e.target.value ? Number(e.target.value) : null);
                    setSpotlight(null);
                  }}
                >
                  <option value="">The whole league</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="ht-replay-status" aria-live="polite">
                {phase === 'set'
                  ? '01 / THE ORIGINAL CALL'
                  : phase === 'move'
                    ? '02 / THE TABLE MOVES'
                    : phase === 'spotlight'
                      ? '03 / THE RECEIPTS'
                      : actual
                        ? 'WEEK 7 / REVEALED'
                        : 'SEPTEMBER / ON TAPE'}
              </div>
              {replaying && (
                <button type="button" onClick={skipReplay}>
                  Skip animation <ChevronRight size={14} />
                </button>
              )}
            </div>
            <div className="ht-board-columns">
              <span>POS</span>
              <span>{actual ? 'WEEK 7 TABLE' : sourceName.toUpperCase()}</span>
              <span>{actual ? 'RECORD' : 'W7 POS'}</span>
              <span>SHIFT</span>
            </div>
            <div
              className="ht-rank-list"
              aria-label={actual ? 'Week 7 standings' : sourceName}
              aria-busy={replaying}
            >
              {[...teams]
                .sort((a, b) =>
                  actual
                    ? a.rank - b.rank
                    : order.indexOf(a.id) - order.indexOf(b.id),
                )
                .map((team) => {
                  const predicted = order.indexOf(team.id) + 1;
                  const position = actual ? team.rank : predicted;
                  const movement = predicted - team.rank;
                  return (
                    <button
                      type="button"
                      key={team.id}
                      disabled={replaying}
                      className={`ht-rank-row ${actual && position === 6 ? 'ht-cut-row' : ''} ${followed === team.id ? 'ht-followed' : ''} ${spotlight === team.id ? 'ht-spotlight' : ''}`}
                      data-team-id={team.id}
                      style={
                        {
                          '--row': position - 1,
                          '--stagger': `${(team.rank - 1) * 22}ms`,
                        } as CSSProperties
                      }
                      onClick={(e) => openTeam(team, e.currentTarget)}
                      aria-label={`${team.name}, ${actual ? 'Week 7' : 'predicted'} position ${position}. Open team report`}
                    >
                      <span
                        className="ht-rank-number"
                        key={`${actual}-${effectiveSource}-${position}`}
                      >
                        {two(position)}
                      </span>
                      <span className="ht-rank-identity">
                        <Portrait team={team} />
                        <span>
                          <strong>{team.name}</strong>
                          <small>{team.team}</small>
                        </span>
                      </span>
                      <span className="ht-rank-record">
                        {actual ? team.record : `#${team.rank}`}
                      </span>
                      <span
                        className={`ht-rank-change ${movement > 0 ? 'ht-up' : movement < 0 ? 'ht-down' : 'ht-even'}`}
                      >
                        {actual ? (
                          <>
                            {movement > 0 ? (
                              <ArrowUpRight size={14} />
                            ) : movement < 0 ? (
                              <ArrowDownRight size={14} />
                            ) : (
                              <Check size={13} />
                            )}
                            {Math.abs(movement) || '—'}
                          </>
                        ) : (
                          <span className="ht-await">···</span>
                        )}
                      </span>
                    </button>
                  );
                })}
            </div>
            <div className="ht-board-footer" aria-live="polite">
              <span className="ht-status-dot" />
              {actual
                ? 'WEEK 7 REVEALED · TAP A TEAM FOR THE STORY'
                : 'FROZEN PRESEASON FORECAST · 6 SEPTEMBER 2026'}
            </div>
          </div>
          <aside className="ht-replay-aside ht-reveal">
            {storyTeam && (
              <div className="ht-follow-story" aria-live="polite">
                <span className="ht-eyebrow">
                  {storyTeam === followedTeam
                    ? 'FOLLOWING YOUR TEAM'
                    : 'THE BIGGEST SURPRISE'}
                </span>
                <h3>{storyTeam.name}</h3>
                <div>
                  <strong>#{order.indexOf(storyTeam.id) + 1}</strong>
                  <ArrowRight size={22} />
                  <strong>#{storyTeam.rank}</strong>
                </div>
                <p>{sourceName} → Week 7 table</p>
                <button
                  type="button"
                  className="ht-text-button"
                  onClick={(e) => openTeam(storyTeam, e.currentTarget)}
                >
                  Open the evidence <ArrowUpRight size={16} />
                </button>
              </div>
            )}

            <div className="ht-accuracy">
              <span className="ht-eyebrow">{sourceName} / HALFWAY CHECK</span>
              <div>
                <strong key={`${effectiveSource}-error`}>{error}</strong>
                <span>
                  total places out
                  <br />
                  <small>Lower is better</small>
                </span>
              </div>
              <p>
                {exact} of 12 exact positions. These are final-season
                predictions; there are still seven regular-season weeks to play.
              </p>
            </div>
            <div className="ht-ballot-note">
              <span className="ht-eyebrow">WHO SPOKE UP?</span>
              {ballots.status === 'ready' ? (
                <p>
                  {ballots.count} of 12 managers submitted a valid preseason
                  ballot. Only those ballots shape the consensus. Non-submitters
                  receive no prediction score.
                </p>
              ) : ballots.status === 'loading' ? (
                <p>Checking access to the submitted manager ballots…</p>
              ) : ballots.status === 'error' ? (
                <p>
                  Manager ballots could not be loaded. The original AI forecast
                  remains available.
                </p>
              ) : (
                <p>
                  Manager ballots are available when signed in. The consensus
                  includes only managers who submitted a complete ranking.{' '}
                  <a href="/matchups">Sign in to view →</a>
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section id="teams" className="ht-section">
        <SectionTitle
          number="02"
          label="THE TWELVE DOSSIERS"
          title="Everybody gets a report."
          detail="The record, the reality and the original receipt. Pick a manager to open their halftime dossier."
        />
        <div className="ht-rugby-feature">
          <div>
            <span className="ht-eyebrow">THEN IN BLUE. NOW IN GREEN.</span>
            <h3>Find your Ireland alter ego.</h3>
            <p>The draft-night comparison gets its halfway review.</p>
          </div>
          <div className="ht-rugby-feature-actions">
            <label>
              CHOOSE A MANAGER
              <select
                value={
                  rugbyManager ?? ballots.ownRosterId ?? followed ?? teams[0].id
                }
                onChange={(e) => setRugbyManager(Number(e.target.value))}
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={(e) =>
                openTeam(
                  teams.find(
                    (t) =>
                      t.id ===
                      (rugbyManager ??
                        ballots.ownRosterId ??
                        followed ??
                        teams[0].id),
                  ) ?? teams[0],
                  e.currentTarget,
                  true,
                )
              }
            >
              Reveal the comparison <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
        <div className="ht-team-tools">
          <label>
            FIND YOUR TEAM
            <input
              type="search"
              placeholder="Manager or team name"
              value={finder}
              onChange={(e) => setFinder(e.target.value)}
            />
          </label>
          <span aria-live="polite">{filteredTeams.length} of 12 reports</span>
          <button
            type="button"
            onClick={() => {
              setFinder('');
              setFollowed(null);
            }}
          >
            Show everyone
          </button>
        </div>
        <div className="ht-team-grid">
          {filteredTeams.map((team) => (
            <button
              type="button"
              key={team.id}
              className={`ht-team-card ${followed === team.id ? 'ht-followed' : ''}`}
              onClick={(e) => openTeam(team, e.currentTarget)}
            >
              <div className="ht-card-top">
                <span className="ht-eyebrow">{two(team.rank)} / WEEK 7</span>
                <span className="ht-card-record">{team.record}</span>
              </div>
              <div className="ht-card-person">
                <Portrait team={team} size="large" />
                <span>
                  <small>{team.name}</small>
                  <h3>{team.team}</h3>
                </span>
              </div>
              <p>{team.title}</p>
              <div className="ht-card-bottom">
                <span>
                  AI PICK <b>#{team.ai}</b>
                  <span className="ht-card-arrow">→</span> ACTUAL{' '}
                  <b>#{team.rank}</b>
                </span>
                <span className="ht-card-open">
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section id="schedule" className="ht-section">
        <SectionTitle
          number="03"
          label="THE SCHEDULE SOLICITOR"
          title="Objection. Check the points."
          detail="What if everyone faced everyone, every week? All-play gives each team 77 comparisons across the first seven weeks."
        />
        <div className="ht-schedule-feature ht-reveal">
          <div className="ht-schedule-case">
            <span className="ht-eyebrow">EXHIBIT A / DAVID SHARPE</span>
            <div className="ht-case-ranks">
              <span>
                06<small>ACTUAL POSITION</small>
              </span>
              <ArrowRight />
              <span>
                12<small>ALL-PLAY POSITION</small>
              </span>
            </div>
            <h3>
              Four wins.
              <br />A very helpful fixture list.
            </h3>
            <p>
              The fewest points. The weakest all-play record. A place in the top
              six. Sharpe is under no obligation to apologise.
            </p>
          </div>
          <div className="ht-schedule-table">
            <div className="ht-segment" aria-label="Schedule comparison">
              <button
                type="button"
                aria-pressed={!allPlay}
                onClick={() => setAllPlay(false)}
              >
                Actual table
              </button>
              <button
                type="button"
                aria-pressed={allPlay}
                onClick={() => setAllPlay(true)}
              >
                All-play table
              </button>
            </div>
            <div className="ht-mini-board">
              {teams.map((team) => {
                const pos = allPlay
                  ? apOrder.findIndex((t) => t.id === team.id)
                  : team.rank - 1;
                return (
                  <div
                    key={team.id}
                    className={`ht-mini-row ${team.id === 11 || team.id === 12 ? 'ht-mini-highlight' : ''} ${followed === team.id ? 'ht-followed' : ''}`}
                    style={{ '--row': pos } as CSSProperties}
                  >
                    <span>{two(pos + 1)}</span>
                    <strong>{team.name}</strong>
                    <span>
                      {allPlay
                        ? `${team.allPlay[0]}–${team.allPlay[1]}${team.allPlay[2] ? `–${team.allPlay[2]}` : ''}`
                        : team.record}
                    </span>
                  </div>
                );
              })}
            </div>
            <p>
              All-play ties count as half a win. Equal records use points scored
              to order this view.
            </p>
          </div>
        </div>
        <div className="ht-under-table ht-reveal">
          <span className="ht-eyebrow">COUNTERCLAIM / AIDAN MURPHY</span>
          <p>
            <strong>Seventh in the league. Third in all-play.</strong> Murphy’s
            47–30 record against the field makes a decent case for feeling hard
            done by.
          </p>
        </div>
      </section>

      <section id="receipts" className="ht-section">
        <SectionTitle
          number="04"
          label="THE APOLOGY DESK"
          title="We said what we said."
          detail="The original words, preserved. No editing a September prediction to make it sound clever in October."
        />
        <div className="ht-receipt-layout ht-reveal">
          <div className="ht-receipt-selector">
            {[10, 1, 3, 9].map((id) => {
              const team = teams.find((t) => t.id === id)!;
              return (
                <button
                  type="button"
                  key={id}
                  aria-pressed={receipt === id}
                  onClick={() => {
                    setReceipt(id);
                    setRevealed(false);
                  }}
                >
                  <Portrait team={team} />
                  <span>
                    <strong>{team.name}</strong>
                    <small>
                      Predicted #{team.ai} → actual #{team.rank}
                    </small>
                  </span>
                  <ChevronRight size={18} />
                </button>
              );
            })}
            <p>
              AI outlooks published
              <br />6 September 2026
            </p>
            <a href="/draft-recap">
              Read the original draft report <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="ht-paper" key={receipt}>
            <div className="ht-paper-top">
              <span>MAC12 / FORECAST ARCHIVE</span>
              <span>NO. {two(receipt)}</span>
            </div>
            <p className="ht-paper-label">
              THE ORIGINAL CALL / {receiptTeam.name.toUpperCase()}
            </p>
            <blockquote>“{receiptTeam.quote}”</blockquote>
            <div className="ht-receipt-bottom">
              <span>
                AI PICK <strong>#{receiptTeam.ai}</strong>
              </span>
              <span>
                WEEK 7 <strong>#{receiptTeam.rank}</strong>
              </span>
              <button
                type="button"
                onClick={() => setRevealed(!revealed)}
                aria-expanded={revealed}
              >
                {revealed ? 'Fold receipt' : 'The verdict'}{' '}
                <ArrowDownRight size={17} />
              </button>
            </div>
            {revealed && (
              <div className="ht-stamped-verdict">
                <span className="ht-stamp">
                  {receiptTeam.verdict.toUpperCase()}
                </span>
                <p>{receiptTeam.title}</p>
                <button
                  type="button"
                  onClick={(e) => openTeam(receiptTeam, e.currentTarget)}
                >
                  Read the full defence <ArrowUpRight size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
        <ManagerReceipts insights={ballots.insights} status={ballots.status} />
      </section>

      <TransactionDesk
        activity={report.activity}
        afterWhistle={report.afterWhistle}
        teams={teams}
        followed={followed}
      />

      <section id="honours" className="ht-section ht-honours">
        <SectionTitle
          number="06"
          label="THE HALFTIME HONOURS"
          title="Take a bow. Or take the blame."
          detail="Mackorcle has five envelopes. You control the ceremony. Pick an award, roll the presentation and inspect the evidence."
        />
        <AwardsStage
          awards={report.honours}
          intro={report.stageIntro}
          teams={teams}
          paused={motionPaused}
          onOpenTeam={openTeam}
        />
        {halftimeTape && (
          <div className="ht-tape ht-reveal">
            <div>
              <span className="ht-eyebrow">
                RETURN OF THE MAC · HALFTIME SPECIAL
              </span>
              <h3>{halftimeTape.title}</h3>
              <p>
                Mackorcle goes to the tape and re-ranks all twelve teams. Your
                host does not accept the actual table.
              </p>
              {!halftimeTape.held && (
                <a href={macEpisodeHref(halftimeTape)}>
                  Episode page <ArrowUpRight size={14} />
                </a>
              )}
            </div>
            <AudioPlayer
              src={halftimeTape.audio}
              durationSeconds={halftimeTape.durationSeconds}
              title={halftimeTape.title}
            />
          </div>
        )}
      </section>

      <section id="second-half" className="ht-section">
        <SectionTitle
          number="07"
          label="THE SECOND-HALF BALLOT"
          title="Call the second half."
          detail="Rank the final table, then pick every playoff game and the loser bowl. One ballot each, private until Sunday’s kickoff."
        />
        <SecondHalfBallot
          teams={teams}
          ballot={secondHalf}
          house={report.secondHalf.house}
          lockAt={report.secondHalf.lockAt}
          paused={motionPaused}
        />
      </section>

      <footer className="ht-footer">
        <Trophy size={24} />
        <h2>
          Seven weeks left.
          <br />
          <span>Plenty of time to be wrong again.</span>
        </h2>
        <p>2026 regular season · Weeks 1–7 · Published 30 October 2026</p>
        <details>
          <summary>Sources & scoring notes</summary>
          <p>
            Week 7 checkpoint captured 28 October 2026 at 11:02 UTC from
            Sleeper. Records and points are frozen in this edition. Positions
            use wins, then points scored. All-play compares each weekly score
            with the other eleven teams. AI forecasts and quotes are preserved
            from the published 6 September draft report. Total prediction error
            sums the absolute gap across all twelve positions.
          </p>
          <p>
            Joe’s current Sleeper Week 7 score is 117.18, a 0.10 correction
            below the settled matchup report. This edition uses 117.18 for
            points and all-play; the original settled result remains unchanged.
            Team reports are editorial assessments at halfway, not Week 8
            previews.
          </p>
          <p>
            Manager predictions stay behind the existing member sign-in. Only
            complete ballots count; no ballot means no prediction score.
          </p>
          <a href="/draft-recap">Original forecasts</a>
          <a href="/season-hub">Awards & trade receipts</a>
        </details>
        <a className="ht-back" href="#main-content">
          BACK TO THE TOP ↑
        </a>
      </footer>

      <Dialog
        open={Boolean(selected)}
        onOpenChangeComplete={(open) => {
          if (open && rugbyEntry)
            rugbyTarget.current?.scrollIntoView({ block: 'start' });
        }}
        onOpenChange={(open) => {
          if (!open) morphReport(null);
        }}
      >
        <DialogContent
          className={`ht-dialog ${motionPaused ? 'ht-motion-paused' : ''}`}
          showCloseButton={false}
          finalFocus={opener}
          initialFocus={rugbyEntry ? rugbyTarget : undefined}
          style={{ viewTransitionName: selected ? 'ht-dossier' : 'none' }}
        >
          {selected && (
            <>
              <div className="ht-dialog-top">
                <span className="ht-eyebrow">
                  MAC12 / HALFTIME DOSSIER / {two(selected.rank)}
                </span>
                <div className="ht-dialog-actions">
                  <button
                    type="button"
                    className="ht-card-export"
                    aria-label="Save report card"
                    disabled={exportState === 'saving'}
                    onClick={async () => {
                      setExportState('saving');
                      try {
                        await saveReportCard(selected);
                        setExportState('saved');
                      } catch {
                        setExportState('error');
                      }
                    }}
                  >
                    {exportState === 'saved' ? (
                      <Check size={15} />
                    ) : (
                      <ArrowDown size={15} />
                    )}
                    <span>
                      {exportState === 'saving'
                        ? 'Saving…'
                        : exportState === 'saved'
                          ? 'Saved'
                          : exportState === 'error'
                            ? 'Try again'
                            : 'Save card'}
                    </span>
                  </button>
                  <DialogClose
                    className="ht-dialog-close"
                    aria-label="Close team report"
                  >
                    <X size={22} />
                  </DialogClose>
                </div>
                <output className="sr-only">
                  {exportState === 'saved'
                    ? 'Report card PNG saved.'
                    : exportState === 'error'
                      ? 'Could not create the image. Please try again.'
                      : ''}
                </output>
              </div>
              <div className="ht-dialog-person">
                <Portrait team={selected} size="large" />
                <div>
                  <p>{selected.name}</p>
                  <DialogTitle className="ht-dialog-title">
                    {selected.team}
                  </DialogTitle>
                </div>
                <span className="ht-dialog-record">{selected.record}</span>
              </div>
              <DialogDescription className="ht-dialog-description">
                {selected.title}
              </DialogDescription>
              <div className="ht-dossier-stats">
                <div>
                  <span>WEEK 7</span>
                  <strong>#{selected.rank}</strong>
                </div>
                <div>
                  <span>AI PICK</span>
                  <strong>#{selected.ai}</strong>
                </div>
                <div>
                  <span>POINTS</span>
                  <strong>{selected.points.toFixed(2)}</strong>
                </div>
                <div>
                  <span>ALL-PLAY</span>
                  <strong>
                    {selected.allPlay.join('–').replace(/–0$/, '')}
                  </strong>
                </div>
              </div>
              <div className="ht-dossier-story">
                <p>{selected.review}</p>
              </div>
              <div ref={rugbyTarget} tabIndex={-1}>
                <RugbyReveal
                  key={selected.id}
                  team={selected}
                  paused={motionPaused}
                  startRevealed={rugbyEntry}
                />
              </div>
              <div className="ht-dossier-chart">
                <div>
                  <span className="ht-eyebrow">SEVEN WEEKS ON TAPE</span>
                  <Sparkline
                    scores={selected.scores}
                    label={`${selected.name} weekly points`}
                  />
                </div>
                <div className="ht-week-values">
                  {selected.scores.map((points, i) => (
                    <span key={i}>
                      <small>W{i + 1}</small>
                      <strong>{points.toFixed(2)}</strong>
                    </span>
                  ))}
                </div>
              </div>
              <details className="ht-dossier-receipt">
                <summary>
                  <span>Pull the preseason receipt</span>
                  <span>
                    #{selected.ai} <ArrowDown size={16} />
                  </span>
                </summary>
                <blockquote>“{selected.quote}”</blockquote>
                <span className="ht-dossier-verdict">
                  {selected.verdict} · halfway assessment
                </span>
              </details>
              {report.activity.teams.find(
                (t) => t.rosterId === selected.id,
              ) && (
                <TeamActivity
                  team={report.activity.teams.find(
                    (t) => t.rosterId === selected.id,
                  )!}
                />
              )}
              <div className="ht-dossier-question">
                <span className="ht-eyebrow">THE SECOND-HALF QUESTION</span>
                <p>{selected.question}</p>
                {!secondHalf.locked && (
                  <DialogClose
                    className="ht-text-button"
                    onClick={() =>
                      window.setTimeout(() =>
                        document.getElementById('second-half')?.scrollIntoView({
                          behavior: motionAllowed() ? 'smooth' : 'auto',
                        }),
                      )
                    }
                  >
                    {secondHalf.own
                      ? 'Review your second-half ballot'
                      : 'Make your second-half call'}{' '}
                    <ArrowDown size={15} />
                  </DialogClose>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
