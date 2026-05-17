import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import Button from '../atoms/Button';
import { colors, radii } from '../../theme/tokens';
import { useResponsive } from '../../utils/responsive';
import type { Ability } from '../../types';
import type { User } from '../../types/user';
import type { Customization } from '../../types/customization';

interface AbilityContextMenuProps {
  visible: boolean;
  /** The ability the user long-pressed. Null when the modal is closed. */
  ability: Ability | null;
  /** That ability's current customization (or undefined if none). */
  customization?: Customization;
  /** Position info so we can grey out Move Up at the top, Move Down at bottom. */
  positionInPhase?: { index: number; total: number };
  /** Current user (for gating signed-in actions). */
  user: User | null;
  onClose: () => void;
  // ---- Verified-user actions (async; reject with friendly Error on failure) ----
  onMoveUp?: (ability: Ability) => Promise<void>;
  onMoveDown?: (ability: Ability) => Promise<void>;
  onEditNote?: (ability: Ability) => void;
  onToggleHidden?: (ability: Ability, hidden: boolean) => Promise<void>;
  // ---- Signed-out / unverified ----
  /** Opens the global login modal. */
  onOpenLogin?: () => void;
}

type ActionId = 'up' | 'down' | 'hide';

/**
 * AbilityContextMenu — the action sheet that appears on long-press of an
 * ability card. Surfaces three states cleanly:
 *
 *  • Signed-in + verified: full menu (Move Up, Move Down, Note, Hide/Unhide)
 *  • Signed-in + unverified: same look but body says "Verify your email
 *    to customize abilities" with a button to open the login modal where
 *    the verification banner + Resend live.
 *  • Signed-out: "Sign in to customize abilities" + Sign In button.
 *
 * Async actions show a per-row "Saving…" indicator and disable the row
 * while in flight. Errors surface inline below the actions, not via Alert
 * (Alert is a no-op on react-native-web).
 */
export default function AbilityContextMenu({
  visible,
  ability,
  customization,
  positionInPhase,
  user,
  onClose,
  onMoveUp,
  onMoveDown,
  onEditNote,
  onToggleHidden,
  onOpenLogin,
}: AbilityContextMenuProps) {
  // Which async action is currently in flight (for the per-row spinner).
  const [busy, setBusy] = useState<ActionId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { select, scaleFont } = useResponsive();
  const modalMaxWidth = select({ mobile: 360, tablet: 400, default: 420 });
  const titleFontSize = scaleFont(select({ mobile: 16, default: 18 }));

  // The modal's body content depends on what action the user can take.
  const canCustomize = !!user && user.emailVerified;
  const needsVerification = !!user && !user.emailVerified;
  const isSignedOut = !user;

  function handleClose() {
    if (busy) return; // don't dismiss mid-action
    setError(null);
    onClose();
  }

  async function runAction(id: ActionId, fn: () => Promise<void>) {
    setBusy(id);
    setError(null);
    try {
      await fn();
      // For move/hide we close immediately on success so the user sees the
      // result in the list behind. For note editing we let the editor modal
      // take over.
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(null);
    }
  }

  if (!ability) return null;

  const isHidden = !!customization?.hidden;
  const hasNote = !!customization?.note;
  const atTop = positionInPhase ? positionInPhase.index === 0 : false;
  const atBottom = positionInPhase
    ? positionInPhase.index >= positionInPhase.total - 1
    : false;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable
          style={[styles.container, { maxWidth: modalMaxWidth }]}
          onPress={(e) => e.stopPropagation?.()}
        >
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.headerLabel}>Customize</Text>
              <Text
                style={[styles.title, { fontSize: titleFontSize }]}
                numberOfLines={2}
              >
                {ability.name}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              accessibilityLabel="Close menu"
              disabled={!!busy}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {canCustomize ? (
              <>
                {/* ----- Reorder ----- */}
                <MenuRow
                  icon="▲"
                  label="Move up"
                  hint={atTop ? 'Already at top' : 'Reorder within this phase'}
                  disabled={atTop || !!busy || !onMoveUp}
                  busy={busy === 'up'}
                  onPress={() => onMoveUp && runAction('up', () => onMoveUp(ability))}
                />
                <MenuRow
                  icon="▼"
                  label="Move down"
                  hint={atBottom ? 'Already at bottom' : 'Reorder within this phase'}
                  disabled={atBottom || !!busy || !onMoveDown}
                  busy={busy === 'down'}
                  onPress={() => onMoveDown && runAction('down', () => onMoveDown(ability))}
                />

                <View style={styles.divider} />

                {/* ----- Note ----- */}
                <MenuRow
                  icon="📝"
                  label={hasNote ? 'Edit note' : 'Add note'}
                  hint={hasNote ? 'Update your saved note' : 'Pin a reminder to this card'}
                  disabled={!onEditNote || !!busy}
                  onPress={() => {
                    if (!onEditNote) return;
                    setError(null);
                    onClose();
                    // Defer slightly so the close animation can start before
                    // the note editor opens on top (avoids a visual stack).
                    setTimeout(() => onEditNote(ability), 50);
                  }}
                />

                <View style={styles.divider} />

                {/* ----- Hide / Unhide ----- */}
                <MenuRow
                  icon={isHidden ? '👁' : '🙈'}
                  label={isHidden ? 'Unhide' : 'Hide'}
                  hint={
                    isHidden
                      ? 'Show this ability in the normal list again'
                      : 'Filter it out until you toggle Show Hidden'
                  }
                  disabled={!onToggleHidden || !!busy}
                  busy={busy === 'hide'}
                  onPress={() =>
                    onToggleHidden &&
                    runAction('hide', () => onToggleHidden(ability, !isHidden))
                  }
                  destructive={!isHidden}
                />

                {error ? (
                  <Text style={styles.errorText} accessibilityRole="alert">
                    {error}
                  </Text>
                ) : null}
              </>
            ) : needsVerification ? (
              <>
                <Text style={styles.gateTitle}>Verify your email to customize</Text>
                <Text style={styles.gateText}>
                  Notes, hide, and reorder are saved to your account. Verify your email
                  (link in your inbox) to unlock them.
                </Text>
                <View style={styles.gateActions}>
                  <Button
                    label="Open Account"
                    onPress={() => {
                      onClose();
                      setTimeout(() => onOpenLogin?.(), 50);
                    }}
                    variant="primary"
                  />
                </View>
              </>
            ) : isSignedOut ? (
              <>
                <Text style={styles.gateTitle}>Sign in to customize</Text>
                <Text style={styles.gateText}>
                  Hide abilities you've memorized, pin notes, and reorder by importance —
                  all synced to your account.
                </Text>
                <View style={styles.gateActions}>
                  <Button
                    label="Sign In"
                    onPress={() => {
                      onClose();
                      setTimeout(() => onOpenLogin?.(), 50);
                    }}
                    variant="primary"
                  />
                </View>
              </>
            ) : null}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface MenuRowProps {
  icon: string;
  label: string;
  hint?: string;
  disabled?: boolean;
  busy?: boolean;
  destructive?: boolean;
  onPress: () => void;
}

function MenuRow({
  icon,
  label,
  hint,
  disabled,
  busy,
  destructive,
  onPress,
}: MenuRowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, disabled && styles.rowDisabled]}
      onPress={onPress}
      disabled={disabled || busy}
      activeOpacity={0.7}
      accessibilityLabel={label}
    >
      <Text style={styles.rowIcon}>{icon}</Text>
      <View style={styles.rowTextWrapper}>
        <Text
          style={[
            styles.rowLabel,
            destructive && styles.rowLabelDestructive,
            disabled && styles.rowLabelDisabled,
          ]}
        >
          {busy ? 'Saving…' : label}
        </Text>
        {hint ? <Text style={styles.rowHint}>{hint}</Text> : null}
      </View>
    </TouchableOpacity>
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

  body: {
    paddingVertical: 4,
  },

  // ---- Action rows ----
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
  },
  rowDisabled: {
    opacity: 0.4,
  },
  rowIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  rowTextWrapper: { flex: 1, minWidth: 0 },
  rowLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  rowLabelDestructive: {
    color: '#FF9C7A',
  },
  rowLabelDisabled: {
    color: colors.textDim,
  },
  rowHint: {
    color: colors.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#22324A',
    marginHorizontal: 20,
  },

  // ---- Gate (signed-out / unverified) ----
  gateTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  gateText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  gateActions: {
    padding: 20,
    paddingTop: 14,
  },

  errorText: {
    color: '#FF8B8B',
    fontSize: 13,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
