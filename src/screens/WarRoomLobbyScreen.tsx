import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Button from '../components/atoms/Button';
import SavedArmyPicker from '../components/molecules/SavedArmyPicker';
import { colors, radii } from '../theme/tokens';
import { useResponsive, getContentMaxWidth } from '../utils/responsive';
import { searchUsers } from '../utils/profiles';
import {
  createChallenge,
  createLinkChallenge,
  createEmailChallenge,
  buildInviteUrl,
  getMyChallenges,
  cancelChallenge,
} from '../utils/challenges';
import type { Profile } from '../types/profile';
import type { SavedArmy } from '../types/army';
import type { Challenge } from '../types/warRoom';

const CARET_COLOR = '#5BA9FF';

interface WarRoomLobbyScreenProps {
  /** The current user's profile (their handle is attached to challenges). */
  profile: Profile;
  /** The current user's saved armies (to choose which to challenge with). */
  savedArmies: SavedArmy[];
  /** Current user id, to identify outgoing challenges. */
  userId: string;
  /** Back to the previous screen. */
  onBack: () => void;
  /**
   * Enter a war room. Called when a challenge we sent this session is accepted
   * — detected by polling, so the challenger reliably joins even if the
   * realtime UPDATE that App also listens for never arrives.
   */
  onEnterRoom: (roomId: string, opponentLabel?: string) => void;
}

/**
 * WarRoomLobbyScreen — find an opponent by username, pick the army you'll
 * bring, and send a challenge. Also lists your pending outgoing challenges so
 * you can cancel them. When an opponent accepts, the App-root realtime handler
 * pulls you into the room (this screen doesn't need to watch for that).
 */
export default function WarRoomLobbyScreen({
  profile,
  savedArmies,
  userId,
  onBack,
  onEnterRoom,
}: WarRoomLobbyScreenProps) {
  const { width, select } = useResponsive();
  const contentMaxWidth = Math.min(getContentMaxWidth(width), 640);
  const padding = select({ mobile: 16, default: 24 });

  // Opponent search
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [searching, setSearching] = useState(false);
  const [opponent, setOpponent] = useState<Profile | null>(null);
  const searchSeq = useRef(0);

  // Challenges sent THIS session (id → opponent label, if known), so the poll
  // below can pull us into the room the moment one is accepted — independent of
  // the best-effort realtime UPDATE the App also listens for.
  const sentChallenges = useRef<Map<string, string | undefined>>(new Map());

  // Army selection + send
  const [selectedArmyId, setSelectedArmyId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sentNotice, setSentNotice] = useState<string | null>(null);

  // Shareable invite link
  const [creatingLink, setCreatingLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Email invite
  const [emailInput, setEmailInput] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailNotice, setEmailNotice] = useState<string | null>(null);

  // Outgoing challenges (raw 'pending' rows from the server) + a 1s clock so
  // countdowns tick and a challenge drops out of "active" the moment it lapses.
  const [outgoingRaw, setOutgoingRaw] = useState<Challenge[]>([]);
  const [nowMs, setNowMs] = useState(Date.now());

  async function refreshOutgoing() {
    const all = await getMyChallenges();
    // Did a challenge we sent this session get accepted? Jump into the room.
    // This is the reliable path in — the App's realtime listener is only a
    // faster best-effort shortcut. Safe to call repeatedly: entering unmounts
    // this screen (stopping the poll), and enterRoom is idempotent, so a
    // transient getRoom miss simply retries on the next tick.
    const accepted = all.find(
      (c) => c.status === 'accepted' && c.roomId && sentChallenges.current.has(c.id)
    );
    if (accepted?.roomId) {
      onEnterRoom(accepted.roomId, sentChallenges.current.get(accepted.id));
      return;
    }
    setOutgoingRaw(all.filter((c) => c.challengerId === userId && c.status === 'pending'));
  }

  // A challenge is only "active" while pending AND not past its expiry. Derived
  // from nowMs so the gate releases instantly when the timer runs out.
  const activeOutgoing = outgoingRaw.filter((c) => c.expiresAt > nowMs);
  const pending = activeOutgoing[0] ?? null;
  const hasPending = !!pending;

  useEffect(() => {
    refreshOutgoing();
    // 1s clock for the countdown + lapse detection.
    const clock = setInterval(() => setNowMs(Date.now()), 1000);
    // Poll so an opponent's accept/decline (and server-side expiry) reflect here.
    const poll = setInterval(refreshOutgoing, 3000);
    return () => {
      clearInterval(clock);
      clearInterval(poll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search as the user types (guarded to 2+ chars by searchUsers). A sequence
  // counter discards out-of-order responses.
  function handleQueryChange(text: string) {
    setQuery(text);
    setOpponent(null);
    const seq = ++searchSeq.current;
    if (text.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    searchUsers(text).then((found) => {
      if (seq !== searchSeq.current) return; // stale
      setResults(found);
      setSearching(false);
    });
  }

  const selectedArmy = savedArmies.find((a) => a.id === selectedArmyId) ?? null;
  const canSend = !!opponent && !!selectedArmy && !sending && !hasPending;

  async function handleSend() {
    if (!opponent || !selectedArmy) return;
    const oppUsername = opponent.username;
    setSending(true);
    setSendError(null);
    setSentNotice(null);
    try {
      const ch = await createChallenge({
        opponentId: opponent.userId,
        challengerUsername: profile.username,
        armyJson: selectedArmy.json,
      });
      sentChallenges.current.set(ch.id, oppUsername);
      setSentNotice(`Challenge sent to @${oppUsername}.`);
      setOpponent(null);
      setQuery('');
      setResults([]);
      setSelectedArmyId(null);
      refreshOutgoing();
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Could not send the challenge.');
    } finally {
      setSending(false);
    }
  }

  async function handleCancel(challenge: Challenge) {
    try {
      await cancelChallenge(challenge.id);
      refreshOutgoing();
    } catch {
      // Non-fatal; refresh will reconcile.
      refreshOutgoing();
    }
  }

  async function handleCreateLink() {
    if (!selectedArmy) return;
    setCreatingLink(true);
    setLinkError(null);
    setLinkUrl(null);
    setCopied(false);
    try {
      const challenge = await createLinkChallenge({
        challengerUsername: profile.username,
        armyJson: selectedArmy.json,
      });
      sentChallenges.current.set(challenge.id, undefined);
      setLinkUrl(buildInviteUrl(challenge.inviteToken));
      refreshOutgoing();
    } catch (err) {
      setLinkError(err instanceof Error ? err.message : 'Could not create the invite link.');
    } finally {
      setCreatingLink(false);
    }
  }

  async function handleEmailInvite() {
    const email = emailInput.trim().toLowerCase();
    if (!selectedArmy) return;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setEmailError('That email address looks invalid.');
      return;
    }
    setSendingEmail(true);
    setEmailError(null);
    setEmailNotice(null);
    try {
      const ch = await createEmailChallenge({
        challengerUsername: profile.username,
        opponentEmail: email,
        armyJson: selectedArmy.json,
      });
      sentChallenges.current.set(ch.id, undefined);
      setEmailNotice(`Invite emailed to ${email}.`);
      setEmailInput('');
      refreshOutgoing();
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'Could not send the email invite.');
    } finally {
      setSendingEmail(false);
    }
  }

  async function handleCopyLink() {
    if (!linkUrl) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(linkUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Clipboard blocked — the URL is shown for manual copy anyway.
    }
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { maxWidth: contentMaxWidth, paddingHorizontal: padding },
        ]}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.heading}>War Room</Text>
          <TouchableOpacity onPress={onBack} accessibilityLabel="Close war room lobby">
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subhead}>
          Challenge another player to compare armies in a shared room.
        </Text>

        {/* Active pending challenge — you can only have one at a time. */}
        {pending ? (
          <View style={styles.pendingBanner}>
            <View style={styles.pendingTextWrap}>
              <Text style={styles.pendingTitle}>Challenge pending</Text>
              <Text style={styles.pendingMeta}>
                {pending.opponentId
                  ? 'Waiting for a reply'
                  : 'Invite link active — waiting for someone to join'}
                {' · '}
                {formatRemaining(pending.expiresAt - nowMs)} left
              </Text>
            </View>
            <TouchableOpacity
              style={styles.pendingCancelBtn}
              onPress={() => handleCancel(pending)}
              activeOpacity={0.8}
            >
              <Text style={styles.pendingCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Find opponent */}
        <Text style={styles.sectionTitle}>1 · Find an opponent</Text>
        <View style={styles.searchRow}>
          <Text style={styles.at}>@</Text>
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={handleQueryChange}
            placeholder="search by username"
            placeholderTextColor="#7A8BA4"
            autoCapitalize="none"
            autoCorrect={false}
            selectionColor={CARET_COLOR}
          />
        </View>

        {opponent ? (
          <View style={styles.selectedOpponent}>
            <Text style={styles.selectedOpponentText}>
              Challenging @{opponent.username}
            </Text>
            <TouchableOpacity onPress={() => setOpponent(null)}>
              <Text style={styles.changeText}>change</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.results}>
            {searching ? (
              <Text style={styles.dim}>Searching…</Text>
            ) : query.trim().length >= 2 && results.length === 0 ? (
              <Text style={styles.dim}>No players found.</Text>
            ) : (
              results.map((u) => (
                <TouchableOpacity
                  key={u.userId}
                  style={styles.resultRow}
                  onPress={() => {
                    setOpponent(u);
                    setResults([]);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.resultHandle}>@{u.username}</Text>
                  {u.displayName ? (
                    <Text style={styles.resultName}>{u.displayName}</Text>
                  ) : null}
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* Pick army */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>2 · Choose your army</Text>
        <SavedArmyPicker
          armies={savedArmies}
          selectedId={selectedArmyId}
          onSelect={(army) => setSelectedArmyId(army.id)}
          emptyHint="No saved armies. Load an army and save it to your account first."
        />

        {/* Send */}
        {sendError ? <Text style={styles.errorText}>{sendError}</Text> : null}
        {sentNotice ? <Text style={styles.infoText}>{sentNotice}</Text> : null}
        <View style={styles.sendRow}>
          <Button
            label={sending ? 'Sending…' : 'Send challenge'}
            onPress={handleSend}
            variant="primary"
            disabled={!canSend}
          />
        </View>
        {hasPending ? (
          <Text style={styles.gateHint}>
            You have a pending challenge — cancel it above to send another.
          </Text>
        ) : null}

        {/* Or share a link (no specific opponent needed) */}
        <View style={styles.orDivider}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or share a link</Text>
          <View style={styles.orLine} />
        </View>
        <Text style={styles.linkBlurb}>
          Create an invite link to send via WhatsApp, Discord, etc. Whoever opens it can join
          with their own army.
        </Text>
        {linkError ? <Text style={styles.errorText}>{linkError}</Text> : null}
        {linkUrl ? (
          <View style={styles.linkBox}>
            <Text style={styles.linkUrl} numberOfLines={2} selectable>
              {linkUrl}
            </Text>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopyLink} activeOpacity={0.8}>
              <Text style={styles.copyBtnText}>{copied ? 'Copied!' : 'Copy link'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.sendRow}>
            <Button
              label={creatingLink ? 'Creating…' : 'Create invite link'}
              onPress={handleCreateLink}
              variant="secondary"
              disabled={!selectedArmy || creatingLink || hasPending}
            />
          </View>
        )}

        {/* Or invite by email */}
        <View style={styles.orDivider}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or invite by email</Text>
          <View style={styles.orLine} />
        </View>
        <Text style={styles.linkBlurb}>
          We'll email them the join link. They sign in, pick an army, and join.
        </Text>
        <View style={styles.searchRow}>
          <TextInput
            style={[styles.input, { paddingHorizontal: 12 }]}
            value={emailInput}
            onChangeText={(t) => {
              setEmailInput(t);
              setEmailError(null);
              setEmailNotice(null);
            }}
            placeholder="opponent@example.com"
            placeholderTextColor="#7A8BA4"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!sendingEmail && !hasPending}
            selectionColor={CARET_COLOR}
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        {emailNotice ? <Text style={styles.infoText}>{emailNotice}</Text> : null}
        <View style={styles.sendRow}>
          <Button
            label={sendingEmail ? 'Sending…' : 'Send email invite'}
            onPress={handleEmailInvite}
            variant="secondary"
            disabled={!selectedArmy || !emailInput.trim() || sendingEmail || hasPending}
          />
        </View>
      </ScrollView>
    </View>
  );
}

/** Format a millisecond remaining-time as m:ss (clamped at 0:00). */
function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 20,
    paddingBottom: 48,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  closeText: {
    color: colors.textSecondary,
    fontSize: 24,
    fontWeight: '700',
  },
  subhead: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  searchRow: {
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
  },
  input: {
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 15,
    caretColor: CARET_COLOR,
  } as any,
  results: {
    marginTop: 8,
    gap: 6,
  },
  dim: {
    color: colors.textDim,
    fontSize: 13,
    fontStyle: 'italic',
    paddingVertical: 6,
  },
  resultRow: {
    backgroundColor: '#101725',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#22324A',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  resultHandle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  resultName: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 1,
  },
  selectedOpponent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(63, 102, 214, 0.12)',
    borderColor: '#3F66D6',
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  selectedOpponentText: {
    color: '#9DBDFF',
    fontSize: 14,
    fontWeight: '700',
  },
  changeText: {
    color: colors.textDim,
    fontSize: 13,
  },
  errorText: {
    color: '#FF8B8B',
    fontSize: 13,
    marginTop: 12,
  },
  infoText: {
    color: '#7FE7C8',
    fontSize: 13,
    marginTop: 12,
  },
  sendRow: {
    marginTop: 16,
    alignItems: 'flex-start',
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 24,
    marginBottom: 12,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#22324A',
  },
  orText: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  linkBlurb: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  linkBox: {
    backgroundColor: '#101725',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#3F66D6',
    padding: 12,
    gap: 10,
  },
  linkUrl: {
    color: '#9DBDFF',
    fontSize: 13,
  },
  copyBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#3F66D6',
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  copyBtnText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  gateHint: {
    color: colors.textDim,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
  },
  pendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1F2A4A',
    borderColor: '#3D4F7F',
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },
  pendingTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  pendingTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  pendingMeta: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  pendingCancelBtn: {
    backgroundColor: '#6F384F',
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pendingCancelText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
});
