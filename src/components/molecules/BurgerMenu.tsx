import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { colors, radii, shadows } from '../../theme/tokens';
import { useResponsive } from '../../utils/responsive';

export interface BurgerMenuItem {
  label: string;
  onPress: () => void;
  /** 'destructive' applies a warning tint (e.g. for Reset All) */
  variant?: 'default' | 'destructive';
  /** Optional leading icon (single glyph / emoji) */
  icon?: string;
}

interface BurgerMenuProps {
  items: BurgerMenuItem[];
  /** Use compact (header-sized) padding to match other header buttons */
  compact?: boolean;
  /**
   * Kept for API compatibility — the new sheet design always anchors to the top
   * of the screen regardless of where the trigger sits.
   */
  anchor?: 'left' | 'right';
}

/**
 * BurgerMenu molecule — a hamburger button that drops down a full-width top sheet.
 *
 * Visual model is inspired by app drawers like Careem's: the menu descends from the
 * top of the screen as a polished sheet showing a horizontal row of large, circular
 * icon targets. Tapping any item closes the menu and runs the action; tapping the
 * backdrop or the close button dismisses it. The content underneath dims to focus
 * attention on the sheet.
 */
export default function BurgerMenu({ items, compact = false }: BurgerMenuProps) {
  const [open, setOpen] = useState(false);
  const { select, scaleFont, width } = useResponsive();

  const fontSize = scaleFont(
    compact ? select({ mobile: 16, default: 18 }) : select({ mobile: 18, default: 20 })
  );
  const paddingVertical = compact ? select({ mobile: 6, default: 8 }) : 12;
  const paddingHorizontal = compact ? select({ mobile: 10, default: 12 }) : 16;

  // Cap the sheet width on large screens so it doesn't span the whole viewport
  // — it should feel like a focused drawer, not a wall of UI.
  const sheetMaxWidth = Math.min(width, 720);

  function handleItemPress(item: BurgerMenuItem) {
    setOpen(false);
    // Defer so the menu closes visibly before the action fires
    setTimeout(() => item.onPress(), 0);
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.85}
        accessibilityLabel="Open menu"
        style={[
          styles.triggerButton,
          { paddingVertical, paddingHorizontal },
        ]}
      >
        <Text style={[styles.triggerIcon, { fontSize }]}>☰</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        {/* Backdrop — dims the page below and dismisses on tap */}
        <Pressable
          style={styles.overlay}
          onPress={() => setOpen(false)}
          accessibilityLabel="Close menu"
        >
          {/* Top sheet — swallows taps so clicks on the menu don't dismiss it */}
          <Pressable
            style={[styles.sheet, { maxWidth: sheetMaxWidth }]}
            onPress={(e) => e.stopPropagation?.()}
          >
            {/* Header: brand on the left, close button on the right */}
            <View style={styles.sheetHeader}>
              <View style={styles.brand}>
                <Text style={styles.brandSparkle}>✦</Text>
                <Text style={styles.brandTitle}>AOS Tracker</Text>
              </View>
              <TouchableOpacity
                onPress={() => setOpen(false)}
                style={styles.closeButton}
                accessibilityLabel="Close"
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Items: horizontal row of circular icon targets */}
            <View style={styles.itemsRow}>
              {items.map((item, index) => {
                const isDestructive = item.variant === 'destructive';
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={0.7}
                    style={styles.itemTouchable}
                    accessibilityLabel={item.label}
                  >
                    <View
                      style={[
                        styles.iconCircle,
                        isDestructive && styles.iconCircleDestructive,
                      ]}
                    >
                      <Text style={styles.itemIcon}>{item.icon ?? '•'}</Text>
                    </View>
                    <Text
                      style={[
                        styles.itemLabel,
                        isDestructive && styles.itemLabelDestructive,
                      ]}
                      numberOfLines={2}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Bottom drag-handle affordance (purely visual, like iOS sheets) */}
            <View style={styles.handleWrapper}>
              <View style={styles.handle} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // ----- Trigger (the ☰ button in the header) -----
  triggerButton: {
    backgroundColor: '#22324A',
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
  },
  triggerIcon: {
    color: colors.textPrimary,
    fontWeight: '900',
    lineHeight: 20,
  },

  // ----- Backdrop -----
  overlay: {
    flex: 1,
    // Dim the page below so focus shifts to the sheet
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // Sheet sits at the top
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  // ----- Sheet (the drawer surface) -----
  sheet: {
    width: '100%',
    backgroundColor: '#15203A',
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 20,
    // Only the bottom corners are rounded so it appears to drop down from the top
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#22324A',
    ...shadows.card,
  },

  // ----- Sheet header -----
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandSparkle: {
    color: colors.buttonKeywords,
    fontSize: 18,
    fontWeight: '900',
  },
  brandTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22324A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '700',
  },

  // ----- Items row (the icon grid) -----
  itemsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  itemTouchable: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 72,
    flexBasis: '22%',
    flexGrow: 0,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1F2F50',
    borderWidth: 1,
    borderColor: '#2D4068',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconCircleDestructive: {
    backgroundColor: 'rgba(226, 100, 100, 0.15)',
    borderColor: 'rgba(226, 100, 100, 0.4)',
  },
  itemIcon: {
    fontSize: 24,
  },
  itemLabel: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  itemLabelDestructive: {
    color: '#E26464',
  },

  // ----- Bottom handle (visual affordance) -----
  handleWrapper: {
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 6,
  },
  handle: {
    width: 56,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3D507A',
  },
});
