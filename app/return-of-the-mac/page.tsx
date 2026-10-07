import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { EpisodeContext } from '@/components/return-of-the-mac/broadcast';
import {
  formatAudioTime,
  formatMacDate,
  getMacEpisodes,
  macEpisodeHref,
  macShow,
} from '@/lib/data/return-of-the-mac';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Return of the Mac Mondays',
  description:
    'Less reaction. More Macktion. The MAC 12 audio archive with Mackorcle Senior the First.',
};

export default function MacArchivePage() {
  const episodes = getMacEpisodes();
  return (
    <div className="space-y-8">
      <header>
        <p className="ui-kicker text-primary">The clubhouse broadcast desk</p>
        <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
          {macShow.title}
        </h1>
        <p className="mt-3 text-lg font-semibold">{macShow.tagline}</p>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
          Join Mackorcle Senior the First for Mackalytics in Macktion:
          completely sincere analysis, increasingly ridiculous statistical
          adjustments, and a fresh defence of a struggling manager. Mackticians
          and Macksperts welcome.
        </p>
      </header>
      <section aria-labelledby="episodes-title">
        <h2 id="episodes-title" className="ui-kicker">
          Episode archive
        </h2>
        {episodes.length ? (
          <ol className="mt-4 divide-y divide-border border-y border-border">
            {episodes.map((episode) => (
              <li key={episode.slug} className="py-5">
                <EpisodeContext episode={episode} />
                <h3 className="mt-2 text-xl font-bold tracking-tight">
                  <a
                    className="hover:text-primary"
                    href={macEpisodeHref(episode)}
                  >
                    {episode.title}
                  </a>
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {episode.manager} · {episode.team} ·{' '}
                  {formatAudioTime(episode.durationSeconds)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Published{' '}
                  <time dateTime={episode.publishedAt}>
                    {formatMacDate(episode.publishedAt)}
                  </time>
                </p>
                <a
                  className="clubhouse-text-link mt-2 min-h-11"
                  href={macEpisodeHref(episode)}
                >
                  Listen to episode{' '}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-4 text-muted-foreground">
            The first broadcast is still to come.
          </p>
        )}
      </section>
      <a href="/" className="clubhouse-text-link min-h-11">
        Back to the clubhouse{' '}
        <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </div>
  );
}
