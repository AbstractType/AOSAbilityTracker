import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Unit, UnitState } from '../../types/unit';
import type { Phase } from '../../types';
import { distributeIntoColumns } from '../../utils/masonry';
import { unitCategory } from '../../utils/units';
import { radii } from '../../theme/tokens';
import UnitCard from './UnitCard';

interface UnitSectionProps {
  units: Unit[];
  terrain: Unit[];
  manifestations: Unit[];
  unitsTotal: number;
  destroyedTotal: number;
  unitStates: Map<string, UnitState>;
  onUnitWoundsChange: (unitId: string, delta: number) => void;
  onToggleUnitDestroyed: (unitId: string) => void;
  onToggleUnitSummoned: (unitId: string) => void;
  horizontalPadding: number;
  cardColumns: number;
  // Combat context toggles — optional; when provided, toggle UI is shown on cards
  onToggleUnitCharged?: (unitId: string) => void;
  onUnitHitModChange?: (unitId: string, delta: number) => void;
  onUnitSaveModChange?: (unitId: string, delta: number) => void;
  // War-room combat selection — optional
  onSelectUnitForCombat?: (unitId: string) => void;
  attackingUnitId?: string | null;
  /** Active game phase — passed to UnitCard to gate weapon display. */
  activePhase?: Phase | null;
}

const EMPTY_STATE: UnitState = { wounds: 0, destroyed: false, charged: false, hitModifier: 0, saveModifier: 0 };

/**
 * UnitSection — the collapsible "Units" block above the phase ability sections.
 * Renders the (phase-filtered) units in a masonry grid, with terrain split into
 * its own subsection. Collapsed by default so it's on demand.
 */
export default function UnitSection({
  units,
  terrain,
  manifestations,
  unitsTotal,
  destroyedTotal,
  unitStates,
  onUnitWoundsChange,
  onToggleUnitDestroyed,
  onToggleUnitSummoned,
  horizontalPadding,
  cardColumns,
  onToggleUnitCharged,
  onUnitHitModChange,
  onUnitSaveModChange,
  onSelectUnitForCombat,
  attackingUnitId,
  activePhase,
}: UnitSectionProps) {
  const [collapsed, setCollapsed] = useState(true);

  const renderGrid = (list: Unit[], summonable = false) => (
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
                summonable={summonable}
                summoned={!!state.summoned}
                onToggleSummoned={() => onToggleUnitSummoned(unit.id)}
                charged={!!state.charged}
                hitModifier={state.hitModifier ?? 0}
                saveModifier={state.saveModifier ?? 0}
                onToggleCharged={onToggleUnitCharged ? () => onToggleUnitCharged(unit.id) : undefined}
                onHitModChange={onUnitHitModChange ? (d) => onUnitHitModChange(unit.id, d) : undefined}
                onSaveModChange={onUnitSaveModChange ? (d) => onUnitSaveModChange(unit.id, d) : undefined}
                onSelectForCombat={onSelectUnitForCombat ? () => onSelectUnitForCombat(unit.id) : undefined}
                isAttacking={attackingUnitId === unit.id}
                activePhase={activePhase}
              />
            );
          })}
        </View>
      ))}
    </View>
  );

  const summonedCount = manifestations.reduce(
    (n, u) => n + (unitStates.get(u.id)?.summoned ? 1 : 0),
    0
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
            (() => {
              // Categorize units by role
              const categories = ['hero', 'unique', 'cavalry', 'infantry'] as const;
              const categoryLabels: Record<string, string> = {
                hero: 'Heroes',
                unique: 'Unique Heroes',
                cavalry: 'Cavalry',
                infantry: 'Infantry',
              };
              const categorizedUnits: Record<string, Unit[]> = {
                hero: [],
                unique: [],
                cavalry: [],
                infantry: [],
              };

              units.forEach(u => {
                const cat = unitCategory(u);
                categorizedUnits[cat].push(u);
              });

              return (
                <>
                  {categories.map(cat => {
                    const unitsInCategory = categorizedUnits[cat];
                    if (unitsInCategory.length === 0) return null;
                    return (
                      <View key={cat}>
                        {categories.length > 1 && unitsInCategory.length > 0 && (
                          <Text style={styles.subHeading}>{categoryLabels[cat]}</Text>
                        )}
                        {renderGrid(unitsInCategory)}
                      </View>
                    );
                  })}
                </>
              );
            })()
          ) : unitsTotal > 0 ? (
            <Text style={styles.emptyNote}>No units act in this phase.</Text>
          ) : null}

          {manifestations.length > 0 && (() => {
            // Un-summoned manifestations can only be summoned in the Hero Phase.
            // In other phases, only show manifestations that are already on the battlefield.
            const visibleManifestations = !activePhase || activePhase === 'Hero Phase'
              ? manifestations
              : manifestations.filter(m => unitStates.get(m.id)?.summoned);
            if (visibleManifestations.length === 0) return null;
            return (
              <>
                <Text style={styles.subHeading}>
                  Manifestations ({visibleManifestations.length}
                  {summonedCount > 0 ? `, ${summonedCount} summoned` : ''})
                </Text>
                {renderGrid(visibleManifestations, true)}
              </>
            );
          })()}

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
