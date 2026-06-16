-- Tweak — One active challenge at a time + stale auto-expiry
--
-- Run in the Supabase SQL Editor AFTER 0004_invite_links.sql.
--
-- Stops a challenger from spamming: at most one ACTIVE (pending) challenge each.
-- A BEFORE-INSERT trigger first expires their timed-out pending challenges so a
-- stale one never locks them out permanently. The short response window itself
-- is set client-side via expires_at (2 min targeted, 1 h links).

-- Clear any pre-existing pending challenges so the unique index can be built.
-- (Alpha: there shouldn't be meaningful in-flight challenges; this just lets
-- the migration apply cleanly if old test data has multiple pending rows.)
update public.challenges set status = 'expired' where status = 'pending';

-- Before a challenger inserts a new challenge, expire any of THEIR pending
-- challenges whose timer has already run out — so a timed-out challenge doesn't
-- block them from sending a fresh one.
create or replace function public.expire_stale_challenges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.challenges
    set status = 'expired'
    where challenger_id = new.challenger_id
      and status = 'pending'
      and expires_at < now();
  return new;
end;
$$;

drop trigger if exists challenges_expire_stale on public.challenges;
create trigger challenges_expire_stale
  before insert on public.challenges
  for each row execute function public.expire_stale_challenges();

-- The hard guarantee: at most one ACTIVE (pending) challenge per challenger.
-- A second concurrent send fails with a unique violation (23505), which the
-- client maps to "you already have a pending challenge".
create unique index if not exists challenges_one_pending_per_challenger
  on public.challenges (challenger_id)
  where status = 'pending';
