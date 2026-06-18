import { supabase } from '../lib/supabase';
import type { WarRoom } from '../types/warRoom';

/**
 * War-room reads. The room itself is created by the `accept_challenge` RPC
 * (see utils/challenges.ts); here we just fetch it. RLS restricts reads to the
 * room's two players.
 */

export interface WarRoomRow {
  id: string;
  player1_id: string;
  player1_army_json: string;
  player2_id: string | null;
  player2_army_json: string | null;
  status: string;
  created_at: string;
  // Clock columns (added in migration 0006; may be absent on older rows).
  active_player_id?: string | null;
  current_phase?: string | null;
  turn_number?: number | null;
  phase_started_at?: string | null;
}

export function rowToWarRoom(row: WarRoomRow): WarRoom {
  return {
    id: row.id,
    player1Id: row.player1_id,
    player1ArmyJson: row.player1_army_json,
    player2Id: row.player2_id,
    player2ArmyJson: row.player2_army_json,
    status: row.status,
    createdAt: new Date(row.created_at).getTime(),
    activePlayerId: row.active_player_id ?? null,
    currentPhase: row.current_phase ?? null,
    turnNumber: row.turn_number ?? 1,
    phaseStartedAt: row.phase_started_at
      ? new Date(row.phase_started_at).getTime()
      : Date.now(),
  };
}

/** Fetch a war room by id (the caller must be one of its two players). */
export async function getRoom(roomId: string): Promise<WarRoom | null> {
  const { data, error } = await supabase
    .from('war_rooms')
    .select('*')
    .eq('id', roomId)
    .maybeSingle();

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[warRoom] fetch failed:', error.message);
    return null;
  }
  return data ? rowToWarRoom(data as WarRoomRow) : null;
}
