import { ChevronDown } from 'lucide-react';
import {
  draftPersonalities,
  personalityCopy,
} from '@/lib/data/draft-personality';

function Methodology() {
  return (
    <p className="text-[11px] leading-5 text-muted-foreground">
      Compared with the frozen FantasyPros consensus ADP order in our{' '}
      <a
        className="text-primary underline underline-offset-2"
        href="/data/draft-2026-pick-review.csv"
      >
        published pick review
      </a>
      , not decimal average draft position or Sleeper’s auto-draft queue. The
      league comparison uses rounds 1–7, excludes kickers and defences, and
      averages the absolute gap between actual pick and benchmark order. Within
      six places counts as “close”; more than six early is a reach, more than
      six late is a fall. Lower average gap means closer to the board, not a
      better draft. Unknown benchmarks are excluded, never counted as zero. Ties
      share a place. Draft slot and positional needs also affect these gaps.
      Auto-draft accusations are jokes, not evidence of how a manager selected.
    </p>
  );
}

export function DraftPersonalityTable() {
  return (
    <details
      data-adp-comparison
      className="group/adp linear-panel rounded-xl p-4 sm:p-5"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
        <div>
          <p className="ui-kicker">The draft-room receipts</p>
          <h2 className="mt-1 text-base font-semibold sm:text-lg">
            Who drafted by the book?
          </h2>
        </div>
        <ChevronDown className="size-4 shrink-0 transition-transform group-open/adp:rotate-180" />
      </summary>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">
        From market followers to managers who brought their own shopping list.
        Open a manager’s report for the roast and every pick.
      </p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <caption className="sr-only">
            Managers ordered by average absolute distance from ADP order in
            rounds one through seven
          </caption>
          <thead className="text-[10px] text-muted-foreground">
            <tr>
              <th scope="col" className="py-3 pr-3">
                Place
              </th>
              <th scope="col" className="p-3">
                Manager
              </th>
              <th scope="col" className="p-3">
                Average gap
              </th>
              <th scope="col" className="p-3">
                Close
              </th>
              <th scope="col" className="p-3">
                Early reaches
              </th>
              <th scope="col" className="p-3">
                Late falls
              </th>
            </tr>
          </thead>
          <tbody>
            {draftPersonalities.map((d) => (
              <tr key={d.rosterId} className="border-t border-white/[0.065]">
                <td className="py-3 pr-3 font-mono text-primary">
                  {d.meanDistance === null
                    ? '—'
                    : draftPersonalities.findIndex(
                        (other) => other.meanDistance === d.meanDistance,
                      ) + 1}
                </td>
                <th scope="row" className="p-3 text-left font-medium">
                  <a
                    href={`#roster-${d.rosterId}`}
                    className="hover:text-primary"
                  >
                    {d.managerName}
                  </a>
                  <span className="mt-1 block text-[10px] font-normal text-muted-foreground">
                    {personalityCopy[d.rosterId].label}
                  </span>
                </th>
                <td className="p-3 font-mono">
                  {d.meanDistance?.toFixed(1) ?? '—'}
                  <span className="block text-[10px] text-muted-foreground">
                    {d.earlyCount} picks
                  </span>
                </td>
                <td className="p-3">{d.close}</td>
                <td className="p-3">{d.reaches}</td>
                <td className="p-3">{d.falls}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-medium text-primary">
          How the comparison works
        </summary>
        <div className="mt-2">
          <Methodology />
        </div>
      </details>
    </details>
  );
}

export function DraftPersonality({ rosterId }: { rosterId: number }) {
  const data = draftPersonalities.find((d) => d.rosterId === rosterId);
  const copy = personalityCopy[rosterId];
  if (!data || !copy) return null;
  return (
    <section
      data-draft-personality
      className="rounded-xl border border-secondary/20 bg-secondary/[0.035] p-4"
    >
      <p className="ui-kicker">Draft personality</p>
      <h3 className="mt-2 text-sm font-semibold">{copy.label}</h3>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">
        {copy.roast}
      </p>
      <p className="mt-3 text-[11px] leading-5">
        Rounds 1–7: {data.close} close · {data.reaches} early reaches ·{' '}
        {data.falls} late falls · {data.meanDistance?.toFixed(1) ?? '—'} places
        average gap.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {[
          { title: 'Biggest reach', pick: data.biggestReach, word: 'early' },
          {
            title: 'Biggest fall collected',
            pick: data.biggestFall,
            word: 'late',
          },
        ].map(({ title, pick, word }) => (
          <div
            key={title}
            className="rounded-lg border border-white/[0.065] p-3"
          >
            <p className="ui-kicker">{title}</p>
            <p className="mt-2 text-xs font-semibold">
              {pick?.player ?? 'None among eligible picks'}
            </p>
            {pick && (
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                Round {pick.round} · pick #{pick.overall} · ADP order #
                {pick.adpOrder}
                <br />
                {Math.abs(pick.gap!)} places {word}.
              </p>
            )}
          </div>
        ))}
      </div>
      <p className="mt-2 text-[10px] leading-5 text-muted-foreground">
        Spotlights cover all rounds, excluding K/DEF. A fall is a market
        discount, not proof of value or deliberate patience.
      </p>
      <details className="group/evidence mt-3 rounded-lg border border-white/[0.065]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
          Every pick against the board
          <ChevronDown className="size-3.5 shrink-0 transition-transform group-open/evidence:rotate-180" />
        </summary>
        <div className="overflow-x-auto border-t border-white/[0.065]">
          <table className="w-full text-left text-[11px]">
            <caption className="sr-only">
              All draft selections compared with consensus ADP order
            </caption>
            <thead className="text-muted-foreground">
              <tr>
                <th scope="col" className="p-3">
                  Pick
                </th>
                <th scope="col" className="p-3">
                  Player
                </th>
                <th scope="col" className="p-3">
                  ADP order
                </th>
                <th scope="col" className="p-3">
                  Difference
                </th>
              </tr>
            </thead>
            <tbody>
              {data.evidence.map((p) => (
                <tr key={p.overall} className="border-t border-white/[0.045]">
                  <td className="p-3 align-top">
                    #{p.overall}
                    <span className="block text-muted-foreground">
                      R{p.round}
                    </span>
                  </td>
                  <th
                    scope="row"
                    className="p-3 text-left align-top font-medium"
                  >
                    {p.player}
                    <span className="mt-1 block text-[10px] font-normal text-muted-foreground">
                      {p.position}
                      {p.position === 'K' || p.position === 'DEF'
                        ? ' · excluded from comparison'
                        : p.round <= 7
                          ? ' · main comparison'
                          : ' · later round'}
                    </span>
                  </th>
                  <td className="p-3 align-top">
                    {p.adpOrder === null ? 'Unavailable' : `#${p.adpOrder}`}
                  </td>
                  <td className="whitespace-nowrap p-3 align-top text-muted-foreground">
                    {p.gap === null
                      ? 'Not assessed'
                      : p.gap === 0
                        ? 'On the number'
                        : `${Math.abs(p.gap)} ${p.gap > 0 ? 'early' : 'late'}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-white/[0.065] p-3">
          <Methodology />
        </div>
      </details>
    </section>
  );
}
