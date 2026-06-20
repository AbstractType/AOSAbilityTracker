import type { Ability } from '../types';

/**
 * Categorize an ability by type. Used for grouping abilities within phases.
 */
export function categorizeAbility(ability: Ability): 'spell' | 'prayer' | 'command' | 'other' {
  if (ability.isSpell) return 'spell';
  if (ability.isPrayer) return 'prayer';
  if (ability.isCommand) return 'command';
  return 'other';
}
