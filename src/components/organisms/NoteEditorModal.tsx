import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Button from '../atoms/Button';
import { colors, radii } from '../../theme/tokens';
import { useResponsive } from '../../utils/responsive';

const CARET_COLOR = '#5BA9FF';
const NOTE_MAX_LENGTH = 1000;

interface NoteEditorModalProps {
  visible: boolean;
  /** Ability name (shown as subtitle so user knows what they're editing). */
  abilityName: string;
  /** Current note text, or null if none. */
  initialNote: string | null;
  /** Called when the user saves. Empty string = clear the note. */
  onSave: (note: string) => Promise<void>;
  onClose: () => void;
}

/**
 * NoteEditorModal — full-screen-ish dialog for editing the user's note on a
 * single ability. Pre-fills with the existing note (if any) so editing is
 * additive. Saves on confirm, surfaces errors inline rather than via Alert
 * (Alert is a no-op on react-native-web).
 */
export default function NoteEditorModal({
  visible,
  abilityName,
  initialNote,
  onSave,
  onClose,
}: NoteEditorModalProps) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset the form whenever the modal opens for a (possibly different) ability.
  useEffect(() => {
    if (visible) {
      setText(initialNote ?? '');
      setError(null);
      setSaving(false);
    }
  }, [visible, initialNote]);

  const { select, scaleFont } = useResponsive();
  const modalMaxWidth = select({ mobile: 420, tablet: 480, default: 540 });
  const titleFontSize = scaleFont(select({ mobile: 18, default: 20 }));

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      await onSave(text);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save note.');
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    if (saving) return; // prevent dismiss-mid-save
    onClose();
  }

  // "Clear" is a distinct intent from "Save with empty text" only in the UI —
  // both result in the same DB write (note → NULL). Showing it explicitly
  // when there IS a saved note makes the intent obvious.
  async function handleClear() {
    setError(null);
    setSaving(true);
    try {
      await onSave('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not clear note.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.overlay} onPress={handleClose}>
          <Pressable
            style={[styles.container, { maxWidth: modalMaxWidth }]}
            onPress={(e) => e.stopPropagation?.()}
          >
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={[styles.title, { fontSize: titleFontSize }]}>Notes</Text>
                <Text style={styles.subtitle} numberOfLines={2}>
                  {abilityName}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
                accessibilityLabel="Close"
                disabled={saving}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.body}>
              <Text style={styles.label}>Your note</Text>
              <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="e.g. Remember the +1 to wound vs Order armies"
                placeholderTextColor="#7A8BA4"
                multiline
                autoFocus
                maxLength={NOTE_MAX_LENGTH}
                editable={!saving}
                selectionColor={CARET_COLOR}
                textAlignVertical="top"
              />
              <Text style={styles.counter}>
                {text.length} / {NOTE_MAX_LENGTH}
              </Text>

              {error ? (
                <Text style={styles.errorText} accessibilityRole="alert">
                  {error}
                </Text>
              ) : null}

              <View style={styles.actions}>
                {initialNote ? (
                  <Button
                    label="Clear"
                    onPress={handleClear}
                    variant="reset"
                    disabled={saving}
                  />
                ) : (
                  <Button
                    label="Cancel"
                    onPress={handleClose}
                    variant="secondary"
                    disabled={saving}
                  />
                )}
                <Button
                  label={saving ? 'Saving…' : 'Save'}
                  onPress={handleSave}
                  variant="primary"
                  disabled={saving}
                />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: { flex: 1 },
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
    alignItems: 'flex-start',
    backgroundColor: '#0F1A30',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#22324A',
    gap: 12,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: { padding: 4 },
  closeButtonText: {
    fontSize: 22,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  body: {
    padding: 20,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#101725',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#22324A',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 14,
    minHeight: 140,
    // Web-only — caret-color goes through the style prop
    caretColor: CARET_COLOR,
  } as any,
  counter: {
    color: colors.textDim,
    fontSize: 11,
    textAlign: 'right',
    marginTop: 4,
  },
  errorText: {
    color: '#FF8B8B',
    fontSize: 13,
    marginTop: 6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
  },
});
