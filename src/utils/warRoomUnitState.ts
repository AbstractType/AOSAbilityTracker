import { supabase } from '../lib/supabase';
import type { UnitState } from '../types/unit';

export interface UnitStateRow {
  room_id: string;
  owner_id: string;
  unit_id: string;
  wounds: number;
  destroyed: boolean;
  summoned: boolean;
  charged: boolean;
  hit_modifier: number;
  save_modifier: number;
}

export function rowToUnitState(row: UnitStateRow): UnitState {
  return {
    wounds: row.wounds,
    destroyed: row.destroyed,
    summoned: row.summoned,
    charged: row.charged,
    hitModifier: row.hit_modifier,
    saveModifier: row.save_modifier,
  };
}

export async function getUnitStates(roomId: string): Promise<UnitStateRow[]> {
  const { data, error } = await supabase
    .from('war_room_unit_state')
    .select('*')
    .eq('room_id', roomId);
  if (error) throw error;
  return (data ?? []) as UnitStateRow[];
}

export async function upsertUnitState(
  roomId: string,
  ownerId: string,
  unitId: string,
  state: UnitState,
): Promise<void> {
  const { error } = await supabase
    .from('war_room_unit_state')
    .upsert(
      {
        room_id: roomId,
        owner_id: ownerId,
        unit_id: unitId,
        wounds: state.wounds,
        destroyed: state.destroyed,
        summoned: state.summoned ?? false,
        charged: state.charged ?? false,
        hit_modifier: state.hitModifier ?? 0,
        save_modifier: state.saveModifier ?? 0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'room_id,owner_id,unit_id' }
    );
  if (error) throw error;
}

export function unitStateKey(ownerId: string, unitId: string): string {
  return `${ownerId}::${unitId}`;
}
