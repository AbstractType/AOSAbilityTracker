import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { universalKeywords } from '../../data/universalKeywords';
import { useResponsive } from '../../utils/responsive';
import { colors, radii } from '../../theme/tokens';

interface KeywordsModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * KeywordsModal organism — modal displaying the list of universal AoS keywords
 * (Ward Save, Champion, etc.) with their descriptions.
 *
 * Visually matches LoginModal: dark navy palette, fade animation, "X" close in the
 * header, no redundant footer button. Long content scrolls inside the body.
 */
export default function KeywordsModal({ visible, onClose }: KeywordsModalProps) {
  const { select, scaleFont } = useResponsive();
  const modalMaxWidth = select({ mobile: 480, tablet: 600, default: 720 });
  const titleFontSize = scaleFont(select({ mobile: 18, default: 20 }));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {/* Backdrop — tapping outside the dialog closes it */}
      <Pressable
        style={styles.overlay}
        onPress={onClose}
        accessibilityLabel="Close dialog"
      >
        {/* Inner Pressable swallows taps so clicks on the dialog body don't bubble
            up to the backdrop and close it. */}
        <Pressable
          style={[styles.container, { maxWidth: modalMaxWidth }]}
          onPress={(e) => e.stopPropagation?.()}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { fontSize: titleFontSize }]}>
              Universal Keywords
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} accessibilityLabel="Close">
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
            {universalKeywords.map((keyword, index) => {
              const isLast = index === universalKeywords.length - 1;
              return (
                <View
                  key={index}
                  style={[styles.item, isLast && styles.itemLast]}
                >
                  <Text
                    style={[
                      styles.itemName,
                      { fontSize: scaleFont(select({ mobile: 15, default: 16 })) },
                    ]}
                  >
                    {keyword.name}
                  </Text>
                  <Text
                    style={[
                      styles.itemDescription,
                      { fontSize: scaleFont(select({ mobile: 13, default: 14 })) },
                    ]}
                  >
                    {keyword.description}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Styles mirror LoginModal exactly so both dialogs feel like one consistent surface.
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#15203A',
    borderRadius: radii.lg,
    width: '100%',
    maxHeight: '90%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#22324A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F1A30',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#22324A',
  },
  title: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 22,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  body: {
    // ScrollView itself — the inner contentContainerStyle adds the padding
  },
  bodyContent: {
    padding: 20,
  },
  item: {
    marginBottom: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#22324A',
  },
  itemLast: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  itemName: {
    fontWeight: '700',
    color: colors.buttonKeywords,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  itemDescription: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
