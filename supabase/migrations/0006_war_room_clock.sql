-- Synced turn/phase clock + phase-time logging
--
-- Run in the Supabase SQL Editor AFTER 0005_challenge_limits.sql.
-- Idempotent: safe to re-run at any time.
--
-- Adds a shared game clock to each war room (whose turn, current phase, turn
-- number) so both players stay in lockstep and the turn-role ability filter is
-- driven by shared state rather than a local toggle. Each phase transition is
-- timestamped + logged so the stats screen can show time-per-phase.

-- ---------------------------------------------------------------------------
-- Clock columns on war_rooms (all nullable / defaulted; the client initializes
-- active_player_id + current_phase on first load if still null).
-- ---------------------------------------------------------------------------
alter table public.war_rooms
  add column if not exists active_player_id uuid,
  add column if not exists current_phase text,
  add column if not exists turn_number integer not null default 1,
  add column if not exists phase_started_at timestamptz not null default now();

-- Publish war_rooms so clock UPDATEs reach both players in real time.
alter table public.war_rooms replica identity full;
do $$ begin
  alter publication supabase_realtime add table public.war_rooms;
exception when others then null;
end $$;

-- ---------------------------------------------------------------------------
-- war_room_phase_log: one row per completed phase segment. Written by whichever
-- player advances the clock (records the segment that just ended). Aggregated
-- by the stats screen into time-per-phase.
-- ---------------------------------------------------------------------------
create table if not exists public.war_room_phase_log (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.war_rooms (id) on delete cascade,
  player_id uuid not null,            -- who was the active player during the segment
  phase text not null,
  turn_number integer not null default 1,
  duration_ms integer not null,
  created_at timestamptz not null default now()
);
create index if not exists war_room_phase_log_player_idx on public.war_room_phase_log (player_id);

alter table public.war_room_phase_log enable row level security;

-- Either player in the room may read the log and append segments (either player
-- can advance the shared clock — the logged player_id is whoever was active,
-- not necessarily the one who clicked).
do $$ begin
  create policy "wpl_select" on public.war_room_phase_log
    for select using (
      exists (select 1 from public.war_rooms r
              where r.id = room_id and auth.uid() in (r.player1_id, r.player2_id))
    );
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "wpl_insert" on public.war_room_phase_log
    for insert with check (
      exists (select 1 from public.war_rooms r
              where r.id = room_id and auth.uid() in (r.player1_id, r.player2_id))
    );
exception when duplicate_object then null;
end $$;
