import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Priest } from '../../utils/jsonParser';
import PriestItem from '../molecules/PriestItem';
import { colors, radii } from '../../theme/tokens';
import { useResponsive } from '../../utils/responsive';

interface PriestSectionProps {
  priests: Priest[];
}

/**
 * PriestSection organism — compact display of all priests in the roster.
 * Mirrors WizardSection structure with gold/amber priest theming.
 * Width is controlled by the parent container (allows side-by-side layout with WizardSection).
 */
export default function PriestSection({ priests }: PriestSectionProps) {
  const { scaleFont } = useResponsive();

  if (priests.length === 0) return null;

  const totalChanting = priests.reduce((sum, p) => sum + p.priestLevel, 0);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { fontSize: scaleFont(12) }]}>
          Priests ({priests.length})
        </Text>
        <Text style={[styles.totalText, { fontSize: scaleFont(11) }]}>
          Total Chanting Power:{' '}
          <Text style={[styles.totalNumber, { fontSize: scaleFont(12) }]}>
            {totalChanting}
          </Text>
        </Text>
      </View>
      <View style={styles.list}>
        {priests.map((priest, index) => (
          <PriestItem key={index} priest={priest} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radii.md,
    marginTop: 6,
    marginBottom: 2,
    backgroundColor: '#2a1f10',
    borderWidth: 1,
    borderColor: colors.buttonKeywords,
    width: '100%',
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    rowGap: 2,
    marginBottom: 6,
  },
  title: {
    fontWeight: '700',
    color: colors.buttonKeywords,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  totalText: {
    color: colors.textSecondary,
  },
  totalNumber: {
    color: colors.buttonKeywords,
    fontWeight: '700',
  },
});
