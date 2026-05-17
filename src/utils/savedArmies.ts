import type { SavedArmy } from '../types/army';

/**
 * Storage for per-user saved army lists.
 *
 * Demo persistence layer: writes to `window.localStorage` keyed by the user's
 * (lower-cased) email. No backend, no encryption — when the user clears their
 * browser data the saves are gone. On native (no `window.localStorage`) every
 * operation is a no-op, so the feature degrades gracefully.
 *
 * Production would replace these functions with API calls to an authenticated
 * backend; everything else in the app (LoginModal, App.tsx) stays the same.
 */

const STORAGE_KEY_PREFIX = 'aos-tracker-armies::';

function storageKey(userEmail: string): string {
  return `${STORAGE_KEY_PREFIX}${userEmail.toLowerCase()}`;
}

function hasStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getSavedArmies(userEmail: string): SavedArmy[] {
  if (!hasStorage() || !userEmail) return [];
  try {
    const raw = window.localStorage.getItem(storageKey(userEmail));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Cheap shape validation — drop any entries that look corrupted
    return parsed.filter(
      (a: any): a is SavedArmy =>
        a && typeof a.id === 'string' && typeof a.name === 'string' && typeof a.json === 'string'
    );
  } catch {
    return [];
  }
}

export function persistSavedArmies(userEmail: string, armies: SavedArmy[]): void {
  if (!hasStorage() || !userEmail) return;
  try {
    window.localStorage.setItem(storageKey(userEmail), JSON.stringify(armies));
  } catch {
    // Storage full / blocked — fail silently (the in-memory state is still valid for the session)
  }
}

/**
 * Generates a short, unique-enough id without pulling in a uuid dependency.
 * Combines timestamp + random suffix; collisions are vanishingly unlikely for
 * the maximum-of-three list we cap saves at.
 */
export function makeArmyId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
