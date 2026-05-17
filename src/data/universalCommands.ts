import type { Phase } from '../types';

export interface UniversalCommand {
  name: string;
  cost: number;
  timing: string;
  phase: Phase;
  description: string;
  /** Optional comma-separated keywords (e.g., "Move, Run") — rendered via the styled Keywords section. */
  keywords?: string;
}

export const universalCommands: UniversalCommand[] = [
  {
    name: 'Rally',
    cost: 1,
    phase: 'Hero Phase',
    timing: 'Any Hero Phase',
    description: '**Declare:** Pick a friendly unit that is not in combat to use this ability.\n\n**Effect:** Make 6 rally rolls of D6. For each 4+, you receive 1 rally point. Rally points can be spent in the following ways:\n• For each rally point spent, Heal (1) that unit.\n• You can spend a number of rally points equal to the Health characteristic of that unit to return a slain model to that unit.\n\nYou can spend the rally points in any combination of the above. Unspent rally points are then lost.'
  },
  {
    name: 'Magical Intervention',
    cost: 1,
    phase: 'Hero Phase',
    timing: 'Enemy Hero Phase',
    description: '**Declare:** Pick a friendly Wizard or Priest to use this ability.\n\n**Effect:** That friendly unit can use a Spell or Prayer ability (as appropriate) as if it were your hero phase. If you do so, subtract 1 from casting rolls or chanting rolls made as part of that ability.'
  },
  {
    name: 'Redeploy',
    cost: 1,
    phase: 'Movement Phase',
    timing: 'Enemy Movement Phase',
    description: '**Declare:** Pick a friendly unit that is not in combat to use this ability.\n\n**Effect:** Each model in that unit can move up to D6". That move cannot pass through or end within the combat range of an enemy unit.',
    keywords: 'Move, Run',
  },
  {
    name: 'At the Double',
    cost: 1,
    phase: 'Movement Phase',
    timing: 'Reaction: You declared a Run ability',
    description: '**Used By:** The unit using that Run ability.\n\n**Effect:** Do not make a run roll as part of that Run ability. Instead, add 6" to that unit\'s Move characteristic to determine the distance each model in that unit can move as part of that Run ability.'
  },
  {
    name: 'Covering Fire',
    cost: 1,
    phase: 'Shooting Phase',
    timing: 'Enemy Shooting Phase',
    description: '**Declare:** Pick a friendly unit that did not use a Run ability this turn and that is not in combat to use this ability, then pick the closest enemy unit (to that unit) that can be picked as the target of shooting attacks to be the target. You cannot pick Manifestations or faction terrain features as the target of this ability.\n\n**Effect:** Resolve shooting attacks for the unit using this ability against the target. You must subtract 1 from the hit rolls for those attacks.',
    keywords: 'Shoot, Attack',
  },
  {
    name: 'Counter-Charge',
    cost: 2,
    phase: 'Charge Phase',
    timing: 'Enemy Charge Phase',
    description: '**Declare:** Pick a friendly unit that is not in combat to use this ability.\n\n**Effect:** That unit can use a Charge ability as if it were your charge phase.'
  },
  {
    name: 'Forward to Victory',
    cost: 1,
    phase: 'Charge Phase',
    timing: 'Reaction: You declared a Charge ability',
    description: '**Used By:** The unit using that Charge ability.\n\n**Effect:** You can re-roll the charge roll.'
  },
  {
    name: 'All-Out Attack',
    cost: 1,
    phase: 'Combat Phase',
    timing: 'Reaction: You declared an Attack ability',
    description: '**Used By:** The unit using that Attack ability.\n\n**Effect:** Add 1 to hit rolls for attacks made as part of that Attack ability. This also affects weapons that have the Companion weapon ability. For the rest of the turn, subtract 1 from save rolls for the unit using this ability.'
  },
  {
    name: 'All-Out Defence',
    cost: 1,
    phase: 'Combat Phase',
    timing: 'Reaction: Opponent declared an Attack ability',
    description: '**Used By:** A unit targeted by that Attack ability.\n\n**Effect:** Add 1 to save rolls for that unit until that Attack ability has been resolved.'
  },
  {
    name: 'Power Through',
    cost: 1,
    phase: 'End of Turn',
    timing: 'End of Any Turn',
    description: '**Declare:** Pick a friendly unit that charged this turn to use this ability, then you must pick an enemy unit in combat with it to be the target. The target must have a lower Health characteristic than the unit using this ability.\n\n**Effect:** Inflict D3 mortal damage on the target. Then, the unit using this ability can move a distance up to its Move characteristic. It can pass through and end that move within the combat ranges of enemy units that were in combat with it at the start of the move, but not those of other enemy units. It does not have to end the move in combat.',
    keywords: 'Move',
  },
];
