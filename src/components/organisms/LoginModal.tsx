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
import { supabase } from '../../lib/supabase';
import type { User } from '../../types/user';
import type { SavedArmy } from '../../types/army';
import { MAX_SAVED_ARMIES } from '../../types/army';
import type { Profile } from '../../types/profile';

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

/**
 * Compute the URL Supabase should redirect to after the user clicks the magic
 * link in the verification email. Has to match an entry in the project's
 * "Redirect URLs" allowlist (Auth → URL Configuration in the dashboard).
 *
 * On web we use the current origin + pathname so dev (localhost:19006) and
 * prod (abstracttype.github.io/AOSAbilityTracker/) both work without
 * hardcoding. On native we return undefined and Supabase falls back to its
 * configured Site URL.
 */
function getEmailRedirectTo(): string | undefined {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return undefined;
  return window.location.origin + window.location.pathname;
}

/**
 * Map Supabase auth error messages into something a player will understand.
 * The defaults are mostly OK but a few are jargon-y.
 */
function prettyAuthError(rawMessage: string): string {
  const msg = rawMessage.toLowerCase();
  if (msg.includes('invalid login credentials')) {
    return "That email and password don't match. Try again.";
  }
  if (msg.includes('email rate limit') || msg.includes('over_email_send_rate_limit')) {
    return 'Too many emails sent recently. Wait a few minutes before trying again.';
  }
  if (msg.includes('user already registered')) {
    return 'That email is already registered. Try signing in instead.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Please verify your email first. Check your inbox for the link.';
  }
  if (msg.includes('password should be at least')) {
    return 'Password must be at least 6 characters.';
  }
  if (msg.includes('new password should be different') || msg.includes('same as the old')) {
    return 'Pick a different password from your current one.';
  }
  if (msg.includes('auth session missing')) {
    return 'Your session expired. Sign in again.';
  }
  if (msg.includes('otp_expired') || msg.includes('token has expired') || msg.includes('expired')) {
    return 'That reset link has expired. Request a new one below.';
  }
  // Fallback: raw message, capitalized
  return rawMessage.charAt(0).toUpperCase() + rawMessage.slice(1);
}

/**
 * Sub-modes of the modal. The signed-out and verified-but-recovering states
 * cycle through these via tabs / links / explicit mode changes.
 *  - sign-in / register / check-email: existing flows from v0.2
 *  - forgot-password: user clicked "Forgot password?", we collect their email
 *  - reset-password: user clicked the email link OR explicitly chose to change
 *    their password from the Account view; collect new password + confirm
 */
type AuthMode =
  | 'sign-in'
  | 'register'
  | 'check-email'
  | 'forgot-password'
  | 'reset-password';

interface LoginModalProps {
  visible: boolean;
  /** Current user — null when signed out, present (with verification flag) when signed in. */
  user: User | null;
  onClose: () => void;
  // ----- Saved-army features (only meaningful when the user is verified) -----
  /** The user's saved roster list (loaded by App from Supabase). */
  savedArmies?: SavedArmy[];
  /** Raw JSON of the army currently loaded in the tracker (if any) — enables saving. */
  currentArmyJson?: string | null;
  /**
   * Persist the current army under a user-chosen name.
   * Async — resolves on success, rejects with a friendly Error message on
   * failure so this modal can surface it inline (the App layer can't, since
   * react-native-web's Alert.alert is a no-op).
   */
  onSaveArmy?: (name: string) => Promise<void>;
  /** Load a previously saved army (parses its JSON and navigates to the tracker). */
  onLoadSavedArmy?: (army: SavedArmy) => void;
  /**
   * Delete a saved army from the user's list. Async — resolves on success,
   * rejects with a friendly Error on failure.
   */
  onDeleteArmy?: (armyId: string) => Promise<void>;
  // ----- Password recovery -----
  /**
   * True when the user landed here via a Supabase password-recovery link.
   * While set, the modal forces 'reset-password' mode regardless of the
   * underlying signed-in state, and the data-loading effect in App is
   * gated off (so saved armies don't leak into the recovery session).
   */
  isRecoveringPassword?: boolean;
  /** Clear the recovery flag in App once the user has successfully updated their password. */
  onRecoveryComplete?: () => void;
  /**
   * Error message parsed from the URL hash on first load (e.g., the recovery
   * link was expired). Rendered in the forgot-password panel as a starting
   * state so the user knows why they're here.
   */
  recoveryHashError?: string | null;
  /** Clear the hash-error flag after the user has seen it / acted on it. */
  onRecoveryHashErrorAcknowledged?: () => void;
  // ----- Multiplayer identity -----
  /** The verified user's profile (username), or null if not chosen yet. */
  profile?: Profile | null;
  /** Open the username-claim modal (App closes this modal first). */
  onChooseUsername?: () => void;
}

/**
 * LoginModal organism — the global account dialog.
 *
 * Signed-out flow:
 *   - Tabs: [Sign In] [Register]
 *   - Sign In: email + password → supabase.auth.signInWithPassword
 *   - Register: email + password (+ confirm) → supabase.auth.signUp with
 *     emailRedirectTo so Supabase's confirmation email links back here.
 *     After successful registration, mode flips to 'check-email' to tell
 *     the user to verify before signing in.
 *
 * Signed-in flow:
 *   - If email NOT verified: prominent "Verify your email" banner with a
 *     Resend button. Saved-armies section is hidden — the feature is gated.
 *   - If verified: full saved-army management (list, save current, delete).
 *
 * Auth ops talk to Supabase directly. App.tsx subscribes to onAuthStateChange
 * and re-renders this modal with the new `user` prop accordingly — we don't
 * need to manually call any App-level login/logout handlers.
 */
export default function LoginModal({
  visible,
  user,
  onClose,
  savedArmies = [],
  currentArmyJson,
  onSaveArmy,
  onLoadSavedArmy,
  onDeleteArmy,
  isRecoveringPassword = false,
  onRecoveryComplete,
  recoveryHashError,
  onRecoveryHashErrorAcknowledged,
  profile,
  onChooseUsername,
}: LoginModalProps) {
  // Auth form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Separate state for the reset-password / change-password forms so they
  // don't accidentally inherit values from a stale sign-in attempt.
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Sub-state for the signed-out experience
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [busy, setBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authInfo, setAuthInfo] = useState<string | null>(null);
  /** Email address to use for the resend button (set after signup). */
  const [pendingEmail, setPendingEmail] = useState<string>('');
  /**
   * True when the Account-view change-password form is expanded. Independent
   * from `mode` because this is a signed-in feature, not a sub-mode of the
   * auth flow.
   */
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

  // Save-current-army sub-form state (only used when signed in + verified)
  const [savingName, setSavingName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  /** True while the save request is in flight — disables the button so a
   *  double-tap can't trigger two inserts. */
  const [savingArmy, setSavingArmy] = useState(false);
  /** Id of an army currently being deleted (so we can grey out just that
   *  row), or null when no delete is in flight. */
  const [deletingArmyId, setDeletingArmyId] = useState<string | null>(null);

  useEffect(() => {
    injectAutofillFixOnce();
  }, []);

  // Reset transient state every time the modal closes so the next open is fresh.
  useEffect(() => {
    if (!visible) {
      setShowSaveForm(false);
      setSavingName('');
      setSaveError(null);
      setSavingArmy(false);
      setDeletingArmyId(null);
      setAuthError(null);
      setAuthInfo(null);
      setBusy(false);
      // Wipe sensitive password fields the moment the modal closes — don't
      // leave them sitting in memory waiting for the next open.
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowChangePasswordForm(false);
      // Don't reset mode here — if the user closed mid-registration we don't
      // want to drop them back to Sign In; they may reopen to retry.
    }
  }, [visible]);

  // When the URL-hash error from App.tsx arrives (or changes), force the modal
  // into forgot-password mode so the user sees the error AND has the email
  // input handy to request a new reset link. Only run on transitions from null
  // to non-null — re-running on every render would clobber user mode changes.
  useEffect(() => {
    if (recoveryHashError) {
      setMode('forgot-password');
      setAuthError(recoveryHashError);
    }
  }, [recoveryHashError]);

  const { select, scaleFont } = useResponsive();
  const modalMaxWidth = select({ mobile: 420, tablet: 480, default: 540 });
  const titleFontSize = scaleFont(select({ mobile: 18, default: 20 }));

  // -------------------------------------------------------------------------
  // Auth actions (talk to Supabase directly; App listens via onAuthStateChange)
  // -------------------------------------------------------------------------

  function clearAuthForm() {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setAuthError(null);
    setAuthInfo(null);
  }

  async function handleSignIn() {
    setAuthError(null);
    setAuthInfo(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setAuthError('Please enter your email.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedEmail)) {
      setAuthError('That email address looks invalid.');
      return;
    }
    if (!password) {
      setAuthError('Please enter your password.');
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });
    setBusy(false);

    if (error) {
      setAuthError(prettyAuthError(error.message));
      return;
    }
    // Success: onAuthStateChange in App fires; this component re-renders
    // with `user` non-null and shows the Account view.
    clearAuthForm();
  }

  async function handleRegister() {
    setAuthError(null);
    setAuthInfo(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setAuthError('Please enter your email.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedEmail)) {
      setAuthError('That email address looks invalid.');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        emailRedirectTo: getEmailRedirectTo(),
      },
    });
    setBusy(false);

    if (error) {
      setAuthError(prettyAuthError(error.message));
      return;
    }
    // Success: Supabase has sent the verification email. Flip the modal into
    // "check your inbox" mode and remember the email so the resend button
    // can use it without the user re-typing.
    setPendingEmail(trimmedEmail);
    setMode('check-email');
    setPassword('');
    setConfirmPassword('');
  }

  async function handleSignOut() {
    setBusy(true);
    await supabase.auth.signOut();
    setBusy(false);
    // App's auth listener fires; user becomes null; modal re-renders signed-out.
  }

  async function handleResendVerification() {
    const target = pendingEmail || user?.email;
    if (!target) return;
    setAuthError(null);
    setAuthInfo(null);
    setBusy(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: target,
      options: { emailRedirectTo: getEmailRedirectTo() },
    });
    setBusy(false);
    if (error) {
      setAuthError(prettyAuthError(error.message));
      return;
    }
    setAuthInfo(`Verification email sent to ${target}.`);
  }

  /**
   * Step 1 of the forgot-password flow: ask Supabase to email the user a
   * reset link. The success message is intentionally neutral ("If an account
   * exists…") to avoid leaking whether the email is registered. Supabase
   * already returns success regardless, but UI-side wording matters too.
   */
  async function handleForgotPassword() {
    setAuthError(null);
    setAuthInfo(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setAuthError('Please enter your email.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedEmail)) {
      setAuthError('That email address looks invalid.');
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo: getEmailRedirectTo(),
    });
    setBusy(false);

    if (error) {
      setAuthError(prettyAuthError(error.message));
      return;
    }
    // Clear any hash-error banner now that we've taken action.
    onRecoveryHashErrorAcknowledged?.();
    setAuthInfo(
      `If an account exists for ${trimmedEmail}, we sent a reset link. Check your inbox.`
    );
  }

  /**
   * Step 2 of the forgot-password flow OR the proactive change flow (called
   * after re-auth succeeds): update the password on the active session.
   * Supabase requires a valid session for this — recovery links create one
   * automatically; for proactive change, the user is already signed in.
   */
  async function handleUpdatePassword() {
    setAuthError(null);
    setAuthInfo(null);

    if (newPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setBusy(false);

    if (error) {
      setAuthError(prettyAuthError(error.message));
      return;
    }
    // Success: clear sensitive fields and signal the recovery flag in App so
    // the next render no longer forces 'reset-password' mode.
    setNewPassword('');
    setConfirmNewPassword('');
    setCurrentPassword('');
    setAuthInfo('Password updated.');
    onRecoveryComplete?.();
    // For the recovery flow, the user now has a normal verified session and
    // will see the Account view on next render. For proactive change, the
    // form collapses and the Account view stays as-is.
    setShowChangePasswordForm(false);
  }

  /**
   * Proactive change from the Account view. Re-auths the user with the
   * current password BEFORE calling updateUser — otherwise a few seconds at
   * an unlocked laptop is enough for anyone to take over the account.
   */
  async function handleProactiveChangePassword() {
    setAuthError(null);
    setAuthInfo(null);

    if (!user?.email) {
      setAuthError('Sign in again to change your password.');
      return;
    }
    if (!currentPassword) {
      setAuthError('Enter your current password to confirm.');
      return;
    }
    if (newPassword.length < 6) {
      setAuthError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setAuthError('New passwords do not match.');
      return;
    }
    if (newPassword === currentPassword) {
      setAuthError('Pick a different password from your current one.');
      return;
    }

    setBusy(true);
    // Re-auth gate: if this fails, we never even attempt the password change.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (signInError) {
      setBusy(false);
      setAuthError(prettyAuthError(signInError.message));
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setBusy(false);

    if (updateError) {
      setAuthError(prettyAuthError(updateError.message));
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setAuthInfo('Password updated.');
    setShowChangePasswordForm(false);
  }

  // -------------------------------------------------------------------------
  // Save-current-army
  // -------------------------------------------------------------------------

  async function handleConfirmSave() {
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
    if (!onSaveArmy) return;

    setSavingArmy(true);
    try {
      await onSaveArmy(trimmed);
      // Only clear the form on success — leaving the typed name in place
      // when save fails saves the user from retyping after fixing whatever
      // the error was.
      setSavingName('');
      setShowSaveForm(false);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Could not save the army. Try again.'
      );
    } finally {
      setSavingArmy(false);
    }
  }

  // -------------------------------------------------------------------------
  // Delete-saved-army
  // -------------------------------------------------------------------------

  async function handleDeleteArmyClick(armyId: string) {
    if (!onDeleteArmy || deletingArmyId) return;
    setDeletingArmyId(armyId);
    setSaveError(null);
    try {
      await onDeleteArmy(armyId);
    } catch (err) {
      // Surface in the same saveError slot — it's right next to where the
      // army list is, so the user sees it without a layout shift.
      setSaveError(
        err instanceof Error ? err.message : 'Could not delete the army. Try again.'
      );
    } finally {
      setDeletingArmyId(null);
    }
  }

  function handleCancel() {
    clearAuthForm();
    onClose();
  }

  // While a recovery session is active, force the modal into reset-password
  // mode regardless of what the user clicked. Keep raw `mode` writable for
  // when recovery completes (then `effectiveMode` falls back to it).
  const effectiveMode: AuthMode = isRecoveringPassword ? 'reset-password' : mode;

  // Title text reflects the current state of the modal so the user always
  // knows what they're looking at.
  const titleText = (() => {
    if (isRecoveringPassword) return 'Set New Password';
    if (user) return 'Account';
    if (effectiveMode === 'register') return 'Create Account';
    if (effectiveMode === 'check-email') return 'Check Your Email';
    if (effectiveMode === 'forgot-password') return 'Reset Password';
    if (effectiveMode === 'reset-password') return 'Set New Password';
    return 'Sign In';
  })();

  const canSaveCurrent =
    !!user &&
    user.emailVerified &&
    !!currentArmyJson &&
    !!onSaveArmy &&
    savedArmies.length < MAX_SAVED_ARMIES;

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
              <Text style={[styles.title, { fontSize: titleFontSize }]}>{titleText}</Text>
              <TouchableOpacity
                onPress={handleCancel}
                style={styles.closeButton}
                accessibilityLabel="Close"
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.body}>
              {isRecoveringPassword ? (
                // ============================================================
                // PASSWORD RECOVERY (set new password after clicking reset link)
                // ============================================================
                // Forces in regardless of underlying user state. App also gates
                // saved-army / customization fetching off while this is true so
                // nothing leaks into the recovery session.
                <>
                  <View style={styles.verifyBanner}>
                    <Text style={styles.verifyBannerTitle}>You're recovering your account</Text>
                    <Text style={styles.verifyBannerText}>
                      Set a new password to continue. After saving, you'll be signed in
                      and can manage your armies as usual.
                    </Text>
                  </View>

                  <Text style={[styles.label, { marginTop: 14 }]}>New password</Text>
                  <TextInput
                    style={styles.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="At least 6 characters"
                    placeholderTextColor="#7A8BA4"
                    secureTextEntry
                    autoComplete="new-password"
                    selectionColor={CARET_COLOR}
                  />

                  <Text style={styles.label}>Confirm new password</Text>
                  <TextInput
                    style={styles.input}
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    placeholder="Type it again"
                    placeholderTextColor="#7A8BA4"
                    secureTextEntry
                    autoComplete="new-password"
                    onSubmitEditing={handleUpdatePassword}
                    selectionColor={CARET_COLOR}
                  />

                  {authError ? (
                    <Text style={styles.errorText} accessibilityRole="alert">
                      {authError}
                    </Text>
                  ) : null}
                  {authInfo ? <Text style={styles.infoText}>{authInfo}</Text> : null}

                  <View style={styles.actions}>
                    <Button
                      label={busy ? 'Saving…' : 'Save new password'}
                      onPress={handleUpdatePassword}
                      variant="primary"
                      disabled={busy}
                    />
                  </View>
                </>
              ) : user ? (
                // ============================================================
                // SIGNED IN
                // ============================================================
                <>
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
                    {user.emailVerified ? (
                      <Text style={styles.verifiedBadge}>✓ Verified</Text>
                    ) : null}
                  </View>

                  <View style={styles.divider} />

                  {user.emailVerified ? (
                    // ----- Verified: multiplayer identity + saved-army management -----
                    <>
                      {/* Multiplayer handle — username for challenges. */}
                      <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Multiplayer</Text>
                        {profile ? (
                          <View style={styles.usernameRow}>
                            <Text style={styles.usernameHandle}>@{profile.username}</Text>
                            <Text style={styles.usernameMeta}>
                              Other players can challenge you with this handle.
                            </Text>
                          </View>
                        ) : (
                          <>
                            <Text style={styles.emptyHint}>
                              Choose a username so other players can challenge you to a war room.
                            </Text>
                            {onChooseUsername ? (
                              <TouchableOpacity
                                style={styles.saveCurrentBtn}
                                onPress={onChooseUsername}
                                activeOpacity={0.7}
                              >
                                <Text style={styles.saveCurrentText}>Choose username</Text>
                              </TouchableOpacity>
                            ) : null}
                          </>
                        )}
                      </View>

                      <View style={styles.divider} />

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
                          savedArmies.map((army) => {
                            const isDeleting = deletingArmyId === army.id;
                            return (
                              <View
                                key={army.id}
                                style={[styles.armyRow, isDeleting && styles.armyRowFading]}
                              >
                                <TouchableOpacity
                                  style={styles.armyLoadTarget}
                                  onPress={() => onLoadSavedArmy?.(army)}
                                  disabled={isDeleting}
                                  accessibilityLabel={`Load army ${army.name}`}
                                  activeOpacity={0.7}
                                >
                                  <Text style={styles.armyIcon}>⚔️</Text>
                                  <View style={styles.armyTextWrapper}>
                                    <Text style={styles.armyName} numberOfLines={1}>
                                      {army.name}
                                    </Text>
                                    <Text style={styles.armyMeta}>
                                      {isDeleting ? 'Deleting…' : 'Tap to load'}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                                {onDeleteArmy ? (
                                  <TouchableOpacity
                                    style={styles.armyDeleteBtn}
                                    onPress={() => handleDeleteArmyClick(army.id)}
                                    disabled={isDeleting || !!deletingArmyId}
                                    accessibilityLabel={`Delete army ${army.name}`}
                                    activeOpacity={0.6}
                                  >
                                    <Text style={styles.armyDeleteText}>×</Text>
                                  </TouchableOpacity>
                                ) : null}
                              </View>
                            );
                          })
                        )}

                        {/* Save / delete errors surface here so they're visible
                            regardless of whether the save form is open. */}
                        {saveError ? (
                          <Text style={styles.errorText} accessibilityRole="alert">
                            {saveError}
                          </Text>
                        ) : null}

                        {canSaveCurrent && !showSaveForm ? (
                          <TouchableOpacity
                            style={styles.saveCurrentBtn}
                            onPress={() => {
                              setShowSaveForm(true);
                              setSaveError(null);
                            }}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.saveCurrentText}>+ Save current army</Text>
                          </TouchableOpacity>
                        ) : null}
                        {canSaveCurrent && showSaveForm ? (
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
                              editable={!savingArmy}
                              onSubmitEditing={handleConfirmSave}
                              selectionColor={CARET_COLOR}
                            />
                            <View style={styles.saveActions}>
                              <Button
                                label="Cancel"
                                onPress={() => {
                                  setShowSaveForm(false);
                                  setSavingName('');
                                  setSaveError(null);
                                }}
                                variant="secondary"
                                disabled={savingArmy}
                                compact
                              />
                              <Button
                                label={savingArmy ? 'Saving…' : 'Save'}
                                onPress={handleConfirmSave}
                                variant="primary"
                                disabled={savingArmy}
                                compact
                              />
                            </View>
                          </View>
                        ) : null}

                        {!!user && !currentArmyJson && savedArmies.length < MAX_SAVED_ARMIES ? (
                          <Text style={styles.subtleHint}>
                            Load an army first to save it to your list.
                          </Text>
                        ) : null}
                      </View>
                    </>
                  ) : (
                    // ----- Unverified: gate the feature -----
                    <View style={styles.verifyBanner}>
                      <Text style={styles.verifyBannerTitle}>Verify your email to save armies</Text>
                      <Text style={styles.verifyBannerText}>
                        We sent a verification link to{' '}
                        <Text style={styles.verifyBannerEmail}>{user.email}</Text>. Click it to unlock
                        saved army lists.
                      </Text>
                      {authError ? <Text style={styles.errorText}>{authError}</Text> : null}
                      {authInfo ? <Text style={styles.infoText}>{authInfo}</Text> : null}
                      <View style={styles.verifyBannerActions}>
                        <Button
                          label={busy ? 'Sending…' : 'Resend verification email'}
                          onPress={handleResendVerification}
                          variant="primary"
                          disabled={busy}
                        />
                      </View>
                    </View>
                  )}

                  <View style={styles.divider} />

                  {/* ----- Change password (proactive) ----- */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Password</Text>
                    {showChangePasswordForm ? (
                      <>
                        <Text style={[styles.label, { marginTop: 6 }]}>Current password</Text>
                        <TextInput
                          style={styles.input}
                          value={currentPassword}
                          onChangeText={setCurrentPassword}
                          placeholder="Confirm your current password"
                          placeholderTextColor="#7A8BA4"
                          secureTextEntry
                          autoComplete="current-password"
                          editable={!busy}
                          selectionColor={CARET_COLOR}
                        />
                        <Text style={styles.label}>New password</Text>
                        <TextInput
                          style={styles.input}
                          value={newPassword}
                          onChangeText={setNewPassword}
                          placeholder="At least 6 characters"
                          placeholderTextColor="#7A8BA4"
                          secureTextEntry
                          autoComplete="new-password"
                          editable={!busy}
                          selectionColor={CARET_COLOR}
                        />
                        <Text style={styles.label}>Confirm new password</Text>
                        <TextInput
                          style={styles.input}
                          value={confirmNewPassword}
                          onChangeText={setConfirmNewPassword}
                          placeholder="Type it again"
                          placeholderTextColor="#7A8BA4"
                          secureTextEntry
                          autoComplete="new-password"
                          onSubmitEditing={handleProactiveChangePassword}
                          editable={!busy}
                          selectionColor={CARET_COLOR}
                        />
                        {authError ? (
                          <Text style={styles.errorText} accessibilityRole="alert">
                            {authError}
                          </Text>
                        ) : null}
                        {authInfo ? <Text style={styles.infoText}>{authInfo}</Text> : null}
                        <View style={styles.saveActions}>
                          <Button
                            label="Cancel"
                            onPress={() => {
                              setShowChangePasswordForm(false);
                              setCurrentPassword('');
                              setNewPassword('');
                              setConfirmNewPassword('');
                              setAuthError(null);
                              setAuthInfo(null);
                            }}
                            variant="secondary"
                            disabled={busy}
                            compact
                          />
                          <Button
                            label={busy ? 'Saving…' : 'Save'}
                            onPress={handleProactiveChangePassword}
                            variant="primary"
                            disabled={busy}
                            compact
                          />
                        </View>
                      </>
                    ) : (
                      <>
                        {/* Show the "Password updated" confirmation here too so users
                            see it without scrolling, in case they opened the form,
                            saved, and collapsed it. */}
                        {authInfo && !showChangePasswordForm ? (
                          <Text style={styles.infoText}>{authInfo}</Text>
                        ) : null}
                        <TouchableOpacity
                          style={styles.saveCurrentBtn}
                          onPress={() => {
                            setShowChangePasswordForm(true);
                            setAuthError(null);
                            setAuthInfo(null);
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.saveCurrentText}>Change password</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.actionsStacked}>
                    <Button
                      label={busy ? 'Signing out…' : 'Sign Out'}
                      onPress={handleSignOut}
                      variant="reset"
                      disabled={busy || showChangePasswordForm}
                    />
                  </View>
                </>
              ) : effectiveMode === 'check-email' ? (
                // ============================================================
                // JUST REGISTERED — waiting for email verification
                // ============================================================
                <View style={styles.checkEmailBox}>
                  <Text style={styles.checkEmailIcon}>📬</Text>
                  <Text style={styles.checkEmailTitle}>Verification email sent</Text>
                  <Text style={styles.checkEmailText}>
                    We sent a confirmation link to{' '}
                    <Text style={styles.signedInEmail}>{pendingEmail}</Text>. Click it to activate
                    your account, then come back here to sign in.
                  </Text>
                  {authError ? <Text style={styles.errorText}>{authError}</Text> : null}
                  {authInfo ? <Text style={styles.infoText}>{authInfo}</Text> : null}
                  <View style={styles.actionsStacked}>
                    <Button
                      label={busy ? 'Sending…' : 'Resend email'}
                      onPress={handleResendVerification}
                      variant="secondary"
                      disabled={busy}
                    />
                    <Button
                      label="Back to Sign In"
                      onPress={() => {
                        setMode('sign-in');
                        clearAuthForm();
                      }}
                      variant="primary"
                    />
                  </View>
                </View>
              ) : effectiveMode === 'forgot-password' ? (
                // ============================================================
                // FORGOT PASSWORD — collect email, trigger reset link
                // ============================================================
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
                    onSubmitEditing={handleForgotPassword}
                    editable={!busy}
                    selectionColor={CARET_COLOR}
                  />

                  {authError ? (
                    <Text style={styles.errorText} accessibilityRole="alert">
                      {authError}
                    </Text>
                  ) : null}
                  {authInfo ? <Text style={styles.infoText}>{authInfo}</Text> : null}

                  <View style={styles.actions}>
                    <Button
                      label="Back"
                      onPress={() => {
                        setMode('sign-in');
                        // Keep the email field so they don't retype if returning
                        setAuthError(null);
                        setAuthInfo(null);
                      }}
                      variant="secondary"
                      disabled={busy}
                      compact
                    />
                    <Button
                      label={busy ? 'Sending…' : 'Send reset link'}
                      onPress={handleForgotPassword}
                      variant="primary"
                      disabled={busy}
                      compact
                    />
                  </View>

                  <Text style={styles.hint}>
                    We'll email you a link to set a new password. The link expires after
                    an hour for security.
                  </Text>
                </>
              ) : (
                // ============================================================
                // SIGNED OUT — Sign In / Register tabs
                // ============================================================
                <>
                  <View style={styles.tabBar}>
                    <TouchableOpacity
                      style={[styles.tab, mode === 'sign-in' && styles.tabActive]}
                      onPress={() => {
                        setMode('sign-in');
                        setAuthError(null);
                        setAuthInfo(null);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[styles.tabText, mode === 'sign-in' && styles.tabTextActive]}
                      >
                        Sign In
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.tab, mode === 'register' && styles.tabActive]}
                      onPress={() => {
                        setMode('register');
                        setAuthError(null);
                        setAuthInfo(null);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[styles.tabText, mode === 'register' && styles.tabTextActive]}
                      >
                        Register
                      </Text>
                    </TouchableOpacity>
                  </View>

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
                    placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
                    placeholderTextColor="#7A8BA4"
                    secureTextEntry
                    autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                    onSubmitEditing={mode === 'register' ? undefined : handleSignIn}
                    selectionColor={CARET_COLOR}
                  />

                  {mode === 'register' ? (
                    <>
                      <Text style={styles.label}>Confirm password</Text>
                      <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Type it again"
                        placeholderTextColor="#7A8BA4"
                        secureTextEntry
                        autoComplete="new-password"
                        onSubmitEditing={handleRegister}
                        selectionColor={CARET_COLOR}
                      />
                    </>
                  ) : null}

                  {authError ? (
                    <Text style={styles.errorText} accessibilityRole="alert">
                      {authError}
                    </Text>
                  ) : null}
                  {authInfo ? <Text style={styles.infoText}>{authInfo}</Text> : null}

                  <View style={styles.actions}>
                    <Button label="Cancel" onPress={handleCancel} variant="secondary" compact />
                    {mode === 'register' ? (
                      <Button
                        label={busy ? 'Creating…' : 'Create Account'}
                        onPress={handleRegister}
                        variant="primary"
                        disabled={busy}
                        compact
                      />
                    ) : (
                      <Button
                        label={busy ? 'Signing in…' : 'Sign In'}
                        onPress={handleSignIn}
                        variant="primary"
                        disabled={busy}
                        compact
                      />
                    )}
                  </View>

                  {/* Forgot password? — only on the sign-in tab; the register
                      tab doesn't need it (no account to recover yet). */}
                  {mode === 'sign-in' ? (
                    <TouchableOpacity
                      onPress={() => {
                        setMode('forgot-password');
                        // Preserve the email if they typed it on sign-in already.
                        setPassword('');
                        setAuthError(null);
                        setAuthInfo(null);
                      }}
                      style={styles.forgotLink}
                      activeOpacity={0.7}
                      accessibilityRole="link"
                    >
                      <Text style={styles.forgotLinkText}>Forgot password?</Text>
                    </TouchableOpacity>
                  ) : null}

                  <Text style={styles.hint}>
                    {mode === 'register'
                      ? "We'll email you a verification link before you can save armies."
                      : "Don't have an account? Tap Register above."}
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
  bodyScroll: {},
  body: {
    padding: 20,
  },

  // ----- Sign In / Register tab bar -----
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#101725',
    borderRadius: radii.md,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radii.sm,
  },
  tabActive: {
    backgroundColor: '#22324A',
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.textPrimary,
  },

  // ----- Form -----
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
    // Web-only: caret-color goes through the style prop
    caretColor: CARET_COLOR,
  } as any,

  errorText: {
    color: '#FF8B8B',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 4,
  },
  infoText: {
    color: '#7FE7C8',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 4,
  },
  hint: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  forgotLink: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 4,
  },
  forgotLinkText: {
    color: '#5BA9FF',
    fontSize: 13,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 14,
  },
  actionsStacked: {
    gap: 10,
    marginTop: 14,
  },

  // ----- Signed-in identity -----
  signedInBox: {
    alignItems: 'center',
    gap: 6,
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#22324A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  avatarLargeText: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '700',
  },
  signedInLabel: {
    color: colors.textDim,
    fontSize: 12,
  },
  signedInEmail: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    maxWidth: '100%',
  },
  verifiedBadge: {
    color: '#7FE7C8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: '#22324A',
    marginVertical: 16,
  },

  // ----- Sections (Army Lists header) -----
  section: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  sectionCount: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyHint: {
    color: colors.textDim,
    fontSize: 13,
    fontStyle: 'italic',
    paddingVertical: 6,
  },
  usernameRow: {
    paddingVertical: 4,
  },
  usernameHandle: {
    color: '#5BA9FF',
    fontSize: 18,
    fontWeight: '700',
  },
  usernameMeta: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  subtleHint: {
    color: colors.textDim,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 6,
    textAlign: 'center',
  },

  // ----- Saved army rows -----
  armyRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#101725',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#22324A',
    overflow: 'hidden',
  },
  armyRowFading: {
    opacity: 0.5,
  },
  armyLoadTarget: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
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
    fontWeight: '600',
  },
  armyMeta: {
    color: colors.textDim,
    fontSize: 11,
    marginTop: 1,
  },
  armyDeleteBtn: {
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#22324A',
  },
  armyDeleteText: {
    color: '#FF8B8B',
    fontSize: 22,
    fontWeight: '700',
  },

  // ----- Save current army form -----
  saveCurrentBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#101725',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#22324A',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  saveCurrentText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  saveForm: {
    gap: 6,
  },
  saveActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },

  // ----- Verify-email banner (signed-in but unverified) -----
  verifyBanner: {
    backgroundColor: '#1F2A4A',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#3D4F7F',
    padding: 14,
    gap: 8,
  },
  verifyBannerTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  verifyBannerText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  verifyBannerEmail: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  verifyBannerActions: {
    marginTop: 6,
  },

  // ----- Check-email confirmation (post-register) -----
  checkEmailBox: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  checkEmailIcon: {
    fontSize: 48,
  },
  checkEmailTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  checkEmailText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
});
