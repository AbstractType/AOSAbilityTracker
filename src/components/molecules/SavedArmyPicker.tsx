import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { SavedArmy } from '../../types/army';
import { colors, radii } from '../../theme/tokens';

interface SavedArmyPickerProps {
  /** The user's saved armies to choose from. */
  armies: SavedArmy[];
  /** Currently selected army id, or null. */
  selectedId: string | null;
  /** Called when an army row is tapped. */
  onSelect: (army: SavedArmy) => void;
  /** Hint shown when the user has no saved armies. */
  emptyHint?: string;
}

/**
 * SavedArmyPicker — a single-select list of the user's saved armies. Used when
 * accepting a challenge (pick the list you'll bring) and in the lobby (pick the
 * list you challenge with). Distinct from LoginModal's army-management block,
 * which also deletes and saves; this one only selects.
 */
export default function SavedArmyPicker({
  armies,
  selectedId,
  onSelect,
  emptyHint = 'No saved armies yet. Save an army to your account first.',
}: SavedArmyPickerProps) {
  if (armies.length === 0) {
    return <Text style={styles.emptyHint}>{emptyHint}</Text>;
  }

  return (
    <View style={styles.list}>
      {armies.map((army) => {
        const selected = army.id === selectedId;
        return (
          <TouchableOpacity
            key={army.id}
            style={[styles.row, selected && styles.rowSelected]}
            onPress={() => onSelect(army)}
            activeOpacity={0.7}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`Select army ${army.name}`}
          >
            <Text style={styles.icon}>⚔️</Text>
            <Text style={[styles.name, selected && styles.nameSelected]} numberOfLines={1}>
              {army.name}
            </Text>
            <Text style={[styles.radio, selected && styles.radioSelected]}>
              {selected ? '◉' : '○'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#101725',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#22324A',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  rowSelected: {
    borderColor: '#3F66D6',
    backgroundColor: 'rgba(63, 102, 214, 0.12)',
  },
  icon: {
    fontSize: 18,
  },
  name: {
    flex: 1,
    minWidth: 0,
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  nameSelected: {
    color: '#9DBDFF',
  },
  radio: {
    color: colors.textDim,
    fontSize: 18,
  },
  radioSelected: {
    color: '#5BA9FF',
  },
  emptyHint: {
    color: colors.textDim,
    fontSize: 13,
    fontStyle: 'italic',
    paddingVertical: 6,
  },
});
