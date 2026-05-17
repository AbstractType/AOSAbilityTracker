import React, { useEffect, useMemo, useState } from 'react';
import type { Ability, Phase } from '../types';
import type { Wizard, Priest } from '../utils/jsonParser';
import type { User } from '../types/user';
import TrackerTemplate from '../components/templates/TrackerTemplate';

const PHASES: Phase[] = [
  'Deployment Phase',
  'Start of Turn',
  'Hero Phase',
  'Movement Phase',
  'Shooting Phase',
  'Charge Phase',
  'Combat Phase',
  'End of Turn',
];

interface AbilityTrackerScreenProps {
  abilities: Ability[];
  wizards: Wizard[];
  priests: Priest[];
  onAbilitiesChange: (abilities: Ability[]) => void;
  onBack: () => void;
  /** Current signed-in user (drives the header user button) */
  user: User | null;
  /** Open the global login modal */
  onOpenLogin: () => void;
}

/**
 * AbilityTrackerScreen — main game tracker page.
 * Acts as the controller layer: holds state (abilities, active phase, deployment state, modal visibility)
 * and computes derived data (sorted sections per phase, visible phases).
 * Renders via TrackerTemplate.
 */
export default function AbilityTrackerScreen({
  abilities: initialAbilities,
  wizards,
  priests,
  onAbilitiesChange,
  onBack,
  user,
  onOpenLogin,
}: AbilityTrackerScreenProps) {
  const [abilities, setAbilities] = useState<Ability[]>(initialAbilities);
  const [activePhase, setActivePhase] = useState<Phase | null>(null);
  const [showKeywordsModal, setShowKeywordsModal] = useState(false);
  const [deploymentComplete, setDeploymentComplete] = useState(false);
  // Free-text search query from the header search bar. Filters abilities by
  // name, source, keyword, timing, and description (case-insensitive substring).
  const [searchQuery, setSearchQuery] = useState('');

  // Sync local state when parent abilities change (e.g., after loading)
  useEffect(() => {
    setAbilities(initialAbilities);
  }, [initialAbilities]);

  // Filter out the Deployment Phase once it's been completed for the game
  const visiblePhases = useMemo<Phase[]>(
    () => (deploymentComplete ? PHASES.filter(p => p !== 'Deployment Phase') : PHASES),
    [deploymentComplete]
  );

  // Apply the search filter once, before grouping. Empty / whitespace-only
  // queries pass everything through unchanged.
  const filteredAbilities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return abilities;
    return abilities.filter(a => {
      const haystack = [
        a.name,
        a.source ?? '',
        a.keyword ?? '',
        a.timing ?? '',
        a.description,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [abilities, searchQuery]);

  // Group (filtered) abilities by phase, sorted by priority within each phase
  const abilitiesByPhase = useMemo(
    () =>
      visiblePhases.map(phase => ({
        phase,
        items: filteredAbilities
          .filter(a => a.phase === phase)
          .sort((a, b) => getAbilitySortPriority(a) - getAbilitySortPriority(b)),
      })),
    [filteredAbilities, visiblePhases]
  );

  // When searching, hide phase sections with no matches so the user isn't
  // scrolling through a wall of empty "0 abilities" headers.
  const isSearching = searchQuery.trim().length > 0;
  const sectionsAfterSearch = isSearching
    ? abilitiesByPhase.filter(s => s.items.length > 0)
    : abilitiesByPhase;

  // Optionally filter to the selected phase only
  const displaySections = activePhase
    ? sectionsAfterSearch.filter(p => p.phase === activePhase)
    : sectionsAfterSearch;

  // Determine which phase is selectable next (current and adjacent)
  const currentPhaseIndex = activePhase ? visiblePhases.indexOf(activePhase) : -1;
  const nextPhase =
    currentPhaseIndex >= 0 && currentPhaseIndex < visiblePhases.length - 1
      ? visiblePhases[currentPhaseIndex + 1]
      : null;

  function isPhaseSelectable(phase: Phase): boolean {
    return !activePhase || phase === activePhase || phase === nextPhase;
  }

  function togglePhaseFilter(phase: Phase) {
    if (activePhase && phase !== activePhase && phase !== nextPhase) return;
    setActivePhase(activePhase === phase ? null : phase);
  }

  function toggleUsed(id: string) {
    const updated = abilities.map(a => (a.id === id ? { ...a, used: !a.used } : a));
    setAbilities(updated);
    onAbilitiesChange(updated);
  }

  /**
   * Advance the game to the next turn. Resets every ability's `used` flag back
   * to false EXCEPT for Deployment Phase abilities (which only fire once per
   * game during deployment and are hidden once that phase is complete). Also
   * clears the active phase filter so the player sees the full phase grid and
   * can pick where the new turn begins.
   */
  function nextTurn() {
    const updated = abilities.map(a =>
      a.phase === 'Deployment Phase' ? a : { ...a, used: false }
    );
    setAbilities(updated);
    onAbilitiesChange(updated);
    setActivePhase(null);
  }

  function completeDeployment() {
    setDeploymentComplete(true);
    setActivePhase(null);
  }

  return (
    <TrackerTemplate
      abilities={abilities}
      wizards={wizards}
      priests={priests}
      visiblePhases={visiblePhases}
      activePhase={activePhase}
      displaySections={displaySections}
      deploymentComplete={deploymentComplete}
      showKeywordsModal={showKeywordsModal}
      isPhaseSelectable={isPhaseSelectable}
      onBack={onBack}
      onShowKeywords={() => setShowKeywordsModal(true)}
      onCloseKeywords={() => setShowKeywordsModal(false)}
      onPhasePress={togglePhaseFilter}
      onToggleUsed={toggleUsed}
      onCompleteDeployment={completeDeployment}
      onNextTurn={nextTurn}
      user={user}
      onOpenLogin={onOpenLogin}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    />
  );
}

/**
 * Determines display priority within a phase.
 * Spells first, then commands, then activated abilities, then passive abilities.
 */
function getAbilitySortPriority(ability: Ability): number {
  if (ability.isSpell) return 0;
  if (ability.isCommand) return 1;
  if (!ability.isPassive) return 2;
  return 3;
}
