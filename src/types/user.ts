/**
 * Signed-in user, derived from the Supabase auth session.
 *
 * `emailVerified` is the gate for the saved-armies feature — users can
 * register and sign in before verifying, but can't save anything until
 * they click the magic link in the confirmation email Supabase sends.
 */
export interface User {
  /** Supabase user UUID (auth.users.id). Stable across email changes. */
  id: string;
  /** Login email — also used as the unique identifier for sign-in. */
  email: string;
  /** True once the user has clicked the magic link from the signup email. */
  emailVerified: boolean;
}
