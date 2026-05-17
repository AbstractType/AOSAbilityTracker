import React, { useState, useCallback } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import LandingScreen from './src/screens/LandingScreen';
import AbilityTrackerScreen from './src/screens/AbilityTrackerScreen';
import LoginModal from './src/components/organisms/LoginModal';
import { StatusBar } from 'expo-status-bar';
import type { Ability } from './src/types';
import { parseAbilitiesFromJSON, type Wizard, type Priest } from './src/utils/jsonParser';
import type { User } from './src/types/user';
import type { SavedArmy } from './src/types/army';
import { MAX_SAVED_ARMIES } from './src/types/army';
import {
  getSavedArmies,
  persistSavedArmies,
  makeArmyId,
} from './src/utils/savedArmies';

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

  // Global user/auth state — kept at the App root so it survives screen changes
  // and so the LoginModal can be opened from any view.
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  /** The signed-in user's saved army list (loaded from storage on sign-in) */
  const [savedArmies, setSavedArmies] = useState<SavedArmy[]>([]);

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

  function handleLogin(loggedInUser: User) {
    setUser(loggedInUser);
    // Pull the user's saved armies from storage so they're available immediately
    setSavedArmies(getSavedArmies(loggedInUser.email));
    setShowLoginModal(false);
  }

  function handleLogout() {
    setUser(null);
    setSavedArmies([]);
    setShowLoginModal(false);
  }

  function handleSaveArmy(name: string) {
    if (!user || !currentArmyJson) return;
    if (savedArmies.length >= MAX_SAVED_ARMIES) return;
    const next: SavedArmy[] = [
      ...savedArmies,
      {
        id: makeArmyId(),
        name,
        json: currentArmyJson,
        createdAt: Date.now(),
      },
    ];
    setSavedArmies(next);
    persistSavedArmies(user.email, next);
  }

  function handleDeleteArmy(armyId: string) {
    if (!user) return;
    const next = savedArmies.filter(a => a.id !== armyId);
    setSavedArmies(next);
    persistSavedArmies(user.email, next);
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
        />
      )}

      {/* Global login modal — mounted once at App root so it's accessible from any screen */}
      <LoginModal
        visible={showLoginModal}
        user={user}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onLogout={handleLogout}
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
