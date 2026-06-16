import { supabase } from '../lib/supabase';

/**
 * Live war-room usage state (`war_room_state`). One row per used ability per
 * room, keyed by (room_id, owner_id, ability_key). Each player writes only
 * their own army's rows (owner_id = themselves); both read all rows. Realtime
 * postgres_changes on this table drives the live cross-player sync.
 */

export interface RoomStateRow {
  room_id: string;
  owner_id: string;
  ability_key: string;
  used: boolean;
}

/** Map key for a single ability's used flag: `${ownerId}::${abilityKey}`. */
export function stateKey(ownerId: string, abilityKey: string): string {
  return `${ownerId}::${abilityKey}`;
}

async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

/** Fetch the full used-state for a room (both players' marks). */
export async function getRoomState(roomId: string): Promise<RoomStateRow[]> {
  const { data, error } = await supabase
    .from('war_room_state')
    .select('room_id, owner_id, ability_key, used')
    .eq('room_id', roomId);

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[warRoomState] fetch failed:', error.message);
    return [];
  }
  return (data ?? []) as RoomStateRow[];
}

/**
 * Upsert a single ability's used flag for the CURRENT user's own army. RLS
 * enforces that owner_id / updated_by are the caller, so a player can only
 * ever change their own army's state.
 */
export async function setAbilityUsed(
  roomId: string,
  abilityKey: string,
  used: boolean
): Promise<void> {
  const userId = await currentUserId();
  if (!userId) throw new Error('You need to be signed in.');

  const { error } = await supabase.from('war_room_state').upsert(
    {
      room_id: roomId,
      owner_id: userId,
      ability_key: abilityKey,
      used,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'room_id,owner_id,ability_key' }
  );

  if (error) throw new Error(error.message || 'Could not sync that change.');
}
