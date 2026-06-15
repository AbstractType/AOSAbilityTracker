import { supabase } from '../lib/supabase';
import type { Ability } from '../types';
import {
  abilityKey,
  keyForAbility,
  type Customization,
} from '../types/customization';

/**
 * Supabase-backed per-user ability customization layer (hide / note / sort).
 *
 * All RLS is enforced server-side — the SDK attaches the session JWT, the
 * policies filter to rows where user_id = auth.uid(). We do still have to
 * pass user_id explicitly on insert because the RLS insert policy's
 * `with check (auth.uid() = user_id)` evaluates to NULL (denial) if the
 * column is absent, exactly the same problem we hit on the armies table.
 */

interface CustomizationRow {
  id: string;
  user_id: string;
  ability_name: string;
  ability_source: string;
  hidden: boolean;
  note: string | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

function rowToCustomization(row: CustomizationRow): Customization {
  return {
    abilityName: row.ability_name,
    abilitySource: row.ability_source,
    hidden: row.hidden,
    note: row.note,
    sortOrder: row.sort_order,
  };
}

/** Pull all customizations for the current user into a Map for O(1) lookup. */
export async function getAllCustomizations(): Promise<Map<string, Customization>> {
  const { data, error } = await supabase
    .from('ability_customizations')
    .select('*');

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[customizations] fetch failed:', error.message);
    return new Map();
  }

  const map = new Map<string, Customization>();
  for (const row of (data ?? []) as CustomizationRow[]) {
    map.set(abilityKey(row.ability_name, row.ability_source), rowToCustomization(row));
  }
  return map;
}

/**
 * Get the current user's id from the local session (no network round-trip).
 * Returns null if there isn't a session — callers should bail with a friendly
 * error rather than pass null on to the DB.
 */
async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

/**
 * Upsert a single column on the customization row for one ability. Used by
 * setHidden and setNote — both follow the same shape (insert if missing,
 * update one field if present, leave other fields alone).
 *
 * Note on upsert behavior: Supabase translates this to
 *   INSERT ... ON CONFLICT (user_id, ability_name, ability_source)
 *   DO UPDATE SET <provided columns> = EXCLUDED.<provided columns>
 * which means columns NOT in our payload keep their existing values on
 * update and take their DB default on insert. So setting `hidden=true`
 * won't clobber an existing `note`, and vice versa.
 */
async function upsertOne(
  ability: Ability,
  patch: Partial<Pick<CustomizationRow, 'hidden' | 'note' | 'sort_order'>>
): Promise<void> {
  const userId = await currentUserId();
  if (!userId) throw new Error('You need to be signed in to customize abilities.');

  const { error } = await supabase
    .from('ability_customizations')
    .upsert(
      {
        user_id: userId,
        ability_name: ability.name,
        ability_source: ability.source ?? '',
        ...patch,
      },
      { onConflict: 'user_id,ability_name,ability_source' }
    );

  if (error) {
    throw new Error(error.message || 'Could not save customization. Try again.');
  }
}

/** Toggle (or explicitly set) the hidden flag for an ability. */
export async function setHidden(ability: Ability, hidden: boolean): Promise<void> {
  await upsertOne(ability, { hidden });
}

/**
 * Set the note for an ability. Pass an empty string (or whitespace-only) to
 * clear the note — we normalize to NULL so the DB doesn't carry meaningless
 * empty strings.
 */
export async function setNote(ability: Ability, note: string): Promise<void> {
  const trimmed = note.trim();
  await upsertOne(ability, { note: trimmed.length > 0 ? trimmed : null });
}

/**
 * Persist an already-ordered list of abilities as the phase's sort order:
 * writes contiguous sort_order values (0, 1, 2, ...) matching the array
 * order. Used by both the Move Up/Down buttons (via moveAbility) and the
 * drag-and-drop reorder, which produce an arbitrary final permutation.
 *
 * Why rewrite the whole phase instead of touching only changed rows: it
 * keeps the math trivial (no fractional indexing, no NULL-tiebreak quirks)
 * at the cost of ~5-15 upserts per reorder. Acceptable for our scale;
 * revisit if a phase ever has hundreds of abilities.
 */
export async function persistPhaseOrder(orderedAbilities: Ability[]): Promise<void> {
  const userId = await currentUserId();
  if (!userId) throw new Error('You need to be signed in to reorder abilities.');

  const rows = orderedAbilities.map((a, i) => ({
    user_id: userId,
    ability_name: a.name,
    ability_source: a.source ?? '',
    sort_order: i,
  }));

  const { error } = await supabase
    .from('ability_customizations')
    .upsert(rows, { onConflict: 'user_id,ability_name,ability_source' });

  if (error) {
    throw new Error(error.message || 'Could not reorder. Try again.');
  }
}

/**
 * Move an ability one position up or down within its phase. The caller
 * supplies the current ordered list of abilities in that phase (already
 * sorted using whatever sort_order overrides are in effect); we compute
 * the swap, then persist the whole phase's new order.
 */
export async function moveAbility(
  ability: Ability,
  phaseAbilities: Ability[],
  direction: 'up' | 'down'
): Promise<void> {
  const targetKey = keyForAbility(ability);
  const idx = phaseAbilities.findIndex(a => keyForAbility(a) === targetKey);
  if (idx === -1) {
    // The ability isn't in the phase we were told it's in — caller bug,
    // but bail quietly rather than corrupting data.
    return;
  }
  const swapWith = direction === 'up' ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= phaseAbilities.length) return; // already at boundary

  const reordered = [...phaseAbilities];
  [reordered[idx], reordered[swapWith]] = [reordered[swapWith], reordered[idx]];

  await persistPhaseOrder(reordered);
}
