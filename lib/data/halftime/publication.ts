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
  },
  {
    id: 'miss',
    label: 'Biggest AI miss',
    rosterId: 1,
    winner: 'The Burns forecast',
    metric: '8',
    detail: 'Places out · predicted second, currently tenth',
    verdict:
      'The AI gave six straight playoff appearances plenty of credit. Burns has seven weeks left to make that look less generous.',
  },
] as const;
