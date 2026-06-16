-- Phase 3 — Live usage sync: war_room_state
--
-- Run in the Supabase SQL Editor AFTER 0002_war_room.sql.
--
-- One row per used ability per room, keyed by the OWNER's army + the stable
-- abilityKey(name, source). Each player only ever writes rows for their OWN
-- army (owner_id = themselves); both players read all rows. The DB is the
-- source of truth — last write wins via the primary-key upsert.

create table public.war_room_state (
  room_id uuid not null references public.war_rooms (id) on delete cascade,
  owner_id uuid not null,            -- whose army this ability belongs to
  ability_key text not null,         -- abilityKey(name, source) — stable across parses
  used boolean not null default true,
  updated_by uuid not null default auth.uid(),
  updated_at timestamptz not null default now(),
  primary key (room_id, owner_id, ability_key)
);

alter table public.war_room_state enable row level security;

-- Both players in the room may READ all of its state (so each sees the other's
-- marks). The war_rooms subquery runs under the caller's RLS, which already
-- restricts it to rooms they're in.
create policy "wrs_select" on public.war_room_state
  for select using (
    exists (select 1 from public.war_rooms r
            where r.id = room_id and auth.uid() in (r.player1_id, r.player2_id))
  );

-- A player may only write state for THEIR OWN army (owner_id = themselves) and
-- must stamp themselves as updater. This prevents marking your opponent's
-- abilities.
create policy "wrs_insert" on public.war_room_state
  for insert with check (
    updated_by = auth.uid()
    and owner_id = auth.uid()
    and exists (select 1 from public.war_rooms r
                where r.id = room_id and auth.uid() in (r.player1_id, r.player2_id))
  );
create policy "wrs_update" on public.war_room_state
  for update using (
    exists (select 1 from public.war_rooms r
            where r.id = room_id and auth.uid() in (r.player1_id, r.player2_id))
  ) with check (updated_by = auth.uid() and owner_id = auth.uid());

-- Realtime: deliver state changes to both players. replica identity full so
-- DELETE/UPDATE payloads carry enough to reconcile (we only upsert, but be safe).
alter table public.war_room_state replica identity full;
alter publication supabase_realtime add table public.war_room_state;
