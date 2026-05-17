import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Wizard } from '../../utils/jsonParser';
import WizardItem from '../molecules/WizardItem';
import { colors, radii } from '../../theme/tokens';
import { useResponsive } from '../../utils/responsive';

interface WizardSectionProps {
  wizards: Wizard[];
}

/**
 * WizardSection organism — compact display of all wizards in the roster.
 * Title, count, and total casting power live on a single header row.
 * Wizard items wrap in a tight inline row beneath.
 * Width is controlled by the parent container (allows side-by-side layout with PriestSection).
 */
export default function WizardSection({ wizards }: WizardSectionProps) {
  const { scaleFont } = useResponsive();

  if (wizards.length === 0) return null;

  const totalPower = wizards.reduce((sum, w) => sum + w.powerLevel, 0);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { fontSize: scaleFont(12) }]}>
          Wizards ({wizards.length})
        </Text>
        <Text style={[styles.totalText, { fontSize: scaleFont(11) }]}>
          Total Casting Power:{' '}
          <Text style={[styles.totalNumber, { fontSize: scaleFont(12) }]}>
            {totalPower}
          </Text>
        </Text>
      </View>
      <View style={styles.list}>
        {wizards.map((wizard, index) => (
          <WizardItem key={index} wizard={wizard} />
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
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.command,
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
    color: colors.command,
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
    color: colors.command,
    fontWeight: '700',
  },
});
