import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import Button from '../atoms/Button';
import { colors, radii } from '../../theme/tokens';
import { useResponsive } from '../../utils/responsive';
import type { User } from '../../types/user';
import type { SavedArmy } from '../../types/army';
import { MAX_SAVED_ARMIES } from '../../types/army';

// ---------------------------------------------------------------------------
// Caret color
// ---------------------------------------------------------------------------
// The text color is white (#F8F9FB) so a white caret blends right into the
// just-typed characters, which can make the cursor look like it's invisible
// while typing. Use a contrasting accent color so the caret stays clearly
// distinguishable from the text it sits next to.
const CARET_COLOR = '#5BA9FF';

// ---------------------------------------------------------------------------
// Browser autofill style fix (web only)
// ---------------------------------------------------------------------------
// When a browser autofills credentials, it overrides input background/text colors
// with its own (light yellow background, dark text). Against our dark form that
// makes the text appear invisible. The `:-webkit-autofill` pseudo-class lets us
// keep our colors. Using a large inset box-shadow is the standard trick to mask
// the browser's forced background color since `background-color` itself can't
// override autofill.
const INJECTED_STYLE_ID = 'aos-login-autofill-fix';
function injectAutofillFixOnce() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  if (document.getElementById(INJECTED_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = INJECTED_STYLE_ID;
  style.textContent = `
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-text-fill-color: #F8F9FB !important;
      -webkit-box-shadow: 0 0 0 1000px #101725 inset !important;
      caret-color: ${CARET_COLOR} !important;
      transition: background-color 5000s ease-in-out 0s;
    }
  `;
  document.head.appendChild(style);
}

interface LoginModalProps {
  visible: boolean;
  /** Current user — if non-null, the modal shows the signed-in state with Sign Out + saved armies */
  user: User | null;
  onClose: () => void;
  /** Called when the user successfully signs in (demo-only — no real backend call) */
  onLogin: (user: User) => void;
  /** Called when the user signs out */
  onLogout: () => void;
  // ----- Saved-army features (only meaningful when `user` is non-null) -----
  /** The user's saved roster list */
  savedArmies?: SavedArmy[];
  /** Raw JSON of the army currently loaded in the tracker (if any) — enables saving */
  currentArmyJson?: string | null;
  /** Persist the current army under a user-chosen name */
  onSaveArmy?: (name: string) => void;
  /** Load a previously saved army (parses its JSON and navigates to the tracker) */
  onLoadSavedArmy?: (army: SavedArmy) => void;
  /** Delete a saved army from the user's list */
  onDeleteArmy?: (armyId: string) => void;
}

/**
 * LoginModal organism — the global account dialog.
 *
 * Signed-out: shows email + password form.
 * Signed-in: shows account info, saved army list (load/delete), an optional
 * "Save current army" form, and a Sign Out action.
 */
export default function LoginModal({
  visible,
  user,
  onClose,
  onLogin,
  onLogout,
  savedArmies = [],
  currentArmyJson,
  onSaveArmy,
  onLoadSavedArmy,
  onDeleteArmy,
}: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // "Save current army" sub-form state
  const [savingName, setSavingName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    injectAutofillFixOnce();
  }, []);

  // Whenever the modal closes, reset the save form so it doesn't reappear next time
  useEffect(() => {
    if (!visible) {
      setShowSaveForm(false);
      setSavingName('');
      setSaveError(null);
    }
  }, [visible]);

  const { select, scaleFont } = useResponsive();
  const modalMaxWidth = select({ mobile: 420, tablet: 480, default: 540 });

  function reset() {
    setEmail('');
    setPassword('');
    setError(null);
  }

  function handleCancel() {
    reset();
    onClose();
  }

  function handleLogin() {
    setError(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedEmail)) {
      setError('That email address looks invalid.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }
    onLogin({ email: trimmedEmail });
    reset();
  }

  function handleLogout() {
    reset();
    onLogout();
  }

  function handleConfirmSave() {
    setSaveError(null);
    const trimmed = savingName.trim();
    if (!trimmed) {
      setSaveError('Please give this army a name.');
      return;
    }
    if (trimmed.length > 40) {
      setSaveError('Keep the name under 40 characters.');
      return;
    }
    if (savedArmies.length >= MAX_SAVED_ARMIES) {
      setSaveError(`You can only save up to ${MAX_SAVED_ARMIES} armies. Delete one first.`);
      return;
    }
    onSaveArmy?.(trimmed);
    setSavingName('');
    setShowSaveForm(false);
  }

  const titleFontSize = scaleFont(select({ mobile: 18, default: 20 }));
  const canSaveCurrent =
    !!user && !!currentArmyJson && !!onSaveArmy && savedArmies.length < MAX_SAVED_ARMIES;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable
          style={styles.overlay}
          onPress={handleCancel}
          accessibilityLabel="Close dialog"
        >
          <Pressable
            style={[styles.container, { maxWidth: modalMaxWidth }]}
            onPress={(e) => e.stopPropagation?.()}
          >
            <View style={styles.header}>
              <Text style={[styles.title, { fontSize: titleFontSize }]}>
                {user ? 'Account' : 'Sign In'}
              </Text>
              <TouchableOpacity onPress={handleCancel} style={styles.closeButton} accessibilityLabel="Close">
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* The body can grow tall (saved armies list) so wrap in a ScrollView */}
            <ScrollView
              style={styles.bodyScroll}
              contentContainerStyle={styles.body}
            >
              {user ? (
                <>
                  {/* ----- Signed-in identity ----- */}
                  <View style={styles.signedInBox}>
                    <View style={styles.avatarLarge}>
                      <Text style={styles.avatarLargeText}>
                        {user.email.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.signedInLabel}>Signed in as</Text>
                    <Text style={styles.signedInEmail} numberOfLines={1}>
                      {user.email}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  {/* ----- Saved Army Lists ----- */}
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Army Lists</Text>
                      <Text style={styles.sectionCount}>
                        {savedArmies.length} / {MAX_SAVED_ARMIES}
                      </Text>
                    </View>

                    {savedArmies.length === 0 ? (
                      <Text style={styles.emptyHint}>
                        No saved armies yet. Load an army and save it here for quick access later.
                      </Text>
                    ) : (
                      savedArmies.map((army) => (
                        <View key={army.id} style={styles.armyRow}>
                          <TouchableOpacity
                            style={styles.armyLoadTarget}
                            onPress={() => onLoadSavedArmy?.(army)}
                            accessibilityLabel={`Load army ${army.name}`}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.armyIcon}>⚔️</Text>
                            <View style={styles.armyTextWrapper}>
                              <Text style={styles.armyName} numberOfLines={1}>
                                {army.name}
                              </Text>
                              <Text style={styles.armyMeta}>Tap to load</Text>
                            </View>
                          </TouchableOpacity>
                          {onDeleteArmy && (
                            <TouchableOpacity
                              style={styles.armyDeleteBtn}
                              onPress={() => onDeleteArmy(army.id)}
                              accessibilityLabel={`Delete army ${army.name}`}
                              activeOpacity={0.6}
                            >
                              <Text style={styles.armyDeleteText}>×</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      ))
                    )}

                    {/* Save-current-army form (only when there's an army loaded to save) */}
                    {canSaveCurrent && !showSaveForm && (
                      <TouchableOpacity
                        style={styles.saveCurrentBtn}
                        onPress={() => setShowSaveForm(true)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.saveCurrentText}>+ Save current army</Text>
                      </TouchableOpacity>
                    )}
                    {canSaveCurrent && showSaveForm && (
                      <View style={styles.saveForm}>
                        <Text style={styles.label}>Name this army</Text>
                        <TextInput
                          style={styles.input}
                          value={savingName}
                          onChangeText={setSavingName}
                          placeholder="e.g. Tournament list"
                          placeholderTextColor="#7A8BA4"
                          autoFocus
                          maxLength={40}
                          onSubmitEditing={handleConfirmSave}
                          selectionColor={CARET_COLOR}
                        />
                        {saveError ? (
                          <Text style={styles.errorText}>{saveError}</Text>
                        ) : null}
                        <View style={styles.saveActions}>
                          <Button
                            label="Cancel"
                            onPress={() => {
                              setShowSaveForm(false);
                              setSavingName('');
                              setSaveError(null);
                            }}
                            variant="secondary"
                          />
                          <Button label="Save" onPress={handleConfirmSave} variant="primary" />
                        </View>
                      </View>
                    )}

                    {/* Hint when no army loaded — clarifies why the save button isn't shown */}
                    {!!user && !currentArmyJson && savedArmies.length < MAX_SAVED_ARMIES && (
                      <Text style={styles.subtleHint}>
                        Load an army first to save it to your list.
                      </Text>
                    )}
                  </View>

                  <View style={styles.divider} />

                  {/* ----- Sign out ----- */}
                  <View style={styles.actionsStacked}>
                    <Button label="Sign Out" onPress={handleLogout} variant="reset" />
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    placeholderTextColor="#7A8BA4"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    selectionColor={CARET_COLOR}
                  />

                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#7A8BA4"
                    secureTextEntry
                    autoComplete="current-password"
                    onSubmitEditing={handleLogin}
                    selectionColor={CARET_COLOR}
                  />

                  {error ? (
                    <Text style={styles.errorText} accessibilityRole="alert">
                      {error}
                    </Text>
                  ) : null}

                  <View style={styles.actions}>
                    <Button label="Cancel" onPress={handleCancel} variant="secondary" />
                    <Button label="Sign In" onPress={handleLogin} variant="primary" />
                  </View>

                  <Text style={styles.hint}>
                    Demo sign-in only — your credentials stay in your browser and never leave your device.
                  </Text>
                </>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
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
  bodyScroll: {
    // Body itself, contentContainerStyle handles padding
  },
  body: {
    padding: 20,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#101725',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#22324A',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 15,
    marginBottom: 12,
    caretColor: CARET_COLOR,
  } as any,
  errorText: {
    color: '#E26464',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  actionsStacked: {
    marginTop: 4,
    width: '100%',
  },
  hint: {
    color: colors.textDim,
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 14,
    textAlign: 'center',
  },
  signedInBox: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.command,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarLargeText: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
  },
  signedInLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 2,
  },
  signedInEmail: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    maxWidth: '100%',
  },

  // Section blocks
  divider: {
    height: 1,
    backgroundColor: '#22324A',
    marginVertical: 18,
  },
  section: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  sectionCount: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyHint: {
    color: colors.textDim,
    fontSize: 13,
    fontStyle: 'italic',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  subtleHint: {
    color: colors.textDim,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 6,
    paddingHorizontal: 4,
  },

  // Army row
  armyRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#101725',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#22324A',
    marginBottom: 8,
    overflow: 'hidden',
  },
  armyLoadTarget: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  armyIcon: {
    fontSize: 18,
  },
  armyTextWrapper: {
    flex: 1,
    minWidth: 0,
  },
  armyName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  armyMeta: {
    color: colors.textDim,
    fontSize: 11,
    marginTop: 1,
  },
  armyDeleteBtn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#22324A',
  },
  armyDeleteText: {
    color: '#E26464',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 22,
  },

  // Save form
  saveCurrentBtn: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#3F66D6',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  saveCurrentText: {
    color: '#5BA9FF',
    fontSize: 13,
    fontWeight: '600',
  },
  saveForm: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#101725',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#22324A',
  },
  saveActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
});
