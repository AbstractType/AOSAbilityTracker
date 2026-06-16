import { supabase } from '../lib/supabase';
import type { Challenge } from '../types/warRoom';
import type { WarRoom } from '../types/warRoom';
import { rowToWarRoom, type WarRoomRow } from './warRoom';

/**
 * Challenge lifecycle against the `challenges` table + `accept_challenge` RPC.
 * RLS lets a user see/insert/update only challenges they're involved in; the
 * cross-user room creation on accept goes through the security-definer RPC.
 */

interface ChallengeRow {
  id: string;
  challenger_id: string;
  challenger_username: string;
  opponent_id: string | null;
  opponent_email: string | null;
  status: Challenge['status'];
  challenger_army_json: string;
  room_id: string | null;
  created_at: string;
  expires_at: string;
}

export function rowToChallenge(row: ChallengeRow): Challenge {
  return {
    id: row.id,
    challengerId: row.challenger_id,
    challengerUsername: row.challenger_username,
    opponentId: row.opponent_id,
    opponentEmail: row.opponent_email,
    status: row.status,
    challengerArmyJson: row.challenger_army_json,
    roomId: row.room_id,
    createdAt: new Date(row.created_at).getTime(),
    expiresAt: new Date(row.expires_at).getTime(),
  };
}

async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

/**
 * Send a challenge to another user (targeted by their user id, found via
 * username search). Stores the challenger's chosen army JSON + their handle.
 */
export async function createChallenge(params: {
  opponentId: string;
  challengerUsername: string;
  armyJson: string;
}): Promise<Challenge> {
  const userId = await currentUserId();
  if (!userId) throw new Error('You need to be signed in to send a challenge.');

  const { data, error } = await supabase
    .from('challenges')
    .insert({
      challenger_id: userId,
      challenger_username: params.challengerUsername,
      opponent_id: params.opponentId,
      challenger_army_json: params.armyJson,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message || 'Could not send the challenge. Try again.');
  }
  return rowToChallenge(data as ChallengeRow);
}

/**
 * Fetch all challenges the current user is involved in (sent or received),
 * newest first. The lobby filters these into incoming / outgoing.
 */
export async function getMyChallenges(): Promise<Challenge[]> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[challenges] fetch failed:', error.message);
    return [];
  }
  return (data ?? []).map((r) => rowToChallenge(r as ChallengeRow));
}

/** Challenger cancels their own pending challenge. */
export async function cancelChallenge(challengeId: string): Promise<void> {
  const { error } = await supabase
    .from('challenges')
    .update({ status: 'cancelled' })
    .eq('id', challengeId)
    .eq('status', 'pending');
  if (error) throw new Error(error.message || 'Could not cancel the challenge.');
}

/** Opponent declines a pending challenge addressed to them. */
export async function declineChallenge(challengeId: string): Promise<void> {
  const { error } = await supabase
    .from('challenges')
    .update({ status: 'declined' })
    .eq('id', challengeId)
    .eq('status', 'pending');
  if (error) throw new Error(error.message || 'Could not decline the challenge.');
}

/**
 * Opponent accepts: creates the war room (via RPC) with their chosen army and
 * returns it. The challenger learns of acceptance via the realtime UPDATE on
 * the challenge row.
 */
export async function acceptChallenge(
  challengeId: string,
  armyJson: string
): Promise<WarRoom> {
  const { data, error } = await supabase.rpc('accept_challenge', {
    p_challenge_id: challengeId,
    p_army_json: armyJson,
  });

  if (error) {
    if (error.message.includes('challenge_unavailable')) {
      throw new Error('This challenge is no longer available (expired or already answered).');
    }
    if (error.message.includes('not_your_challenge')) {
      throw new Error('This challenge was not addressed to you.');
    }
    throw new Error(error.message || 'Could not accept the challenge. Try again.');
  }
  // rpc returns the war_rooms row (single object).
  return rowToWarRoom(data as WarRoomRow);
}
