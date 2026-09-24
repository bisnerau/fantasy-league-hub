import { ArrowRight, Star } from 'lucide-react';
import type { getClubhouseEditorial } from '@/lib/data/clubhouse-editorial';

type Editorial = ReturnType<typeof getClubhouseEditorial>;

/** The lead report as a headline and a two-line teaser, never a wall of text. */
export function LeadStory({
  lead,
  week,
}: {
  lead: Editorial['lead'];
  week: number;
}) {
  if (!lead)
    return (
      <section aria-labelledby="lead-story-title">
        <p className="ui-kicker">Matchup reports</p>
        <h2 id="lead-story-title" className="section-title">
          The Week {week} previews are still to come.
        </h2>
      </section>
    );
  const href = `/matchups?week=${lead.week}#matchup-${lead.matchup.sleeperMatchupId}`;
  return (
    <section aria-labelledby="lead-story-title">
      <p className="ui-kicker flex items-center gap-1.5 text-primary">
        {lead.featured && <Star className="size-3.5" aria-hidden="true" />}
        {lead.featured
          ? 'Match of the Week'
          : lead.kind === 'review'
            ? `Week ${lead.week} round-up`
            : `Week ${lead.week} preview`}
      </p>
      <h2
        id="lead-story-title"
        className="mt-1 text-2xl font-bold leading-tight tracking-tight sm:text-3xl"
      >
        <a className="hover:text-primary" href={href}>
          {lead.story.headline}
        </a>
      </h2>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
        {lead.story.summary}
      </p>
      <a href={href} className="clubhouse-text-link mt-1 min-h-11">
        Read the {lead.kind === 'review' ? 'report' : 'preview'}{' '}
        <ArrowRight className="size-4" />
      </a>
    </section>
  );
}

export function TalkingPoints({
  points,
}: {
  points: Editorial['talkingPoints'];
}) {
  if (!points.length) return null;
  return (
    <section aria-labelledby="talking-points-title">
      <h2 id="talking-points-title" className="ui-kicker">
        Three talking points
      </h2>
      <ol className="snap-rail mt-3">
        {points.map((point, index) => (
          <li key={point.title} className="talking-point">
            <a href={point.href} className="block h-full">
              <span className="font-mono text-xs text-primary">
                0{index + 1}
              </span>
              <span className="mt-1 block font-semibold leading-snug">
                {point.title}
              </span>
              <span className="mt-1 line-clamp-2 block text-xs leading-5 text-muted-foreground">
                {point.text}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
