import React, { useState, useCallback, useEffect } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import type { Session } from '@supabase/supabase-js';
import LandingScreen from './src/screens/LandingScreen';
import AbilityTrackerScreen from './src/screens/AbilityTrackerScreen';
import LoginModal from './src/components/organisms/LoginModal';
import { StatusBar } from 'expo-status-bar';
import type { Ability } from './src/types';
import { parseAbilitiesFromJSON, type Wizard, type Priest } from './src/utils/jsonParser';
import type { User } from './src/types/user';
import type { SavedArmy } from './src/types/army';
import type { Customization } from './src/types/customization';
import { supabase } from './src/lib/supabase';
import { getSavedArmies, saveArmy, deleteArmy } from './src/utils/savedArmies';
import { getAllCustomizations } from './src/utils/customizations';

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
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'tracker'>('landing');
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [wizards, setWizards] = useState<Wizard[]>([]);
  const [priests, setPriests] = useState<Priest[]>([]);
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

  // Subscribe to Supabase auth events: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED,
  // USER_UPDATED (the last one fires when email gets verified in another tab).
  // The listener is the single source of truth — every UI change flows through
  // it, so the avatar updates automatically when the user signs in from the
  // LoginModal or completes verification via a magic link.
  useEffect(() => {
    // Restore any existing session (returning visitor in the same browser).
    supabase.auth.getSession().then(({ data }) => {
      setUser(sessionToUser(data.session));
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(sessionToUser(session));
    });

    return () => data.subscription.unsubscribe();
  }, []);

  // Load saved armies + customizations whenever the verified user changes.
  // Verified-only: unverified users see the modal but the army list and
  // customization features are gated, so there's no point fetching for them.
  // Signing out clears both immediately.
  useEffect(() => {
    let cancelled = false;
    if (user?.emailVerified) {
      // Fetch both in parallel — they're independent and we don't want the
      // slower one to delay the other appearing.
      Promise.all([getSavedArmies(), getAllCustomizations()]).then(
        ([armies, customs]) => {
          if (cancelled) return;
          setSavedArmies(armies);
          setCustomizations(customs);
        }
      );
    } else {
      setSavedArmies([]);
      setCustomizations(new Map());
    }
    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.emailVerified]);

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

  return (
    <SafeAreaView style={styles.container}>
      {currentScreen === 'landing' ? (
        <LandingScreen
          onLoadJson={loadAbilitiesFromJson}
          user={user}
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
          onAbilitiesChange={setAbilities}
          onBack={handleBackToHome}
          user={user}
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
