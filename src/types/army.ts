/**
 * A roster that a signed-in user has saved to their account so they can reload
 * it later without re-pasting the JSON. We store the raw JSON string verbatim
 * so the parser is the single source of truth for interpreting it.
 */
export interface SavedArmy {
  /** Stable per-entry ID — used as a React key and as the delete handle */
  id: string;
  /** User-chosen short label, e.g. "Tournament Hedonites" */
  name: string;
  /** The raw BattleScribe JSON exactly as the user pasted it */
  json: string;
  /** When the entry was created (epoch ms) — used for sorting */
  createdAt: number;
}

/** Maximum number of armies a user can save. */
export const MAX_SAVED_ARMIES = 3;
