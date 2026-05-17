import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii } from '../../theme/tokens';
import { useResponsive } from '../../utils/responsive';
import type { Wizard } from '../../utils/jsonParser';

interface WizardItemProps {
  wizard: Wizard;
}

/**
 * WizardItem molecule — compact pill displaying a wizard's name and power level.
 */
export default function WizardItem({ wizard }: WizardItemProps) {
  const { scaleFont } = useResponsive();

  return (
    <View style={styles.container}>
      <Text style={[styles.name, { fontSize: scaleFont(12) }]} numberOfLines={1}>
        {wizard.name}
      </Text>
      <View style={styles.badge}>
        <Text style={[styles.badgeText, { fontSize: scaleFont(10) }]}>
          {wizard.powerLevel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
    marginBottom: 4,
    backgroundColor: '#2a3a4a',
    paddingVertical: 3,
    paddingLeft: 8,
    paddingRight: 3,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.command,
  },
  name: {
    color: colors.textPrimary,
    fontWeight: '600',
    marginRight: 6,
  },
  badge: {
    backgroundColor: colors.command,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
