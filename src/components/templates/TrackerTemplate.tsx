import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { Ability, Phase } from '../../types';
import type { Wizard, Priest } from '../../utils/jsonParser';
import type { User } from '../../types/user';
import AppHeader from '../organisms/AppHeader';
import PhaseSelector from '../organisms/PhaseSelector';
import WizardSection from '../organisms/WizardSection';
import PriestSection from '../organisms/PriestSection';
import AbilityList from '../organisms/AbilityList';
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

      {/* Scrollable ability list (multi-column grid on wide screens) */}
      <AbilityList
        sections={props.displaySections}
        onToggleUsed={props.onToggleUsed}
        contentMaxWidth={contentMaxWidth}
        horizontalPadding={horizontalPadding}
        cardColumns={cardColumns}
      />

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
});
