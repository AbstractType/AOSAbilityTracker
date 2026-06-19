import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Unit, UnitState } from '../../types/unit';
import { distributeIntoColumns } from '../../utils/masonry';
import UnitCard from './UnitCard';

interface UnitSectionProps {
  units: Unit[];
  /** Ephemeral per-unit combat state, keyed by unit id. */
  unitStates: Map<string, UnitState>;
  onUnitWoundsChange: (unitId: string, delta: number) => void;
  onToggleUnitDestroyed: (unitId: string) => void;
  /** Horizontal padding (matches the phase sections). */
  horizontalPadding: number;
  /** Columns for the masonry grid (matches the ability grid). */
  cardColumns: number;
}

const EMPTY_STATE: UnitState = { wounds: 0, destroyed: false };

/**
 * UnitSection — the inline "Units" block shown above the phase ability sections.
 * Renders one UnitCard per unit in the same masonry grid the abilities use, so
 * the whole army (stats + weapons + live wound tracking) sits in one scroll.
 */
export default function UnitSection({
  units,
  unitStates,
  onUnitWoundsChange,
  onToggleUnitDestroyed,
  horizontalPadding,
  cardColumns,
}: UnitSectionProps) {
  if (units.length === 0) return null;

  return (
    <View style={[styles.section, { paddingHorizontal: horizontalPadding }]}>
      <Text style={styles.heading}>Units ({units.length})</Text>
      <View style={styles.masonryGrid}>
        {distributeIntoColumns(units, cardColumns).map((columnItems, colIdx) => (
          <View key={colIdx} style={styles.masonryColumn}>
            {columnItems.map((unit) => {
              const state = unitStates.get(unit.id) ?? EMPTY_STATE;
              return (
                <UnitCard
                  key={unit.id}
                  unit={unit}
                  wounds={state.wounds}
                  destroyed={state.destroyed}
                  onWoundsChange={(delta) => onUnitWoundsChange(unit.id, delta)}
                  onToggleDestroyed={() => onToggleUnitDestroyed(unit.id)}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
    width: '100%',
  },
  heading: {
    color: '#E9F0FF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  masonryGrid: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  masonryColumn: {
    flex: 1,
    minWidth: 0,
    gap: 14,
  },
});
