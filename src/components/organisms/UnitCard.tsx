import React, { useRef, useState } from 'react';
import { Animated, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Unit, WeaponProfile } from '../../types/unit';
import type { Phase } from '../../types';
import { colors, radii, shadows } from '../../theme/tokens';
import { useResponsive } from '../../utils/responsive';
import { unitTotalWounds, modelsRemaining } from '../../utils/units';

interface UnitCardProps {
  unit: Unit;
  wounds: number;
  destroyed: boolean;
  onWoundsChange: (delta: number) => void;
  onToggleDestroyed: () => void;
  summonable?: boolean;
  summoned?: boolean;
  onToggleSummoned?: () => void;
  // Combat context toggles — omit to hide the toggle row (e.g. opponent cards)
  charged?: boolean;
  hitModifier?: number;
  saveModifier?: number;
  onToggleCharged?: () => void;
  onHitModChange?: (delta: number) => void;
  onSaveModChange?: (delta: number) => void;
  // War-room combat selection
  onSelectForCombat?: () => void;
  combatSelectLabel?: string;
  isAttacking?: boolean;
  /** Active game phase — gates which weapon tables are shown. */
  activePhase?: Phase | null;
}

const HEADER_BG = '#15203A';
const BORDER = '#A68B4D';

// ─── Probability helpers ──────────────────────────────────────────────────────

// Natural 6 is always a critical hit in AoS 4th
const P_CRIT = 1 / 6;

function parseTarget(s: string | undefined): number | null {
  const m = s?.match(/^(\d+)\+/);
  return m ? parseInt(m[1]) : null;
}

/** P(D6 roll ≥ target). Returns 0 for impossible targets (> 6). */
function dieProb(target: number | null): number {
  if (target === null || target > 6) return 0;
  return target <= 1 ? 1 : (7 - target) / 6;
}

/** Expected average of "2", "D3", "D6", "2D6", etc. */
function avgRoll(s: string | undefined): number {
  if (!s) return 0;
  const fixed = parseFloat(s);
  if (!isNaN(fixed)) return fixed;
  const m = s.match(/^(\d+)?[Dd](\d+)$/);
  if (m) {
    const n = m[1] ? parseInt(m[1]) : 1;
    const d = parseInt(m[2]);
    return n * (d + 1) / 2;
  }
  return 1;
}

/** Rend magnitude: "-" → 0, "-1" → 1. */
function parseRend(s: string | undefined): number {
  const m = s?.match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

type CritKind = 'extra_hit' | 'mortal' | 'auto_wound' | 'deadly';

interface CritEffect {
  kind: CritKind;
  /** Mortal wounds dealt on a crit (1 for 'mortal', N for 'deadly'). */
  mortals: number;
}

/**
 * Parses Crit(...) weapon abilities that alter the attack roll sequence.
 * Returns null for abilities that don't affect the math (Anti-X, Charge, etc.).
 */
function parseCritEffect(ability: string | undefined): CritEffect | null {
  if (!ability) return null;
  if (/crit\s*\(\s*(2\s*hits?|extra\s*hit)\s*\)/i.test(ability))
    return { kind: 'extra_hit', mortals: 0 };
  if (/crit\s*\(\s*mortal\s*\)/i.test(ability))
    return { kind: 'mortal', mortals: 1 };
  if (/crit\s*\(\s*auto.?wound\s*\)/i.test(ability))
    return { kind: 'auto_wound', mortals: 0 };
  const deadly = ability.match(/crit\s*\(\s*deadly\s*(\d+)\s*\)/i);
  if (deadly) return { kind: 'deadly', mortals: parseInt(deadly[1]) };
  return null;
}

/**
 * Split a comma-separated ability string like
 * "Anti-Infantry (+1 Rend), Crit (2 Hits)" into individual trimmed tags,
 * stripping BattleScribe bold/keyword markers.
 */
function splitAbilityTags(ability: string | undefined): string[] {
  if (!ability || ability.trim() === '-') return [];
  return ability
    .split(/,\s*/)
    .map(t => t.replace(/\*\*/g, '').replace(/\^\^/g, '').trim())
    .filter(Boolean);
}

/** Context passed to weaponExpectedDmg to apply conditional weapon abilities. */
export interface AttackContext {
  /** This unit charged this turn — activates Charge weapon abilities. */
  attackerCharged: boolean;
  /** +/- modifier to the attacker's hit rolls (from unit state or spells). */
  hitMod: number;
  /** Target unit charged this turn — activates Anti-charge weapon abilities. */
  targetCharged?: boolean;
  /** Target unit's save modifier (positive = better save, e.g. cover). */
  targetSaveMod?: number;
  /** Target unit's keywords (uppercase) for Anti-[keyword] abilities. */
  targetKeywords?: string[];
}

/**
 * Classify an ability tag for display: whether it's factored into the math,
 * potentially active (but attacker hasn't charged), or purely contextual.
 */
function chipStatus(
  tag: string,
  ctx: AttackContext,
): 'factored' | 'potential' | 'contextual' {
  if (/crit\s*\(/i.test(tag)) return 'factored';
  if (/^Charge\s*\(/i.test(tag)) return ctx.attackerCharged ? 'factored' : 'potential';
  if (/^Anti-charge\s*\(/i.test(tag)) return (ctx.targetCharged ?? false) ? 'factored' : 'contextual';
  if (/^Anti-/i.test(tag)) return 'contextual';
  return 'contextual';
}

/**
 * Expected damage for one weapon's full attack sequence vs an enemy with
 * a given save characteristic, incorporating Crit and conditional weapon abilities.
 * Pass null for "no save" (unarmoured). Pass ctx for game-state modifiers.
 */
function weaponExpectedDmg(
  w: WeaponProfile,
  enemySave: number | null,
  modelCount = 1,
  ctx?: AttackContext,
): number {
  // ── Step 1: conditional mods from ability tags ────────────────────────────
  let hitMod   = ctx?.hitMod ?? 0;
  let bonusDmg = 0;
  let bonusRend = 0;
  let woundMod  = 0;

  if (ctx) {
    const tags = splitAbilityTags(w.ability);
    for (const tag of tags) {
      // Charge (+N Damage/Rend/to Hit)
      if (ctx.attackerCharged) {
        const cm = tag.match(/^Charge\s*\(\+(\d+)\s+(Damage|Rend|to\s+Hit)\)/i);
        if (cm) {
          const n = parseInt(cm[1]);
          const s = cm[2].toLowerCase();
          if (s.includes('damage')) bonusDmg += n;
          else if (s.includes('rend')) bonusRend += n;
          else hitMod += n;
        }
      }
      // Anti-charge (+N Rend)
      if (ctx.targetCharged) {
        const am = tag.match(/^Anti-charge\s*\(\+(\d+)\s+Rend\)/i);
        if (am) bonusRend += parseInt(am[1]);
      }
      // Anti-[keyword] (+N Rend / +N to Wound)
      if (ctx.targetKeywords && ctx.targetKeywords.length > 0) {
        const kr = tag.match(/^Anti-([A-Za-z][A-Za-z\s-]*?)\s*\(\+(\d+)\s+Rend\)/i);
        if (kr) {
          const kw = kr[1].trim().toUpperCase();
          if (ctx.targetKeywords.includes(kw)) bonusRend += parseInt(kr[2]);
        }
        const kw2 = tag.match(/^Anti-([A-Za-z][A-Za-z\s-]*?)\s*\(\+(\d+)\s+to\s+Wound\)/i);
        if (kw2) {
          const kw = kw2[1].trim().toUpperCase();
          if (ctx.targetKeywords.includes(kw)) woundMod += parseInt(kw2[2]);
        }
      }
    }
  }

  // ── Step 2: base roll probabilities ──────────────────────────────────────
  const hitTarget = parseTarget(w.hit);
  const pHit = hitTarget !== null ? dieProb(Math.max(2, hitTarget - hitMod)) : 0;

  const woundTarget = parseTarget(w.wound);
  const pWound = woundTarget !== null ? dieProb(Math.max(2, woundTarget - woundMod)) : 0;

  const rend     = parseRend(w.rend) + bonusRend;
  const saveMod  = ctx?.targetSaveMod ?? 0;
  const effSave  = enemySave !== null ? (enemySave - saveMod) + rend : 99;
  const pSave    = dieProb(effSave <= 6 ? effSave : null);
  const avgDmg   = avgRoll(w.damage) + bonusDmg;
  const avgAtks  = avgRoll(w.attacks) * modelCount;

  // ── Step 3: crit effect on the attack sequence ───────────────────────────
  const pCrit    = Math.min(P_CRIT, pHit);
  const pNormHit = pHit - pCrit;
  const crit     = parseCritEffect(w.ability);

  let dmgPerAtk: number;
  switch (crit?.kind) {
    case 'extra_hit':
      dmgPerAtk = (pHit + pCrit) * pWound * (1 - pSave) * avgDmg;
      break;
    case 'mortal':
      dmgPerAtk = pCrit * 1 + pNormHit * pWound * (1 - pSave) * avgDmg;
      break;
    case 'auto_wound':
      dmgPerAtk = (pCrit + pNormHit * pWound) * (1 - pSave) * avgDmg;
      break;
    case 'deadly':
      dmgPerAtk = pCrit * crit.mortals + pNormHit * pWound * (1 - pSave) * avgDmg;
      break;
    default:
      dmgPerAtk = pHit * pWound * (1 - pSave) * avgDmg;
  }

  return avgAtks * dmgPerAtk;
}

function fmtDmg(n: number): string {
  if (n >= 100) return n.toFixed(0);
  if (n >= 10)  return n.toFixed(1);
  if (n >= 0.1) return n.toFixed(1);
  return '0';
}

function dmgStyle(value: number, max: number) {
  if (max === 0) return {};
  const r = value / max;
  if (r >= 0.65) return { color: '#4CAF81' };  // green
  if (r >= 0.35) return { color: '#E6B566' };  // amber
  return { color: '#FF6B6B' };                  // red
}

function pctStyle(pct: number) {
  if (pct >= 0.6) return { color: '#4CAF81' };
  if (pct >= 0.35) return { color: '#E6B566' };
  return { color: '#FF6B6B' };
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function UnitCard({
  unit,
  wounds,
  destroyed,
  onWoundsChange,
  onToggleDestroyed,
  summonable,
  summoned,
  onToggleSummoned,
  charged = false,
  hitModifier = 0,
  saveModifier = 0,
  onToggleCharged,
  onHitModChange,
  onSaveModChange,
  onSelectForCombat,
  combatSelectLabel,
  isAttacking = false,
  activePhase,
}: UnitCardProps) {
  const { scaleFont, select } = useResponsive();
  const scaleAnim   = useRef(new Animated.Value(1)).current;
  const flippingRef = useRef(false);
  const [showBack, setShowBack] = useState(false);

  const handleFlip = () => {
    if (flippingRef.current) return;
    flippingRef.current = true;
    Animated.timing(scaleAnim, { toValue: 0, duration: 190, useNativeDriver: true }).start(() => {
      setShowBack(s => !s);
      Animated.timing(scaleAnim, { toValue: 1, duration: 190, useNativeDriver: true }).start(() => {
        flippingRef.current = false;
      });
    });
  };

  const total     = unitTotalWounds(unit);
  const trackable = total > 0;
  const remaining = Math.max(0, total - wounds);
  const ranged    = unit.weapons.filter(w => w.kind === 'ranged');
  const melee     = unit.weapons.filter(w => w.kind === 'melee');

  // Show only weapons usable in the current phase:
  // Shooting Phase → ranged only; Combat Phase → melee only; null → all; other → none.
  const displayRanged = !activePhase || activePhase === 'Shooting Phase' ? ranged : [];
  const displayMelee  = !activePhase || activePhase === 'Combat Phase'   ? melee  : [];

  // Unsummoned manifestation — minimal card with no flip.
  if (summonable && !summoned) {
    return (
      <View style={[styles.card, styles.cardNotSummoned]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text
              style={[styles.name, { fontSize: scaleFont(select({ mobile: 15, default: 17 })) }]}
              numberOfLines={2}
            >
              {unit.name}
            </Text>
            <View style={styles.manifestTag}>
              <Text style={styles.manifestTagText}>MANIFESTATION</Text>
            </View>
          </View>
          {unit.points !== undefined && <Text style={styles.points}>{unit.points} pts</Text>}
        </View>
        <View style={styles.summonRow}>
          <Text style={styles.notSummonedHint}>Not summoned</Text>
          <TouchableOpacity style={[styles.actionBtn, styles.summonBtn]} onPress={onToggleSummoned}>
            <Text style={styles.actionBtnText}>Summon</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, destroyed && styles.cardDestroyed]}>
      {/* Flippable section — header, stats, weapons */}
      <Animated.View style={{ transform: [{ scaleX: scaleAnim }] }}>
        {showBack ? (
          <StatsBack unit={unit} wounds={wounds} charged={charged} hitModifier={hitModifier} onFlip={handleFlip} activePhase={activePhase} />
        ) : (
          <TouchableOpacity onPress={handleFlip} activeOpacity={0.88}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text
                  style={[styles.name, { fontSize: scaleFont(select({ mobile: 15, default: 17 })) }]}
                  numberOfLines={2}
                >
                  {unit.name}
                </Text>
                {(unit.isWizard || unit.isPriest) && (
                  <View style={styles.casterTag}>
                    <Text style={styles.casterTagText}>{unit.isWizard ? 'WIZARD' : 'PRIEST'}</Text>
                  </View>
                )}
                {unit.reinforced && (
                  <View style={styles.reinforcedTag}>
                    <Text style={styles.reinforcedTagText}>REINFORCED</Text>
                  </View>
                )}
                {summonable && summoned && (
                  <View style={styles.summonedTag}>
                    <Text style={styles.summonedTagText}>SUMMONED</Text>
                  </View>
                )}
              </View>
              <View style={styles.headerRight}>
                {unit.points !== undefined && <Text style={styles.points}>{unit.points} pts</Text>}
                <Text style={styles.models}>
                  {unit.models} {unit.models === 1 ? 'model' : 'models'}
                </Text>
                <Text style={styles.statsHint}>tap for stats</Text>
              </View>
            </View>

            {/* Stat line */}
            <View style={styles.statRow}>
              <Stat label="MOVE"    value={unit.move} />
              <Stat label="HEALTH"  value={unit.health} />
              <Stat label="SAVE"    value={unit.save} />
              {unit.banishment
                ? <Stat label="BANISH"  value={unit.banishment} />
                : <Stat label="CONTROL" value={unit.control} />}
              {unit.ward ? <Stat label="WARD" value={unit.ward} /> : null}
            </View>

            {/* Keywords */}
            {unit.keywords && unit.keywords.length > 0 && (
              <View style={styles.keywordsRow}>
                {unit.keywords
                  .filter(kw => {
                    const lower = kw.toLowerCase();
                    if (lower === 'manifestation') return false;
                    if (lower.includes('regimental')) return false;
                    return true;
                  })
                  .map((kw, idx) => (
                    <View key={idx} style={styles.keywordTag}>
                      <Text style={styles.keywordText}>{kw}</Text>
                    </View>
                  ))}
              </View>
            )}

            {/* Weapons — filtered to those usable in the active phase */}
            <View style={styles.weaponsWrap}>
              {displayRanged.length > 0 && <WeaponTable title="RANGED WEAPONS" weapons={displayRanged} ranged />}
              {displayMelee.length > 0  && <WeaponTable title="MELEE WEAPONS"  weapons={displayMelee} />}
              {unit.weapons.length === 0 && (
                <Text style={styles.noWeapons}>No weapon profiles.</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Footer — always visible, outside the flip */}
      <View style={styles.footer}>

        {/* Interactive combat toggles — only visible on the stats back face */}
        {onToggleCharged !== undefined && showBack && (
          <View style={styles.toggleStrip}>
            <TouchableOpacity
              style={[styles.chargedBtn, charged && styles.chargedBtnActive]}
              onPress={onToggleCharged}
              activeOpacity={0.75}
            >
              <Text style={[styles.chargedIcon, charged && styles.chargedIconActive]}>⚡</Text>
              <View>
                <Text style={[styles.chargedLabel, charged && styles.chargedLabelActive]}>
                  CHARGED
                </Text>
                {charged && <Text style={styles.chargedSub}>abilities active</Text>}
              </View>
            </TouchableOpacity>

            <View style={styles.modsGroup}>
              {onHitModChange && (
                <View style={styles.modPill}>
                  <Text style={styles.modPillLabel}>HIT</Text>
                  <View style={styles.modPillRow}>
                    <TouchableOpacity onPress={() => onHitModChange(-1)} disabled={hitModifier <= -2}>
                      <Text style={[styles.modPillBtn, hitModifier <= -2 && styles.modPillBtnOff]}>−</Text>
                    </TouchableOpacity>
                    <Text style={[
                      styles.modPillVal,
                      hitModifier > 0 && styles.modPillValPos,
                      hitModifier < 0 && styles.modPillValNeg,
                    ]}>
                      {hitModifier > 0 ? `+${hitModifier}` : `${hitModifier}`}
                    </Text>
                    <TouchableOpacity onPress={() => onHitModChange(1)} disabled={hitModifier >= 2}>
                      <Text style={[styles.modPillBtn, hitModifier >= 2 && styles.modPillBtnOff]}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {onSaveModChange && (
                <View style={styles.modPill}>
                  <Text style={styles.modPillLabel}>SAVE</Text>
                  <View style={styles.modPillRow}>
                    <TouchableOpacity onPress={() => onSaveModChange(-1)} disabled={saveModifier <= -2}>
                      <Text style={[styles.modPillBtn, saveModifier <= -2 && styles.modPillBtnOff]}>−</Text>
                    </TouchableOpacity>
                    <Text style={[
                      styles.modPillVal,
                      saveModifier > 0 && styles.modPillValPos,
                      saveModifier < 0 && styles.modPillValNeg,
                    ]}>
                      {saveModifier > 0 ? `+${saveModifier}` : `${saveModifier}`}
                    </Text>
                    <TouchableOpacity onPress={() => onSaveModChange(1)} disabled={saveModifier >= 2}>
                      <Text style={[styles.modPillBtn, saveModifier >= 2 && styles.modPillBtnOff]}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Read-only state summary (opponent cards) — only visible on the stats back face */}
        {onToggleCharged === undefined && showBack && (charged || hitModifier !== 0 || saveModifier !== 0) && (
          <View style={styles.readOnlyStrip}>
            {charged && (
              <View style={[styles.readOnlyChip, styles.readOnlyChipCharged]}>
                <Text style={styles.readOnlyChipTextCharged}>⚡ Charged</Text>
              </View>
            )}
            {hitModifier !== 0 && (
              <View style={styles.readOnlyChip}>
                <Text style={styles.readOnlyChipText}>
                  Hit {hitModifier > 0 ? `+${hitModifier}` : hitModifier}
                </Text>
              </View>
            )}
            {saveModifier !== 0 && (
              <View style={styles.readOnlyChip}>
                <Text style={styles.readOnlyChipText}>
                  Save {saveModifier > 0 ? `+${saveModifier}` : saveModifier}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Wounds + action row */}
        <View style={styles.woundsActionRow}>
          {trackable ? (
            <View style={styles.woundsRow}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => onWoundsChange(1)}
                disabled={wounds >= total}
              >
                <Text style={[styles.stepBtnText, wounds >= total && styles.stepBtnTextDisabled]}>−</Text>
              </TouchableOpacity>
              <View style={styles.woundsCenter}>
                <Text style={styles.woundsValue}>
                  {remaining}<Text style={styles.woundsTotal}>/{total}</Text>
                </Text>
                {unit.models > 1 && (
                  <Text style={styles.modelsRemaining}>
                    {modelsRemaining(unit, wounds)}/{unit.models} models
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => onWoundsChange(-1)}
                disabled={wounds <= 0}
              >
                <Text style={[styles.stepBtnText, wounds <= 0 && styles.stepBtnTextDisabled]}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.woundsLabel}>
              {destroyed ? 'Destroyed' : 'On the battlefield'}
            </Text>
          )}

          {summonable ? (
            <TouchableOpacity style={[styles.actionBtn, styles.unsummonBtn]} onPress={onToggleSummoned}>
              <Text style={styles.actionBtnText}>Unsummon</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionBtn, destroyed ? styles.reviveBtn : styles.killBtn]}
              onPress={onToggleDestroyed}
            >
              <Text style={styles.actionBtnText}>{destroyed ? 'Revive' : 'Destroy'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* War-room combat selection */}
        {onSelectForCombat && (
          <View style={styles.combatSelectRow}>
            <TouchableOpacity
              style={[styles.combatSelectBtn, isAttacking && styles.combatSelectBtnActive]}
              onPress={onSelectForCombat}
              activeOpacity={0.8}
            >
              <Text style={[styles.combatSelectBtnText, isAttacking && styles.combatSelectBtnTextActive]}>
                {isAttacking
                  ? (activePhase === 'Shooting Phase' ? '🏹 Shooting — tap to clear' : '⚔ Attacking — tap to clear')
                  : (combatSelectLabel ?? (activePhase === 'Shooting Phase' ? '🏹 Select to shoot' : '⚔ Select for combat'))}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {destroyed && (
        <View style={styles.destroyedTag} pointerEvents="none">
          <Text style={styles.destroyedTagText}>DESTROYED</Text>
        </View>
      )}
    </View>
  );
}

// ─── Stats back face ──────────────────────────────────────────────────────────

const SAVE_TARGETS = [null, 6, 5, 4, 3, 2] as const;
const SAVE_LABELS  = ['None', '6+', '5+', '4+', '3+', '2+'];

function StatsBack({
  unit, wounds, charged, hitModifier, onFlip, activePhase,
}: {
  unit: Unit; wounds: number; charged: boolean; hitModifier: number; onFlip: () => void;
  activePhase?: Phase | null;
}) {
  const remaining = modelsRemaining(unit, wounds);
  const ctx: AttackContext = { attackerCharged: charged, hitMod: hitModifier };

  // Filter to weapons usable in the current phase (mirrors the front-face logic).
  const weaponsToShow = !activePhase ? unit.weapons
    : activePhase === 'Shooting Phase' ? unit.weapons.filter(w => w.kind === 'ranged')
    : activePhase === 'Combat Phase'   ? unit.weapons.filter(w => w.kind === 'melee')
    : [];

  return (
    <TouchableOpacity onPress={onFlip} activeOpacity={0.88}>
      <View style={styles.backHeader}>
        <Text style={styles.backTitle}>ATTACK STATS</Text>
        <Text style={styles.backFlipHint}>tap to flip back</Text>
      </View>

      {/* Model strength context — only meaningful for multi-model units */}
      {unit.models > 1 && (
        <View style={styles.modelStrengthRow}>
          <Text style={styles.modelStrengthText}>
            {remaining < unit.models
              ? `${remaining} of ${unit.models} models remaining`
              : `${unit.models} models at full strength`}
          </Text>
          {remaining < unit.models && (
            <Text style={styles.modelStrengthLost}>
              {unit.models - remaining} lost
            </Text>
          )}
        </View>
      )}

      <View style={styles.backBody}>
        {weaponsToShow.length === 0 ? (
          <Text style={styles.backNoWeapons}>
            {unit.weapons.length === 0 ? 'No weapon profiles.' : 'No weapons usable in this phase.'}
          </Text>
        ) : (
          weaponsToShow.map(w => {
            // Build hit target considering context mods
            let effectiveHitMod = ctx.hitMod;
            if (ctx.attackerCharged) {
              splitAbilityTags(w.ability).forEach(tag => {
                const cm = tag.match(/^Charge\s*\(\+(\d+)\s+to\s+Hit\)/i);
                if (cm) effectiveHitMod += parseInt(cm[1]);
              });
            }
            const hitTarget  = parseTarget(w.hit);
            const pHit  = hitTarget !== null ? dieProb(Math.max(2, hitTarget - effectiveHitMod)) : 0;
            const pWound = dieProb(parseTarget(w.wound));
            const avgAtk = avgRoll(w.attacks) * remaining;
            const crit   = parseCritEffect(w.ability);
            const pCrit  = Math.min(P_CRIT, pHit);

            // Effective hit rate shown in chip (Crit 2-Hits adds a bonus hit)
            const effHit = crit?.kind === 'extra_hit' ? pHit + pCrit : pHit;

            // Pre-save wounds incorporating crit effects
            let avgWnds: number;
            switch (crit?.kind) {
              case 'extra_hit':
                avgWnds = avgAtk * (pHit + pCrit) * pWound; break;
              case 'mortal':
              case 'auto_wound':
                avgWnds = avgAtk * (pCrit + (pHit - pCrit) * pWound); break;
              default:
                avgWnds = avgAtk * pHit * pWound;
            }

            const noneVal     = weaponExpectedDmg(w, null, remaining, ctx);
            const dmgVals     = SAVE_TARGETS.map(s => weaponExpectedDmg(w, s, remaining, ctx));
            const abilityTags = splitAbilityTags(w.ability);

            return (
              <View key={w.name} style={styles.weaponStatBlock}>
                {/* Weapon name + kind badge */}
                <View style={styles.weaponStatHead}>
                  <Text style={styles.weaponStatName} numberOfLines={1}>{w.name}</Text>
                  <View style={[
                    styles.kindBadge,
                    w.kind === 'ranged' ? styles.rangedBadge : styles.meleeBadge,
                  ]}>
                    <Text style={styles.kindBadgeText}>
                      {w.kind === 'ranged' ? 'RANGED' : 'MELEE'}
                    </Text>
                  </View>
                </View>

                {/* Ability tags — green chip for factored-in crits, muted for contextual */}
                {abilityTags.length > 0 && (
                  <View style={styles.abilityTagRow}>
                    {abilityTags.map((tag, i) => {
                      const status = chipStatus(tag, ctx);
                      const tagStyle = status === 'factored'
                        ? styles.abilityTagCrit
                        : status === 'potential'
                          ? styles.abilityTagPotential
                          : styles.abilityTagContextual;
                      const textStyle = status === 'factored'
                        ? styles.abilityTagTextCrit
                        : status === 'potential'
                          ? styles.abilityTagTextPotential
                          : styles.abilityTagTextContextual;
                      const prefix = status === 'factored' ? '✓ ' : status === 'potential' ? '⚡ ' : '';
                      return (
                        <View key={i} style={[styles.abilityTag, tagStyle]}>
                          <Text style={[styles.abilityTagText, textStyle]}>
                            {prefix}{tag}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}

                {/* Probability row */}
                <View style={styles.probRow}>
                  <View style={styles.probChip}>
                    <Text style={styles.probLabel}>
                      {crit?.kind === 'extra_hit' ? 'Eff.Hit' : 'Hit'}
                    </Text>
                    <Text style={[styles.probValue, pctStyle(effHit)]}>
                      {Math.round(effHit * 100)}%
                    </Text>
                  </View>
                  <View style={styles.probChip}>
                    <Text style={styles.probLabel}>Wound</Text>
                    <Text style={[styles.probValue, pctStyle(pWound)]}>
                      {Math.round(pWound * 100)}%
                    </Text>
                  </View>
                  <View style={styles.probChip}>
                    <Text style={styles.probLabel}>
                      {crit?.kind === 'mortal' ? 'Eff.wnds' : 'Avg wnds'}
                    </Text>
                    <Text style={[styles.probValue, { color: '#E9F0FF' }]}>
                      {avgWnds.toFixed(1)}
                    </Text>
                  </View>
                </View>

                {/* Damage vs save table */}
                <View style={styles.saveTableLabel}>
                  <Text style={styles.saveTableLabelText}>Expected dmg vs enemy save</Text>
                </View>
                <View style={styles.saveHeaderRow}>
                  {SAVE_LABELS.map(l => (
                    <Text key={l} style={styles.saveHeaderCell}>{l}</Text>
                  ))}
                </View>
                <View style={styles.saveValueRow}>
                  {dmgVals.map((v, i) => (
                    <Text key={i} style={[styles.saveValueCell, dmgStyle(v, noneVal)]}>
                      {fmtDmg(v)}
                    </Text>
                  ))}
                </View>
              </View>
            );
          })
        )}

        {/* Ward note */}
        {unit.weapons.length > 0 && (
          <Text style={styles.wardNote}>
            Ward saves reduce damage through: x0.83 for 5+ward, x0.67 for 4+ward, x0.50 for 3+ward
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function cleanWeaponAbilityText(text: string): string {
  return text.replace(/\*\*/g, '').replace(/\^\^/g, '');
}

function Stat({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.statChip}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value || '-'}</Text>
    </View>
  );
}

function WeaponTable({
  title,
  weapons,
  ranged,
}: {
  title: string;
  weapons: WeaponProfile[];
  ranged?: boolean;
}) {
  return (
    <View style={styles.weaponGroup}>
      <Text style={styles.weaponGroupTitle}>{title}</Text>
      <View style={styles.weaponHeaderRow}>
        {ranged && <Text style={styles.weaponHeadCell}>Rng</Text>}
        <Text style={styles.weaponHeadCell}>Atk</Text>
        <Text style={styles.weaponHeadCell}>Hit</Text>
        <Text style={styles.weaponHeadCell}>Wnd</Text>
        <Text style={styles.weaponHeadCell}>Rnd</Text>
        <Text style={styles.weaponHeadCell}>Dmg</Text>
      </View>
      {weapons.map(w => (
        <View key={w.name} style={styles.weaponBlock}>
          <Text style={styles.weaponName}>{w.name}</Text>
          <View style={styles.weaponValuesRow}>
            {ranged && <Text style={styles.weaponCell}>{w.range || '-'}</Text>}
            <Text style={styles.weaponCell}>{w.attacks}</Text>
            <Text style={styles.weaponCell}>{w.hit}</Text>
            <Text style={styles.weaponCell}>{w.wound}</Text>
            <Text style={styles.weaponCell}>{w.rend}</Text>
            <Text style={styles.weaponCell}>{w.damage}</Text>
          </View>
          {w.ability ? (
            <Text style={styles.weaponAbility}>
              {cleanWeaponAbilityText(w.ability)}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: BORDER,
    backgroundColor: colors.bgCard,
    overflow: 'hidden',
    alignSelf: 'stretch',
    ...shadows.card,
  },
  cardDestroyed: {
    opacity: 0.55,
  },

  // ── Front face ──
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: HEADER_BG,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  name: {
    color: colors.textCream,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  casterTag: {
    backgroundColor: colors.command,
    borderRadius: radii.sm,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  casterTagText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  reinforcedTag: {
    backgroundColor: '#B08A2E',
    borderRadius: radii.sm,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  reinforcedTagText: {
    color: '#1B1B1B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  points: {
    color: '#E6B566',
    fontSize: 12,
    fontWeight: '800',
  },
  models: {
    color: '#9DB0CF',
    fontSize: 11,
    fontWeight: '600',
  },
  statsHint: {
    color: '#5BA9FF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
    opacity: 0.9,
  },
  statRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 4,
  },
  statChip: {
    backgroundColor: '#1E2C49',
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 52,
    alignItems: 'center',
  },
  statLabel: {
    color: '#9DB0CF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  statValue: {
    color: colors.textCream,
    fontSize: 15,
    fontWeight: '900',
  },
  keywordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  keywordTag: {
    backgroundColor: '#2A3F5F',
    borderRadius: radii.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  keywordText: {
    color: '#A8C5E0',
    fontSize: 10,
    fontWeight: '600',
  },
  weaponsWrap: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 4,
  },
  weaponGroup: {
    marginBottom: 8,
  },
  weaponGroupTitle: {
    color: colors.textCardMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  weaponHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(90,74,47,0.3)',
    paddingBottom: 2,
  },
  weaponHeadCell: {
    flex: 1,
    textAlign: 'center',
    color: colors.textCardMuted,
    fontSize: 10,
    fontWeight: '800',
  },
  weaponBlock: {
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(90,74,47,0.12)',
  },
  weaponName: {
    color: colors.textCardPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 1,
  },
  weaponValuesRow: {
    flexDirection: 'row',
  },
  weaponCell: {
    flex: 1,
    textAlign: 'center',
    color: colors.textCardPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  weaponAbility: {
    color: '#7A3E12',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 2,
  },
  noWeapons: {
    color: colors.textCardMuted,
    fontSize: 12,
    fontStyle: 'italic',
  },

  // ── Back face ──
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A1220',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backTitle: {
    color: '#5BA9FF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  backFlipHint: {
    color: '#4C6A8C',
    fontSize: 10,
    fontWeight: '600',
  },
  modelStrengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0C1628',
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 8,
  },
  modelStrengthText: {
    color: '#7A9FBF',
    fontSize: 10,
    fontWeight: '600',
  },
  modelStrengthLost: {
    color: '#C0504D',
    fontSize: 10,
    fontWeight: '700',
  },
  backBody: {
    backgroundColor: '#0F1A2E',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 10,
  },
  backNoWeapons: {
    color: '#4C6A8C',
    fontSize: 12,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  weaponStatBlock: {
    gap: 5,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(91,169,255,0.12)',
  },
  weaponStatHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  abilityTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  abilityTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  abilityTagCrit: {
    backgroundColor: '#0F2A1C',
    borderColor: '#2A6B44',
  },
  abilityTagContextual: {
    backgroundColor: '#131828',
    borderColor: '#252E4A',
  },
  abilityTagPotential: {
    backgroundColor: '#221800',
    borderColor: '#5C3E00',
  },
  abilityTagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  abilityTagTextCrit: {
    color: '#4CAF81',
  },
  abilityTagTextPotential: {
    color: '#E6B566',
  },
  abilityTagTextContextual: {
    color: '#4C6A8C',
  },
  weaponStatName: {
    color: '#E9F0FF',
    fontSize: 13,
    fontWeight: '800',
    flex: 1,
  },
  kindBadge: {
    borderRadius: radii.sm,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  meleeBadge: {
    backgroundColor: '#5C2A2A',
  },
  rangedBadge: {
    backgroundColor: '#1E4A6C',
  },
  kindBadgeText: {
    color: '#E9F0FF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  probRow: {
    flexDirection: 'row',
    gap: 6,
  },
  probChip: {
    flex: 1,
    backgroundColor: '#162030',
    borderRadius: radii.sm,
    paddingHorizontal: 6,
    paddingVertical: 4,
    alignItems: 'center',
  },
  probLabel: {
    color: '#4C6A8C',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  probValue: {
    fontSize: 14,
    fontWeight: '900',
  },
  saveTableLabel: {
    marginTop: 2,
  },
  saveTableLabelText: {
    color: '#4C6A8C',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  saveHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(91,169,255,0.15)',
    paddingBottom: 2,
  },
  saveHeaderCell: {
    flex: 1,
    textAlign: 'center',
    color: '#3A5A7C',
    fontSize: 9,
    fontWeight: '800',
  },
  saveValueRow: {
    flexDirection: 'row',
    paddingTop: 3,
  },
  saveValueCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '800',
  },
  wardNote: {
    color: '#3A5A7C',
    fontSize: 9,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 13,
    marginTop: 2,
  },

  // ── Footer (column layout) ──
  footer: {
    flexDirection: 'column',
    borderTopWidth: 1,
    borderTopColor: 'rgba(90,74,47,0.2)',
  },

  // Toggle strip (interactive)
  toggleStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0C1525',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(91,169,255,0.07)',
  },
  chargedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    backgroundColor: '#131E32',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E3050',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chargedBtnActive: {
    backgroundColor: '#2A1800',
    borderColor: '#C49A20',
  },
  chargedIcon: {
    fontSize: 18,
    lineHeight: 22,
    opacity: 0.3,
  },
  chargedIconActive: {
    opacity: 1,
  },
  chargedLabel: {
    color: '#4A6A8F',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  chargedLabelActive: {
    color: '#E6B566',
  },
  chargedSub: {
    color: '#9A7A30',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1,
  },
  modsGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  modPill: {
    backgroundColor: '#131E32',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E3050',
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignItems: 'center',
    gap: 2,
  },
  modPillLabel: {
    color: '#4A6A8F',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  modPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  modPillBtn: {
    color: '#7A9FBF',
    fontSize: 17,
    fontWeight: '900',
    width: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  modPillBtnOff: {
    color: '#2A3A52',
  },
  modPillVal: {
    color: '#D0E0F8',
    fontSize: 15,
    fontWeight: '900',
    minWidth: 26,
    textAlign: 'center',
  },
  modPillValPos: {
    color: '#4CAF81',
  },
  modPillValNeg: {
    color: '#FF6B6B',
  },

  // Read-only state strip (opponent cards)
  readOnlyStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#0C1525',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(91,169,255,0.07)',
  },
  readOnlyChip: {
    backgroundColor: '#1A2236',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: '#2A3A58',
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  readOnlyChipCharged: {
    backgroundColor: '#2A1800',
    borderColor: '#C49A20',
  },
  readOnlyChipText: {
    color: '#7A9FBF',
    fontSize: 10,
    fontWeight: '700',
  },
  readOnlyChipTextCharged: {
    color: '#E6B566',
    fontSize: 10,
    fontWeight: '700',
  },

  // Wounds + action row
  woundsActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  woundsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  woundsCenter: {
    alignItems: 'center',
    minWidth: 48,
  },
  woundsLabel: {
    color: colors.textCardSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#15203A',
    borderWidth: 1,
    borderColor: '#1E3050',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    color: colors.textCream,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 20,
  },
  stepBtnTextDisabled: {
    color: '#3A4A66',
  },
  woundsValue: {
    color: colors.textCardPrimary,
    fontSize: 20,
    fontWeight: '900',
  },
  woundsTotal: {
    color: colors.textCardMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  modelsRemaining: {
    color: '#4A6A8F',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginTop: 1,
  },
  actionBtn: {
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  killBtn: {
    backgroundColor: colors.castingRed,
  },
  reviveBtn: {
    backgroundColor: colors.castingGreen,
  },
  summonBtn: {
    backgroundColor: '#3F66D6',
  },
  unsummonBtn: {
    backgroundColor: '#4C5775',
  },

  // ── Manifestation (unsummoned) ──
  cardNotSummoned: {
    borderStyle: 'dashed',
  },
  manifestTag: {
    backgroundColor: '#6D4FA3',
    borderRadius: radii.sm,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  manifestTagText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  summonedTag: {
    backgroundColor: '#1E7A6E',
    borderRadius: radii.sm,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  summonedTagText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  summonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  notSummonedHint: {
    color: colors.textCardMuted,
    fontSize: 12,
    fontStyle: 'italic',
  },

  // ── Combat select ──
  combatSelectRow: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  combatSelectBtn: {
    backgroundColor: '#0D1E36',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E4070',
    paddingVertical: 8,
    alignItems: 'center',
  },
  combatSelectBtnActive: {
    backgroundColor: '#2A0D00',
    borderColor: '#8C3A00',
  },
  combatSelectBtnText: {
    color: '#4A7AB5',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  combatSelectBtnTextActive: {
    color: '#E8935A',
  },

  // ── Destroyed overlay ──
  destroyedTag: {
    position: 'absolute',
    top: 38,
    right: 10,
    backgroundColor: colors.castingRed,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
    transform: [{ rotate: '8deg' }],
  },
  destroyedTagText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
