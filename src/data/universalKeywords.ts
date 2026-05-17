export interface UniversalKeyword {
  name: string;
  description: string;
}

export const universalKeywords: UniversalKeyword[] = [
  {
    name: 'Ward Save',
    description: 'A unit has a Ward Save of X if, in some cases, it can be saved from injury by magic, armour, or sheer toughness. If a unit has a Ward Save, then the first time each turn that the unit receives damage, you can make a Ward Save roll by rolling a dice. If the result equals or exceeds the Ward Save value, reduce the damage by the amount that the Ward Save roll value exceeds the Ward Save value.'
  },
  {
    name: 'Champion',
    description: 'A Champion is a single model within a unit that is picked to be its leader. If a unit has a Champion, you can pick one of the models in that unit to be the Champion. A Champion has a +1 modifier to hit rolls and wound rolls. If the Champion is slain, that effect ends and you must pick a new Champion from the remaining models in that unit.'
  },
  {
    name: 'Guarded Hero',
    description: 'A model that is a Guarded Hero can subtract 1 from damage rolls that target it (to a minimum of 1 damage per damage roll).'
  },
  {
    name: 'Strike-first',
    description: 'If a unit with this keyword uses a Fight ability while in combat with an enemy unit that does not have Strike-first, the first time each turn that one of those abilities is used by that unit, resolve all of the attacks made by that unit before resolving any of the attacks made by the enemy unit.'
  },
  {
    name: 'Strike-last',
    description: 'If a unit has this keyword, it cannot use a Fight ability until an enemy unit in combat with it has done so. If a unit with this keyword uses a Fight ability while in combat with an enemy unit that does not have Strike-last, the first time each turn that one of those abilities is used by that unit, resolve all of the attacks made by the enemy unit before resolving any of the attacks made by that unit.'
  },
  {
    name: 'Heal',
    description: 'If a unit has a Heal ability, then the first time each turn that one of those abilities is used, you can allocate that many wounds to a friendly model in that unit. For each wound allocated in this way, reduce the total number of wounds that are being allocated to that model by 1 (this is not a mortal wound).'
  },
  {
    name: 'Crit',
    description: 'If an attack roll or a damage roll equals or exceeds the Crit value, that attack is a critical hit. If a critical hit is made, the attacking unit makes an additional attack with the same weapon, or deals additional damage.'
  },
  {
    name: 'Mortal',
    description: 'Mortal damage cannot be prevented by ward saves or other protective abilities. The damage is allocated directly to models.'
  },
  {
    name: 'Unlimited',
    description: 'An ability with Unlimited can be used an unlimited number of times each turn, rather than being restricted to once per turn.'
  },
  {
    name: 'Euphoric',
    description: 'Units with the Euphoric keyword have improved combat capabilities and can be buffed by various Hedonites of Slaanesh abilities.'
  },
];
