import type { Unit } from '../types/unit';

/**
 * Wound-tracking helpers. A unit's total wound pool is its per-model Health
 * times its model count; both the card (for display) and the screen (for
 * clamping/destroyed logic) need this, so it lives here once.
 */

/** Per-model Health as a number, or null when Health isn't numeric (e.g. "-"). */
export function perModelHealth(unit: Unit): number | null {
  if (!unit.health) return null;
  const m = unit.health.match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
}

/**
 * Total wound pool = per-model Health × models. Returns 0 when Health isn't a
 * number (terrain etc.) — callers treat 0 as "not wound-trackable".
 */
export function unitTotalWounds(unit: Unit): number {
  const h = perModelHealth(unit);
  return h != null ? h * Math.max(1, unit.models) : 0;
}

/**
 * Models still standing given the wounds taken so far — a simple derivation
 * (models lost = floor(wounds / per-model Health)). Approximate, since real
 * damage allocation is model-by-model, but a useful at-a-glance casualty count.
 */
export function modelsRemaining(unit: Unit, wounds: number): number {
  const h = perModelHealth(unit);
  if (h == null || h <= 0) return unit.models;
  return Math.max(0, unit.models - Math.floor(wounds / h));
}
