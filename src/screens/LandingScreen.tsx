import React, { useState } from 'react';
import type { User } from '../types/user';
import LandingTemplate from '../components/templates/LandingTemplate';
import { exampleRoster } from '../data/exampleRoster';
import { parseAbilitiesFromJSON } from '../utils/jsonParser';

interface LandingScreenProps {
  /**
   * Hands a raw JSON string up to the App, which parses it and (on success)
   * navigates to the tracker. Returns true on success. We only call this once
   * we've already confirmed the JSON yields abilities, so its own
   * failure path never fires from here.
   */
  onLoadJson: (json: string) => boolean;
  /** Current signed-in user (used to render the user button in the header) */
  user: User | null;
  /** Open the global login modal */
  onOpenLogin: () => void;
}

// A real BattleScribe roster is large and brace-wrapped. Use that as a cheap
// gate so typing/partial input doesn't trigger a parse on every keystroke —
// only attempt an auto-load once the box plausibly holds a whole roster.
const LOOKS_LIKE_ROSTER_MIN_LEN = 200;

/**
 * LandingScreen — entry page where the user provides a BattleScribe roster JSON
 * by dragging a file in, browsing for one, or pasting. There's no "load" button:
 * the moment the input is a valid roster (by any of those routes, or the example),
 * we load it and move straight to the tracker. Invalid input shows an inline hint
 * rather than a blocking alert, since there's no button to retry with.
 */
export default function LandingScreen({
  onLoadJson,
  user,
  onOpenLogin,
}: LandingScreenProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadHint, setLoadHint] = useState<string | null>(null);

  /**
   * Validate and (if it's a real roster) load + advance. Used by every input
   * route: dropped/browsed file, a completed paste, and the example. Pre-parsing
   * here means we only call the App loader on success, so its failure Alert never
   * fires — invalid input surfaces as an inline hint instead.
   */
  function tryLoad(text: string) {
    setJsonInput(text);
    if (!text.trim()) {
      setLoadHint(null);
      return;
    }
    setLoading(true);
    try {
      const parsed = parseAbilitiesFromJSON(text);
      if (parsed.abilities.length > 0) {
        setLoadHint(null);
        onLoadJson(text); // navigates to the tracker
      } else {
        setLoadHint(
          "That doesn't look like a complete roster — make sure you pasted or dropped the whole JSON file."
        );
      }
    } catch {
      setLoadHint("Couldn't read that as JSON. Check the file and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleJsonChange(text: string) {
    setJsonInput(text);
    if (loadHint) setLoadHint(null);
    const trimmed = text.trim();
    // Once the box looks like a full roster (e.g. just pasted), auto-load it.
    if (
      trimmed.length > LOOKS_LIKE_ROSTER_MIN_LEN &&
      trimmed.startsWith('{') &&
      trimmed.endsWith('}')
    ) {
      tryLoad(text);
    }
  }

  function handleLoadExample() {
    tryLoad(JSON.stringify(exampleRoster, null, 2));
  }

  return (
    <LandingTemplate
      jsonInput={jsonInput}
      loading={loading}
      loadHint={loadHint}
      onJsonInputChange={handleJsonChange}
      onLoadFromText={tryLoad}
      onLoadExample={handleLoadExample}
      user={user}
      onOpenLogin={onOpenLogin}
    />
  );
}
