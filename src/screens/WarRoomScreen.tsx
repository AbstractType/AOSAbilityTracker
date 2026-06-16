import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import type { Ability, Phase } from '../types';
import type { WarRoom } from '../types/warRoom';
import { parseAbilitiesFromJSON } from '../utils/jsonParser';
import { keyForAbility } from '../types/customization';
import AbilityCard from '../components/organisms/AbilityCard';
import { colors, radii } from '../theme/tokens';
import { useResponsive, getContentMaxWidth } from '../utils/responsive';

const PHASES: Phase[] = [
  'Deployment Phase',
  'Start of Turn',
  'Hero Phase',
  'Movement Phase',
  'Shooting Phase',
  'Charge Phase',
  'Combat Phase',
  'End of Turn',
];

interface WarRoomScreenProps {
  room: WarRoom;
  /** Current user id, to work out which side is "yours". */
  userId: string;
  /** Opponent's handle for the tab label, if known. */
  opponentLabel?: string;
  onLeave: () => void;
}

type Side = 'mine' | 'opponent';

/**
 * WarRoomScreen — shows BOTH players' armies (grouped by phase) with a tab to
 * switch between them, so each player can see what either side can do. In this
 * phase, "used" toggling is LOCAL to your device (not synced) — Phase 3 adds
 * live sync keyed on the same `abilityKey`.
 */
export default function WarRoomScreen({
  room,
  userId,
  opponentLabel,
  onLeave,
}: WarRoomScreenProps) {
  const { width, select } = useResponsive();
  const contentMaxWidth = Math.min(getContentMaxWidth(width), 720);
  const padding = select({ mobile: 16, default: 24 });

  // Which army is "mine"? Fall back to player1 if id matching is inconclusive.
  const iAmPlayer1 = room.player1Id === userId;
  const myJson = iAmPlayer1 ? room.player1ArmyJson : room.player2ArmyJson;
  const oppJson = iAmPlayer1 ? room.player2ArmyJson : room.player1ArmyJson;

  const myAbilities = useMemo(
    () => (myJson ? parseAbilitiesFromJSON(myJson).abilities : []),
    [myJson]
  );
  const oppAbilities = useMemo(
    () => (oppJson ? parseAbilitiesFromJSON(oppJson).abilities : []),
    [oppJson]
  );

  // Local used-state per side, keyed by stable abilityKey (sync-ready for P3).
  const [usedMine, setUsedMine] = useState<Set<string>>(new Set());
  const [usedOpp, setUsedOpp] = useState<Set<string>>(new Set());

  const [side, setSide] = useState<Side>('mine');
  const abilities = side === 'mine' ? myAbilities : oppAbilities;
  const usedSet = side === 'mine' ? usedMine : usedOpp;
  const setUsedSet = side === 'mine' ? setUsedMine : setUsedOpp;

  function toggleUsed(key: string) {
    setUsedSet((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // Group the active side's abilities by phase (drop empty phases).
  const sections = useMemo(
    () =>
      PHASES.map((phase) => ({
        phase,
        items: abilities.filter((a) => a.phase === phase),
      })).filter((s) => s.items.length > 0),
    [abilities]
  );

  return (
    <View style={styles.root}>
      <View style={[styles.bar, { maxWidth: contentMaxWidth, paddingHorizontal: padding }]}>
        <Text style={styles.heading}>War Room</Text>
        <TouchableOpacity onPress={onLeave} style={styles.leaveBtn} accessibilityLabel="Leave war room">
          <Text style={styles.leaveText}>Leave</Text>
        </TouchableOpacity>
      </View>

      {/* Side tabs */}
      <View style={[styles.tabsWrap, { maxWidth: contentMaxWidth, paddingHorizontal: padding }]}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, side === 'mine' && styles.tabActive]}
            onPress={() => setSide('mine')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, side === 'mine' && styles.tabTextActive]}>
              Your army
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, side === 'opponent' && styles.tabActive]}
            onPress={() => setSide('opponent')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, side === 'opponent' && styles.tabTextActive]}>
              {opponentLabel ? `@${opponentLabel}` : 'Opponent'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { maxWidth: contentMaxWidth, paddingHorizontal: padding },
        ]}
      >
        {abilities.length === 0 ? (
          <Text style={styles.empty}>
            {side === 'opponent'
              ? "Your opponent hasn't joined yet, or their army has no abilities."
              : 'No abilities found in this army.'}
          </Text>
        ) : (
          sections.map((section) => (
            <View key={section.phase} style={styles.section}>
              <Text style={styles.phaseLabel}>{section.phase}</Text>
              {section.items.map((ability, i) => {
                const key = keyForAbility(ability);
                const display: Ability = { ...ability, used: usedSet.has(key) };
                return (
                  <View key={`${ability.id}-${i}`} style={styles.cardWrap}>
                    <AbilityCard ability={display} onToggleUsed={() => toggleUsed(key)} />
                  </View>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  bar: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  leaveBtn: {
    backgroundColor: '#6F384F',
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  leaveText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  tabsWrap: {
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 8,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#101725',
    borderRadius: radii.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radii.sm,
  },
  tabActive: {
    backgroundColor: '#22324A',
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.textPrimary,
  },
  content: {
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 48,
  },
  section: {
    marginTop: 16,
  },
  phaseLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  cardWrap: {
    marginBottom: 14,
  },
  empty: {
    color: colors.textDim,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 40,
  },
});
