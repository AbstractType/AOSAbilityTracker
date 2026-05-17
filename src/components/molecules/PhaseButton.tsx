import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { Phase } from '../../types';
import { colors, radii } from '../../theme/tokens';
import { useResponsive } from '../../utils/responsive';

interface PhaseButtonProps {
  phase: Phase;
  isActive: boolean;
  isSelectable: boolean;
  onPress: () => void;
  /** Take the full row width (used for the End of Turn row) */
  fullWidth?: boolean;
  /**
   * Stretch this button so a row of siblings shares the available width equally.
   * Used on landscape phones / tablets / desktop where the main phases fit on one line.
   * When false (portrait mobile), buttons use a percentage flexBasis to wrap into a grid.
   */
  stretchToFit?: boolean;
}

/**
 * Maps a phase to its display label across three label modes:
 *  - 'full'    → "Hero Phase", "Deployment Phase", etc. (desktop with plenty of room)
 *  - 'short'   → drops the redundant " Phase" suffix: "Hero", "Movement", "Deployment"
 *  - 'compact' → same as 'short' but uses 'Deploy' for "Deployment" so it fits on a
 *                very narrow button (e.g. landscape phone where 7 buttons share a row)
 *
 * The redundant "Phase" suffix is dropped in short/compact because every button is
 * already a phase — keeping it adds visual noise without information.
 */
function getDisplayLabel(phase: Phase, mode: 'full' | 'short' | 'compact'): string {
  if (mode === 'full') return phase;
  // Custom overrides for compact (very narrow) layouts
  if (mode === 'compact' && phase === 'Deployment Phase') return 'Deploy';
  // Default: drop trailing " Phase" suffix; "Start of Turn" / "End of Turn" are unaffected.
  return phase.replace(/\s+Phase$/i, '');
}

/**
 * PhaseButton molecule — a single phase filter button.
 * Combines text with a phase-themed background color and disabled/active states.
 */
export default function PhaseButton({
  phase,
  isActive,
  isSelectable,
  onPress,
  fullWidth,
  stretchToFit,
}: PhaseButtonProps) {
  const { scaleFont, select, isLandscape, isMobile, width } = useResponsive();

  const bgColor = colors.phase[phase];
  const borderColor = colors.phaseBorder[phase];

  // Layout strategy:
  // - fullWidth: take 100% (End of Turn row)
  // - stretchToFit: flex: 1 so siblings share the row equally
  // - default (portrait mobile): flexBasis around 47% so we get 2 per row that wrap
  const sizingStyle = fullWidth
    ? { flexBasis: '100%' as any, flexGrow: 1 }
    : stretchToFit
      ? { flex: 1, flexBasis: 0, minWidth: 70 }
      : { flexGrow: 1, flexBasis: '47%' as any, minWidth: 100 };

  // On landscape phones we get a bit more vertical padding so buttons feel substantial
  const paddingVertical = isMobile && isLandscape
    ? 8
    : select({ mobile: 10, default: 12 });
  // Tighter horizontal padding on cramped layouts to leave more room for text
  const paddingHorizontal = width < 1280 ? 6 : 12;

  // Pick the label mode based on the available width per button:
  // - <1100px: compact (shortest labels, e.g. "Deploy" instead of "Deployment") —
  //            covers landscape phones AND small tablets where 7 buttons share a row
  // - 1100-1279px: short (drops " Phase" suffix)
  // - ≥1280px: full ("Hero Phase", etc.) — only when sharing a single row
  const labelMode: 'full' | 'short' | 'compact' =
    stretchToFit && width < 1100
      ? 'compact'
      : stretchToFit && width < 1280
        ? 'short'
        : 'full';
  const label = getDisplayLabel(phase, labelMode);

  // Allow text to wrap to 2 lines as a safety net. Even with short labels,
  // "Start of Turn" / "End of Turn" can still need a second line on very narrow buttons.
  const allowTwoLines = stretchToFit || isMobile;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: bgColor,
          borderColor,
          paddingVertical,
          paddingHorizontal,
        },
        sizingStyle,
        isActive && styles.active,
        !isSelectable && styles.disabled,
      ]}
      onPress={onPress}
      disabled={!isSelectable}
      activeOpacity={0.85}
    >
      <Text
        style={[
          styles.text,
          { fontSize: scaleFont(select({ mobile: 11, default: 12 })) },
          isActive && styles.textActive,
          !isSelectable && styles.textDisabled,
        ]}
        numberOfLines={allowTwoLines ? 2 : 1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radii.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    opacity: 1,
    borderWidth: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  textActive: {
    color: colors.textPrimary,
  },
  textDisabled: {
    color: colors.textMuted,
  },
});
