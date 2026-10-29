'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { useHalftimeReducedMotion } from './use-reduced-motion';
import {
  ArrowUpRight,
  Check,
  Play,
  RotateCcw,
  SkipForward,
  Trophy,
} from 'lucide-react';
import type { HalftimeReport, HalftimeTeam } from '@/lib/data/halftime/report';

type Award = HalftimeReport['honours'][number];
type Phase = 'ready' | 'nominees' | 'envelope' | 'winner';

function HostLine({ children }: { children: string }) {
  return (
    <blockquote className="ht-stage-quote">
      <cite>MACKORCLE</cite>
      <p>“{children}”</p>
    </blockquote>
  );
}

export function AwardsStage({
  teams,
  awards,
  intro,
  paused,
  onOpenTeam,
}: {
  teams: HalftimeTeam[];
  awards: HalftimeReport['honours'];
  intro: string;
  paused: boolean;
  onOpenTeam: (team: HalftimeTeam, target: HTMLElement) => void;
}) {
  const screen = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);
  const [phase, setPhase] = useState<Phase>('ready');
  const [seen, setSeen] = useState<string[]>([]);
  const [allResults, setAllResults] = useState(false);
  const reduce = useHalftimeReducedMotion();
  const still = paused || Boolean(reduce);
  const award = awards[selected];
  const playing = phase === 'nominees' || phase === 'envelope';
  const winner = phase === 'winner';
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(
      () => {
        if (still || phase === 'envelope') {
          setPhase('winner');
          setSeen((s) => (s.includes(award.id) ? s : [...s, award.id]));
        } else setPhase('envelope');
      },
      still ? 0 : phase === 'nominees' ? 6000 : 2000,
    );
    return () => window.clearTimeout(timer);
  }, [phase, playing, still, award.id]);

  function reveal(index = selected) {
    screen.current?.scrollIntoView({
      block: 'center',
      behavior: still ? 'instant' : 'smooth',
    });
    setSelected(index);
    setPhase(still ? 'winner' : 'nominees');
    if (still)
      setSeen((s) =>
        s.includes(awards[index].id) ? s : [...s, awards[index].id],
      );
  }
  function skip() {
    setPhase('winner');
    setSeen((s) => (s.includes(award.id) ? s : [...s, award.id]));
  }
  function evidence(a: Award, target: HTMLElement) {
    const team = teams.find((t) => t.id === a.rosterId);
    if (team) onOpenTeam(team, target);
  }
  return (
    <MotionConfig reducedMotion={still ? 'always' : 'user'}>
      <div className="ht-ceremony" data-phase={phase} data-still={still}>
        <div className="ht-stage-topline">
          <span>
            <i /> RETURN OF THE MAC
          </span>
          <span>HALFTIME HONOURS / 2026</span>
        </div>
        <div className="ht-stage-scene">
          <motion.div
            className="ht-stage-beam ht-stage-beam-left"
            aria-hidden="true"
            animate={{
              rotate: still ? -18 : winner ? -8 : playing ? -27 : -18,
              opacity: winner ? 0.8 : 0.35,
            }}
            transition={{ duration: still ? 0 : 1.2 }}
          />
          <motion.div
            className="ht-stage-beam ht-stage-beam-right"
            aria-hidden="true"
            animate={{
              rotate: still ? 18 : winner ? 8 : playing ? 27 : 18,
              opacity: winner ? 0.8 : 0.35,
            }}
            transition={{ duration: still ? 0 : 1.2 }}
          />
          <div className="ht-stage-architecture" aria-hidden="true" />
          <motion.div
            className="ht-stage-host"
            animate={{
              x: still ? 0 : playing ? 8 : 0,
              rotate: still ? 0 : phase === 'envelope' ? -2 : 0,
            }}
            transition={{
              type: 'spring',
              duration: still ? 0 : 0.6,
              bounce: 0.12,
            }}
          >
            <Image
              src="/images/halftime/mackorcle-awards.png"
              width="1400"
              height="1122"
              alt="Mackorcle holding a gold awards envelope"
              loading="lazy"
              unoptimized
            />
            <div className="ht-stage-podium">
              <span>
                MAC<span>12</span>
              </span>
              <small>THE HALFTIME SHOW</small>
              <b>MACKORCLE</b>
            </div>
          </motion.div>
          <div
            className="ht-stage-screen"
            ref={screen}
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="ht-stage-screen-top">
              <span>0{selected + 1} / 05</span>
              <span>
                {winner
                  ? 'THE HONOUR GOES TO'
                  : playing
                    ? 'THE PRESENTATION'
                    : 'YOUR HOST · MACKORCLE'}
              </span>
              <Trophy size={16} />
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                className="ht-stage-content"
                key={`${selected}-${phase}`}
                initial={{ opacity: 0, y: still ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: still ? 0 : -10 }}
                transition={{ duration: still ? 0 : 0.25 }}
              >
                {phase === 'ready' && (
                  <>
                    <span className="ht-stage-kicker">
                      FIVE ENVELOPES. SEVEN WEEKS OF EVIDENCE.
                    </span>
                    <h3>{award.label}</h3>
                    <div className="ht-stage-seal" aria-hidden="true">
                      <Trophy size={42} />
                    </div>
                    <HostLine>{intro}</HostLine>
                  </>
                )}
                {phase === 'nominees' && (
                  <>
                    <span className="ht-stage-kicker">
                      THE EDITORIAL SHORTLIST
                    </span>
                    <h3>{award.label}</h3>
                    <div className="ht-stage-nominees">
                      {award.shortlist.map((nominee, i) => (
                        <motion.div
                          key={nominee.name}
                          initial={{ opacity: 0, x: still ? 0 : 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: still ? 0 : i * 0.65,
                            duration: still ? 0 : 0.3,
                          }}
                        >
                          <span>0{i + 1}</span>
                          <div>
                            <strong>{nominee.name}</strong>
                            <small>{nominee.evidence}</small>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
                {phase === 'envelope' && (
                  <>
                    <span className="ht-stage-kicker">{award.label}</span>
                    <div className="ht-envelope" aria-hidden="true">
                      <motion.div
                        className="ht-envelope-flap"
                        initial={{ rotateX: 0 }}
                        animate={{ rotateX: 180 }}
                        transition={{ delay: 0.3, duration: 0.65 }}
                      />
                      <motion.div
                        className="ht-envelope-card"
                        initial={{ y: 0 }}
                        animate={{ y: -32 }}
                        transition={{ delay: 0.85, duration: 0.5 }}
                      >
                        <Trophy size={32} />
                      </motion.div>
                      <span>MAC12</span>
                    </div>
                    <h3>The envelope, please.</h3>
                  </>
                )}
                {winner && (
                  <>
                    <span className="ht-stage-kicker">{award.label}</span>
                    <motion.div
                      className="ht-winner-metric"
                      initial={{ scale: still ? 1 : 0.82 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        bounce: 0.2,
                        duration: still ? 0 : 0.6,
                      }}
                    >
                      {award.metric}
                    </motion.div>
                    <h3>{award.winner}</h3>
                    <p className="ht-winner-detail">{award.detail}</p>
                    <HostLine>{award.mackorcle}</HostLine>
                    <button
                      className="ht-stage-evidence"
                      type="button"
                      onClick={(e) => evidence(award, e.currentTarget)}
                    >
                      Show the evidence <ArrowUpRight size={16} />
                    </button>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="ht-stage-floor" aria-hidden="true" />
          <div className="ht-stage-audience" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
        </div>
        <div className="ht-stage-controls">
          <span>{seen.length} / 5 opened</span>
          <button
            type="button"
            className="ht-stage-present"
            onClick={() => (playing ? skip() : reveal())}
          >
            {playing ? (
              <>
                <SkipForward size={16} /> Skip to winner
              </>
            ) : winner ? (
              <>
                <RotateCcw size={16} /> Replay this award
              </>
            ) : (
              <>
                <Play size={16} /> Present this award
              </>
            )}
          </button>
          {winner && selected < 4 && (
            <button
              type="button"
              onClick={() => {
                setSelected(selected + 1);
                setPhase('ready');
              }}
            >
              Next award →
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (playing) skip();
              setAllResults(!allResults);
            }}
          >
            {allResults ? 'Hide all results' : 'Show all results'}
          </button>
        </div>
        <div className="ht-award-programme" aria-label="Choose an award">
          {awards.map((a, i) => (
            <button
              key={a.id}
              type="button"
              aria-pressed={selected === i}
              onClick={() => {
                setSelected(i);
                setPhase('ready');
              }}
            >
              <span>0{i + 1}</span>
              <strong>{a.label}</strong>
              {seen.includes(a.id) ? (
                <Check size={16} aria-label="Opened" />
              ) : (
                <Play size={14} />
              )}
            </button>
          ))}
        </div>
        {allResults && (
          <div className="ht-award-results">
            {awards.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={(e) => evidence(a, e.currentTarget)}
              >
                <span>{a.label}</span>
                <strong>{a.winner}</strong>
                <small>{a.detail}</small>
                <p>{a.verdict}</p>
                <ArrowUpRight size={16} />
              </button>
            ))}
          </div>
        )}
        <p className="ht-stage-footnote">
          Mackorcle’s editorial honours · Based on Weeks 1–7, not a manager
          vote. Pickup returns include only verified receipts. Final-season
          awards are still to come.
        </p>
      </div>
    </MotionConfig>
  );
}
