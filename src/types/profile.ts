/**
 * A player's public-facing identity, used for multiplayer discovery
 * (challenge another player by username). Backed by the `profiles` table.
 * Distinct from `User` (auth identity: id/email/emailVerified) — a verified
 * user does not have a Profile until they choose a username.
 */
export interface Profile {
  /** Supabase auth user id (profiles.user_id, = auth.users.id). */
  userId: string;
  /** Unique, case-insensitive handle: 3–20 chars of [a-z0-9_]. */
  username: string;
  /** Optional friendlier name shown alongside the handle. */
  displayName: string | null;
}

/** Username rules, shared between client validation and the DB check constraint. */
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
export const USERNAME_PATTERN = /^[a-z0-9_]+$/;

/**
 * Validate a candidate username client-side (mirrors the DB CHECK so we fail
 * fast with a friendly message instead of round-tripping to a 23514 error).
 * Returns an error string, or null if valid. Assumes already lower-cased.
 */
export function validateUsername(username: string): string | null {
  if (username.length < USERNAME_MIN || username.length > USERNAME_MAX) {
    return `Username must be ${USERNAME_MIN}–${USERNAME_MAX} characters.`;
  }
  if (!USERNAME_PATTERN.test(username)) {
    return 'Use only lowercase letters, numbers, and underscores.';
  }
  return null;
}
