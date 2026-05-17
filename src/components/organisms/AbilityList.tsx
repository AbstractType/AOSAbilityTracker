import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import type { Ability, Phase } from '../../types';
import AbilityCard from './AbilityCard';

interface PhaseSection {
  phase: Phase;
  items: Ability[];
}

interface AbilityListProps {
  /** Sections grouped by phase, each containing sorted abilities */
  sections: PhaseSection[];
  /** Toggle the used state of an ability */
  onToggleUsed: (abilityId: string) => void;
  /** Max width of the content area (for centered layout on desktop) */
  contentMaxWidth: number;
  /** Horizontal padding inside the list */
  horizontalPadding: number;
  /** How many ability cards to display per row (defaults to 1) */
  cardColumns?: number;
}

/**
 * AbilityList organism — scrollable list of phase sections containing ability cards.
 *
 * Multi-column layout uses a masonry approach: cards are distributed across N vertical
 * columns. Each card takes its natural height and the next card stacks immediately
 * underneath it within its column. This eliminates the empty cells you get from a
 * traditional row-based grid when the final row is incomplete or when cards within
 * a row have very different heights.
 *
 * Distribution is round-robin (card N goes to column N % cardColumns), which keeps
 * the natural reading order intact when cards have similar heights: scan column 0
 * top-to-bottom, then column 1, etc.
 */
export default function AbilityList({
  sections,
  onToggleUsed,
  contentMaxWidth,
  horizontalPadding,
  cardColumns = 1,
}: AbilityListProps) {
  return (
    <FlatList
      data={sections}
      keyExtractor={section => section.phase}
      style={styles.list}
      contentContainerStyle={[
        styles.content,
        { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' },
      ]}
      renderItem={({ item: section }) => {
        // Phases with no abilities (common for many armies — not every phase
        // has actions in every roster) render nothing at all, rather than a
        // "No abilities in this phase" placeholder that just adds visual noise.
        if (section.items.length === 0) return null;
        return (
          <View style={[styles.section, { paddingHorizontal: horizontalPadding }]}>
            <View style={styles.masonryGrid}>
              {distributeIntoColumns(section.items, cardColumns).map((columnItems, colIdx) => (
                <View key={colIdx} style={styles.masonryColumn}>
                  {columnItems.map(ability => (
                    <AbilityCard
                      key={ability.id}
                      ability={ability}
                      onToggleUsed={() => onToggleUsed(ability.id)}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>
        );
      }}
    />
  );
}

/**
 * Splits an ordered list of items into N columns using round-robin distribution.
 * Preserves the original reading order when read column-by-column, top-to-bottom.
 */
function distributeIntoColumns<T>(items: T[], columnCount: number): T[][] {
  const safeCount = Math.max(1, columnCount);
  const columns: T[][] = Array.from({ length: safeCount }, () => []);
  items.forEach((item, index) => {
    columns[index % safeCount].push(item);
  });
  return columns;
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: '100%',
  },
  content: {
    paddingBottom: 24,
  },
  section: {
    marginTop: 16,
    width: '100%',
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
