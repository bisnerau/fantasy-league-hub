export type SleeperLeague = {
  league_id: string;
  name: string;
  season: string;
  status: 'pre_draft' | 'drafting' | 'in_season' | 'complete';
  total_rosters: number;
  previous_league_id: string | null;
  roster_positions: string[];
  settings: Record<string, number | null>;
  scoring_settings: Record<string, number>;
  metadata?: Record<string, string> | null;
};

export type SleeperUser = {
  user_id: string;
  username: string;
  display_name: string;
  avatar: string | null;
  metadata?: { team_name?: string; avatar?: string } | null;
};

export type SleeperRoster = {
  roster_id: number;
  owner_id: string | null;
  players: string[] | null;
  starters: string[] | null;
  reserve?: string[] | null;
  settings: {
    wins: number;
    losses: number;
    ties: number;
    fpts: number;
    fpts_decimal?: number;
    fpts_against: number;
    fpts_against_decimal?: number;
    waiver_position?: number;
    waiver_budget_used?: number;
  };
  metadata?: Record<string, string> | null;
};

export type SleeperMatchup = {
  roster_id: number;
  matchup_id: number | null;
  points: number;
  custom_points?: number | null;
  players: string[];
  starters: string[];
  players_points: Record<string, number>;
  starters_points?: number[];
};

export type SleeperTransaction = {
  transaction_id: string;
  type: 'trade' | 'waiver' | 'free_agent' | 'commissioner';
  status: string;
  created: number;
  roster_ids: number[];
  adds: Record<string, number> | null;
  drops: Record<string, number> | null;
  draft_picks?: Array<Record<string, unknown>>;
  settings?: { waiver_bid?: number; seq?: number | null } | null;
};

export type SleeperDraft = {
  draft_id: string;
  league_id: string;
  season: string;
  type: string;
  status: string;
  rounds: number;
  settings: Record<string, number>;
  slot_to_roster_id: Record<string, number>;
};

export type SleeperDraftPick = {
  round: number;
  roster_id: number;
  player_id: string;
  picked_by: string;
  pick_no: number;
  draft_slot: number;
  metadata: Record<string, string>;
};

export type SleeperBracketMatch = {
  r: number;
  m: number;
  t1: number | null;
  t2: number | null;
  w?: number | null;
  l?: number | null;
  t1_from?: { w?: number; l?: number };
  t2_from?: { w?: number; l?: number };
};

export type SleeperNFLState = {
  week: number;
  season: string;
  season_type: 'pre' | 'regular' | 'post';
  display_week: number;
  league_season: string;
};

export type SleeperPlayer = {
  player_id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  position: string | null;
  team: string | null;
  status?: string | null;
  fantasy_positions?: string[] | null;
  age?: number | null;
};

export type SleeperTrendingPlayer = {
  player_id: string;
  count: number;
};

export type SleeperProjection = {
  player_id: string;
  stats: Record<string, number>;
  player?: Record<string, unknown>;
};
