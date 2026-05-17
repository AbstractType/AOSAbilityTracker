import type { Ability } from '../types';

/**
 * A user's per-ability customization, projected from the Supabase
 * `ability_customizations` table row. One row per (user, ability) where
 * "ability" is identified by its name + source.
 *
 * Absence of a customization (no entry in the map) means: not hidden,
 * no note, natural sort order. The UI treats missing exactly the same as
 * a row with all-defaults — we never INSERT empty rows.
 */
export interface Customization {
  /** Name from the parsed ability (case-preserved as-stored). */
  abilityName: string;
  /** Source from the parsed ability, or '' if the ability had no source. */
  abilitySource: string;
  /** When true, hide the ability unless "Show hidden" is toggled on. */
  hidden: boolean;
  /** User-written notes shown as a section on the card. null = no note. */
  note: string | null;
  /**
   * Custom sort position within the phase. Lower = higher in the list.
   * null = use the natural priority order (spells → commands → activated → passive).
   * Custom-ordered abilities always sort before naturally-ordered ones.
   */
  sortOrder: number | null;
}

/**
 * Builds the composite key used to identify an ability across rosters.
 * Same name + same source = same key, regardless of which army it came from.
 * Pipe separator is safe because neither name nor source contain `|` in
 * BattleScribe data we've seen — if that changes, swap to `\0` or similar.
 */
export function abilityKey(name: string, source: string | null | undefined): string {
  return `${name}|${source ?? ''}`;
}

/** Convenience for the common "key from an Ability" call site. */
export function keyForAbility(ability: Ability): string {
  return abilityKey(ability.name, ability.source);
}
