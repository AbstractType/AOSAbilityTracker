import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Phase } from '../../types';
import Icon from '../atoms/Icon';
import { colors } from '../../theme/tokens';
import { useResponsive } from '../../utils/responsive';

interface AbilityCardHeaderProps {
  phase: Phase;
  /** Text to display in the header (e.g., timing like "Any Hero Phase", or "Passive") */
  label: string;
}

/**
 * AbilityCardHeader molecule — top banner of an ability card.
 * Shows the phase/timing label with an icon, with a phase-themed background color.
 */
export default function AbilityCardHeader({ phase, label }: AbilityCardHeaderProps) {
  const { scaleFont, select } = useResponsive();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.phaseBanner[phase],
          paddingVertical: select({ mobile: 6, default: 8 }),
          paddingHorizontal: select({ mobile: 10, default: 12 }),
        },
      ]}
    >
      <View style={styles.left}>
        <Icon name="✦" size={15} color={colors.textCream} />
        <Text
          style={[
            styles.label,
            { fontSize: scaleFont(select({ mobile: 11, default: 13 })) },
          ]}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  label: {
    color: colors.textCream,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    flexShrink: 1,
  },
});
