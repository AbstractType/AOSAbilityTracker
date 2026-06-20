import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Unit, WeaponProfile } from '../../types/unit';
import { colors, radii, shadows } from '../../theme/tokens';
import { useResponsive } from '../../utils/responsive';
import { unitTotalWounds, modelsRemaining } from '../../utils/units';

interface UnitCardProps {
  unit: Unit;
  /** Wounds taken so far (from the screen's ephemeral unit state). */
  wounds: number;
  /** Whether the unit is marked destroyed. */
  destroyed: boolean;
  /** Adjust wounds by ±1 (screen clamps to [0, total] and syncs destroyed). */
  onWoundsChange: (delta: number) => void;
  /** Toggle destroyed / revive. */
  onToggleDestroyed: () => void;
  /** This is a manifestation — summoned on demand (details hidden until then). */
  summonable?: boolean;
  /** Whether the manifestation is currently summoned. */
  summoned?: boolean;
  /** Toggle summoned / unsummoned. */
  onToggleSummoned?: () => void;
}

const HEADER_BG = '#15203A';
const BORDER = '#A68B4D'; // warscroll-style bronze edge, distinct from ability cards

/**
 * UnitCard — a parchment "warscroll" card for one unit: its stat line, weapon
 * profiles (melee + ranged) and an interactive footer for tracking wounds and
 * marking the unit destroyed during a game.
 */
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

  const total = unitTotalWounds(unit); // 0 ⇒ not wound-trackable (e.g. terrain)
  const trackable = total > 0;
  const remaining = Math.max(0, total - wounds);
  const ranged = unit.weapons.filter((w) => w.kind === 'ranged');
  const melee = unit.weapons.filter((w) => w.kind === 'melee');

  // A manifestation that hasn't been summoned shows only its name + a Summon
  // button — its stats, weapons and abilities stay hidden until it's on the table.
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
      {/* Header — name + points/models + caster tag */}
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
              <Text style={styles.reinforcedTagText}>⚑ REINFORCED</Text>
            </View>
          )}
          {summonable && summoned && (
            <View style={styles.summonedTag}>
              <Text style={styles.summonedTagText}>✦ SUMMONED</Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          {unit.points !== undefined && <Text style={styles.points}>{unit.points} pts</Text>}
          <Text style={styles.models}>
            {unit.models} {unit.models === 1 ? 'model' : 'models'}
          </Text>
        </View>
      </View>

      {/* Stat line */}
      <View style={styles.statRow}>
        <Stat label="MOVE" value={unit.move} />
        <Stat label="HEALTH" value={unit.health} />
        <Stat label="SAVE" value={unit.save} />
        {unit.banishment ? (
          <Stat label="BANISH" value={unit.banishment} />
        ) : (
          <Stat label="CONTROL" value={unit.control} />
        )}
        {unit.ward ? <Stat label="WARD" value={unit.ward} /> : null}
      </View>

      {/* Keywords tags */}
      {unit.keywords && unit.keywords.length > 0 && (
        <View style={styles.keywordsRow}>
          {unit.keywords
            .filter(kw => kw.toLowerCase() !== 'manifestation')
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
        {melee.length > 0 && <WeaponTable title="MELEE WEAPONS" weapons={melee} />}
        {unit.weapons.length === 0 && <Text style={styles.noWeapons}>No weapon profiles.</Text>}
      </View>

      {/* Interactive footer — wounds + destroyed */}
      <View style={styles.footer}>
        {trackable ? (
          <View style={styles.woundsRow}>
            <Text style={styles.woundsLabel}>Wounds</Text>
            {/* The value shown is wounds REMAINING, so − takes a wound (remaining
                down) and + heals (remaining up). */}
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
          <Text style={styles.woundsLabel}>{destroyed ? 'Destroyed' : 'On the battlefield'}</Text>
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

/** One stat chip (label over value). */
function Stat({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.statChip}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value || '-'}</Text>
    </View>
  );
}

/** A weapon group with an aligned column header and one block per weapon. */
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
      {weapons.map((w) => (
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
          {w.ability ? <Text style={styles.weaponAbility}>✦ {w.ability}</Text> : null}
        </View>
      ))}
    </View>
  );
}

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
  // ---- header ----
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
  // ---- stat line ----
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
  // ---- keywords ----
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
  // ---- weapons ----
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
  // ---- footer ----
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
  // ---- manifestation (summon) ----
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
  destroyBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
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
