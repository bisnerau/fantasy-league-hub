import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Broadcast } from '@/components/return-of-the-mac/broadcast';
import {
  formatMacDate,
  getMacEpisode,
  getMacEpisodes,
  macShow,
} from '@/lib/data/return-of-the-mac';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const episode = getMacEpisode((await params).slug);
  if (!episode) return { title: 'Episode not found' };
  return {
    title: `${episode.title} | ${macShow.title}`,
    description: `${episode.context}. ${episode.manager} joins the Mackalytics in Macktion casebook. Recorded ${formatMacDate(episode.recordedOn)}.`,
  };
}

export default async function MacEpisodePage({ params }: Props) {
  const episode = getMacEpisode((await params).slug);
  if (!episode) notFound();
  return (
    <div className="space-y-6">
      <header>
        <a href="/return-of-the-mac" className="clubhouse-text-link min-h-11">
          {macShow.title}
        </a>
        <p className="text-sm text-muted-foreground">{macShow.tagline}</p>
      </header>
      <Broadcast
        episode={episode}
        detail
        hasPrevious={getMacEpisodes().some(
          (candidate) => candidate.publishedAt < episode.publishedAt,
        )}
      />
      <p className="text-xs text-muted-foreground">
        {episode.season} · Week {episode.week} · Featuring {episode.manager},{' '}
        {episode.team}
        <br />
        Published{' '}
        <time dateTime={episode.publishedAt}>
          {formatMacDate(episode.publishedAt)}
        </time>
      </p>
      {episode.transcript?.length ? (
        <section
          id="transcript"
          aria-labelledby="transcript-title"
          className="max-w-2xl scroll-mt-24 space-y-4"
        >
          <h2 id="transcript-title" className="section-title">
            Transcript
          </h2>
          {episode.transcript.map((paragraph, index) => (
            <p key={index} className="text-sm leading-7">
              {paragraph}
            </p>
          ))}
        </section>
      ) : null}
    </div>
  );
}
