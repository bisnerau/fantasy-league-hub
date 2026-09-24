import type { FlagOnThePlay } from '@/lib/data/flags-on-the-play';

/** The week's authored blunder, with a referee's flag thrown onto the card. */
export function FlagOnThePlayCard({ flag }: { flag: FlagOnThePlay }) {
  return (
    <section className="flag-play" aria-labelledby="flag-title">
      <svg viewBox="0 0 40 48" className="flag-icon" aria-hidden="true">
        <path d="M8 4v40" stroke="currentColor" strokeWidth="2.5" />
        <path d="M9 5c9-4 15 5 26 1v18c-11 4-17-5-26-1z" fill="var(--flag)" />
        <circle cx="8" cy="44" r="3.5" fill="currentColor" />
      </svg>
      <div className="min-w-0">
        <p className="ui-kicker text-flag">
          Flag on the play · Week {flag.week}
        </p>
        <h2 id="flag-title" className="mt-1 text-lg font-bold tracking-tight">
          {flag.call}: {flag.manager}
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {flag.text}
        </p>
        <p className="mt-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em]">
          Penalty: {flag.penalty}
        </p>
      </div>
    </section>
  );
}
