import { supabase } from '../lib/supabase';
import type { Phase } from '../types';

/**
 * Shared war-room game clock: whose turn, current phase, turn number — stored
 * on the war_rooms row and synced via Realtime. Each transition records the
 * just-ended phase segment to war_room_phase_log for time-per-phase stats.
 */

export const CLOCK_PHASES: Phase[] = [
  'Deployment Phase',
  'Start of Turn',
  'Hero Phase',
  'Movement Phase',
  'Shooting Phase',
  'Charge Phase',
  'Combat Phase',
  'End of Turn',
];

// New turns begin here (Deployment only happens once, at the very start).
const TURN_START_PHASE: Phase = 'Start of Turn';

// Segments shorter than this are treated as accidental taps and not logged.
const MIN_LOGGED_MS = 1000;

export interface ClockState {
  roomId: string;
  activePlayerId: string;
  currentPhase: Phase;
  turnNumber: number;
  phaseStartedAt: number;
}

/**
 * Initialize the clock if it hasn't been set yet. The conditional `is null`
 * means only the first caller wins, so two clients loading at once don't race.
 */
export async function initClock(roomId: string, firstPlayerId: string): Promise<void> {
  const { error } = await supabase
    .from('war_rooms')
    .update({
      active_player_id: firstPlayerId,
      current_phase: 'Deployment Phase',
      turn_number: 1,
      phase_started_at: new Date().toISOString(),
    })
    .eq('id', roomId)
    .is('active_player_id', null);
  if (error) {
    // eslint-disable-next-line no-console
    console.error('[clock] init failed:', error.message);
  }
}

/** Log the just-ended segment (best-effort) and write the next clock state. */
async function logAndSet(
  ended: { roomId: string; playerId: string; phase: Phase; turn: number; startedAt: number },
  next: { activePlayerId: string; currentPhase: Phase; turnNumber: number }
): Promise<void> {
  const durationMs = Math.max(0, Date.now() - ended.startedAt);
  if (durationMs >= MIN_LOGGED_MS) {
    const { error: logErr } = await supabase.from('war_room_phase_log').insert({
      room_id: ended.roomId,
      player_id: ended.playerId,
      phase: ended.phase,
      turn_number: ended.turn,
      duration_ms: durationMs,
    });
    if (logErr) {
      // Non-fatal — don't block the clock advance on a logging hiccup.
      // eslint-disable-next-line no-console
      console.error('[clock] log failed:', logErr.message);
    }
  }

  const { error } = await supabase
    .from('war_rooms')
    .update({
      active_player_id: next.activePlayerId,
      current_phase: next.currentPhase,
      turn_number: next.turnNumber,
      phase_started_at: new Date().toISOString(),
    })
    .eq('id', ended.roomId);
  if (error) throw new Error(error.message || 'Could not advance the clock.');
}

/** Advance to the next phase within the current turn (no-op at End of Turn). */
export async function advancePhase(clock: ClockState): Promise<void> {
  const idx = CLOCK_PHASES.indexOf(clock.currentPhase);
  const nextPhase =
    idx >= 0 && idx < CLOCK_PHASES.length - 1 ? CLOCK_PHASES[idx + 1] : clock.currentPhase;
  if (nextPhase === clock.currentPhase) return;
  await logAndSet(
    {
      roomId: clock.roomId,
      playerId: clock.activePlayerId,
      phase: clock.currentPhase,
      turn: clock.turnNumber,
      startedAt: clock.phaseStartedAt,
    },
    { activePlayerId: clock.activePlayerId, currentPhase: nextPhase, turnNumber: clock.turnNumber }
  );
}

/** Pass the turn to the other player; their turn starts at Start of Turn. */
export async function passTurn(clock: ClockState, otherPlayerId: string): Promise<void> {
  await logAndSet(
    {
      roomId: clock.roomId,
      playerId: clock.activePlayerId,
      phase: clock.currentPhase,
      turn: clock.turnNumber,
      startedAt: clock.phaseStartedAt,
    },
    {
      activePlayerId: otherPlayerId,
      currentPhase: TURN_START_PHASE,
      turnNumber: clock.turnNumber + 1,
    }
  );
}
