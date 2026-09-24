import {
  Award,
  BarChart3,
  BookOpen,
  NotebookPen,
  Skull,
  TrendingUp,
  UserRound,
  Users,
} from 'lucide-react';

/** One swipeable row of league destinations; the bottom bar covers the rest. */
export function ExploreStrip({ beforeDraft }: { beforeDraft: boolean }) {
  const links = [
    beforeDraft
      ? { label: 'Draft Report', href: '/draft-recap', icon: NotebookPen }
      : { label: 'Power Rankings', href: '/power-rankings', icon: TrendingUp },
    { label: 'Standings', href: '/standings', icon: BarChart3 },
    { label: 'Record Book', href: '/records', icon: BookOpen },
    { label: 'Managers', href: '/managers', icon: Users },
    { label: 'Awards & Receipts', href: '/season-hub', icon: Award },
    { label: 'My Season', href: '/my-season', icon: UserRound },
    { label: 'Wall of Shame', href: '/wall-of-shame', icon: Skull },
  ];
  return (
    <nav aria-labelledby="explore-title">
      <h2 id="explore-title" className="ui-kicker">
        Explore the league
      </h2>
      <ul className="snap-rail mt-3">
        {links.map(({ label, href, icon: Icon }) => (
          <li key={href}>
            <a href={href} className="explore-chip">
              <Icon
                className="size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
