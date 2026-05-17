import { supabase, type ArmyRow } from '../lib/supabase';
import type { SavedArmy } from '../types/army';

/**
 * Supabase-backed persistence for per-user saved army lists.
 *
 * All functions are async and authenticated — the SDK attaches the current
 * user's JWT automatically, and Row Level Security policies on the `armies`
 * table enforce that a user can only see/modify their own rows. We therefore
 * don't pass the user id explicitly anywhere; the DB infers it from auth.
 *
 * The 3-armies-per-user cap is enforced both client-side (for UX — disable
 * the Save button at the cap) and database-side (a trigger raises an error
 * if a 4th insert is attempted, which protects against UI bypass).
 */

/** Convert a Postgres timestamp row into the JS-friendly SavedArmy shape. */
function rowToSavedArmy(row: ArmyRow): SavedArmy {
  return {
    id: row.id,
    name: row.name,
    json: row.json,
    // Postgres returns an ISO 8601 timestamp; SavedArmy expects epoch ms
    // so the existing sort/format code in the UI doesn't have to change.
    createdAt: new Date(row.created_at).getTime(),
  };
}

/**
 * Fetch every saved army for the current signed-in user, newest first.
 * Returns [] if not signed in or if the query fails (with a console error
 * for diagnosis — we don't want a transient network blip to look like
 * "your saves vanished").
 */
export async function getSavedArmies(): Promise<SavedArmy[]> {
  const { data, error } = await supabase
    .from('armies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[savedArmies] fetch failed:', error.message);
    return [];
  }

  return (data ?? []).map(rowToSavedArmy);
}

/**
 * Save a new army. Returns the persisted row (with server-generated id +
 * timestamps) so the caller can append it to local state without a refetch.
 * Throws a friendly Error on failure (3-army cap, network error, RLS denial)
 * so the calling UI can render the message inline.
 *
 * Why we pass `user_id` explicitly even though the user is implicit in the
 * auth session: the RLS insert policy is `with check (auth.uid() = user_id)`.
 * Without supplying `user_id`, Postgres sees `auth.uid() = null` which
 * evaluates to NULL (not TRUE), so the policy denies the insert with a 403
 * + error 42501. Future cleanup: add `default auth.uid()` to the column
 * in a DB migration and drop this manual passthrough.
 */
export async function saveArmy(name: string, json: string): Promise<SavedArmy> {
  // Pull the user's id from the local session — synchronous in practice
  // (no network round-trip), so the cost is negligible.
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) {
    throw new Error('You need to be signed in to save armies.');
  }

  const { data, error } = await supabase
    .from('armies')
    .insert({ name, json, user_id: userId })
    .select()
    .single();

  if (error) {
    // The DB trigger raises a check_violation when the user already has 3.
    if (error.message.includes('3-army limit')) {
      throw new Error('You can only save up to 3 armies. Delete one first.');
    }
    // RLS rejection (defensive — shouldn't fire now that we pass user_id,
    // but catches it cleanly if the policy ever changes or the session
    // is stale for some reason).
    if (
      error.message.includes('row-level security') ||
      error.message.includes('violates row-level security')
    ) {
      throw new Error(
        'Could not save — your session may have expired. Sign out and back in to refresh.'
      );
    }
    throw new Error(error.message || 'Could not save the army. Try again.');
  }

  return rowToSavedArmy(data as ArmyRow);
}

/**
 * Delete an army by id. The RLS policy ensures the user can only delete
 * their own rows — passing someone else's id silently no-ops at the DB
 * level (not an error, just zero rows affected).
 */
export async function deleteArmy(armyId: string): Promise<void> {
  const { error } = await supabase.from('armies').delete().eq('id', armyId);
  if (error) {
    throw new Error(error.message || 'Could not delete the army. Try again.');
  }
}
