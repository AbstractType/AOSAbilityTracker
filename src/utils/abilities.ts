import type { Ability } from '../types';

/**
 * Categorize an ability by type. Used for grouping abilities within phases.
 */
export function categorizeAbility(
  ability: Ability
): 'spell' | 'prayer' | 'command' | 'passive_unit' | 'passive_terrain' {
  if (ability.isSpell) return 'spell';
  if (ability.isPrayer) return 'prayer';
  if (ability.isCommand) return 'command';
  if (ability.isPassive) {
    return ability.isTerrain ? 'passive_terrain' : 'passive_unit';
  }
  // Default passives without explicit type to unit passives
  return 'passive_unit';
}
