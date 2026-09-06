export type LeagueBranding = {
  sleeperLeagueId: string;
  name: string;
  tagline: string;
  shortName: string;
  season?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  ownerNameOverrides: Record<string, string>;
  teamAvatarOverrides: Record<string, string>;
};

export const leagueConfig: LeagueBranding = {
  sleeperLeagueId: process.env.NEXT_PUBLIC_SLEEPER_LEAGUE_ID ?? '',
  name: 'MAC 12',
  shortName: 'M12',
  tagline: 'Twelve managers. One champion. Est. 2020.',
  season: undefined,
  colors: {
    primary: 'var(--primary)',
    secondary: 'var(--secondary)',
    accent: 'var(--accent)',
  },
  ownerNameOverrides: {},
  teamAvatarOverrides: {},
};

export const hasConfiguredLeague = Boolean(leagueConfig.sleeperLeagueId);
