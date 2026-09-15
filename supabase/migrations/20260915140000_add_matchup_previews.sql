-- Public editorial metadata. Existing matchups RLS restricts all writes to
-- the service role; member votes and their disclosure rules are unchanged.
alter table public.prediction_matchups
  add column preview_story jsonb;

alter table public.prediction_matchups
  add constraint prediction_preview_object
  check (preview_story is null or jsonb_typeof(preview_story) = 'object');

comment on column public.prediction_matchups.preview_story is
  'Immutable Thursday pregame edition, written by the authenticated cron before early games. Contains no member votes.';
