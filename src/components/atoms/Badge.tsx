import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { colors, radii, shadows } from '../../theme/tokens';
import { useResponsive } from '../../utils/responsive';

export type BadgeVariant =
  | 'castingGreen'
  | 'castingAmber'
  | 'castingRed'
  | 'chantingPurple'
  | 'chantingDark'
  | 'command'
  | 'ready'
  | 'used'
  | 'powerLevel'
  | 'neutral';

interface BadgeProps {
  /** Top label (e.g., "Casting", "Command") - optional */
  label?: string;
  /** Main value displayed (e.g., "7" or "Ready") */
  value: string | number;
  variant?: BadgeVariant;
  /** If true, this badge floats in the top-right corner of a parent card */
  cornerCutout?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Badge atom — used for casting values, command costs, status (ready/used), wizard power levels, etc.
 * Has multiple variants for different semantic meanings.
 */
export default function Badge({
  label,
  value,
  variant = 'neutral',
  cornerCutout = false,
  style,
}: BadgeProps) {
  const { scaleFont } = useResponsive();
  const variantStyles = VARIANT_STYLES[variant];

  return (
    <View
      style={[
        styles.base,
        cornerCutout && styles.cornerCutout,
        variantStyles.container,
        style,
      ]}
    >
      {label ? (
        <Text style={[styles.label, variantStyles.text, { fontSize: scaleFont(9) }]}>
          {label}
        </Text>
      ) : null}
      <Text
        style={[
          styles.value,
          variantStyles.text,
          { fontSize: scaleFont(label ? 18 : 12), lineHeight: scaleFont(label ? 20 : 16) },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const VARIANT_STYLES: Record<BadgeVariant, { container: ViewStyle; text: TextStyle }> = {
  castingGreen: {
    container: { backgroundColor: colors.castingGreen },
    text: { color: colors.textCream },
  },
  castingAmber: {
    container: { backgroundColor: colors.castingAmber },
    text: { color: colors.textCream },
  },
  castingRed: {
    container: { backgroundColor: colors.castingRed },
    text: { color: colors.textCream },
  },
  chantingPurple: {
    container: { backgroundColor: '#7B4FB6' },
    text: { color: colors.textCream },
  },
  chantingDark: {
    container: { backgroundColor: '#5A3680' },
    text: { color: colors.textCream },
  },
  command: {
    container: { backgroundColor: colors.command },
    text: { color: colors.textCream },
  },
  ready: {
    container: { backgroundColor: colors.readyBg, paddingVertical: 6, paddingHorizontal: 12, borderRadius: radii.pill },
    text: { color: colors.textPrimary, fontWeight: '700' },
  },
  used: {
    container: { backgroundColor: colors.usedBg, paddingVertical: 6, paddingHorizontal: 12, borderRadius: radii.pill },
    text: { color: colors.usedText, fontWeight: '700' },
  },
  powerLevel: {
    container: {
      backgroundColor: colors.command,
      width: 24,
      height: 24,
      borderRadius: 12,
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
    text: { color: colors.textPrimary, fontWeight: '700' },
  },
  neutral: {
    container: { backgroundColor: colors.bgTertiary },
    text: { color: colors.textPrimary },
  },
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
    ...shadows.badge,
  },
  cornerCutout: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 0,
    borderBottomLeftRadius: radii.lg,
    zIndex: 10,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  value: {
    fontWeight: '900',
  },
});

/**
 * Helper to pick a casting badge variant based on casting value difficulty.
 */
export function getCastingBadgeVariant(castingValue: number): BadgeVariant {
  if (castingValue <= 5) return 'castingGreen';
  if (castingValue <= 7) return 'castingAmber';
  return 'castingRed';
}

/**
 * Helper to pick a chanting badge variant based on chanting value difficulty.
 * Uses purple tones to distinguish from casting (green/amber/red).
 */
export function getChanningBadgeVariant(chantingValue: number): BadgeVariant {
  if (chantingValue <= 5) return 'chantingPurple';
  return 'chantingDark';
}
