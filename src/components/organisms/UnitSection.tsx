import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Unit, UnitState } from '../../types/unit';
import { distributeIntoColumns } from '../../utils/masonry';
import { radii } from '../../theme/tokens';
import UnitCard from './UnitCard';

interface UnitSectionProps {
  /** Units to show in the grid — already phase-filtered, terrain excluded. */
  units: Unit[];
  /** Terrain pieces, shown in their own subsection (not phase-filtered). */
  terrain: Unit[];
  /** Total non-terrain units in the army (for the "n of total" count). */
  unitsTotal: number;
  /** How many non-terrain units are destroyed (header badge). */
  destroyedTotal: number;
  /** Ephemeral per-unit combat state, keyed by unit id. */
  unitStates: Map<string, UnitState>;
  onUnitWoundsChange: (unitId: string, delta: number) => void;
  onToggleUnitDestroyed: (unitId: string) => void;
  horizontalPadding: number;
  cardColumns: number;
}

const EMPTY_STATE: UnitState = { wounds: 0, destroyed: false };

/**
 * UnitSection — the collapsible "Units" block above the phase ability sections.
 * Renders the (phase-filtered) units in a masonry grid, with terrain split into
 * its own subsection. Collapsed by default so it's on demand.
 */
export default function UnitSection({
  units,
  terrain,
  unitsTotal,
  destroyedTotal,
  unitStates,
  onUnitWoundsChange,
  onToggleUnitDestroyed,
  horizontalPadding,
  cardColumns,
}: UnitSectionProps) {
  const [collapsed, setCollapsed] = useState(true);

  const renderGrid = (list: Unit[]) => (
    <View style={styles.masonryGrid}>
      {distributeIntoColumns(list, cardColumns).map((columnItems, colIdx) => (
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
  );

  // "Units (8)" normally; "Units (2 of 8)" when a phase narrows the list.
  const countLabel =
    units.length === unitsTotal ? `Units (${unitsTotal})` : `Units (${units.length} of ${unitsTotal})`;

  return (
    <View style={[styles.section, { paddingHorizontal: horizontalPadding }]}>
      <TouchableOpacity
        style={styles.headerBar}
        onPress={() => setCollapsed((c) => !c)}
        activeOpacity={0.75}
        accessibilityRole="button"
      >
        <Text style={styles.chevron}>{collapsed ? '▸' : '▾'}</Text>
        <Text style={styles.heading}>{countLabel}</Text>
        {destroyedTotal > 0 && <Text style={styles.destroyedCount}>{destroyedTotal} destroyed</Text>}
        <Text style={styles.toggleHint}>{collapsed ? 'Show' : 'Hide'}</Text>
      </TouchableOpacity>

      {!collapsed && (
        <>
          {units.length > 0 ? (
            renderGrid(units)
          ) : (
            <Text style={styles.emptyNote}>No units act in this phase.</Text>
          )}

          {terrain.length > 0 && (
            <>
              <Text style={styles.subHeading}>Terrain ({terrain.length})</Text>
              {renderGrid(terrain)}
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
    width: '100%',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#15203A',
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  chevron: {
    color: '#9DB0CF',
    fontSize: 13,
    fontWeight: '900',
    width: 12,
  },
  heading: {
    color: '#E9F0FF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  destroyedCount: {
    color: '#FF8B8B',
    fontSize: 12,
    fontWeight: '700',
  },
  toggleHint: {
    color: '#9DB0CF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 'auto',
  },
  subHeading: {
    color: '#9DB0CF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 14,
    marginBottom: 10,
  },
  emptyNote: {
    color: '#7A8BA4',
    fontSize: 13,
    fontStyle: 'italic',
    paddingVertical: 4,
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
