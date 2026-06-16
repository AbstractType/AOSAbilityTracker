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
import { createProfile } from '../../utils/profiles';
import { validateUsername, USERNAME_MAX } from '../../types/profile';
import type { Profile } from '../../types/profile';

const CARET_COLOR = '#5BA9FF';

interface UsernamePromptModalProps {
  visible: boolean;
  /** Allow dismissing without choosing (e.g. opened from Account view). When
   *  false, only a successful create closes it (used when gating multiplayer). */
  dismissible?: boolean;
  /** Called with the created profile on success. */
  onCreated: (profile: Profile) => void;
  onClose: () => void;
}

/**
 * UsernamePromptModal — lets a verified user claim a unique username, which is
 * the prerequisite for multiplayer (challenging / being challenged by handle).
 *
 * Validation mirrors the DB CHECK so the common cases fail fast inline; the
 * uniqueness check is enforced by the DB (we never check-then-insert, to avoid
 * races) and surfaced as a friendly "taken" message.
 */
export default function UsernamePromptModal({
  visible,
  dismissible = true,
  onCreated,
  onClose,
}: UsernamePromptModalProps) {
  const [username, setUsername] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setUsername('');
      setError(null);
      setBusy(false);
    }
  }, [visible]);

  const { select, scaleFont } = useResponsive();
  const modalMaxWidth = select({ mobile: 420, tablet: 460, default: 500 });
  const titleFontSize = scaleFont(select({ mobile: 18, default: 20 }));

  // Live-normalize to the stored form (lowercase) so what the user sees is what
  // gets saved, and the inline validation matches the DB constraint.
  function handleChange(text: string) {
    setUsername(text.toLowerCase().replace(/\s/g, ''));
    if (error) setError(null);
  }

  async function handleSubmit() {
    const normalized = username.trim().toLowerCase();
    const validationError = validateUsername(normalized);
    if (validationError) {
      setError(validationError);
      return;
    }
    setBusy(true);
    try {
      const profile = await createProfile(normalized);
      onCreated(profile);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your username.');
    } finally {
      setBusy(false);
    }
  }

  function handleClose() {
    if (busy) return;
    if (!dismissible) return;
    onClose();
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
              <Text style={[styles.title, { fontSize: titleFontSize }]}>
                Choose a username
              </Text>
              {dismissible ? (
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}
                  accessibilityLabel="Close"
                  disabled={busy}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.body}>
              <Text style={styles.blurb}>
                Pick a handle other players can use to challenge you to a war room.
                You can't change it later, so choose well.
              </Text>

              <Text style={styles.label}>Username</Text>
              <View style={styles.inputRow}>
                <Text style={styles.at}>@</Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={handleChange}
                  placeholder="warboss_grimgnash"
                  placeholderTextColor="#7A8BA4"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={USERNAME_MAX}
                  editable={!busy}
                  onSubmitEditing={handleSubmit}
                  selectionColor={CARET_COLOR}
                />
              </View>
              <Text style={styles.rule}>
                3–20 characters · lowercase letters, numbers, underscores
              </Text>

              {error ? (
                <Text style={styles.errorText} accessibilityRole="alert">
                  {error}
                </Text>
              ) : null}

              <View style={styles.actions}>
                {dismissible ? (
                  <Button
                    label="Cancel"
                    onPress={handleClose}
                    variant="secondary"
                    disabled={busy}
                    compact
                  />
                ) : null}
                <Button
                  label={busy ? 'Saving…' : 'Claim username'}
                  onPress={handleSubmit}
                  variant="primary"
                  disabled={busy}
                  compact
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
  closeButton: { padding: 4 },
  closeButtonText: {
    fontSize: 22,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  body: { padding: 20 },
  blurb: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#101725',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#22324A',
    paddingLeft: 12,
  },
  at: {
    color: colors.textDim,
    fontSize: 15,
    fontWeight: '700',
    marginRight: 2,
  },
  input: {
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 15,
    // Web-only caret color through the style prop
    caretColor: CARET_COLOR,
  } as any,
  rule: {
    color: colors.textDim,
    fontSize: 11,
    marginTop: 6,
  },
  errorText: {
    color: '#FF8B8B',
    fontSize: 13,
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
  },
});
