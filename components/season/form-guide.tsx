'use client';

import { useEffect, useRef, useState } from 'react';
import { Stamp } from '@/components/effects/stamp';
import { prefersReducedMotion } from '@/lib/motion';
import type { FormTile } from '@/lib/season/my-season';

const resultWord = { W: 'Win', L: 'Loss', T: 'Tie' } as const;

function describe(tile: FormTile, name: (rosterId: number) => string) {
  if (tile.state === 'bye') return `Week ${tile.week} · No paired matchup`;
  if (tile.state === 'missing')
    return `Week ${tile.week} · Score unavailable from Sleeper`;
  if (tile.state === 'upcoming') return `Week ${tile.week} · Still to play`;
  return `Week ${tile.week} · ${resultWord[tile.state]} ${tile.points.toFixed(2)}–${tile.against.toFixed(2)} v ${name(tile.opponent)}`;
}

/**
 * The season as a football form guide. Tiles flip in one after another the
 * first time the strip is seen; tap or press a tile to read that week.
 */
export function FormGuide({
  tiles,
  name,
  best,
  lowest,
  luck,
}: {
  tiles: FormTile[];
  name: (rosterId: number) => string;
  best: number | null;
  lowest: number | null;
  luck: { value: number; allPlay: string; record: string } | null;
}) {
  const ref = useRef<HTMLOListElement>(null);
  const played = tiles.filter((t) => t.state !== 'upcoming');
  const [selected, setSelected] = useState<number | null>(
    [...played]
      .reverse()
      .find((t) => t.state !== 'bye' && t.state !== 'missing')?.week ?? null,
  );
  const tile = tiles.find((t) => t.week === selected);

  // The server renders face-up tiles; only a motion-friendly browser turns
  // them over first so they can flip into view.
  useEffect(() => {
    const list = ref.current;
    if (!list || prefersReducedMotion()) return;
    list.dataset.armed = '';
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        list.dataset.shown = '';
      },
      { threshold: 0.4 },
    );
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  const record = (['W', 'L', 'T'] as const).map(
    (state) => tiles.filter((t) => t.state === state).length,
  );

  return (
    <section
      id="my-log"
      aria-labelledby="my-log-title"
      className="season-panel"
    >
      <p className="ui-kicker text-primary">Your season log</p>
      <h2 id="my-log-title" className="section-title">
        The form guide
      </h2>
      {!played.length ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Settled matchup results will appear here after Week 1.
        </p>
      ) : (
        <>
          <p className="mt-1 text-xs text-muted-foreground">
            {record[0]}W · {record[1]}L{record[2] ? ` · ${record[2]}T` : ''} ·
            tap a week for the score
          </p>
          <ol ref={ref} className="form-strip" aria-label="Weekly results">
            {tiles.map((t, index) => (
              <li
                key={t.week}
                style={{ '--i': index } as React.CSSProperties}
                className="form-cell"
              >
                {t.state === 'upcoming' ? (
                  <span className="form-tile" data-state="upcoming">
                    <span className="sr-only">
                      Week {t.week}, still to play
                    </span>
                    <span className="form-tile-week" aria-hidden="true">
                      {t.week}
                    </span>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="form-tile"
                    data-state={t.state}
                    data-best={t.week === best || undefined}
                    data-lowest={t.week === lowest || undefined}
                    aria-pressed={selected === t.week}
                    aria-label={describe(t, name)}
                    onClick={() => setSelected(t.week)}
                  >
                    <span className="form-tile-mark" aria-hidden="true">
                      {t.state === 'bye'
                        ? 'B'
                        : t.state === 'missing'
                          ? '–'
                          : t.state}
                    </span>
                    <span className="form-tile-week" aria-hidden="true">
                      {t.week}
                    </span>
                  </button>
                )}
              </li>
            ))}
          </ol>
          <p className="form-detail" aria-live="polite">
            {tile ? (
              <>
                <span>{describe(tile, name)}</span>
                {tile.week === best && <Stamp tone="gold">Best week</Stamp>}
                {tile.week === lowest && <Stamp tone="muted">Lowest</Stamp>}
              </>
            ) : (
              'Tap a week for the score.'
            )}
          </p>
          {tiles.some((t) => t.state === 'missing') && (
            <p className="season-note mt-2">
              Some scores are unavailable. Best and lowest weeks use the
              available results only.
            </p>
          )}
        </>
      )}
      {luck && <LuckMeter {...luck} />}
    </section>
  );
}

/** Real record against the all-play record: were the fixtures kind? */
function LuckMeter({
  value,
  allPlay,
  record,
}: {
  value: number;
  allPlay: string;
  record: string;
}) {
  const wins = Math.abs(value).toFixed(1);
  const verdict =
    value >= 0.5
      ? `Riding your luck · ${wins} wins above your scoring`
      : value <= -0.5
        ? `Hard done by · ${wins} wins below your scoring`
        : 'Right on the money · your record matches your scoring';
  const offset = Math.max(-1, Math.min(1, value / 3)) * 50;
  return (
    <div className="luck-meter">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <h3 className="text-sm font-semibold">Luck meter</h3>
        <p className="font-mono text-xs text-muted-foreground">
          {record} real · {allPlay} all-play
        </p>
      </div>
      <div className="luck-track" aria-hidden="true">
        <span className="luck-marker" style={{ left: `${50 + offset}%` }} />
      </div>
      <p className="luck-scale" aria-hidden="true">
        <span>Unlucky</span>
        <span>Fair</span>
        <span>Lucky</span>
      </p>
      <p className="mt-1 text-sm">{verdict}</p>
      <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
        All-play is your record if you had played every other team each week.
      </p>
    </div>
  );
}
