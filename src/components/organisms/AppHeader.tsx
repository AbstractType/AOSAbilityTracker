import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import UserButton from '../molecules/UserButton';
import BurgerMenu, { type BurgerMenuItem } from '../molecules/BurgerMenu';
import SearchBar from '../molecules/SearchBar';
import type { User } from '../../types/user';
import { colors, radii } from '../../theme/tokens';

interface AppHeaderProps {
  /** Navigates back to the landing screen — labeled "Load New Army" in the menu */
  onBack?: () => void;
  onKeywords?: () => void;
  /** Current signed-in user (drives the user button in the actions row) */
  user?: User | null;
  /** Open the global login modal */
  onOpenLogin?: () => void;
  // ----- Search -----
  /** Current search query (controlled) */
  searchQuery?: string;
  /** Called when the search query changes */
  onSearchChange?: (text: string) => void;
  // ----- Show Hidden toggle -----
  /**
   * Whether the Show Hidden filter is on. When undefined (handler omitted),
   * the toggle isn't rendered at all — keeps the header clean on screens
   * that don't care about hidden abilities.
   */
  showHidden?: boolean;
  /** Toggle Show Hidden. Omit (along with showHidden) to hide the button. */
  onToggleShowHidden?: () => void;
  // ----- Reorder mode toggle -----
  /** Whether drag-to-reorder mode is active. */
  reorderMode?: boolean;
  /**
   * Toggle reorder mode. Omit to hide the button — used to gate the feature
   * to verified accounts (signed-out / unverified users don't get a handler).
   */
  onToggleReorder?: () => void;
}

/**
 * AppHeader organism — top header bar for the tracker screen.
 *
 * Layout (left → right):
 *   [☰ menu]   [🔍 search badge] [👁 show-hidden]              [user avatar]
 *
 * Every action — Load New Army (back), Keywords, and Sign In when signed out —
 * lives inside the burger menu on the left. The search badge sits next to it and
 * expands to a full input on tap so the user can quickly find an ability by
 * name, source, keyword, timing, or description text. The eye toggle reveals
 * abilities the user has hidden (so they can long-press → Unhide them). The
 * user avatar stays on the right when signed in.
 */
export default function AppHeader({
  onBack,
  onKeywords,
  user,
  onOpenLogin,
  searchQuery,
  onSearchChange,
  showHidden,
  onToggleShowHidden,
  reorderMode,
  onToggleReorder,
}: AppHeaderProps) {
  // Assemble the burger menu items in priority/usage order
  const menuItems = useMemo<BurgerMenuItem[]>(() => {
    const items: BurgerMenuItem[] = [];
    if (onBack) {
      items.push({ label: 'Load New Army', onPress: onBack, icon: '⚔️' });
    }
    if (onKeywords) {
      items.push({ label: 'Keywords', onPress: onKeywords, icon: '📖' });
    }
    if (onOpenLogin && !user) {
      items.push({ label: 'Sign In', onPress: onOpenLogin, icon: '👤' });
    }
    return items;
  }, [onBack, onKeywords, onOpenLogin, user]);

  // Avatar lives on the right when signed-in (visible identity marker + Account access)
  const showAvatar = !!(user && onOpenLogin);
  const showSearch = !!onSearchChange;
  const showHiddenToggle = !!onToggleShowHidden;
  const showReorderToggle = !!onToggleReorder;

  return (
    <View style={styles.actionsRow}>
      <View style={styles.leftActions}>
        {menuItems.length > 0 && <BurgerMenu items={menuItems} compact anchor="left" />}
        {showSearch && (
          <SearchBar value={searchQuery ?? ''} onChangeText={onSearchChange!} />
        )}
        {showHiddenToggle && (
          <TouchableOpacity
            onPress={onToggleShowHidden}
            style={[styles.hiddenToggle, showHidden && styles.hiddenToggleActive]}
            accessibilityRole="button"
            accessibilityLabel={showHidden ? 'Hide hidden abilities' : 'Show hidden abilities'}
            accessibilityState={{ selected: !!showHidden }}
            activeOpacity={0.7}
          >
            <Text style={styles.hiddenToggleIcon}>{showHidden ? '👁' : '🙈'}</Text>
          </TouchableOpacity>
        )}
        {showReorderToggle && (
          <TouchableOpacity
            onPress={onToggleReorder}
            style={[styles.hiddenToggle, reorderMode && styles.hiddenToggleActive]}
            accessibilityRole="button"
            accessibilityLabel={reorderMode ? 'Done reordering' : 'Reorder cards'}
            accessibilityState={{ selected: !!reorderMode }}
            activeOpacity={0.7}
          >
            <Text style={styles.hiddenToggleIcon}>{reorderMode ? '✓' : '⠿'}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.rightActions}>
        {showAvatar && onOpenLogin && (
          <UserButton user={user ?? null} onPress={onOpenLogin} compact />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  leftActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flexShrink: 1,
    alignItems: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    gap: 8,
    flexShrink: 0,
    alignItems: 'center',
  },
  // Same 40×40 footprint as the search/burger badges so the row reads as
  // a uniform set of small actions. The "active" state uses the same
  // colour as a focused phase button so it's visually consistent.
  hiddenToggle: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: '#22324A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenToggleActive: {
    backgroundColor: '#3F66D6',
  },
  hiddenToggleIcon: {
    fontSize: 18,
    color: colors.textPrimary,
  },
});
