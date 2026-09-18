import type { SupabaseClient } from '@supabase/supabase-js';

export type VoteRecord = {
  matchup_id: number;
  voter_id: string;
  selected_roster_id: number;
};

export type BankerRecord = {
  prediction_week_id: number;
  matchup_id: number;
  voter_id: string;
};

/** The database atomically replaces the week's nomination and enforces its deadline. */
export async function persistBanker(
  client: SupabaseClient,
  matchupId: number,
  voterId: string,
) {
  const { data: saved, error } = await client
    .rpc('set_prediction_banker', { target_matchup_id: matchupId })
    .single();
  const row = saved as BankerRecord | null;
  return {
    saved:
      !error &&
      row?.matchup_id === matchupId &&
      row.voter_id === voterId &&
      Number.isInteger(row.prediction_week_id)
        ? row
        : null,
    locked: Boolean(error?.message.toLowerCase().includes('locked')),
  };
}

/** Confirm the exact persisted row before the interface calls a pick saved. */
export async function persistPick(client: SupabaseClient, vote: VoteRecord) {
  const { data: saved, error } = await client
    .from('prediction_votes')
    .upsert(vote, { onConflict: 'matchup_id,voter_id' })
    .select('matchup_id,voter_id,selected_roster_id')
    .single();
  const confirmed =
    !error &&
    saved &&
    saved.matchup_id === vote.matchup_id &&
    saved.voter_id === vote.voter_id &&
    saved.selected_roster_id === vote.selected_roster_id;
  return {
    saved: confirmed ? (saved as VoteRecord) : null,
    locked: Boolean(error?.message.toLowerCase().includes('locked')),
  };
}
