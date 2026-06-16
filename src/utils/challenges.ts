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
  invite_token: string;
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
    inviteToken: row.invite_token,
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
 * Create an OPEN challenge (no specific opponent) for sharing as a link.
 * Anyone who opens the link can claim it with their own army. Returns the
 * challenge so the caller can read its invite_token to build the URL.
 */
export async function createLinkChallenge(params: {
  challengerUsername: string;
  armyJson: string;
}): Promise<Challenge> {
  const userId = await currentUserId();
  if (!userId) throw new Error('You need to be signed in to create an invite.');

  const { data, error } = await supabase
    .from('challenges')
    .insert({
      challenger_id: userId,
      challenger_username: params.challengerUsername,
      challenger_army_json: params.armyJson,
      // opponent_id intentionally null → open link
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message || 'Could not create the invite link. Try again.');
  }
  return rowToChallenge(data as ChallengeRow);
}

/** Build the shareable URL for an invite token (web only). */
export function buildInviteUrl(token: string): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${window.location.pathname}?challenge=${token}`;
}

/**
 * Look up minimal info about an invite token before claiming it: the
 * challenger's handle + whether it's still valid for the current user. Returns
 * null if the token doesn't resolve at all.
 */
export async function peekInvite(
  token: string
): Promise<{ challengerUsername: string; valid: boolean } | null> {
  const { data, error } = await supabase.rpc('peek_invite', { p_token: token });
  if (error) {
    // eslint-disable-next-line no-console
    console.error('[challenges] peek failed:', error.message);
    return null;
  }
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;
  return { challengerUsername: row.challenger_username, valid: !!row.valid };
}

/**
 * Claim an invite by token with the chosen army → creates + returns the room.
 * Maps the RPC's exception names to friendly messages.
 */
export async function claimInvite(token: string, armyJson: string): Promise<WarRoom> {
  const { data, error } = await supabase.rpc('claim_invite', {
    p_token: token,
    p_army_json: armyJson,
  });
  if (error) {
    if (error.message.includes('invite_invalid')) {
      throw new Error('This invite link is invalid or has expired.');
    }
    if (error.message.includes('invite_taken')) {
      throw new Error('This invite was meant for someone else.');
    }
    if (error.message.includes('cannot_join_own')) {
      throw new Error("You can't join your own invite.");
    }
    throw new Error(error.message || 'Could not join. Try again.');
  }
  return rowToWarRoom(data as WarRoomRow);
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
