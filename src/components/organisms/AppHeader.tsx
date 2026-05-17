import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import UserButton from '../molecules/UserButton';
import BurgerMenu, { type BurgerMenuItem } from '../molecules/BurgerMenu';
import SearchBar from '../molecules/SearchBar';
import type { User } from '../../types/user';

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
}

/**
 * AppHeader organism — top header bar for the tracker screen.
 *
 * Layout (left → right):
 *   [☰ menu]   [🔍 search badge]                              [user avatar]
 *
 * Every action — Load New Army (back), Keywords, and Sign In when signed out —
 * lives inside the burger menu on the left. The search badge sits next to it and
 * expands to a full input on tap so the user can quickly find an ability by
 * name, source, keyword, timing, or description text. The user avatar stays on
 * the right when signed in.
 */
export default function AppHeader({
  onBack,
  onKeywords,
  user,
  onOpenLogin,
  searchQuery,
  onSearchChange,
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

  return (
    <View style={styles.actionsRow}>
      <View style={styles.leftActions}>
        {menuItems.length > 0 && <BurgerMenu items={menuItems} compact anchor="left" />}
        {showSearch && (
          <SearchBar value={searchQuery ?? ''} onChangeText={onSearchChange!} />
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
});
