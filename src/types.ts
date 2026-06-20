export type Phase =
  | 'Deployment Phase'
  | 'Start of Turn'
  | 'Hero Phase'
  | 'Movement Phase'
  | 'Shooting Phase'
  | 'Charge Phase'
  | 'Combat Phase'
  | 'End of Turn';

export type Ability = {
  id: string;
  name: string;
  description: string;
  phase: Phase;
  used: boolean;
  keyword: string;
  isPassive: boolean;
  source?: string;
  isSpell?: boolean;
  isPrayer?: boolean;
  /** Needs a living Wizard to use (a spell, or its declare names a Wizard). */
  requiresWizard?: boolean;
  /** Needs a living Priest to use (a prayer, or its declare names a Priest). */
  requiresPriest?: boolean;
  castingValue?: number;
  isCommand?: boolean;
  commandCost?: number;
  timing?: string;
};
