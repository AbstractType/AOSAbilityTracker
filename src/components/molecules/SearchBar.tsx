import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, radii } from '../../theme/tokens';
import { useResponsive } from '../../utils/responsive';

interface SearchBarProps {
  /** Current query text */
  value: string;
  /** Called whenever the query text changes */
  onChangeText: (text: string) => void;
  /** Placeholder shown in the expanded input */
  placeholder?: string;
  /**
   * Width the search bar expands to. On large screens it stays bounded so it
   * doesn't dominate the header. Defaults are responsive.
   */
  expandedWidth?: number;
}

// Caret color: contrasts with the white input text against the dark background
const CARET_COLOR = '#5BA9FF';

/**
 * SearchBar molecule — a collapsible search input.
 *
 * Default state is just a 🔍 icon button (same footprint as a header button).
 * Tapping it animates the bar open, focuses the field, and reveals an X to
 * clear the query and collapse the bar. The component keeps its own
 * expanded/collapsed state but delegates the query value to the parent so the
 * parent can use it to filter content.
 */
export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search abilities…',
  expandedWidth,
}: SearchBarProps) {
  const [expanded, setExpanded] = useState(false);
  const { select } = useResponsive();
  const inputRef = useRef<TextInput | null>(null);

  // Width the expanded input takes — tighter on small phones, more generous on desktop
  const targetWidth =
    expandedWidth ?? select({ mobile: 200, tablet: 260, default: 320 });

  // Animate width and label opacity together so the collapse feels smooth
  const widthAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: expanded ? targetWidth : 40,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      // `width` isn't native-driver-safe, so we have to use JS animation
      useNativeDriver: false,
    }).start();
  }, [expanded, targetWidth, widthAnim]);

  function handleOpen() {
    setExpanded(true);
    // Focus the input once the expansion has had time to render
    setTimeout(() => inputRef.current?.focus(), 60);
  }

  function handleClose() {
    onChangeText('');
    setExpanded(false);
  }

  return (
    <Animated.View style={[styles.container, { width: widthAnim }]}>
      {expanded ? (
        // Expanded state: icon + text input + clear/close button
        <View style={styles.expandedRow}>
          <Text style={styles.iconLeading}>🔍</Text>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#7A8BA4"
            autoCapitalize="none"
            autoCorrect={false}
            selectionColor={CARET_COLOR}
            returnKeyType="search"
          />
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeBtn}
            accessibilityLabel="Close search"
            activeOpacity={0.7}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Collapsed state: just the badge icon
        <TouchableOpacity
          onPress={handleOpen}
          style={styles.iconButton}
          accessibilityLabel="Open search"
          activeOpacity={0.85}
        >
          <Text style={styles.iconText}>🔍</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Animated width drives the size; we just need to lock height + rounded shape
    height: 40,
    overflow: 'hidden',
    borderRadius: radii.md,
  },

  // Collapsed (icon-only) button
  iconButton: {
    flex: 1,
    backgroundColor: '#22324A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: colors.textPrimary,
    fontSize: 16,
  },

  // Expanded row: icon + input + close
  expandedRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#101725',
    borderWidth: 1,
    borderColor: '#22324A',
    borderRadius: radii.md,
    paddingLeft: 10,
    paddingRight: 4,
  },
  iconLeading: {
    fontSize: 14,
    marginRight: 6,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    paddingVertical: 8,
    minWidth: 0,
    // Web-only: caret-color goes through the style prop
    caretColor: CARET_COLOR,
  } as any,
  closeBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  closeText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '700',
  },
});
