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
  castingValue?: number;
  isCommand?: boolean;
  commandCost?: number;
  timing?: string;
};
