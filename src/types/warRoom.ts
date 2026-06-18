/**
 * Multiplayer war-room domain types, projected from the `challenges` and
 * `war_rooms` tables. The raw DB rows use snake_case + ISO timestamps; these
 * are the camelCase shapes the UI works with.
 */

export type ChallengeStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'cancelled'
  | 'expired';

export interface Challenge {
  id: string;
  challengerId: string;
  /** Denormalized handle so the opponent can show who challenged them. */
  challengerUsername: string;
  opponentId: string | null;
  opponentEmail: string | null;
  /** Token embedded in a shareable invite link (?challenge=<token>). */
  inviteToken: string;
  status: ChallengeStatus;
  /** Raw BattleScribe JSON of the challenger's chosen army. */
  challengerArmyJson: string;
  roomId: string | null;
  createdAt: number;
  expiresAt: number;
}

export interface WarRoom {
  id: string;
  player1Id: string;
  player1ArmyJson: string;
  player2Id: string | null;
  player2ArmyJson: string | null;
  status: string;
  createdAt: number;
  // ----- Synced game clock -----
  /** Whose turn it is. Null until the clock is initialized. */
  activePlayerId: string | null;
  /** Current game phase (a Phase string), or null before the game starts. */
  currentPhase: string | null;
  /** Turn counter, incremented each time the turn passes. */
  turnNumber: number;
  /** When the current phase segment began (epoch ms) — for timing. */
  phaseStartedAt: number;
}
