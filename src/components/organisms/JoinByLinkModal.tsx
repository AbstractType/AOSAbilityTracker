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
import { peekInvite } from '../../utils/challenges';
import type { SavedArmy } from '../../types/army';

interface JoinByLinkModalProps {
  visible: boolean;
  /** Invite token from the ?challenge= URL (null when closed). */
  token: string | null;
  savedArmies: SavedArmy[];
  /** Join with the chosen army; App claims the invite + enters the room. */
  onJoin: (token: string, armyJson: string, challengerUsername: string) => Promise<void>;
  onClose: () => void;
}

type Peek =
  | { state: 'loading' }
  | { state: 'invalid' }
  | { state: 'ready'; challengerUsername: string };

/**
 * JoinByLinkModal — shown when the app is opened with a ?challenge=<token>
 * invite link (and the user is signed in + verified). Peeks at the invite to
 * show who sent it and whether it's still valid, then lets the user pick a
 * saved army and join.
 */
export default function JoinByLinkModal({
  visible,
  token,
  savedArmies,
  onJoin,
  onClose,
}: JoinByLinkModalProps) {
  const [peek, setPeek] = useState<Peek>({ state: 'loading' });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { select, scaleFont } = useResponsive();
  const modalMaxWidth = select({ mobile: 420, tablet: 460, default: 500 });
  const titleFontSize = scaleFont(select({ mobile: 18, default: 20 }));

  useEffect(() => {
    if (!visible || !token) return;
    let cancelled = false;
    setPeek({ state: 'loading' });
    setSelectedId(null);
    setError(null);
    setBusy(false);
    peekInvite(token).then((res) => {
      if (cancelled) return;
      if (!res || !res.valid) setPeek({ state: 'invalid' });
      else setPeek({ state: 'ready', challengerUsername: res.challengerUsername });
    });
    return () => {
      cancelled = true;
    };
  }, [visible, token]);

  if (!token) return null;

  const selectedArmy = savedArmies.find((a) => a.id === selectedId) ?? null;

  async function handleJoin() {
    if (!token || !selectedArmy || peek.state !== 'ready') return;
    setBusy(true);
    setError(null);
    try {
      await onJoin(token, selectedArmy.json, peek.challengerUsername);
      // App navigates into the room on success.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not join. Try again.');
      setBusy(false);
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
              <Text style={styles.headerLabel}>War Room Invite</Text>
              <Text style={[styles.title, { fontSize: titleFontSize }]}>
                {peek.state === 'ready'
                  ? `@${peek.challengerUsername} invited you`
                  : "You've been invited"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              accessibilityLabel="Close"
              disabled={busy}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {peek.state === 'loading' ? (
              <Text style={styles.dim}>Checking invite…</Text>
            ) : peek.state === 'invalid' ? (
              <>
                <Text style={styles.blurb}>
                  This invite link is invalid or has expired. Ask your opponent for a fresh one.
                </Text>
                <View style={styles.actions}>
                  <Button label="Close" onPress={handleClose} variant="secondary" compact />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.blurb}>
                  Pick the army you'll bring to the war room, then join.
                </Text>
                <SavedArmyPicker
                  armies={savedArmies}
                  selectedId={selectedId}
                  onSelect={(army) => {
                    setSelectedId(army.id);
                    setError(null);
                  }}
                  emptyHint="You need a saved army to join. Load an army and save it to your account first."
                />
                {error ? (
                  <Text style={styles.errorText} accessibilityRole="alert">
                    {error}
                  </Text>
                ) : null}
                <View style={styles.actions}>
                  <Button label="Cancel" onPress={handleClose} variant="secondary" disabled={busy} compact />
                  <Button
                    label={busy ? 'Joining…' : 'Join war room'}
                    onPress={handleJoin}
                    variant="primary"
                    disabled={busy || !selectedArmy}
                    compact
                  />
                </View>
              </>
            )}
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
  dim: {
    color: colors.textDim,
    fontSize: 14,
    fontStyle: 'italic',
    paddingVertical: 10,
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
