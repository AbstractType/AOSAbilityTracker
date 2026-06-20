import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Ability, Phase } from '../../types';
import type { Wizard, Priest } from '../../utils/jsonParser';
import type { Unit, UnitState } from '../../types/unit';
import type { User } from '../../types/user';
import type { Customization } from '../../types/customization';
import AppHeader from '../organisms/AppHeader';
import PhaseSelector from '../organisms/PhaseSelector';
import WizardSection from '../organisms/WizardSection';
import PriestSection from '../organisms/PriestSection';
import UnitSection from '../organisms/UnitSection';
import AbilityList from '../organisms/AbilityList';
import ReorderableAbilityList from '../organisms/ReorderableAbilityList';
import KeywordsModal from '../organisms/KeywordsModal';
import { colors } from '../../theme/tokens';
import { useResponsive, getContentMaxWidth, getCardColumns } from '../../utils/responsive';

interface PhaseSection {
  phase: Phase;
  items: Ability[];
}

interface TrackerTemplateProps {
  abilities: Ability[];
  wizards: Wizard[];
  priests: Priest[];
  /** Phase-visible non-terrain, non-manifestation units (the grid). */
  unitsVisible: Unit[];
  /** Terrain pieces, shown in their own subsection. */
  terrain: Unit[];
  /** Manifestations, shown in their own subsection (summoned on demand). */
  manifestations: Unit[];
  /** Total real units in the army (for the "n of total" count). */
  unitsTotal: number;
  /** How many real units are destroyed (header badge). */
  destroyedTotal: number;
  /** Ephemeral per-unit combat state (wounds/destroyed/summoned), keyed by unit id. */
  unitStates: Map<string, UnitState>;
  onUnitWoundsChange: (unitId: string, delta: number) => void;
  onToggleUnitDestroyed: (unitId: string) => void;
  onToggleUnitSummoned: (unitId: string) => void;
  /** Source-unit names that are fully destroyed (drives the "unusable" marker). */
  destroyedSources: Set<string>;
  visiblePhases: Phase[];
  activePhase: Phase | null;
  displaySections: PhaseSection[];
  deploymentComplete: boolean;
  showKeywordsModal: boolean;
  isPhaseSelectable: (phase: Phase) => boolean;
  onBack: () => void;
  onShowKeywords: () => void;
  onCloseKeywords: () => void;
  onPhasePress: (phase: Phase) => void;
  onToggleUsed: (abilityId: string) => void;
  onCompleteDeployment: () => void;
  /** Advance the game: reset used abilities (except deployment) and clear active phase */
  onNextTurn: () => void;
  /** Current signed-in user (drives the AppHeader user button) */
  user: User | null;
  /** Open the global login modal */
  onOpenLogin: () => void;
  /** Current search query (filters the ability list) */
  searchQuery: string;
  /** Called when the user types in the header search bar */
  onSearchChange: (text: string) => void;
  // ----- Customization (long-press menu + Show Hidden toggle) -----
  /** Per-ability customization map (note / hidden / sort_order). Empty when signed out or unverified. */
  customizations: Map<string, Customization>;
  /** Long-press handler — opens the customization context menu in the screen. */
  onLongPressAbility: (ability: Ability) => void;
  /** Whether hidden abilities are currently rendered (faded) in the list. */
  showHidden: boolean;
  /** Toggle the Show Hidden state. */
  onToggleShowHidden: () => void;
  // ----- Drag-to-reorder mode -----
  /** Whether the drag-sortable reorder view is active. */
  reorderMode: boolean;
  /**
   * Toggle reorder mode. Undefined for users who can't customize (signed out
   * or unverified) — when undefined, AppHeader hides the Reorder toggle.
   */
  onToggleReorder?: () => void;
  /** Commit a phase's new order after a drag (optimistic persist in the screen). */
  onCommitPhaseOrder: (phase: Phase, reordered: Ability[]) => void;
  /** Inline error to show above the list if a drag commit failed to persist. */
  reorderError: string | null;
  /** Dismiss the reorder error banner. */
  onDismissReorderError: () => void;
}

/**
 * TrackerTemplate — page layout for the ability tracker screen.
 * Orchestrates the header, phase selector, wizard section, and ability list,
 * applying responsive max-widths and padding consistently across components.
 */
export default function TrackerTemplate(props: TrackerTemplateProps) {
  const responsive = useResponsive();
  const { width, select, isMobile, isLandscape } = responsive;
  const contentMaxWidth = getContentMaxWidth(width);
  // Tighter horizontal padding on landscape phones so phase buttons have room to fit labels
  const horizontalPadding = isMobile && isLandscape
    ? 12
    : select({ mobile: 12, tablet: 16, default: 28 });
  const cardColumns = getCardColumns(width);

  const hasWizards = props.wizards.length > 0;
  const hasPriests = props.priests.length > 0;
  // On mobile we stack the sections; on tablet+ we put them side by side
  const castersDirection: 'row' | 'column' = isMobile ? 'column' : 'row';

  return (
    <View style={styles.root}>
      {/* Header with title + actions + phase selector */}
      <View
        style={[
          styles.headerContainer,
          {
            maxWidth: contentMaxWidth,
            paddingHorizontal: horizontalPadding,
            paddingTop: select({ mobile: 8, default: 16 }),
            paddingBottom: select({ mobile: 8, default: 12 }),
          },
        ]}
      >
        <AppHeader
          onBack={props.onBack}
          onKeywords={props.onShowKeywords}
          user={props.user}
          onOpenLogin={props.onOpenLogin}
          searchQuery={props.searchQuery}
          onSearchChange={props.onSearchChange}
          showHidden={props.showHidden}
          onToggleShowHidden={props.onToggleShowHidden}
          reorderMode={props.reorderMode}
          onToggleReorder={props.onToggleReorder}
        />
        <PhaseSelector
          phases={props.visiblePhases}
          activePhase={props.activePhase}
          isPhaseSelectable={props.isPhaseSelectable}
          onPhasePress={props.onPhasePress}
          showCompleteDeployment={
            !props.deploymentComplete && props.activePhase === 'Deployment Phase'
          }
          onCompleteDeployment={props.onCompleteDeployment}
          showNextTurn={props.activePhase === 'End of Turn'}
          onNextTurn={props.onNextTurn}
        />
      </View>

      {/* Casters row: Wizards + Priests side by side on tablet+, stacked on mobile */}
      {(hasWizards || hasPriests) && (
        <View
          style={[
            styles.castersWrapper,
            {
              maxWidth: contentMaxWidth,
              paddingHorizontal: horizontalPadding,
              flexDirection: castersDirection,
              gap: 8,
            },
          ]}
        >
          {hasWizards && (
            <View style={styles.casterCol}>
              <WizardSection wizards={props.wizards} />
            </View>
          )}
          {hasPriests && (
            <View style={styles.casterCol}>
              <PriestSection priests={props.priests} />
            </View>
          )}
        </View>
      )}

      {/* Reorder-commit error banner (above the list, dismissible) */}
      {props.reorderError ? (
        <View
          style={[
            styles.errorBanner,
            { maxWidth: contentMaxWidth, marginHorizontal: horizontalPadding },
          ]}
        >
          <Text style={styles.errorBannerText}>{props.reorderError}</Text>
          <Text
            style={styles.errorBannerDismiss}
            onPress={props.onDismissReorderError}
            accessibilityRole="button"
          >
            ✕
          </Text>
        </View>
      ) : null}

      {/* Ability list: in reorder mode the same masonry grid but with wiggling,
          drag-sortable cards; otherwise the normal masonry grid. Both use the
          identical width + column count so toggling doesn't shift the layout. */}
      {props.reorderMode ? (
        <ReorderableAbilityList
          sections={props.displaySections}
          customizations={props.customizations}
          contentMaxWidth={contentMaxWidth}
          horizontalPadding={horizontalPadding}
          cardColumns={cardColumns}
          onCommitPhaseOrder={props.onCommitPhaseOrder}
        />
      ) : (
        <AbilityList
          sections={props.displaySections}
          onToggleUsed={props.onToggleUsed}
          onLongPressAbility={props.onLongPressAbility}
          customizations={props.customizations}
          contentMaxWidth={contentMaxWidth}
          horizontalPadding={horizontalPadding}
          cardColumns={cardColumns}
          destroyedSources={props.destroyedSources}
          header={
            props.unitsTotal > 0 || props.terrain.length > 0 || props.manifestations.length > 0 ? (
              <UnitSection
                units={props.unitsVisible}
                terrain={props.terrain}
                manifestations={props.manifestations}
                unitsTotal={props.unitsTotal}
                destroyedTotal={props.destroyedTotal}
                unitStates={props.unitStates}
                onUnitWoundsChange={props.onUnitWoundsChange}
                onToggleUnitDestroyed={props.onToggleUnitDestroyed}
                onToggleUnitSummoned={props.onToggleUnitSummoned}
                horizontalPadding={horizontalPadding}
                cardColumns={cardColumns}
              />
            ) : null
          }
        />
      )}

      {/* Keywords reference modal */}
      <KeywordsModal visible={props.showKeywordsModal} onClose={props.onCloseKeywords} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  headerContainer: {
    width: '100%',
    alignSelf: 'center',
  },
  wizardWrapper: {
    width: '100%',
    alignSelf: 'center',
  },
  castersWrapper: {
    width: '100%',
    alignSelf: 'center',
  },
  casterCol: {
    flex: 1,
    minWidth: 0,
  },
  errorBanner: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: '#3A1E22',
    borderWidth: 1,
    borderColor: '#7F3D44',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
  },
  errorBannerText: {
    color: '#FF8B8B',
    fontSize: 13,
    flex: 1,
    minWidth: 0,
  },
  errorBannerDismiss: {
    color: '#FF8B8B',
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
});
