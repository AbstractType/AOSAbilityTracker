-- Phase 2 — Challenges + War Rooms (in-app, no live usage sync yet)
--
-- Run this in the Supabase SQL Editor AFTER 0001_profiles.sql.

-- ---------------------------------------------------------------------------
-- war_rooms: created when a challenge is accepted. Holds both players' armies.
-- ---------------------------------------------------------------------------
create table public.war_rooms (
  id uuid primary key default gen_random_uuid(),
  player1_id uuid not null references auth.users (id) on delete cascade,   -- challenger
  player1_army_json text not null,
  player2_id uuid references auth.users (id) on delete cascade,            -- opponent
  player2_army_json text,
  status text not null default 'active',                                   -- active | ended
  created_at timestamptz not null default now()
);
alter table public.war_rooms enable row level security;

-- Only the two players may read/update their room. Inserts happen exclusively
-- through accept_challenge() (security definer), so no INSERT policy is needed
-- for clients.
create policy "war_rooms_select_players" on public.war_rooms
  for select using (auth.uid() in (player1_id, player2_id));
create policy "war_rooms_update_players" on public.war_rooms
  for update using (auth.uid() in (player1_id, player2_id));

-- ---------------------------------------------------------------------------
-- challenges
-- ---------------------------------------------------------------------------
create type challenge_status as enum ('pending', 'accepted', 'declined', 'cancelled', 'expired');

create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  challenger_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  challenger_username citext not null,        -- denormalized so the opponent can show who challenged them
  opponent_id uuid references auth.users (id) on delete cascade,  -- set for username-targeted challenges
  opponent_email citext,                       -- email-targeted (Phase 5); unused in P2
  invite_token uuid not null default gen_random_uuid(),  -- link-join (Phase 4)
  status challenge_status not null default 'pending',
  challenger_army_json text not null,
  room_id uuid references public.war_rooms (id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '24 hours'
);
alter table public.challenges enable row level security;

-- A user can see challenges they sent, ones targeted at them (by id or email).
-- The invite_token is deliberately NOT a path here — link-join goes through an
-- RPC (Phase 4) so the table can't be token-scraped.
create policy "challenges_select_involved" on public.challenges
  for select using (
    auth.uid() = challenger_id
    or auth.uid() = opponent_id
    or opponent_email = (auth.jwt() ->> 'email')::citext
  );
create policy "challenges_insert_challenger" on public.challenges
  for insert with check (auth.uid() = challenger_id);
-- Cancel (challenger) / decline (opponent) are client UPDATEs; accept goes
-- through the RPC. Both involved parties may update.
create policy "challenges_update_involved" on public.challenges
  for update using (auth.uid() = challenger_id or auth.uid() = opponent_id);

-- ---------------------------------------------------------------------------
-- accept_challenge: atomically create the room (with BOTH players + armies),
-- link it to the challenge, and mark the challenge accepted.
-- ---------------------------------------------------------------------------
-- SECURITY DEFINER because the room's player1 is the *challenger*, not the
-- caller — a plain client insert would be blocked by RLS. The function still
-- verifies the caller is the targeted opponent before doing anything.
create or replace function public.accept_challenge(p_challenge_id uuid, p_army_json text)
returns public.war_rooms
language plpgsql
security definer
set search_path = public
as $$
declare
  ch   public.challenges;
  room public.war_rooms;
begin
  select * into ch from public.challenges
    where id = p_challenge_id and status = 'pending' and expires_at > now()
    for update;
  if not found then
    raise exception 'challenge_unavailable';
  end if;

  if not (ch.opponent_id = auth.uid()
          or ch.opponent_email = (auth.jwt() ->> 'email')::citext) then
    raise exception 'not_your_challenge';
  end if;

  insert into public.war_rooms (player1_id, player1_army_json, player2_id, player2_army_json)
    values (ch.challenger_id, ch.challenger_army_json, auth.uid(), p_army_json)
    returning * into room;

  update public.challenges
    set status = 'accepted', room_id = room.id, opponent_id = auth.uid()
    where id = ch.id;

  return room;
end;
$$;
grant execute on function public.accept_challenge(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Realtime: deliver challenge INSERT/UPDATE events to involved users.
-- replica identity full so UPDATE payloads carry the whole row (status/room_id).
-- ---------------------------------------------------------------------------
alter table public.challenges replica identity full;
alter publication supabase_realtime add table public.challenges;
