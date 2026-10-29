export const halftimePublication = {
  // Restore only when the commissioner is ready to announce the report.
  isPublic: false,
  leagueId: '1389706813993160704',
  season: 2026,
  publishedAt: '2026-10-28T12:52:08Z',
  path: '/halftime',
};

export function featureHalftime(
  leagueId: string,
  season: string,
  week: number,
) {
  return (
    halftimePublication.isPublic &&
    leagueId === halftimePublication.leagueId &&
    season === String(halftimePublication.season) &&
    week >= 8 &&
    week <= 14
  );
}

export const halftimeHonours = [
  {
    id: 'team',
    label: 'Team of the half',
    rosterId: 10,
    winner: 'Shane Marmion',
    metric: '6–1',
    detail: '973.88 points · 59–18 all-play',
    verdict:
      'First in the table and first against the whole field. Shane has made the engagement jokes considerably harder to write.',
    mackorcle:
      'Shane leads the league in wins and in points. I went looking for an adjustment to make and there isn’t one. It’s been a difficult week for my department.',
  },
  {
    id: 'pickup',
    label: 'Pickup of the half',
    rosterId: 3,
    winner: 'Jared Goff',
    metric: '$5',
    detail: 'Keenan · 86.80 points from four starts',
    verdict:
      'The biggest starter-point return among the fully verified pickup receipts. A useful answer to the forecast that put Keenan last.',
    mackorcle:
      'Keenan paid five dollars for Jared Goff. I want to be careful here, but that is the best five dollars spent in this league, and I’ve seen most of the receipts.',
  },
  {
    id: 'miss',
    label: 'AI Apology Award',
    rosterId: 1,
    winner: 'The Burns forecast',
    metric: '8',
    detail: 'Places out · predicted second, currently tenth',
    verdict:
      'The AI gave six straight playoff appearances plenty of credit. Burns has seven weeks left to make that look less generous.',
    mackorcle:
      'The AI had Burns finishing second. He is tenth. I ran it again on a different calculator and he is still tenth, so I’ve been asked to read this apology out loud.',
  },
  {
    id: 'schedule',
    label: 'Schedule Solicitor',
    rosterId: 12,
    winner: 'Aidan Murphy',
    metric: '47–30',
    detail: 'Third in all-play · seventh in the table',
    verdict:
      'The complaint comes with evidence. Six straight weeks above 114 points and a losing record. The fixture list has been called as a witness.',
    mackorcle:
      'Aidan has outscored most of this league every week since the opener and has a losing record to show for it. On a Mackjusted basis, Aidan is performing very well. The standings have been notified.',
  },
  {
    id: 'escape',
    label: 'Get Away With It',
    rosterId: 11,
    winner: 'David Sharpe',
    metric: '4–3',
    detail: 'Sixth in the table · last in points and all-play',
    verdict:
      'Four wins. Last in points. Please collect your award before the statisticians arrive.',
    mackorcle:
      'David is last in points and sixth in the table. I reviewed the tape three times looking for the part where he does something wrong. To be fair, I couldn’t find the part where he does anything.',
  },
] as const;
