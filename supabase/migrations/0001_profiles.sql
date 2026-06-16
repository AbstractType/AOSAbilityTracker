-- Phase 1 — Identity: profiles + username search
--
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Idempotent-ish: safe to re-run except the CREATE TABLE (which errors if it
-- already exists — drop it first if you need to reapply during development).

-- citext gives case-insensitive usernames without manual lower() everywhere.
create extension if not exists citext;

-- ---------------------------------------------------------------------------
-- profiles: one row per user, holding their public-facing username.
-- ---------------------------------------------------------------------------
create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  -- 3–20 chars, lowercase letters / digits / underscore. Unique (citext = CI).
  username citext unique not null
    check (char_length(username::text) between 3 and 20
           and username ~ '^[a-z0-9_]+$'),
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Owner-only access. We deliberately do NOT allow public SELECT of this table —
-- that would let anyone scrape the whole user list. Discovery happens through
-- the search_users() RPC below, which is rate-limited by a min query length
-- and a hard LIMIT.
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = user_id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = user_id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- search_users: find other players by username prefix.
-- ---------------------------------------------------------------------------
-- SECURITY DEFINER so it can read past the owner-only RLS, but it only ever
-- returns a narrow projection (no email, no ids beyond user_id), excludes the
-- caller, requires a 2+ char query, and caps at 10 rows — so it can't be used
-- to enumerate the whole table.
create or replace function public.search_users(q text)
returns table (user_id uuid, username citext, display_name text)
language sql
security definer
set search_path = public
as $$
  select p.user_id, p.username, p.display_name
  from public.profiles p
  where char_length(trim(q)) >= 2
    and p.username ilike trim(q) || '%'
    and p.user_id <> auth.uid()
  order by p.username
  limit 10
$$;

-- Only signed-in users may search; never anon.
revoke all on function public.search_users(text) from public;
grant execute on function public.search_users(text) to authenticated;
