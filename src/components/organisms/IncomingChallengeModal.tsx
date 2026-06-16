import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Button from '../atoms/Button';
import SavedArmyPicker from '../molecules/SavedArmyPicker';
import { colors, radii } from '../../theme/tokens';
import { useResponsive } from '../../utils/responsive';
import type { Challenge } from '../../types/warRoom';
import type { SavedArmy } from '../../types/army';

interface IncomingChallengeModalProps {
  visible: boolean;
  /** The incoming challenge (null when closed). */
  challenge: Challenge | null;
  /** The current user's saved armies to pick from when accepting. */
  savedArmies: SavedArmy[];
  /** Accept with the chosen army's JSON. Resolves once the room is ready. */
  onAccept: (challenge: Challenge, armyJson: string) => Promise<void>;
  /** Decline the challenge. */
  onDecline: (challenge: Challenge) => Promise<void>;
  onClose: () => void;
}

/**
 * IncomingChallengeModal — pops up (via the App-root realtime subscription)
 * when another player challenges you. You can only accept by selecting one of
 * your saved armies; if you have none, accept is disabled with a hint.
 */
export default function IncomingChallengeModal({
  visible,
  challenge,
  savedArmies,
  onAccept,
  onDecline,
  onClose,
}: IncomingChallengeModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState<'accept' | 'decline' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setSelectedId(null);
      setBusy(null);
      setError(null);
    }
  }, [visible, challenge?.id]);

  const { select, scaleFont } = useResponsive();
  const modalMaxWidth = select({ mobile: 420, tablet: 460, default: 500 });
  const titleFontSize = scaleFont(select({ mobile: 18, default: 20 }));

  if (!challenge) return null;

  const selectedArmy = savedArmies.find((a) => a.id === selectedId) ?? null;

  async function handleAccept() {
    if (!challenge || !selectedArmy) return;
    setBusy('accept');
    setError(null);
    try {
      await onAccept(challenge, selectedArmy.json);
      // App navigates into the room + closes this on success.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not accept. Try again.');
      setBusy(null);
    }
  }

  async function handleDecline() {
    if (!challenge) return;
    setBusy('decline');
    setError(null);
    try {
      await onDecline(challenge);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not decline. Try again.');
      setBusy(null);
    }
  }

  function handleClose() {
    if (busy) return;
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable
          style={[styles.container, { maxWidth: modalMaxWidth }]}
          onPress={(e) => e.stopPropagation?.()}
        >
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.headerLabel}>War Room Challenge</Text>
              <Text style={[styles.title, { fontSize: titleFontSize }]}>
                @{challenge.challengerUsername} challenges you
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              accessibilityLabel="Close"
              disabled={!!busy}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={styles.blurb}>
              Pick the army you'll bring to the war room, then accept.
            </Text>

            <SavedArmyPicker
              armies={savedArmies}
              selectedId={selectedId}
              onSelect={(army) => {
                setSelectedId(army.id);
                setError(null);
              }}
              emptyHint="You need a saved army to accept. Load an army and save it to your account first."
            />

            {error ? (
              <Text style={styles.errorText} accessibilityRole="alert">
                {error}
              </Text>
            ) : null}

            <View style={styles.actions}>
              <Button
                label={busy === 'decline' ? 'Declining…' : 'Decline'}
                onPress={handleDecline}
                variant="reset"
                disabled={!!busy}
                compact
              />
              <Button
                label={busy === 'accept' ? 'Accepting…' : 'Accept'}
                onPress={handleAccept}
                variant="primary"
                disabled={!!busy || !selectedArmy}
                compact
              />
            </View>
            {!selectedArmy && savedArmies.length > 0 ? (
              <Text style={styles.hint}>Select an army above to accept.</Text>
            ) : null}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

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
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#22324A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#0F1A30',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#22324A',
    gap: 12,
  },
  headerText: { flex: 1, minWidth: 0 },
  headerLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
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
    marginBottom: 14,
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
  hint: {
    color: colors.textDim,
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'right',
    marginTop: 6,
  },
});
