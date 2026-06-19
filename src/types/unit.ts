/**
 * Unit + weapon types parsed from a BattleScribe Age of Sigmar roster.
 *
 * All stat/weapon characteristic values are kept as STRINGS, because that's how
 * BattleScribe stores them — they're display text, not numbers ("4+", "-",
 * "12\"", "2D6", "D3"). The UI renders them verbatim; only wound tracking needs
 * a number, and it derives that from `health` when it's numeric.
 */

/** A single weapon profile on a unit (one row in the unit's weapon table). */
export interface WeaponProfile {
  name: string;
  kind: 'melee' | 'ranged';
  /** Range — ranged weapons only (the "Rng" characteristic). */
  range?: string;
  attacks: string; // Atk
  hit: string; // Hit
  wound: string; // Wnd
  rend: string; // Rnd
  damage: string; // Dmg
  /** Weapon ability text, e.g. "Charge +1", "Anti-charge (+1 Rend)", "Crit (Mortal)". */
  ability?: string;
}

/**
 * A unit parsed from the roster — one per `type: "unit"` selection. Two units
 * with the same name are distinct entries on the table, so `id` is per-instance
 * (a parse-order counter), never a name-based key.
 */
export interface Unit {
  id: string;
  name: string;
  /** Number of models in the unit (1 for single-model units). */
  models: number;
  /** Points cost, when present in the roster `costs`. */
  points?: number;
  // Stat line. Optional because some entries (e.g. terrain) omit parts of it.
  move?: string;
  health?: string;
  save?: string;
  control?: string;
  ward?: string;
  weapons: WeaponProfile[];
  /** Cross-links to the caster summary, for an optional badge on the card. */
  isWizard?: boolean;
  isPriest?: boolean;
  /** True when the roster reinforced this unit (a "Reinforced" upgrade). */
  reinforced?: boolean;
  /** True for faction-terrain pieces — shown separately, not as a unit. */
  isTerrain?: boolean;
}

/**
 * Ephemeral, per-game combat state for a unit: wounds taken so far and whether
 * it's been destroyed. Held in screen state only — it resets when a new army
 * loads (the tracker remounts) and, unlike ability `used`, persists across
 * turns. Not persisted to Supabase.
 */
export interface UnitState {
  wounds: number;
  destroyed: boolean;
}
