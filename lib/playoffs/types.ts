export const MODEL_VERSION = 'mac12-score-simulation-v1';
export const SIMULATIONS = 100_000;

export type ForecastTeam = {
  id: number;
  name: string;
  manager: string;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  rank: number;
};
export type ReturnWindow = {
  playerId: string;
  name: string;
  earliestWeek: number;
  latestWeek: number;
  checkedAt: string;
  source: string;
  note: string;
};
export type ForecastPlayer = {
  id: string;
  name: string;
  position: string;
  team: string;
  mean: number;
  variance: number;
  available: boolean;
  gameId: string;
  kickoff: string;
  state: 'pre' | 'in' | 'post';
  actual: number | null;
};
export type ForecastLineup = {
  rosterId: number;
  week: number;
  players: ForecastPlayer[];
  locked: { slot: number; playerId: string }[];
  notes: string[];
  starterIds?: string[];
};
export type ForecastFixture = {
  key: string;
  week: number;
  matchupId: number;
  home: number;
  away: number;
};
export type Calibration = {
  version: string;
  throughWeek: number;
  samples: number;
  positionVariance: Record<string, number>;
  teamVarianceScale: number;
  summary: string;
};
export type ForecastInput = {
  version: string;
  leagueId: string;
  season: number;
  asOf: string;
  sourceCutoff: string;
  completedThrough: number;
  regularSeasonWeeks: number;
  playoffTeams: number;
  slots: string[];
  teams: ForecastTeam[];
  fixtures: ForecastFixture[];
  lineups: ForecastLineup[];
  returns: ReturnWindow[];
  assumptions?: {
    name: string;
    checkedAt: string;
    weeks: string;
    note: string;
    source: string;
  }[];
  calibration: Calibration;
};
export type Scenario = Record<string, number>;
export type Chances = { playoff: number; last: number };
export type ConditionalChances = Chances & { effectiveSamples: number };
export type FixtureEffect = {
  rosterId: number;
  homeWin: ConditionalChances | null;
  awayWin: ConditionalChances | null;
};
export type FixtureForecast = ForecastFixture & {
  homeWin: number;
  tie: number;
  resolved: boolean;
  effects: FixtureEffect[];
};
export type ForecastResult = {
  iterations: number;
  effectiveSamples: number;
  reliable: boolean;
  final: boolean;
  teams: (Chances & { rosterId: number })[];
  fixtures: FixtureForecast[];
};
export type ForecastSnapshot = {
  id: string;
  input: ForecastInput;
  result: ForecastResult;
};
export type ForecastResponse = {
  snapshot: ForecastSnapshot | null;
  previous: ForecastResult | null;
  stale: boolean;
  notice: string | null;
};
