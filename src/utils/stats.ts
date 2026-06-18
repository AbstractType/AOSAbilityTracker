import { supabase } from '../lib/supabase';
import { keyForAbility } from '../types/customization';
import { parseAbilitiesFromJSON } from './jsonParser';
import type { SavedArmy } from '../types/army';

/**
 * War-room usage analytics, derived entirely from existing data:
 *  - war_rooms (how many games you've been in — RLS scopes to yours),
 *  - war_room_state (which of your abilities you marked used, per room),
 *  - your saved armies (to find abilities you field but never use).
 *
 * No new tables. "Most used" counts the number of rooms in which you marked an
 * ability used; "never used" lists abilities present in your saved armies that
 * have never been marked used in any room.
 */

export interface AbilityUsageStat {
  abilityKey: string;
  name: string;
  source: string;
  /** Number of rooms in which the user marked this ability used. */
  count: number;
}

export interface UsageStats {
  gamesPlayed: number;
  mostUsed: AbilityUsageStat[];
  neverUsed: { abilityKey: string; name: string; source: string }[];
}

/** Split an abilityKey (`name|source`) back into its parts. */
function splitKey(key: string): { name: string; source: string } {
  const i = key.lastIndexOf('|');
  if (i === -1) return { name: key, source: '' };
  return { name: key.slice(0, i), source: key.slice(i + 1) };
}

async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

export async function getUsageStats(savedArmies: SavedArmy[]): Promise<UsageStats> {
  const empty: UsageStats = { gamesPlayed: 0, mostUsed: [], neverUsed: [] };
  const userId = await currentUserId();
  if (!userId) return empty;

  // Games played — RLS already restricts war_rooms to ones you're a player in.
  const { data: rooms, error: roomsErr } = await supabase.from('war_rooms').select('id');
  if (roomsErr) {
    // eslint-disable-next-line no-console
    console.error('[stats] rooms fetch failed:', roomsErr.message);
  }
  const gamesPlayed = rooms?.length ?? 0;

  // Your used-ability rows across all your rooms.
  const { data: stateRows, error: stateErr } = await supabase
    .from('war_room_state')
    .select('ability_key')
    .eq('owner_id', userId)
    .eq('used', true);
  if (stateErr) {
    // eslint-disable-next-line no-console
    console.error('[stats] state fetch failed:', stateErr.message);
  }

  const counts = new Map<string, number>();
  for (const r of (stateRows ?? []) as { ability_key: string }[]) {
    counts.set(r.ability_key, (counts.get(r.ability_key) ?? 0) + 1);
  }

  const mostUsed: AbilityUsageStat[] = [...counts.entries()]
    .map(([k, count]) => ({ abilityKey: k, ...splitKey(k), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  // Never-used: abilities in your saved armies with no used rows anywhere.
  const fielded = new Map<string, { name: string; source: string }>();
  for (const army of savedArmies) {
    try {
      const parsed = parseAbilitiesFromJSON(army.json);
      for (const a of parsed.abilities) {
        const k = keyForAbility(a);
        if (!fielded.has(k)) fielded.set(k, { name: a.name, source: a.source ?? '' });
      }
    } catch {
      /* skip an army that fails to parse */
    }
  }
  const neverUsed = [...fielded.entries()]
    .filter(([k]) => !counts.has(k))
    .map(([k, v]) => ({ abilityKey: k, name: v.name, source: v.source }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { gamesPlayed, mostUsed, neverUsed };
}
