-- Phase 4 — Invite links: claim_invite + peek_invite
--
-- Run in the Supabase SQL Editor AFTER 0003_war_room_state.sql.
--
-- A shareable invite is just a challenge whose invite_token is put in a URL
-- (?challenge=<token>). The recipient can't read the challenge by token via RLS
-- (the token is deliberately not a SELECT path), so joining goes through these
-- security-definer RPCs — which also prevents scraping the challenges table by
-- guessing tokens (gen_random_uuid is unguessable anyway).

-- ---------------------------------------------------------------------------
-- peek_invite: minimal info so the join modal can show who invited you and
-- whether the link is still claimable, before you pick an army.
-- ---------------------------------------------------------------------------
create or replace function public.peek_invite(p_token uuid)
returns table (challenger_username citext, valid boolean)
language sql
security definer
set search_path = public
as $$
  select
    c.challenger_username,
    (c.status = 'pending'
      and c.expires_at > now()
      and c.challenger_id <> auth.uid()
      and (c.opponent_id is null or c.opponent_id = auth.uid())) as valid
  from public.challenges c
  where c.invite_token = p_token
  limit 1
$$;
grant execute on function public.peek_invite(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- claim_invite: join a challenge by token with your chosen army. Creates the
-- room (player1 = challenger) and accepts, atomically.
-- ---------------------------------------------------------------------------
create or replace function public.claim_invite(p_token uuid, p_army_json text)
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
    where invite_token = p_token and status = 'pending' and expires_at > now()
    for update;
  if not found then
    raise exception 'invite_invalid';
  end if;
  if ch.challenger_id = auth.uid() then
    raise exception 'cannot_join_own';
  end if;
  -- An open link (opponent_id null) is claimable by anyone; a link that came
  -- from a targeted challenge is only claimable by that target.
  if ch.opponent_id is not null and ch.opponent_id <> auth.uid() then
    raise exception 'invite_taken';
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
grant execute on function public.claim_invite(uuid, text) to authenticated;
