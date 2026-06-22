import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import type { Unit, UnitState } from '../../types/unit';
import { modelsRemaining, unitTotalWounds } from '../../utils/units';
import { AttackContext } from './UnitCard';
import { radii, colors } from '../../theme/tokens';

// ── Re-implement the minimal damage math here to avoid circular imports ────────
// (UnitCard is a component; we only need the pure calculation functions.)

function parseTarget(s: string | undefined): number | null {
  const m = s?.match(/^(\d+)\+/);
  return m ? parseInt(m[1]) : null;
}

function dieProb(target: number | null): number {
  if (target === null || target > 6) return 0;
  return target <= 1 ? 1 : (7 - target) / 6;
}

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

function parseRend(s: string | undefined): number {
  const m = s?.match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function splitAbilityTags(ability: string | undefined): string[] {
  if (!ability || ability.trim() === '-') return [];
  return ability.split(/,\s*/).map(t => t.replace(/\*\*/g, '').replace(/\^\^/g, '').trim()).filter(Boolean);
}

const P_CRIT = 1 / 6;

function weaponExpectedDmg(
  w: { attacks: string; hit: string; wound: string; rend: string; damage: string; ability?: string },
  enemySave: number | null,
  modelCount: number,
  ctx: AttackContext,
): number {
  let hitMod = ctx.hitMod;
  let bonusDmg = 0;
  let bonusRend = 0;
  let woundMod = 0;

  const tags = splitAbilityTags(w.ability);
  for (const tag of tags) {
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
    if (ctx.targetCharged) {
      const am = tag.match(/^Anti-charge\s*\(\+(\d+)\s+Rend\)/i);
      if (am) bonusRend += parseInt(am[1]);
    }
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

  const hitTarget = parseTarget(w.hit);
  const pHit = hitTarget !== null ? dieProb(Math.max(2, hitTarget - hitMod)) : 0;
  const woundTarget = parseTarget(w.wound);
  const pWound = woundTarget !== null ? dieProb(Math.max(2, woundTarget - woundMod)) : 0;
  const rend = parseRend(w.rend) + bonusRend;
  const saveMod = ctx.targetSaveMod ?? 0;
  const effSave = enemySave !== null ? (enemySave - saveMod) + rend : 99;
  const pSave = dieProb(effSave <= 6 ? effSave : null);
  const avgDmg = avgRoll(w.damage) + bonusDmg;
  const avgAtks = avgRoll(w.attacks) * modelCount;

  const pCrit = Math.min(P_CRIT, pHit);
  const pNormHit = pHit - pCrit;

  const abilityLower = (w.ability ?? '').toLowerCase();
  let dmgPerAtk: number;
  if (/crit\s*\(\s*(2\s*hits?|extra\s*hit)\s*\)/i.test(abilityLower)) {
    dmgPerAtk = (pHit + pCrit) * pWound * (1 - pSave) * avgDmg;
  } else if (/crit\s*\(\s*mortal\s*\)/i.test(abilityLower)) {
    dmgPerAtk = pCrit * 1 + pNormHit * pWound * (1 - pSave) * avgDmg;
  } else if (/crit\s*\(\s*auto.?wound\s*\)/i.test(abilityLower)) {
    dmgPerAtk = (pCrit + pNormHit * pWound) * (1 - pSave) * avgDmg;
  } else {
    const deadly = abilityLower.match(/crit\s*\(\s*deadly\s*(\d+)\s*\)/i);
    if (deadly) {
      dmgPerAtk = pCrit * parseInt(deadly[1]) + pNormHit * pWound * (1 - pSave) * avgDmg;
    } else {
      dmgPerAtk = pHit * pWound * (1 - pSave) * avgDmg;
    }
  }

  return avgAtks * dmgPerAtk;
}

function totalExpectedDmg(attacker: Unit, attackerState: UnitState, target: Unit, targetState: UnitState): number {
  const attackerRemaining = modelsRemaining(attacker, attackerState.wounds);
  const targetSaveNum = target.save ? parseTarget(target.save) : null;
  const ctx: AttackContext = {
    attackerCharged: !!attackerState.charged,
    hitMod: attackerState.hitModifier ?? 0,
    targetCharged: !!targetState.charged,
    targetSaveMod: targetState.saveModifier ?? 0,
    targetKeywords: target.keywords ?? [],
  };
  return attacker.weapons.reduce((sum, w) => sum + weaponExpectedDmg(w, targetSaveNum, attackerRemaining, ctx), 0);
}

// ── Component ─────────────────────────────────────────────────────────────────

interface CombatPredictionModalProps {
  visible: boolean;
  attacker: Unit | null;
  attackerState: UnitState;
  target: Unit | null;
  targetState: UnitState;
  onClose: () => void;
}

function pctStyle(pct: number) {
  if (pct >= 0.6) return { color: '#4CAF81' };
  if (pct >= 0.35) return { color: '#E6B566' };
  return { color: '#FF6B6B' };
}

export default function CombatPredictionModal({
  visible,
  attacker,
  attackerState,
  target,
  targetState,
  onClose,
}: CombatPredictionModalProps) {
  if (!attacker || !target) return null;

  const expectedDmg = totalExpectedDmg(attacker, attackerState, target, targetState);
  const targetTotal = unitTotalWounds(target);
  const targetRemaining = modelsRemaining(target, targetState.wounds);
  const targetHpLeft = targetTotal > 0 ? targetTotal - targetState.wounds : null;

  const targetModelsLeft = target.models > 1 ? targetRemaining : null;
  const healthStr = target.health ? parseTarget(target.health) : null;
  const perModelHp = healthStr ?? 1;

  // Survival probability: how likely it is that at least 1 model survives.
  // Simple estimate: P(dmg < remaining hp) ≈ treat expected as approximate.
  // We compute the ratio of remaining HP vs expected damage.
  const hpRatio = targetHpLeft !== null && targetHpLeft > 0 ? targetHpLeft / Math.max(0.01, expectedDmg) : null;
  const survivalPct = hpRatio !== null ? Math.min(1, Math.max(0, 1 - (1 / Math.max(1, hpRatio)))) : null;

  // Models killed estimate
  const modelsKilled = target.models > 1 && perModelHp > 0
    ? Math.min(targetRemaining, Math.floor(expectedDmg / perModelHp))
    : null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>⚔ Combat Prediction</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
            {/* Matchup header */}
            <View style={styles.matchupRow}>
              <View style={styles.matchupUnit}>
                <Text style={styles.matchupRole}>ATTACKER</Text>
                <Text style={styles.matchupName} numberOfLines={2}>{attacker.name}</Text>
                <Text style={styles.matchupMeta}>
                  {modelsRemaining(attacker, attackerState.wounds)}/{attacker.models} models
                  {attackerState.charged ? '  ⚡ charged' : ''}
                </Text>
              </View>
              <Text style={styles.vsText}>vs</Text>
              <View style={styles.matchupUnit}>
                <Text style={styles.matchupRole}>TARGET</Text>
                <Text style={styles.matchupName} numberOfLines={2}>{target.name}</Text>
                <Text style={styles.matchupMeta}>
                  {targetRemaining}/{target.models} models
                  {targetState.charged ? '  ⚡ charged' : ''}
                </Text>
              </View>
            </View>

            {/* Expected damage */}
            <View style={styles.resultBlock}>
              <Text style={styles.resultLabel}>Expected damage through</Text>
              <Text style={[styles.resultValue, pctStyle(Math.min(1, expectedDmg / Math.max(1, targetTotal)))]}>
                {expectedDmg >= 100 ? expectedDmg.toFixed(0) : expectedDmg.toFixed(1)}
              </Text>
              {modelsKilled !== null && (
                <Text style={styles.resultSub}>
                  ≈ {modelsKilled} of {targetRemaining} model{targetRemaining !== 1 ? 's' : ''} killed
                </Text>
              )}
            </View>

            {/* Survival */}
            {hpRatio !== null && (
              <View style={styles.resultBlock}>
                <Text style={styles.resultLabel}>Target survival odds</Text>
                <Text style={[styles.resultValue, pctStyle(hpRatio > 1 ? 0.85 : hpRatio > 0.5 ? 0.5 : 0.2)]}>
                  {targetHpLeft !== null ? `${targetHpLeft} HP left` : '—'}
                </Text>
                <Text style={styles.resultSub}>
                  {expectedDmg.toFixed(1)} expected vs {targetHpLeft?.toFixed(0)} remaining HP
                </Text>
              </View>
            )}

            {/* Active modifiers summary */}
            <View style={styles.modSummary}>
              <Text style={styles.modSummaryTitle}>Active modifiers</Text>
              {attackerState.charged && <Text style={styles.modRow}>⚡ Attacker charged — Charge abilities active</Text>}
              {(attackerState.hitModifier ?? 0) !== 0 && (
                <Text style={styles.modRow}>
                  Hit modifier: {(attackerState.hitModifier ?? 0) > 0 ? '+' : ''}{attackerState.hitModifier}
                </Text>
              )}
              {targetState.charged && <Text style={styles.modRow}>⚡ Target charged — Anti-charge rend active</Text>}
              {(targetState.saveModifier ?? 0) !== 0 && (
                <Text style={styles.modRow}>
                  Target save modifier: {(targetState.saveModifier ?? 0) > 0 ? '+' : ''}{targetState.saveModifier}
                </Text>
              )}
              {!attackerState.charged && (attackerState.hitModifier ?? 0) === 0 &&
               !targetState.charged && (targetState.saveModifier ?? 0) === 0 && (
                <Text style={styles.modRowMuted}>No active modifiers</Text>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sheet: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#0F1A2E',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: '#A68B4D',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#15203A',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: '#E9F0FF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2A3F5F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#9DB0CF',
    fontSize: 14,
    fontWeight: '800',
  },
  body: {
    maxHeight: 500,
  },
  bodyContent: {
    padding: 16,
    gap: 16,
  },
  matchupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  matchupUnit: {
    flex: 1,
    gap: 3,
  },
  matchupRole: {
    color: '#5BA9FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  matchupName: {
    color: '#E9F0FF',
    fontSize: 14,
    fontWeight: '800',
  },
  matchupMeta: {
    color: '#7A9FBF',
    fontSize: 11,
    fontWeight: '600',
  },
  vsText: {
    color: '#4C6A8C',
    fontSize: 14,
    fontWeight: '800',
    alignSelf: 'center',
  },
  resultBlock: {
    backgroundColor: '#0C1628',
    borderRadius: radii.md,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  resultLabel: {
    color: '#4C6A8C',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  resultValue: {
    fontSize: 36,
    fontWeight: '900',
  },
  resultSub: {
    color: '#7A9FBF',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  modSummary: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(91,169,255,0.12)',
    paddingTop: 12,
    gap: 5,
  },
  modSummaryTitle: {
    color: '#4C6A8C',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  modRow: {
    color: '#9DB0CF',
    fontSize: 12,
    fontWeight: '600',
  },
  modRowMuted: {
    color: '#3A5A7C',
    fontSize: 12,
    fontStyle: 'italic',
  },
});
