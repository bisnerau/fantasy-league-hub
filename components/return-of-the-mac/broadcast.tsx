import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { AudioPlayer } from './audio-player';
import {
  formatMacDate,
  macEpisodeHref,
  macShow,
  type MacEpisode,
} from '@/lib/data/return-of-the-mac';

export function EpisodeContext({ episode }: { episode: MacEpisode }) {
  return (
    <p className="text-xs leading-5 text-muted-foreground">
      {episode.context} · Recorded{' '}
      <time dateTime={episode.recordedOn}>
        {formatMacDate(episode.recordedOn)}
      </time>
    </p>
  );
}

export function Broadcast({
  episode,
  detail = false,
  hasPrevious = false,
}: {
  episode: MacEpisode;
  detail?: boolean;
  hasPrevious?: boolean;
}) {
  const Heading = detail ? 'h1' : 'h3';
  return (
    <div className="mac-broadcast">
      <div className="mac-portrait">
        <Image
          src={episode.portrait}
          alt="Mackorcle Senior the First at his desk, wearing a dark hat and MAC12 polo, with his calculator and oversized dinner bell."
          width={1200}
          height={900}
          unoptimized
          className="block h-auto w-full"
        />
        <p className="mac-desk-label">The clubhouse broadcast desk</p>
      </div>
      <div className="min-w-0 p-5 sm:p-6">
        <EpisodeContext episode={episode} />
        <Heading className="mt-3 text-2xl font-black leading-tight tracking-tight sm:text-3xl">
          {detail ? (
            episode.title
          ) : (
            <a href={macEpisodeHref(episode)} className="hover:text-primary">
              {episode.title}
            </a>
          )}
        </Heading>
        <p className="mt-3 text-sm font-semibold">{macShow.host}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          @{macShow.username}
        </p>
        <div className="mt-5">
          <AudioPlayer
            key={episode.slug}
            src={episode.audio}
            durationSeconds={episode.durationSeconds}
            title={episode.title}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-x-5">
          {episode.transcript?.length ? (
            <a
              href={
                detail ? '#transcript' : `${macEpisodeHref(episode)}#transcript`
              }
              className="clubhouse-text-link min-h-11"
            >
              Read transcript
            </a>
          ) : null}
          <a href="/return-of-the-mac" className="clubhouse-text-link min-h-11">
            {hasPrevious ? 'Previous episodes' : 'All episodes'}{' '}
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function MacHomepageFeature({
  episodes,
}: {
  episodes: readonly MacEpisode[];
}) {
  const episode = episodes[0];
  if (!episode) return null;
  return (
    <section aria-labelledby="mac-show-title">
      <p className="ui-kicker text-primary">Mackalytics in Macktion</p>
      <h2 id="mac-show-title" className="section-title">
        <a href="/return-of-the-mac">{macShow.title}</a>
      </h2>
      <p className="mt-1 mb-4 text-sm text-muted-foreground">
        {macShow.tagline}
      </p>
      <Broadcast episode={episode} hasPrevious={episodes.length > 1} />
    </section>
  );
}
