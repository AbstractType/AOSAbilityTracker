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

  // Army selection + send
  const [selectedArmyId, setSelectedArmyId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sentNotice, setSentNotice] = useState<string | null>(null);

  // Outgoing challenges
  const [outgoing, setOutgoing] = useState<Challenge[]>([]);

  async function refreshOutgoing() {
    const all = await getMyChallenges();
    setOutgoing(
      all.filter((c) => c.challengerId === userId && c.status === 'pending')
    );
  }

  useEffect(() => {
    refreshOutgoing();
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
  const canSend = !!opponent && !!selectedArmy && !sending;

  async function handleSend() {
    if (!opponent || !selectedArmy) return;
    setSending(true);
    setSendError(null);
    setSentNotice(null);
    try {
      await createChallenge({
        opponentId: opponent.userId,
        challengerUsername: profile.username,
        armyJson: selectedArmy.json,
      });
      setSentNotice(`Challenge sent to @${opponent.username}.`);
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

        {/* Outgoing */}
        {outgoing.length > 0 ? (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Pending challenges</Text>
            {outgoing.map((c) => (
              <View key={c.id} style={styles.outgoingRow}>
                <Text style={styles.outgoingText} numberOfLines={1}>
                  Waiting for a reply…
                </Text>
                <TouchableOpacity onPress={() => handleCancel(c)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
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
  outgoingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#101725',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#22324A',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  outgoingText: {
    color: colors.textSecondary,
    fontSize: 13,
    flex: 1,
    minWidth: 0,
  },
  cancelText: {
    color: '#FF8B8B',
    fontSize: 13,
    fontWeight: '600',
  },
});
