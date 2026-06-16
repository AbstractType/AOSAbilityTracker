import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { supabase } from '../lib/supabase';
import {
  getRoomState,
  setAbilityUsed,
  stateKey,
  type RoomStateRow,
} from '../utils/warRoomState';
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
 * WarRoomScreen — shows BOTH players' armies (grouped by phase) behind a tab,
 * with ability "used" state synced live between the two players.
 *
 * Sync model: a `war_room_state` row per used ability, keyed by the army
 * owner's id + the stable abilityKey. You only mark YOUR OWN army (RLS enforces
 * it); the opponent's tab is read-only and reflects their marks in real time.
 * A single Realtime channel carries postgres_changes (the state) + presence
 * (the "opponent online" dot). The DB is the source of truth — on (re)subscribe
 * we refetch the full state to catch anything missed while disconnected.
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

  const iAmPlayer1 = room.player1Id === userId;
  const myId = userId;
  const oppId = iAmPlayer1 ? room.player2Id : room.player1Id;
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

  // Synced used-state, keyed by `${ownerId}::${abilityKey}`.
  const [usedMap, setUsedMap] = useState<Map<string, boolean>>(new Map());
  const [opponentOnline, setOpponentOnline] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const [side, setSide] = useState<Side>('mine');

  // ---- Realtime: state sync + presence ----
  useEffect(() => {
    let cancelled = false;

    function applyRows(rows: RoomStateRow[]) {
      const next = new Map<string, boolean>();
      for (const r of rows) next.set(stateKey(r.owner_id, r.ability_key), r.used);
      if (!cancelled) setUsedMap(next);
    }

    // Initial load (also re-run on SUBSCRIBED below to catch missed events).
    getRoomState(room.id).then(applyRows);

    const channel = supabase
      .channel(`room:${room.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'war_room_state',
          filter: `room_id=eq.${room.id}`,
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            const old = payload.old as any;
            if (old?.owner_id && old?.ability_key) {
              setUsedMap((m) => {
                const n = new Map(m);
                n.delete(stateKey(old.owner_id, old.ability_key));
                return n;
              });
            }
            return;
          }
          const row = payload.new as any;
          setUsedMap((m) => {
            const n = new Map(m);
            n.set(stateKey(row.owner_id, row.ability_key), row.used);
            return n;
          });
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const presences = Object.values(channel.presenceState()).flat() as any[];
        setOpponentOnline(presences.some((p) => p.user_id === oppId));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Refetch the authoritative full state, then announce our presence.
          const rows = await getRoomState(room.id);
          applyRows(rows);
          await channel.track({ user_id: myId });
        }
      });

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [room.id, myId, oppId]);

  // Toggle one of MY abilities: optimistic local update + upsert; revert on error.
  async function toggleMine(key: string) {
    const cur = usedMap.get(stateKey(myId, key)) ?? false;
    const nextUsed = !cur;
    setUsedMap((m) => {
      const n = new Map(m);
      n.set(stateKey(myId, key), nextUsed);
      return n;
    });
    setSyncError(null);
    try {
      await setAbilityUsed(room.id, key, nextUsed);
    } catch (err) {
      // Revert the optimistic change.
      setUsedMap((m) => {
        const n = new Map(m);
        n.set(stateKey(myId, key), cur);
        return n;
      });
      setSyncError(err instanceof Error ? err.message : 'Could not sync that change.');
    }
  }

  const abilities = side === 'mine' ? myAbilities : oppAbilities;
  const ownerId = side === 'mine' ? myId : oppId;

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

      {/* Side tabs + presence */}
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
            <View style={styles.tabLabelRow}>
              <View
                style={[styles.dot, { backgroundColor: opponentOnline ? '#4ADE80' : '#5A6B85' }]}
              />
              <Text style={[styles.tabText, side === 'opponent' && styles.tabTextActive]}>
                {opponentLabel ? `@${opponentLabel}` : 'Opponent'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {side === 'opponent' ? (
          <Text style={styles.readonlyNote}>
            {opponentOnline ? 'Online — ' : 'Offline — '}their marks update live. View only.
          </Text>
        ) : null}
        {syncError ? <Text style={styles.errorText}>{syncError}</Text> : null}
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
              ? "Your opponent's army has no abilities to show."
              : 'No abilities found in this army.'}
          </Text>
        ) : (
          sections.map((section) => (
            <View key={section.phase} style={styles.section}>
              <Text style={styles.phaseLabel}>{section.phase}</Text>
              {section.items.map((ability, i) => {
                const key = keyForAbility(ability);
                const used = ownerId ? usedMap.get(stateKey(ownerId, key)) ?? false : false;
                const display: Ability = { ...ability, used };
                return (
                  <View key={`${ability.id}-${i}`} style={styles.cardWrap}>
                    <AbilityCard
                      ability={display}
                      // Own army: interactive + synced. Opponent: read-only.
                      onToggleUsed={side === 'mine' ? () => toggleMine(key) : noop}
                    />
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

function noop() {}

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
  tabLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.textPrimary,
  },
  readonlyNote: {
    color: colors.textDim,
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF8B8B',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
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
