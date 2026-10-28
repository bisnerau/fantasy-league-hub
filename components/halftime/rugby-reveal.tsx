'use client';

import { useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { useHalftimeReducedMotion } from './use-reduced-motion';
import { ArrowRight, RotateCcw } from 'lucide-react';
import type { HalftimeTeam } from '@/lib/data/halftime/report';

export function RugbyReveal({
  team,
  paused,
  startRevealed = false,
}: {
  team: HalftimeTeam;
  paused: boolean;
  startRevealed?: boolean;
}) {
  const [revealed, setRevealed] = useState(startRevealed);
  const reduce = useHalftimeReducedMotion();
  const still = paused || reduce;
  const rugby = team.rugby;
  return (
    <MotionConfig reducedMotion={still ? 'always' : 'user'}>
      <section
        className="ht-rugby"
        aria-label={`${team.name} rugby comparison`}
      >
        <header>
          <span className="ht-eyebrow">THE JERSEY SWITCH</span>
          <h3>
            Then in blue.
            <br />
            <em>Now in green.</em>
          </h3>
        </header>
        <div className="ht-rugby-reveal">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={revealed ? 'ireland' : 'leinster'}
              className={`ht-rugby-card ${revealed ? 'ht-rugby-green' : 'ht-rugby-blue'}`}
              initial={{ opacity: 0, x: still ? 0 : 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: still ? 0 : -32 }}
              transition={{ duration: still ? 0 : 0.3 }}
            >
              <span className="ht-rugby-kit" aria-hidden="true">
                {revealed ? 'IRE' : 'LEI'}
                <small>{revealed ? '07' : '00'}</small>
              </span>
              <span className="ht-eyebrow">
                {revealed ? 'OCTOBER / IRELAND' : 'SEPTEMBER / LEINSTER'}
              </span>
              <h4>{revealed ? rugby.player : rugby.original.player}</h4>
              <p>
                {revealed ? rugby.era : 'The original draft-night comparison'}
              </p>
              {revealed && (
                <span className="ht-rugby-status">{rugby.status}</span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <button
          type="button"
          className="ht-rugby-toggle"
          aria-expanded={revealed}
          onClick={() => setRevealed(!revealed)}
        >
          {revealed ? 'Replay the jersey switch' : 'Who are you now?'}{' '}
          {revealed ? <RotateCcw size={16} /> : <ArrowRight size={18} />}
        </button>
        {revealed ? (
          <div className="ht-rugby-verdict" aria-live="polite">
            <div className="ht-rugby-evidence">
              {rugby.evidence.map((stat) => (
                <span key={stat}>{stat}</span>
              ))}
            </div>
            <p>{rugby.verdict}</p>
            <blockquote>{rugby.roast}</blockquote>
            <details>
              <summary>Revisit the original call</summary>
              <p>
                <strong>{rugby.original.player}.</strong>{' '}
                {rugby.original.detail}
              </p>
            </details>
            {rugby.source && (
              <a href={rugby.source} target="_blank" rel="noreferrer">
                Why this player? Rugby reference ↗
              </a>
            )}
            <small>
              A comparison of this season’s story with a player’s qualities or
              career chapter.
            </small>
          </div>
        ) : (
          <p className="ht-rugby-original">{rugby.original.detail}</p>
        )}
      </section>
    </MotionConfig>
  );
}
