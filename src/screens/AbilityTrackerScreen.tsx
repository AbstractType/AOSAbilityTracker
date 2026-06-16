import React, { useEffect, useMemo, useState } from 'react';
import type { Ability, Phase } from '../types';
import type { Wizard, Priest } from '../utils/jsonParser';
import type { User } from '../types/user';
import type { Customization } from '../types/customization';
import { keyForAbility } from '../types/customization';
import {
  persistPhaseOrder as persistPhaseOrderRequest,
  setHidden as setHiddenRequest,
  setNote as setNoteRequest,
} from '../utils/customizations';
import TrackerTemplate from '../components/templates/TrackerTemplate';
import AbilityContextMenu from '../components/organisms/AbilityContextMenu';
import NoteEditorModal from '../components/organisms/NoteEditorModal';

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
  /** Current signed-in user (drives the header user button + customization gate). */
  user: User | null;
  /** Open the global login modal. */
  onOpenLogin: () => void;
  /**
   * User's ability customizations, loaded by App on sign-in. Empty Map when
   * signed out or unverified. Mutations happen via the setter below; the
   * screen does optimistic local updates and reverts on Supabase error.
   */
  customizations: Map<string, Customization>;
  /** Replace the customizations map (optimistic update + revert-on-error). */
  onCustomizationsChange: (next: Map<string, Customization>) => void;
}

/**
 * AbilityTrackerScreen — main game tracker page.
 *
 * Controller for: which phase is active, deployment-complete gating, the
 * keywords modal, the search query, the customization context menu, and the
 * note editor. Computes the displayed sections by applying (in order):
 *   1. Search filter
 *   2. Hidden filter (off unless Show Hidden is on)
 *   3. Group by phase with custom sort_order applied
 *   4. Drop empty sections when searching
 *   5. Narrow to active phase when one is selected
 *
 * Renders via TrackerTemplate, with AbilityContextMenu + NoteEditorModal
 * overlaid for long-press interactions.
 */
export default function AbilityTrackerScreen({
  abilities: initialAbilities,
  wizards,
  priests,
  onAbilitiesChange,
  onBack,
  user,
  onOpenLogin,
  customizations,
  onCustomizationsChange,
}: AbilityTrackerScreenProps) {
  const [abilities, setAbilities] = useState<Ability[]>(initialAbilities);
  const [activePhase, setActivePhase] = useState<Phase | null>(null);
  const [showKeywordsModal, setShowKeywordsModal] = useState(false);
  const [deploymentComplete, setDeploymentComplete] = useState(false);
  // Free-text search query from the header search bar. Filters abilities by
  // name, source, keyword, timing, and description (case-insensitive substring).
  const [searchQuery, setSearchQuery] = useState('');
  /**
   * When false (default), hidden abilities are filtered out. When true, they
   * appear with faded styling + a "HIDDEN" badge so the user can find and
   * unhide them via long-press.
   */
  const [showHidden, setShowHidden] = useState(false);
  /**
   * The ability currently long-pressed. Null when the context menu is closed.
   * Kept as a full Ability ref (not just an id) so the menu can show name +
   * customization without a re-lookup.
   */
  const [contextAbility, setContextAbility] = useState<Ability | null>(null);
  /** The ability currently being edited in the note editor. */
  const [noteEditAbility, setNoteEditAbility] = useState<Ability | null>(null);
  /**
   * Drag-to-reorder edit mode. When on, the list switches to a single-column
   * drag-sortable view. Gated on a verified account (the only users who can
   * persist a sort_order). See the force-exit effects below.
   */
  const [reorderMode, setReorderMode] = useState(false);
  /** Inline error shown above the list if a drag commit fails to persist. */
  const [reorderError, setReorderError] = useState<string | null>(null);

  // Only verified users can customize (notes/hide/reorder), since everything
  // persists to their account. Signed-out / unverified users never see the
  // Reorder toggle.
  const canCustomize = !!user && user.emailVerified;

  // Sync local state when parent abilities change (e.g., after loading)
  useEffect(() => {
    setAbilities(initialAbilities);
  }, [initialAbilities]);

  // Force-exit reorder mode if the account can no longer customize (e.g. the
  // user signed out while in reorder mode).
  useEffect(() => {
    if (!canCustomize) setReorderMode(false);
  }, [canCustomize]);

  // Exit reorder mode when the user changes what's on screen — selecting a
  // phase filter or starting a search. Reordering should always operate on the
  // full, unfiltered per-phase lists so the persisted sort_order is complete.
  useEffect(() => {
    setReorderMode(false);
    // Clear any stale reorder error when the view changes too.
    setReorderError(null);
  }, [activePhase, searchQuery]);

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

  // Hide filter — drops customizations.hidden abilities unless the user has
  // toggled Show Hidden on. We apply it as a separate pass (rather than
  // baking into filteredAbilities) so the search filter stays purely about
  // text, and toggling Show Hidden doesn't re-run the haystack regex.
  const visibleAbilities = useMemo(() => {
    if (showHidden) return filteredAbilities;
    return filteredAbilities.filter(a => !customizations.get(keyForAbility(a))?.hidden);
  }, [filteredAbilities, customizations, showHidden]);

  // Group (filtered + hide-filtered) abilities by phase. Custom-ordered
  // abilities come first (lowest sortOrder), then the rest in natural
  // priority order.
  const abilitiesByPhase = useMemo(
    () =>
      visiblePhases.map(phase => ({
        phase,
        items: visibleAbilities
          .filter(a => a.phase === phase)
          .sort((a, b) => {
            const aOrder = customizations.get(keyForAbility(a))?.sortOrder ?? Number.MAX_SAFE_INTEGER;
            const bOrder = customizations.get(keyForAbility(b))?.sortOrder ?? Number.MAX_SAFE_INTEGER;
            if (aOrder !== bOrder) return aOrder - bOrder;
            return getAbilitySortPriority(a) - getAbilitySortPriority(b);
          }),
      })),
    [visibleAbilities, visiblePhases, customizations]
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

  // ---------------------------------------------------------------------------
  // Customization handlers (called from AbilityContextMenu / NoteEditorModal)
  // ---------------------------------------------------------------------------
  // Each handler does an optimistic local update, then awaits the Supabase
  // call. On failure we revert the local map and throw so the menu/editor
  // surfaces the error in its inline UI (no Alert — that's a no-op on web).

  /**
   * Merge a partial customization into the map under the right key. Used by
   * setHidden / setNote — both touch a single field on a single row.
   */
  function mergeCustomization(ability: Ability, patch: Partial<Customization>): Map<string, Customization> {
    const next = new Map(customizations);
    const key = keyForAbility(ability);
    const existing = next.get(key);
    next.set(key, {
      abilityName: ability.name,
      abilitySource: ability.source ?? '',
      hidden: existing?.hidden ?? false,
      note: existing?.note ?? null,
      sortOrder: existing?.sortOrder ?? null,
      ...patch,
    });
    return next;
  }

  async function handleToggleHidden(ability: Ability, hidden: boolean) {
    const prev = customizations;
    onCustomizationsChange(mergeCustomization(ability, { hidden }));
    try {
      await setHiddenRequest(ability, hidden);
    } catch (err) {
      onCustomizationsChange(prev);
      throw err;
    }
  }

  async function handleSetNote(ability: Ability, note: string) {
    const prev = customizations;
    const trimmed = note.trim();
    const newNote = trimmed.length > 0 ? trimmed : null;
    onCustomizationsChange(mergeCustomization(ability, { note: newNote }));
    try {
      await setNoteRequest(ability, note);
    } catch (err) {
      onCustomizationsChange(prev);
      throw err;
    }
  }

  /**
   * Commit a full new order for a phase after a drag-and-drop. Optimistically
   * updates the local customizations Map (writing sortOrder per ability), then
   * persists; surfaces failures via the inline `reorderError` banner instead
   * of throwing — the drag list has no host modal to catch a thrown error, and
   * Alert is a no-op on web.
   */
  async function handleCommitPhaseOrder(_phase: Phase, reordered: Ability[]) {
    const prev = customizations;
    const next = new Map(customizations);
    reordered.forEach((a, i) => {
      const k = keyForAbility(a);
      const existing = next.get(k);
      next.set(k, {
        abilityName: a.name,
        abilitySource: a.source ?? '',
        hidden: existing?.hidden ?? false,
        note: existing?.note ?? null,
        sortOrder: i,
      });
    });
    setReorderError(null);
    onCustomizationsChange(next);

    try {
      await persistPhaseOrderRequest(reordered);
    } catch (err) {
      // Revert the optimistic order and explain the snap-back.
      onCustomizationsChange(prev);
      setReorderError(
        err instanceof Error ? err.message : 'Could not save the new order. Try again.'
      );
    }
  }

  const noteEditCustomization = noteEditAbility
    ? customizations.get(keyForAbility(noteEditAbility))
    : undefined;

  return (
    <>
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
        customizations={customizations}
        onLongPressAbility={setContextAbility}
        showHidden={showHidden}
        onToggleShowHidden={() => setShowHidden(s => !s)}
        reorderMode={reorderMode}
        // Only verified users get the toggle — undefined hides it in the header.
        onToggleReorder={canCustomize ? () => setReorderMode(s => !s) : undefined}
        onCommitPhaseOrder={handleCommitPhaseOrder}
        reorderError={reorderError}
        onDismissReorderError={() => setReorderError(null)}
      />

      <AbilityContextMenu
        visible={!!contextAbility}
        ability={contextAbility}
        customization={
          contextAbility ? customizations.get(keyForAbility(contextAbility)) : undefined
        }
        user={user}
        onClose={() => setContextAbility(null)}
        onEditNote={a => setNoteEditAbility(a)}
        onToggleHidden={handleToggleHidden}
        onOpenLogin={onOpenLogin}
      />

      <NoteEditorModal
        visible={!!noteEditAbility}
        abilityName={noteEditAbility?.name ?? ''}
        initialNote={noteEditCustomization?.note ?? null}
        onSave={async note => {
          if (noteEditAbility) await handleSetNote(noteEditAbility, note);
        }}
        onClose={() => setNoteEditAbility(null)}
      />
    </>
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
