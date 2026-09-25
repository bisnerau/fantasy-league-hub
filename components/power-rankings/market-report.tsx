import type { RankingRow } from '@/components/power-rankings/rankings-list';
import { TeamAvatar } from '@/components/shared/team-avatar';
import type { MarketReportItem } from '@/lib/data/power-rankings';

/** Movers and records that disagree with the order: a swipe rail on phones. */
export function MarketReport({
  items,
  rows,
}: {
  items: MarketReportItem[];
  rows: RankingRow[];
}) {
  const cards = items.flatMap((item) => {
    const row = rows.find((candidate) => candidate.rosterId === item.rosterId);
    return row ? [{ item, row }] : [];
  });
  if (!cards.length) return null;
  return (
    <section aria-labelledby="market-report-title">
      <div className="section-heading">
        <div>
          <p className="ui-kicker text-primary">This week</p>
          <h2 id="market-report-title" className="section-title">
            Market report
          </h2>
        </div>
      </div>
      <ul className="snap-rail market-report-rail">
        {cards.map(({ item, row }) => (
          <li key={item.key} className="talking-point">
            <p className="ui-kicker">{item.label}</p>
            <div className="mt-3 flex items-center gap-3">
              <TeamAvatar avatar={row.avatar} name={row.teamName} />
              <div className="min-w-0">
                <p className="truncate font-bold">{row.teamName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {row.manager}
                </p>
              </div>
            </div>
            <p className="mt-3 font-mono text-sm font-bold text-primary">
              {item.value}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
