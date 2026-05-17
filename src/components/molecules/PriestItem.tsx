import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii } from '../../theme/tokens';
import { useResponsive } from '../../utils/responsive';
import type { Priest } from '../../utils/jsonParser';

interface PriestItemProps {
  priest: Priest;
}

/**
 * PriestItem molecule — compact pill displaying a priest's name and chanting level.
 * Mirrors WizardItem with gold/amber priest theming.
 */
export default function PriestItem({ priest }: PriestItemProps) {
  const { scaleFont } = useResponsive();

  return (
    <View style={styles.container}>
      <Text style={[styles.name, { fontSize: scaleFont(12) }]} numberOfLines={1}>
        {priest.name}
      </Text>
      <View style={styles.badge}>
        <Text style={[styles.badgeText, { fontSize: scaleFont(10) }]}>
          {priest.priestLevel}
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
    backgroundColor: '#3a2f1a',
    paddingVertical: 3,
    paddingLeft: 8,
    paddingRight: 3,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.buttonKeywords,
  },
  name: {
    color: colors.textPrimary,
    fontWeight: '600',
    marginRight: 6,
  },
  badge: {
    backgroundColor: colors.buttonKeywords,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.textCardSecondary,
    fontWeight: '700',
  },
});
