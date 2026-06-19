import React, { useState, useCallback, useEffect } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import type { Session } from '@supabase/supabase-js';
import LandingScreen from './src/screens/LandingScreen';
import AbilityTrackerScreen from './src/screens/AbilityTrackerScreen';
import WarRoomLobbyScreen from './src/screens/WarRoomLobbyScreen';
import WarRoomScreen from './src/screens/WarRoomScreen';
import StatsScreen from './src/screens/StatsScreen';
import LoginModal from './src/components/organisms/LoginModal';
import IncomingChallengeModal from './src/components/organisms/IncomingChallengeModal';
import JoinByLinkModal from './src/components/organisms/JoinByLinkModal';
import { StatusBar } from 'expo-status-bar';
import type { Ability } from './src/types';
import { parseAbilitiesFromJSON, type Wizard, type Priest } from './src/utils/jsonParser';
import type { User } from './src/types/user';
import type { SavedArmy } from './src/types/army';
import type { Customization } from './src/types/customization';
import type { Unit } from './src/types/unit';
import type { Profile } from './src/types/profile';
import { supabase } from './src/lib/supabase';
import { getSavedArmies, saveArmy, deleteArmy } from './src/utils/savedArmies';
import { getAllCustomizations } from './src/utils/customizations';
import { getMyProfile } from './src/utils/profiles';
import UsernamePromptModal from './src/components/organisms/UsernamePromptModal';
import type { Challenge, WarRoom } from './src/types/warRoom';
import { rowToChallenge } from './src/utils/challenges';
import { acceptChallenge, declineChallenge, claimInvite } from './src/utils/challenges';
import { getRoom } from './src/utils/warRoom';
import { registerPwa } from './src/lib/pwa';

/** localStorage key for an invite token awaiting a join (survives the
 *  sign-in / email-verification reload round trip). */
const INVITE_STORAGE_KEY = 'aos-pending-invite';

// ---------------------------------------------------------------------------
// React Native Web dev-warning filter
// ---------------------------------------------------------------------------
// React Native Web emits "Unexpected text node: . A text node cannot be a child
// of a <View>." warnings during development when an empty string (or whitespace)
// briefly appears as a child of a View during reconciliation. The rendered DOM
// is correct and we have audited all of our `{cond && <X />}` patterns to use
// ternaries that fall back to `null`. The remaining warnings come from React
// Native Web's own internals when rendering certain Text/View compositions and
// they don't affect production builds. Filter them out so the dev console is
// usable.
if (typeof console !== 'undefined' && typeof console.error === 'function') {
  const _origError = console.error;
  console.error = function (...args: any[]) {
    const first = args[0];
    if (typeof first === 'string' && first.includes('Unexpected text node')) {
      return;
    }
    return _origError.apply(console, args);
  };
}

/** Project a Supabase session into our slimmer User shape (or null). */
function sessionToUser(session: Session | null): User | null {
  if (!session?.user) return null;
  return {
    id: session.user.id,
    email: session.user.email ?? '',
    // Supabase sets email_confirmed_at on the user record once the magic link
    // has been clicked. We use this exact field as the gate for saving armies.
    emailVerified: !!session.user.email_confirmed_at,
  };
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    'landing' | 'tracker' | 'lobby' | 'warroom' | 'stats'
  >('landing');
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [wizards, setWizards] = useState<Wizard[]>([]);
  const [priests, setPriests] = useState<Priest[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  /** Raw JSON of whatever army is currently loaded, kept so we can save it later */
  const [currentArmyJson, setCurrentArmyJson] = useState<string | null>(null);
  /**
   * Increments every time a NEW army is loaded (whether from the JSON input or
   * from a saved army). Used as React's `key` on AbilityTrackerScreen so that
   * loading a different army forces the screen to remount — resetting per-game
   * state like `deploymentComplete` and `activePhase`. Without this, a user who
   * completed deployment on Army A and then loaded Army B would still have the
   * Deployment Phase hidden for Army B.
   */
  const [armyLoadCount, setArmyLoadCount] = useState(0);

  // ---- Auth state, driven by Supabase ----
  // `user` is derived from the Supabase session. It's null while the session is
  // being restored on initial load AND when the user is genuinely signed out;
  // the UI treats both cases the same way (show Sign In affordances).
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  /** Saved armies for the current user. Empty when signed out OR unverified. */
  const [savedArmies, setSavedArmies] = useState<SavedArmy[]>([]);
  /**
   * Per-ability customizations (notes/hide/sort_order) for the current user,
   * keyed by `name|source`. Empty when signed out or unverified. The screen
   * mutates this via the setter — App keeps it as the single source of truth
   * but doesn't itself perform writes (those happen in utils/customizations).
   */
  const [customizations, setCustomizations] = useState<Map<string, Customization>>(
    () => new Map()
  );
  /**
   * True when the user clicked a Supabase password-recovery link and is in
   * the middle of setting a new password. While true:
   *   - The data-loading effect below is suppressed (no leaking saved armies
   *     or customizations into the temporary recovery session).
   *   - LoginModal forces 'reset-password' mode regardless of underlying state.
   *   - LandingScreen / AbilityTrackerScreen treat us as signed-out for
   *     navigation purposes (no avatar, no auto-loaded armies in the header).
   *
   * Cleared by LoginModal's onRecoveryComplete callback once updateUser succeeds.
   */
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
  /**
   * Error parsed from the URL hash on initial page load (e.g., "otp_expired"
   * if the recovery link timed out). Passed to LoginModal so it can show the
   * message in the forgot-password panel and let the user request a new link.
   */
  const [recoveryHashError, setRecoveryHashError] = useState<string | null>(null);
  /**
   * The verified user's multiplayer profile (username), or null if they haven't
   * chosen one yet. Loaded alongside saved armies. Drives the "choose a
   * username" prompt and (in later phases) challenge-by-handle.
   */
  const [profile, setProfile] = useState<Profile | null>(null);
  /** Whether the username-claim modal is open. */
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  // ---- War room ----
  /** An incoming challenge to show in the accept/decline modal, or null. */
  const [incomingChallenge, setIncomingChallenge] = useState<Challenge | null>(null);
  /** The war room the user is currently in (drives the 'warroom' screen). */
  const [currentRoom, setCurrentRoom] = useState<WarRoom | null>(null);
  /** Opponent's handle to label their side in the room, when known. */
  const [roomOpponentLabel, setRoomOpponentLabel] = useState<string | undefined>(undefined);
  /** Invite token from a ?challenge= link, pending a join (null when none). */
  const [pendingInviteToken, setPendingInviteToken] = useState<string | null>(null);
  /** Whether the join-by-link modal is open. */
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Subscribe to Supabase auth events: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED,
  // USER_UPDATED (fires when email gets verified in another tab), and
  // PASSWORD_RECOVERY (fires when the user lands here via a reset link).
  // The listener is the single source of truth — every UI change flows
  // through it, so the avatar updates automatically when the user signs in
  // from the LoginModal or completes verification via a magic link.
  // Install the PWA layer (manifest, theming meta, service worker) once on
  // mount. No-ops off web; idempotent. Kept separate from the auth effect so
  // a registration failure can never affect session restore.
  useEffect(() => {
    registerPwa();
  }, []);

  useEffect(() => {
    // ----- Invite-link parsing (query string, NOT the hash) -----
    // An invite link is `/?challenge=<token>`. We read the query synchronously
    // on first mount (before any await), persist the token to localStorage so
    // it survives the sign-in / email-verification reload, then strip it from
    // the URL. The query string is separate from Supabase's auth hash, so the
    // two never collide.
    if (typeof window !== 'undefined') {
      const qToken = new URLSearchParams(window.location.search).get('challenge');
      let stored: string | null = null;
      try {
        stored = window.localStorage.getItem(INVITE_STORAGE_KEY);
      } catch {
        stored = null;
      }
      const token = qToken || stored;
      if (qToken) {
        try {
          window.localStorage.setItem(INVITE_STORAGE_KEY, qToken);
        } catch {
          /* storage blocked — state still carries it for this session */
        }
        // Strip ?challenge from the URL (keep any hash for Supabase).
        window.history.replaceState(null, '', window.location.pathname + window.location.hash);
      }
      if (token) setPendingInviteToken(token);
    }

    // ----- URL-hash error parsing (must run before subscribing) -----
    // Supabase puts auth errors in the URL fragment when a token is invalid
    // or expired, e.g.:
    //   #error=access_denied&error_description=otp_expired&error_code=otp_expired
    // The SDK strips the hash after exchanging valid tokens, so we have to
    // check it ourselves on first load. We open the login modal in
    // forgot-password mode so the user can immediately request a new link.
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash;
      const params = new URLSearchParams(hash);
      const errorDesc = params.get('error_description');
      const errorCode = params.get('error_code');
      if (errorDesc || errorCode) {
        const friendly =
          errorCode === 'otp_expired' || errorDesc?.includes('expired')
            ? 'That reset link has expired. Request a new one below.'
            : errorDesc?.replace(/\+/g, ' ') ?? 'That reset link is no longer valid.';
        setRecoveryHashError(friendly);
        setShowLoginModal(true);
        // Wipe the hash so a page refresh doesn't re-show the same error.
        window.history.replaceState(null, '', window.location.pathname);
      }
    }

    // Restore any existing session (returning visitor in the same browser).
    supabase.auth.getSession().then(({ data }) => {
      setUser(sessionToUser(data.session));
    });

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      // PASSWORD_RECOVERY fires after INITIAL_SESSION on the recovery landing.
      // We MUST switch on event — checking only `session` here would be
      // indistinguishable from a normal SIGNED_IN and would leak saved armies
      // into the recovery session.
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveringPassword(true);
        setShowLoginModal(true);
      }
      setUser(sessionToUser(session));
    });

    return () => data.subscription.unsubscribe();
  }, []);

  // Load saved armies + customizations whenever the verified user changes.
  // Verified-only: unverified users see the modal but the army list and
  // customization features are gated, so there's no point fetching for them.
  //
  // CRITICAL: also gated on `!isRecoveringPassword`. During a recovery flow
  // the user has a temporary verified session whose sole purpose is to set
  // a new password. Fetching their data into that session would leak the
  // user's saved armies to anyone who clicks an intercepted reset link
  // (before they've proven control of the account by actually setting the
  // new password). Once recovery completes, the flag clears and this effect
  // re-runs to load the data normally.
  useEffect(() => {
    let cancelled = false;
    if (user?.emailVerified && !isRecoveringPassword) {
      // Fetch in parallel — all independent; don't let the slow one block.
      Promise.all([getSavedArmies(), getAllCustomizations(), getMyProfile()]).then(
        ([armies, customs, myProfile]) => {
          if (cancelled) return;
          setSavedArmies(armies);
          setCustomizations(customs);
          setProfile(myProfile);
        }
      );
    } else {
      setSavedArmies([]);
      setCustomizations(new Map());
      setProfile(null);
    }
    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.emailVerified, isRecoveringPassword]);

  /**
   * Fetch a war room and switch into it. Used both when WE accept a challenge
   * and when an opponent accepts OUR challenge (via the realtime UPDATE below).
   */
  const enterRoom = useCallback(async (roomId: string, opponentLabel?: string) => {
    const room = await getRoom(roomId);
    if (!room) return;
    setCurrentRoom(room);
    setRoomOpponentLabel(opponentLabel);
    setIncomingChallenge(null);
    setShowLoginModal(false);
    setCurrentScreen('warroom');
  }, []);

  // Incoming-challenge realtime. While signed in with a profile, listen for
  // challenges addressed to us (→ show the accept/decline modal) and for our
  // own sent challenges being accepted (→ jump into the room). RLS scopes the
  // changefeed to rows we're actually involved in, so no manual auth checks
  // beyond the id comparisons below are needed for security.
  useEffect(() => {
    if (!user?.emailVerified || isRecoveringPassword || !profile) return;
    const myId = user.id;

    const channel = supabase
      .channel('challenges-inbox')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'challenges' },
        (payload) => {
          const ch = rowToChallenge(payload.new as any);
          if (ch.opponentId === myId && ch.status === 'pending') {
            setIncomingChallenge(ch);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'challenges' },
        (payload) => {
          const ch = rowToChallenge(payload.new as any);
          // Our outgoing challenge was accepted → enter the room.
          if (ch.challengerId === myId && ch.status === 'accepted' && ch.roomId) {
            enterRoom(ch.roomId);
          }
          // An incoming challenge we were shown got resolved elsewhere → dismiss.
          if (ch.opponentId === myId && ch.status !== 'pending') {
            setIncomingChallenge((cur) => (cur && cur.id === ch.id ? null : cur));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, user?.emailVerified, isRecoveringPassword, profile?.userId, enterRoom]);

  // Pending invite link: once a token is present, either open the join modal
  // (verified user) or prompt sign-in (the token persists in localStorage
  // across the auth reload). Joining a link doesn't require a username.
  useEffect(() => {
    if (!pendingInviteToken || isRecoveringPassword) return;
    if (user?.emailVerified) {
      setShowJoinModal(true);
    } else {
      setShowLoginModal(true);
    }
  }, [pendingInviteToken, user?.emailVerified, isRecoveringPassword]);

  /**
   * Parses a roster JSON and loads it into the tracker. Used both by the
   * landing screen ("Load Abilities" button) and by tapping a saved army.
   * Returns true on success so callers can decide whether to navigate, close
   * dialogs, etc.
   */
  const loadAbilitiesFromJson = useCallback((json: string): boolean => {
    try {
      const parsed = parseAbilitiesFromJSON(json);
      if (parsed.abilities.length === 0) {
        Alert.alert(
          'No Abilities Found',
          'That JSON did not contain any valid Age of Sigmar abilities.'
        );
        return false;
      }
      setAbilities(parsed.abilities);
      setWizards(parsed.wizards);
      setPriests(parsed.priests);
      setUnits(parsed.units);
      setCurrentArmyJson(json);
      // Bump the load counter so the tracker remounts with fresh per-game state
      // (deploymentComplete, activePhase, etc.) for the new army.
      setArmyLoadCount(c => c + 1);
      setCurrentScreen('tracker');
      return true;
    } catch (err) {
      Alert.alert(
        'Error',
        `Failed to parse JSON: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
      return false;
    }
  }, []);

  function handleBackToHome() {
    setCurrentScreen('landing');
    setAbilities([]);
    setWizards([]);
    setPriests([]);
    setUnits([]);
    setCurrentArmyJson(null);
  }

  // ---- Saved-army handlers ----
  // LoginModal calls these to mutate the user's saved-army list. Each one
  // talks to Supabase, updates local state on success, and shows an Alert
  // on failure (the modal also surfaces inline errors for the save form).

  // NOTE: handleSaveArmy and handleDeleteArmy intentionally let errors
  // propagate to the caller (LoginModal) instead of catching with Alert.
  // Alert.alert() is a no-op in react-native-web, so anything it caught
  // would vanish silently. Callers surface errors in their own UI
  // (e.g. the saveError slot on the save form).
  async function handleSaveArmy(name: string) {
    if (!currentArmyJson) {
      throw new Error('No army is currently loaded.');
    }
    if (!user?.emailVerified) {
      throw new Error('Verify your email before saving armies.');
    }
    const saved = await saveArmy(name, currentArmyJson);
    // Prepend so the most-recently-saved army appears at the top, matching
    // the default `order by created_at desc` we use on fetch.
    setSavedArmies(prev => [saved, ...prev]);
  }

  async function handleDeleteArmy(armyId: string) {
    if (!user) {
      throw new Error('You need to be signed in to delete armies.');
    }
    await deleteArmy(armyId);
    setSavedArmies(prev => prev.filter(a => a.id !== armyId));
  }

  function handleLoadSavedArmy(army: SavedArmy) {
    const ok = loadAbilitiesFromJson(army.json);
    if (ok) setShowLoginModal(false);
  }

  // ---- War room handlers ----
  /** Accept an incoming challenge with the chosen army → create + enter room. */
  async function handleAcceptChallenge(challenge: Challenge, armyJson: string) {
    // Throws on failure; IncomingChallengeModal catches + surfaces it inline.
    const room = await acceptChallenge(challenge.id, armyJson);
    setCurrentRoom(room);
    setRoomOpponentLabel(challenge.challengerUsername);
    setIncomingChallenge(null);
    setCurrentScreen('warroom');
  }

  async function handleDeclineChallenge(challenge: Challenge) {
    await declineChallenge(challenge.id);
    setIncomingChallenge(null);
  }

  function handleLeaveRoom() {
    setCurrentRoom(null);
    setRoomOpponentLabel(undefined);
    setCurrentScreen('landing');
  }

  /** Open the war-room lobby (entry point from the Account modal). */
  function openLobby() {
    setShowLoginModal(false);
    setCurrentScreen('lobby');
  }

  /** Open the stats screen (entry point from the Account modal). */
  function openStats() {
    setShowLoginModal(false);
    setCurrentScreen('stats');
  }

  function clearPendingInvite() {
    setPendingInviteToken(null);
    setShowJoinModal(false);
    try {
      if (typeof window !== 'undefined') window.localStorage.removeItem(INVITE_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  /** Join a war room via an invite link with the chosen army. */
  async function handleJoinByLink(token: string, armyJson: string, challengerUsername: string) {
    // Throws on failure; JoinByLinkModal catches + surfaces it inline.
    const room = await claimInvite(token, armyJson);
    setCurrentRoom(room);
    setRoomOpponentLabel(challengerUsername);
    clearPendingInvite();
    setCurrentScreen('warroom');
  }

  // During recovery, screens see a "signed-out" user so the header / avatar
  // / etc. don't tease the saved-armies UI before the password is actually
  // reset. LoginModal still gets the real user so it can show which account
  // is being recovered.
  const screenUser = isRecoveringPassword ? null : user;

  return (
    <SafeAreaView style={styles.container}>
      {currentScreen === 'stats' && user ? (
        <StatsScreen savedArmies={savedArmies} onBack={() => setCurrentScreen('landing')} />
      ) : currentScreen === 'lobby' && profile && user ? (
        <WarRoomLobbyScreen
          profile={profile}
          savedArmies={savedArmies}
          userId={user.id}
          onBack={() => setCurrentScreen('landing')}
        />
      ) : currentScreen === 'warroom' && currentRoom && user ? (
        <WarRoomScreen
          room={currentRoom}
          userId={user.id}
          opponentLabel={roomOpponentLabel}
          onLeave={handleLeaveRoom}
        />
      ) : currentScreen === 'landing' ? (
        <LandingScreen
          onLoadJson={loadAbilitiesFromJson}
          user={screenUser}
          onOpenLogin={() => setShowLoginModal(true)}
        />
      ) : (
        <AbilityTrackerScreen
          // Remount the tracker (resets deploymentComplete, activePhase, etc.)
          // whenever a different army is loaded.
          key={armyLoadCount}
          abilities={abilities}
          wizards={wizards}
          priests={priests}
          units={units}
          onAbilitiesChange={setAbilities}
          onBack={handleBackToHome}
          user={screenUser}
          onOpenLogin={() => setShowLoginModal(true)}
          customizations={customizations}
          onCustomizationsChange={setCustomizations}
        />
      )}

      {/* Global login modal — mounted once at App root so it's accessible from any screen */}
      <LoginModal
        visible={showLoginModal}
        user={user}
        onClose={() => setShowLoginModal(false)}
        savedArmies={savedArmies}
        currentArmyJson={currentArmyJson}
        onSaveArmy={handleSaveArmy}
        onDeleteArmy={handleDeleteArmy}
        onLoadSavedArmy={handleLoadSavedArmy}
        isRecoveringPassword={isRecoveringPassword}
        onRecoveryComplete={() => setIsRecoveringPassword(false)}
        recoveryHashError={recoveryHashError}
        onRecoveryHashErrorAcknowledged={() => setRecoveryHashError(null)}
        profile={profile}
        onChooseUsername={() => {
          // Close the account modal and open the username claim on top of it.
          setShowLoginModal(false);
          setShowUsernamePrompt(true);
        }}
        // War-room entry: only when the user has claimed a username.
        onEnterWarRoom={profile ? openLobby : undefined}
        // Stats are available to any verified user who's played.
        onViewStats={openStats}
      />

      {/* Username claim — mounted at root so it can be opened from the account
          modal (Phase 1) and the war-room lobby gate (later phases). */}
      <UsernamePromptModal
        visible={showUsernamePrompt}
        onCreated={setProfile}
        onClose={() => setShowUsernamePrompt(false)}
      />

      {/* Incoming challenge — popped by the realtime inbox subscription. */}
      <IncomingChallengeModal
        visible={!!incomingChallenge}
        challenge={incomingChallenge}
        savedArmies={savedArmies}
        onAccept={handleAcceptChallenge}
        onDecline={handleDeclineChallenge}
        onClose={() => setIncomingChallenge(null)}
      />

      {/* Join-by-link — opened when the app is launched with a ?challenge= link. */}
      <JoinByLinkModal
        visible={showJoinModal && !!pendingInviteToken}
        token={pendingInviteToken}
        savedArmies={savedArmies}
        onJoin={handleJoinByLink}
        onClose={clearPendingInvite}
      />

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1220',
  },
});
