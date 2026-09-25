import { TeamAvatar } from '@/components/shared/team-avatar';
import type { Superlative } from '@/lib/data/standings';

/** Top scorer, toughest schedule and luckiest record: a swipe rail on phones. */
export function SuperlativesRail({ items }: { items: Superlative[] }) {
  return (
    <section aria-labelledby="superlatives-title">
      <div className="section-heading">
        <div>
          <p className="ui-kicker text-primary">So far</p>
          <h2 id="superlatives-title" className="section-title">
            Superlatives
          </h2>
        </div>
      </div>
      <ul className="snap-rail">
        {items.map((item) => (
          <li key={item.key} className="talking-point">
            <p className="ui-kicker">{item.label}</p>
            <div className="mt-3 flex items-center gap-3">
              <TeamAvatar avatar={item.team.avatar} name={item.team.teamName} />
              <div className="min-w-0">
                <p className="truncate font-bold">{item.team.teamName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.team.ownerName}
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
