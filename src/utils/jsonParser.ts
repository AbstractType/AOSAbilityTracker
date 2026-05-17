import type { Ability, Phase } from '../types';
import { universalKeywords } from '../data/universalKeywords';
import { universalCommands } from '../data/universalCommands';

export interface Wizard {
  name: string;
  powerLevel: number;
}

export interface Priest {
  name: string;
  priestLevel: number;
}

export interface ParsedRosterData {
  abilities: Ability[];
  wizards: Wizard[];
  priests: Priest[];
}

interface AbilityProfile {
  name: string;
  typeName?: string;
  characteristics?: Array<{
    name: string;
    $text?: string;
  }>;
  attributes?: Array<{
    name: string;
    $text?: string;
  }>;
}

interface Selection {
  name: string;
  profiles?: AbilityProfile[];
  selections?: Selection[];
}

/**
 * Parse BattleScribe JSON and extract abilities with timing information.
 * Also extracts wizard information from the roster.
 * Returns parsed roster data including abilities and wizards.
 */
export function parseAbilitiesFromJSON(jsonString: string): ParsedRosterData {
  try {
    const data = JSON.parse(jsonString);
    const abilitiesMap = new Map<string, Ability>();
    const wizardsMap = new Map<string, number>();
    const priestsMap = new Map<string, number>();
    let idCounter = 0;

    // Recursively search for selections with profiles (abilities) and wizards/priests
    function extractAbilities(obj: any, parentName?: string): void {
      if (!obj) return;

      if (Array.isArray(obj)) {
        obj.forEach(item => extractAbilities(item, parentName));
      } else if (typeof obj === 'object') {
        // Update parent name if this selection has a name
        const currentParent = obj.name || parentName;

        if (currentParent) {
          // ----- Wizard detection -----
          // Match "Wizard (N)" or "Wizard Hero (N)" in the unit's name
          const wizardNameMatch = currentParent.match(/Wizard.+?\((\d+)\)/i);
          if (wizardNameMatch) {
            registerCaster(wizardsMap, currentParent, parseInt(wizardNameMatch[1], 10));
          }

          // ----- Priest detection -----
          // Match "Priest (N)" in the unit's name (e.g., "Ironjawz Priest (1)")
          const priestNameMatch = currentParent.match(/Priest.+?\((\d+)\)/i) || currentParent.match(/Priest\s*\((\d+)\)/i);
          if (priestNameMatch) {
            registerCaster(priestsMap, currentParent, parseInt(priestNameMatch[1], 10));
          }

          // Examine categories array (BattleScribe units list keywords like "WIZARD (1)" / "PRIEST (1)" here)
          if (Array.isArray(obj.categories)) {
            obj.categories.forEach((cat: any) => {
              if (cat?.name && typeof cat.name === 'string') {
                const wm = cat.name.match(/^WIZARD\s*\((\d+)\)$/i);
                if (wm) registerCaster(wizardsMap, currentParent, parseInt(wm[1], 10));
                const pm = cat.name.match(/^PRIEST\s*\((\d+)\)$/i);
                if (pm) registerCaster(priestsMap, currentParent, parseInt(pm[1], 10));
              }
            });
          }

          // Examine ability/profile characteristics for Wizard or Priest keywords
          if (Array.isArray(obj.characteristics)) {
            obj.characteristics.forEach((char: any) => {
              if (char.name === 'Keywords' && char.$text) {
                const text = char.$text.toLowerCase();
                if (text.includes('wizard')) {
                  const m = text.match(/wizard\s*\((\d+)\)/i);
                  registerCaster(wizardsMap, currentParent, m ? parseInt(m[1], 10) : 1);
                }
                if (text.includes('priest')) {
                  const m = text.match(/priest\s*\((\d+)\)/i);
                  registerCaster(priestsMap, currentParent, m ? parseInt(m[1], 10) : 1);
                }
              }
            });
          }

          // Check typeName for Wizard / Priest indication
          if (obj.typeName && typeof obj.typeName === 'string') {
            const tn = obj.typeName.toLowerCase();
            if (tn.includes('wizard')) registerCaster(wizardsMap, currentParent, 1);
            if (tn.includes('priest')) registerCaster(priestsMap, currentParent, 1);
          }
        }

        // Check if this is a selection with profiles (abilities)
        if (obj.profiles && Array.isArray(obj.profiles)) {
          obj.profiles.forEach((profile: AbilityProfile) => {
            // Use the group field if available (for spells in spell lores), otherwise use parent name
            const source = obj.group || currentParent;
            const ability = parseAbility(profile, idCounter.toString(), source);
            if (ability && !abilitiesMap.has(ability.name)) {
              abilitiesMap.set(ability.name, ability);
              idCounter++;
            }
          });
        }

        // Recursively search nested objects.
        // Skip `categories` because we already process it explicitly above —
        // recursing into it would cause category names like "WIZARD (2)" to be
        // mistakenly treated as unit names.
        for (const key in obj) {
          if (key === 'categories') continue;
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            extractAbilities(obj[key], currentParent);
          }
        }
      }
    }

    extractAbilities(data);
    const abilities = Array.from(abilitiesMap.values());

    // Add universal commands to the abilities list
    universalCommands.forEach((command, index) => {
      const commandAbility: Ability = {
        id: `universal-command-${index}`,
        name: command.name,
        description: command.description,
        phase: command.phase,
        used: false,
        // Use defined keywords if present, otherwise empty string (won't render section)
        keyword: command.keywords || '',
        isPassive: false,
        isCommand: true,
        commandCost: command.cost,
        source: 'Universal Command',
        timing: command.timing,
      };
      abilities.push(commandAbility);
    });

    // Build the wizard list with their power levels (using the highest level recorded for each unit)
    const wizards: Wizard[] = Array.from(wizardsMap.entries()).map(([name, powerLevel]) => ({
      name,
      powerLevel,
    }));

    // Build the priest list with their priest levels
    const priests: Priest[] = Array.from(priestsMap.entries()).map(([name, priestLevel]) => ({
      name,
      priestLevel,
    }));

    return { abilities, wizards, priests };
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return { abilities: [], wizards: [], priests: [] };
  }
}

/**
 * Records a wizard/priest detection. If the unit was already detected at a different
 * level, keeps the highest level (so multiple keyword sources don't downgrade each other).
 */
function registerCaster(map: Map<string, number>, name: string, level: number) {
  const existing = map.get(name);
  if (existing === undefined || level > existing) {
    map.set(name, level);
  }
}

function parseAbility(profile: AbilityProfile, id: string, source?: string): Ability | null {
  if (!profile.name) {
    return null;
  }

  // Filter out universal keywords - they shouldn't be displayed as individual abilities
  const universalKeywordNames = universalKeywords.map(k => k.name.toLowerCase());

  if (universalKeywordNames.includes(profile.name.toLowerCase())) {
    return null;
  }

  // Find timing characteristic and keyword text
  let timing = '';
  let declareText = '';
  let effectText = '';
  let usedByText = '';
  let description = '';
  let keywordText = '';
  let castingValue: number | undefined;
  let commandCost: number | undefined;

  profile.characteristics?.forEach(char => {
    if (char.name === 'Timing') {
      timing = char.$text || '';
    }
    if (char.name === 'Declare') {
      declareText = char.$text || '';
    }
    if (char.name === 'Effect') {
      effectText = char.$text || '';
    }
    if (char.name === 'Used By') {
      usedByText = char.$text || '';
    }
    if (char.name === 'Keywords' && char.$text) {
      keywordText = char.$text.trim();
    }
    if (char.name === 'Casting Value' && char.$text) {
      const match = char.$text.match(/\d+/);
      if (match) {
        castingValue = parseInt(match[0], 10);
      }
    }
    if (char.name === 'Cost' && char.$text) {
      const match = char.$text.match(/\d+/);
      if (match) {
        commandCost = parseInt(match[0], 10);
      }
    }
  });

  // Combine Used By, Declare and Effect into description
  const sections: string[] = [];
  if (usedByText) {
    sections.push(`**Used By:** ${usedByText}`);
  }
  if (declareText) {
    sections.push(`**Declare:** ${declareText}`);
  }
  if (effectText) {
    sections.push(`**Effect:** ${effectText}`);
  }
  description = sections.join('\n');

  // Extract the BattleScribe "Color" attribute — passive abilities use this to indicate
  // which game phase they most relate to (Yellow = Hero, Green = Movement, etc.)
  let colorText = '';
  profile.attributes?.forEach(attr => {
    if (attr.name === 'Color' && attr.$text) {
      colorText = attr.$text;
    }
  });

  // If no timing found, check if this is a passive ability, spell, or command
  // Passive abilities, spells, and commands don't have timing but should still be included
  let phase: Phase | null = null;
  const isPassive = profile.typeName === 'Ability (Passive)';
  const isSpell = profile.typeName === 'Ability (Spell)';
  const isCommand = profile.typeName === 'Ability (Command)';

  if (timing) {
    phase = mapTimingToPhase(timing);
  } else if (isPassive) {
    // Passives use the Color attribute to indicate their associated phase
    phase = mapColorToPhase(colorText) || 'Hero Phase';
  } else if (isSpell || isCommand) {
    phase = 'Hero Phase';
  }

  if (!phase) {
    return null;
  }

  const keyword = keywordText || simplifyTypeName(profile.typeName);

  return {
    id,
    name: profile.name,
    description: description || 'No description available',
    phase,
    used: false,
    keyword,
    isPassive,
    isSpell,
    castingValue,
    isCommand,
    commandCost,
    source,
    timing: timing || undefined,
  };
}

function simplifyTypeName(typeName?: string): string {
  if (!typeName) return 'Ability';
  if (typeName.includes('Passive')) return 'Passive';
  if (typeName.includes('Activated')) return 'Activated';
  if (typeName.includes('Spell')) return 'Spell';
  if (typeName.includes('Command')) return 'Command';
  return typeName;
}

function mapTimingToPhase(timing: string): Phase | null {
  const lowerTiming = timing.toLowerCase();

  if (lowerTiming.includes('deployment') || lowerTiming.includes('during deployment') || lowerTiming.includes('set up')) {
    return 'Deployment Phase';
  }
  if (lowerTiming.includes('start of') && (lowerTiming.includes('turn') || lowerTiming.includes('battle round'))) {
    return 'Start of Turn';
  }
  if (lowerTiming.includes('hero phase')) {
    return 'Hero Phase';
  }
  if (lowerTiming.includes('movement phase')) {
    return 'Movement Phase';
  }
  if (lowerTiming.includes('shooting phase')) {
    return 'Shooting Phase';
  }
  if (lowerTiming.includes('charge phase')) {
    return 'Charge Phase';
  }
  if (lowerTiming.includes('combat phase')) {
    return 'Combat Phase';
  }
  if ((lowerTiming.includes('end of') || lowerTiming.includes('any end')) && (lowerTiming.includes('turn') || lowerTiming.includes('battle round'))) {
    return 'End of Turn';
  }

  return null;
}

/**
 * Maps the BattleScribe ability "Color" attribute to the corresponding game phase.
 * AoS 4.0 uses a color-coded system where each ability is tagged with the phase it
 * primarily relates to. Used for passives that don't have explicit timing text.
 *
 * - Yellow  → Hero Phase
 * - Green   → Movement Phase
 * - Blue    → Shooting Phase
 * - Orange  → Charge Phase
 * - Red     → Combat Phase
 * - Purple  → End of Turn
 * - Gray    → Start of Turn
 * - Black   → Hero Phase (default — Black = army-wide/special, no specific phase)
 */
function mapColorToPhase(color: string): Phase | null {
  if (!color) return null;
  const c = color.toLowerCase();
  if (c === 'yellow') return 'Hero Phase';
  if (c === 'green') return 'Movement Phase';
  if (c === 'blue') return 'Shooting Phase';
  if (c === 'orange') return 'Charge Phase';
  if (c === 'red') return 'Combat Phase';
  if (c === 'purple') return 'End of Turn';
  if (c === 'gray' || c === 'grey') return 'Start of Turn';
  if (c === 'black') return 'Hero Phase'; // Special / army-wide passives default to Hero Phase
  return null;
}
