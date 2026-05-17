import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client singleton.
 *
 * URL + anon key are injected at build time via webpack DefinePlugin from
 * either:
 *   - .env (local dev, gitignored), or
 *   - EXPO_PUBLIC_SUPABASE_* env vars in the GitHub Actions workflow.
 *
 * Both values are safe to embed in the client bundle. Row Level Security
 * policies on the `armies` table enforce that even with the anon key, a
 * client can only see and modify rows owned by its authenticated user.
 *
 * The fallback empty strings let the module load without crashing when
 * vars are missing — actual Supabase calls will throw a clear error
 * which is easier to diagnose than a cryptic SDK init failure.
 */

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// One-shot warning if either var is missing — prevents silent breakage where
// the app loads, the user clicks "Sign In", and gets a confusing error.
if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Auth and saved-army features will not work. ' +
      'Copy .env.example to .env (local) or add GitHub Actions secrets (CI).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Keep the session in localStorage across reloads (web default storage).
    persistSession: true,
    // Refresh tokens silently before they expire so we don't kick the user out
    // mid-game on a long session.
    autoRefreshToken: true,
    // CRITICAL for the magic-link verification flow: when the user clicks the
    // confirmation email link, they land back at our site with the auth tokens
    // in the URL hash. This setting tells the SDK to detect those tokens and
    // complete the session automatically.
    detectSessionInUrl: true,
  },
});

/** Convenience type for the row shape in the `armies` table. */
export interface ArmyRow {
  id: string;
  user_id: string;
  name: string;
  json: string;
  created_at: string;
  updated_at: string;
}
