import type { ReturnWindow } from '@/lib/playoffs/types';
// Add a window only when dated reporting supports both bounds. An empty list
// deliberately leaves undated Out/IR absences excluded rather than guessing.
export const returnWindows: ReturnWindow[] = [];
export const injurySources = [
  {
    name: 'Brandon Aiyuk',
    checkedAt: '2026-11-20',
    weeks: '11–14',
    note: 'Reinstated with a roster exemption, but no verified playing return; Sleeper DNR status is excluded.',
    source:
      'https://amp.nfl.com/news/nfl-reinstates-receiver-brandon-aiyuk-to-49ers-after-he-left-team-last-year',
  },
  {
    name: 'Puka Nacua',
    checkedAt: '2026-11-20',
    weeks: '11–14',
    note: 'IR placement does not support a return before the regular-season cutoff.',
    source:
      'https://www.therams.com/news/mcvay-rams-placed-puka-nacua-on-ir-because-they-needed-the-roster-spot-week-10-2026-cardinals',
  },
  {
    name: 'Josh Jacobs',
    checkedAt: '2026-11-20',
    weeks: '11–14',
    note: 'Finger surgery; no bounded return date. Excluded while listed Out/IR.',
    source:
      'https://www.packers.com/news/packers-rb-josh-jacobs-to-miss-time-due-to-surgery-on-broken-finger-nov-9-2026',
  },
  {
    name: 'Jalen Hurts',
    checkedAt: '2026-11-20',
    weeks: '11–14',
    note: 'On injured reserve without a verified return window. Excluded while listed Out/IR.',
    source:
      'https://www.philadelphiaeagles.com/news/eagles-and-jalen-hurts-agent-nicole-lynn-provide-an-update-on-qb-jalen-hurts',
  },
];
