import React, { useRef, useState } from 'react';
import { Animated, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Unit, WeaponProfile } from '../../types/unit';
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
}

const HEADER_BG = '#15203A';
const BORDER = '#A68B4D';

// ─── Probability helpers ──────────────────────────────────────────────────────

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

/**
 * Expected damage for one weapon's full attack sequence vs an enemy with
 * a given save characteristic. Pass null for "no save" (unarmoured).
 */
function weaponExpectedDmg(
  w: WeaponProfile,
  enemySave: number | null,
  modelCount = 1,
): number {
  const pHit    = dieProb(parseTarget(w.hit));
  const pWound  = dieProb(parseTarget(w.wound));
  const rend    = parseRend(w.rend);
  const effSave = enemySave !== null ? enemySave + rend : 99;
  const pSave   = dieProb(effSave <= 6 ? effSave : null);
  return avgRoll(w.attacks) * modelCount * pHit * pWound * (1 - pSave) * avgRoll(w.damage);
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
          <TouchableOpacity style={[styles.destroyBtn, styles.summonBtn]} onPress={onToggleSummoned}>
            <Text style={styles.destroyBtnText}>Summon</Text>
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
          <StatsBack unit={unit} wounds={wounds} onFlip={handleFlip} />
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

            {/* Weapons */}
            <View style={styles.weaponsWrap}>
              {ranged.length > 0 && <WeaponTable title="RANGED WEAPONS" weapons={ranged} ranged />}
              {melee.length > 0  && <WeaponTable title="MELEE WEAPONS"  weapons={melee} />}
              {unit.weapons.length === 0 && (
                <Text style={styles.noWeapons}>No weapon profiles.</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Footer — always visible, outside the flip */}
      <View style={styles.footer}>
        {trackable ? (
          <View style={styles.woundsRow}>
            <Text style={styles.woundsLabel}>Wounds</Text>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => onWoundsChange(1)}
              disabled={wounds >= total}
            >
              <Text style={[styles.stepBtnText, wounds >= total && styles.stepBtnTextDisabled]}>
                −
              </Text>
            </TouchableOpacity>
            <Text style={styles.woundsValue}>
              {remaining}
              <Text style={styles.woundsTotal}>/{total}</Text>
            </Text>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => onWoundsChange(-1)}
              disabled={wounds <= 0}
            >
              <Text style={[styles.stepBtnText, wounds <= 0 && styles.stepBtnTextDisabled]}>+</Text>
            </TouchableOpacity>
            {unit.models > 1 && (
              <Text style={styles.modelsRemaining}>
                {modelsRemaining(unit, wounds)}/{unit.models} models
              </Text>
            )}
          </View>
        ) : (
          <Text style={styles.woundsLabel}>
            {destroyed ? 'Destroyed' : 'On the battlefield'}
          </Text>
        )}
        {summonable ? (
          <TouchableOpacity
            style={[styles.destroyBtn, styles.unsummonBtn]}
            onPress={onToggleSummoned}
          >
            <Text style={styles.destroyBtnText}>Unsummon</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.destroyBtn, destroyed ? styles.reviveBtn : styles.killBtn]}
            onPress={onToggleDestroyed}
          >
            <Text style={styles.destroyBtnText}>{destroyed ? 'Revive' : 'Destroy'}</Text>
          </TouchableOpacity>
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

function StatsBack({ unit, wounds, onFlip }: { unit: Unit; wounds: number; onFlip: () => void }) {
  const remaining = modelsRemaining(unit, wounds);

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
        {unit.weapons.length === 0 ? (
          <Text style={styles.backNoWeapons}>No weapon profiles.</Text>
        ) : (
          unit.weapons.map(w => {
            const pHit    = dieProb(parseTarget(w.hit));
            const pWound  = dieProb(parseTarget(w.wound));
            const avgAtk  = avgRoll(w.attacks) * remaining;
            const avgWnds = avgAtk * pHit * pWound;
            const noneVal = weaponExpectedDmg(w, null, remaining);
            const dmgVals = SAVE_TARGETS.map(s => weaponExpectedDmg(w, s, remaining));

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

                {/* Probability row */}
                <View style={styles.probRow}>
                  <View style={styles.probChip}>
                    <Text style={styles.probLabel}>Hit</Text>
                    <Text style={[styles.probValue, pctStyle(pHit)]}>
                      {Math.round(pHit * 100)}%
                    </Text>
                  </View>
                  <View style={styles.probChip}>
                    <Text style={styles.probLabel}>Wound</Text>
                    <Text style={[styles.probValue, pctStyle(pWound)]}>
                      {Math.round(pWound * 100)}%
                    </Text>
                  </View>
                  <View style={styles.probChip}>
                    <Text style={styles.probLabel}>Avg wnds</Text>
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

  // ── Footer ──
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(90,74,47,0.2)',
  },
  woundsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  woundsLabel: {
    color: colors.textCardSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#15203A',
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
    color: '#56657F',
  },
  woundsValue: {
    color: colors.textCardPrimary,
    fontSize: 16,
    fontWeight: '900',
    minWidth: 40,
    textAlign: 'center',
  },
  woundsTotal: {
    color: colors.textCardMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  modelsRemaining: {
    color: colors.textCardSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  destroyBtn: {
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  destroyBtnText: {
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
