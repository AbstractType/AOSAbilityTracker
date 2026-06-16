import { supabase } from '../lib/supabase';
import type { Profile } from '../types/profile';

/**
 * Supabase-backed profile / username layer.
 *
 * Mirrors the RLS conventions used elsewhere: owner-only access on the
 * `profiles` table (so reads/writes only ever touch the caller's row), and
 * an explicit `user_id` on insert because the insert policy is
 * `with check (auth.uid() = user_id)`. Discovery of OTHER users goes through
 * the `search_users` security-definer RPC, never a direct table read.
 */

interface ProfileRow {
  user_id: string;
  username: string;
  display_name: string | null;
  created_at: string;
}

function rowToProfile(row: ProfileRow): Profile {
  return {
    userId: row.user_id,
    username: row.username,
    displayName: row.display_name,
  };
}

async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

/**
 * Fetch the current user's profile, or null if they haven't chosen a username
 * yet. Owner-only RLS means this returns at most the caller's single row.
 */
export async function getMyProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .maybeSingle();

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[profiles] fetch failed:', error.message);
    return null;
  }
  return data ? rowToProfile(data as ProfileRow) : null;
}

/**
 * Create the current user's profile with the chosen username. Returns the
 * created profile. Throws a friendly Error on:
 *  - 23505 unique violation → username taken
 *  - 23514 check violation → invalid format (shouldn't happen if the caller
 *    validated first, but mapped anyway as a safety net)
 */
export async function createProfile(username: string): Promise<Profile> {
  const userId = await currentUserId();
  if (!userId) throw new Error('You need to be signed in to choose a username.');

  const normalized = username.trim().toLowerCase();

  const { data, error } = await supabase
    .from('profiles')
    .insert({ user_id: userId, username: normalized })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('That username is already taken. Try another.');
    }
    if (error.code === '23514') {
      throw new Error('Usernames must be 3–20 characters: lowercase letters, numbers, or underscores.');
    }
    throw new Error(error.message || 'Could not save your username. Try again.');
  }

  return rowToProfile(data as ProfileRow);
}

/**
 * Search for other players by username prefix. Returns [] for queries shorter
 * than 2 chars (the RPC also enforces this) or on error. Never includes the
 * caller; capped at 10 results server-side.
 */
export async function searchUsers(query: string): Promise<Profile[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const { data, error } = await supabase.rpc('search_users', { q });
  if (error) {
    // eslint-disable-next-line no-console
    console.error('[profiles] search failed:', error.message);
    return [];
  }

  return (data ?? []).map((r: any) => ({
    userId: r.user_id,
    username: r.username,
    displayName: r.display_name ?? null,
  }));
}
