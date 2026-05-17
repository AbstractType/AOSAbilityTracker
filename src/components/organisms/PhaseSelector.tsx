import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { Phase } from '../../types';
import PhaseButton from '../molecules/PhaseButton';
import Button from '../atoms/Button';
import { useResponsive } from '../../utils/responsive';

interface PhaseSelectorProps {
  phases: Phase[];
  activePhase: Phase | null;
  /** Determines if a phase is currently selectable (e.g., current or next phase). */
  isPhaseSelectable: (phase: Phase) => boolean;
  onPhasePress: (phase: Phase) => void;
  /** When the deployment phase is active and not yet completed, shows a "Complete" button. */
  showCompleteDeployment?: boolean;
  onCompleteDeployment?: () => void;
  /** When the End of Turn phase is active, shows a "Next Turn?" button to reset abilities. */
  showNextTurn?: boolean;
  onNextTurn?: () => void;
}

/**
 * PhaseSelector organism — the row of phase filter buttons at the top of the tracker.
 *
 * Layout: the main phases (Deployment → Combat) fill the first row, and the End of
 * Turn phase sits alone on its own row beneath. When End of Turn is the active phase
 * the main row collapses entirely and a "Next Turn?" button is offered, because the
 * only meaningful action at end-of-turn is to wrap up and start the next round.
 */
export default function PhaseSelector({
  phases,
  activePhase,
  isPhaseSelectable,
  onPhasePress,
  showCompleteDeployment,
  onCompleteDeployment,
  showNextTurn,
  onNextTurn,
}: PhaseSelectorProps) {
  const { select, isMobile, isLandscape, width } = useResponsive();

  // Separate End of Turn out so it can have its own row
  const endOfTurnPhase = phases.find(p => p === 'End of Turn');
  const mainPhases = phases.filter(p => p !== 'End of Turn');

  // Tighter gap on cramped viewports (landscape phones, small tablets) so each
  // button has more horizontal room for its label. Generous gap on desktop.
  const gap = width < 1024 ? 6 : 10;
  // On landscape phone we can fit all main phases on a single row
  const mainPhasesOnSingleRow = (isMobile && isLandscape) || !isMobile;

  // When End of Turn is the active phase, collapse the rest of the phase grid —
  // the player is wrapping up the turn and the only useful action is "Next Turn".
  const isEndOfTurnActive = activePhase === 'End of Turn';

  return (
    <View>
      {/* Row 1: main phases — hidden once End of Turn is selected */}
      {!isEndOfTurnActive && (
        <View
          style={[
            styles.row,
            { gap, marginTop: 12 },
          ]}
        >
          {mainPhases.map(phase => (
            <PhaseButton
              key={phase}
              phase={phase}
              isActive={activePhase === phase}
              isSelectable={isPhaseSelectable(phase)}
              onPress={() => onPhasePress(phase)}
              stretchToFit={mainPhasesOnSingleRow}
            />
          ))}
        </View>
      )}

      {/* Row 2: End of Turn alone — full width, prominent placement */}
      {endOfTurnPhase && (
        <View
          style={[
            styles.row,
            { gap, marginTop: isEndOfTurnActive ? 12 : gap },
          ]}
        >
          <PhaseButton
            key={endOfTurnPhase}
            phase={endOfTurnPhase}
            isActive={activePhase === endOfTurnPhase}
            isSelectable={isPhaseSelectable(endOfTurnPhase)}
            onPress={() => onPhasePress(endOfTurnPhase)}
            fullWidth
          />
        </View>
      )}

      {showCompleteDeployment && onCompleteDeployment && (
        <Button
          label="✓ Complete Deployment Phase"
          onPress={onCompleteDeployment}
          variant="complete"
          style={styles.completeButton}
        />
      )}

      {showNextTurn && onNextTurn && (
        <Button
          label="↻ Next Turn?"
          onPress={onNextTurn}
          variant="complete"
          style={styles.completeButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  completeButton: {
    marginTop: 12,
  },
});
