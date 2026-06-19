import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import type { Ability, Phase } from '../../types';
import type { Customization } from '../../types/customization';
import { keyForAbility } from '../../types/customization';
import { distributeIntoColumns } from '../../utils/masonry';
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
  /** Open the customization context menu (long-press). When omitted, long-press is a no-op. */
  onLongPressAbility?: (ability: Ability) => void;
  /**
   * Per-ability customization map keyed by `name|source`. Used to render
   * note sections and faded "hidden" styling. Empty/missing entries mean
   * the ability has no customization (renders normally).
   */
  customizations?: Map<string, Customization>;
  /** Max width of the content area (for centered layout on desktop) */
  contentMaxWidth: number;
  /** Horizontal padding inside the list */
  horizontalPadding: number;
  /** How many ability cards to display per row (defaults to 1) */
  cardColumns?: number;
  /**
   * Optional content rendered above the phase sections (and scrolling with
   * them) — used for the inline Units section. Lives in the FlatList header so
   * it scrolls beneath the pinned casters row.
   */
  header?: React.ReactElement | null;
  /**
   * Names of source units that are fully destroyed. An ability whose `source`
   * is in this set is rendered as unusable. Passed as the FlatList `extraData`
   * so rows re-render when a unit is destroyed/revived.
   */
  destroyedSources?: Set<string>;
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
  onLongPressAbility,
  customizations,
  contentMaxWidth,
  horizontalPadding,
  cardColumns = 1,
  header,
  destroyedSources,
}: AbilityListProps) {
  return (
    <FlatList
      data={sections}
      keyExtractor={section => section.phase}
      style={styles.list}
      ListHeaderComponent={header ?? null}
      extraData={destroyedSources}
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
                  {columnItems.map(ability => {
                    const custom = customizations?.get(keyForAbility(ability));
                    return (
                      <AbilityCard
                        key={ability.id}
                        ability={ability}
                        onToggleUsed={() => onToggleUsed(ability.id)}
                        onLongPress={
                          onLongPressAbility ? () => onLongPressAbility(ability) : undefined
                        }
                        note={custom?.note}
                        hidden={custom?.hidden}
                        sourceDestroyed={
                          !!ability.source && !!destroyedSources?.has(ability.source)
                        }
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        );
      }}
    />
  );
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
