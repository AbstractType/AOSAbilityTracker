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
}
