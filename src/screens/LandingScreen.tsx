import React, { useState } from 'react';
import { Alert } from 'react-native';
import type { User } from '../types/user';
import LandingTemplate from '../components/templates/LandingTemplate';
import { exampleRoster } from '../data/exampleRoster';

interface LandingScreenProps {
  /**
   * Hands a raw JSON string up to the App, which parses it and (on success)
   * navigates to the tracker. Returns true on success so we can clear the form.
   */
  onLoadJson: (json: string) => boolean;
  /** Current signed-in user (used to render the user button in the header) */
  user: User | null;
  /** Open the global login modal */
  onOpenLogin: () => void;
}

/**
 * LandingScreen — entry page where the user pastes a BattleScribe roster JSON.
 * Acts as a thin controller that wires user actions to the LandingTemplate.
 */
export default function LandingScreen({
  onLoadJson,
  user,
  onOpenLogin,
}: LandingScreenProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);

  function handleLoadJSON() {
    if (!jsonInput.trim()) {
      Alert.alert('Error', 'Please paste JSON data first');
      return;
    }
    setLoading(true);
    try {
      const ok = onLoadJson(jsonInput);
      if (ok) {
        setJsonInput('');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleLoadExample() {
    setJsonInput(JSON.stringify(exampleRoster, null, 2));
  }

  /**
   * Load roster text that came from a file (drag-drop or the file picker).
   * Unlike the paste flow, we have the text in hand, so we hand it straight to
   * the App's string-based loader rather than routing through `jsonInput` state
   * (which updates async and would otherwise be parsed stale). We still mirror
   * it into the box so a failed parse leaves the content visible to fix.
   */
  function handleLoadFromText(text: string) {
    if (!text.trim()) {
      Alert.alert('Empty file', "That file didn't contain any text.");
      return;
    }
    setJsonInput(text);
    setLoading(true);
    try {
      const ok = onLoadJson(text);
      if (ok) {
        setJsonInput('');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <LandingTemplate
      jsonInput={jsonInput}
      loading={loading}
      onJsonInputChange={setJsonInput}
      onLoadJson={handleLoadJSON}
      onLoadFromText={handleLoadFromText}
      onLoadExample={handleLoadExample}
      user={user}
      onOpenLogin={onOpenLogin}
    />
  );
}
