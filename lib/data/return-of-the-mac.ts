export type MacEpisode = {
  slug: string;
  title: string;
  publishedAt: string;
  recordedOn: string;
  season: string;
  week: number;
  manager: string;
  team: string;
  context: string;
  audio: string;
  durationSeconds: number;
  portrait: string;
  transcript?: readonly string[];
};

export const macShow = {
  title: 'Return of the Mac Mondays',
  tagline: 'Less reaction. More Macktion.',
  host: 'Mackorcle Senior the First',
  username: 'returnofthemac-12',
};

// Published episodes are snapshots: add a new entry, never rewrite an old one.
export const macEpisodes: readonly MacEpisode[] = [
  {
    slug: '2026-week-4-donta-fourmore',
    title: 'Donta Fourmore: the record needs correcting.',
    publishedAt: '2026-10-02T20:50:00Z',
    recordedOn: '2026-10-02',
    season: '2026',
    week: 4,
    manager: 'Joe Ennis',
    team: 'Donta Fourmore',
    context: 'Week 4 preview/pilot',
    audio: '/audio/return-of-the-mac/2026-week-4-donta-fourmore.mp3',
    durationSeconds: 126,
    portrait: '/images/return-of-the-mac/mackorcle-senior-v9.webp',
  },
];

export function getMacEpisodes(
  now = Date.now(),
  episodes: readonly MacEpisode[] = macEpisodes,
) {
  return episodes
    .filter((episode) => Date.parse(episode.publishedAt) <= now)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export function getMacEpisode(
  slug: string,
  now = Date.now(),
  episodes: readonly MacEpisode[] = macEpisodes,
) {
  return getMacEpisodes(now, episodes).find((episode) => episode.slug === slug);
}

export function macEpisodeHref(episode: MacEpisode) {
  return `/return-of-the-mac/${episode.slug}`;
}

export function formatMacDate(date: string) {
  return new Intl.DateTimeFormat('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Dublin',
  }).format(new Date(date));
}

export function formatAudioTime(seconds: number) {
  const whole = Math.floor(Number.isFinite(seconds) ? Math.max(0, seconds) : 0);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}
