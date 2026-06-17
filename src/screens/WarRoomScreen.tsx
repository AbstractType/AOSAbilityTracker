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
import PhaseSelector from '../components/organisms/PhaseSelector';
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

// Two armies side-by-side need room to stay readable; below this we fall back
// to the You/Opponent tab.
const SIDE_BY_SIDE_MIN = 900;

interface WarRoomScreenProps {
  room: WarRoom;
  userId: string;
  opponentLabel?: string;
  onLeave: () => void;
}

type Side = 'mine' | 'opponent';
type TurnRole = 'active' | 'inactive';
type TurnScope = 'active' | 'inactive' | 'any';

/**
 * Classify an ability by WHOSE TURN it can be used on, from its timing text:
 *  - "Your …"            → active  (only on your own turn)
 *  - "Enemy …" / "Reaction:" → inactive (on the opponent's turn / reacting)
 *  - "Any …", passives, generic phase timings (Start/End of Turn, Deployment)
 *    or no timing → any (relevant regardless of whose turn)
 */
function classifyTiming(ability: Ability): TurnScope {
  const t = (ability.timing ?? '').toLowerCase();
  if (t.includes('your')) return 'active';
  if (t.includes('enemy') || t.includes('reaction')) return 'inactive';
  return 'any';
}

/**
 * Abilities a player in the given turn role should see: those matching their
 * role plus the always-relevant ('any') ones, optionally narrowed to a phase.
 */
function abilitiesForRole(
  abilities: Ability[],
  role: TurnRole,
  phaseFilter: Phase | null
): Ability[] {
  return abilities.filter((a) => {
    if (phaseFilter && a.phase !== phaseFilter) return false;
    const scope = classifyTiming(a);
    return scope === 'any' || scope === role;
  });
}

function groupByPhase(abilities: Ability[]) {
  return PHASES.map((phase) => ({
    phase,
    items: abilities.filter((a) => a.phase === phase),
  })).filter((s) => s.items.length > 0);
}

/**
 * WarRoomScreen — phase-selector at the top (like the tracker); both armies
 * shown side-by-side on wide screens, or behind a You/Opponent tab on narrow
 * ones. A local "whose turn" toggle filters each army to the abilities usable
 * in that role (active = your-turn abilities, inactive = reactions/enemy-turn),
 * while "used" state stays synced live between players (Phase 3).
 */
export default function WarRoomScreen({
  room,
  userId,
  opponentLabel,
  onLeave,
}: WarRoomScreenProps) {
  const { width, select } = useResponsive();
  const contentMaxWidth = Math.min(getContentMaxWidth(width), 1200);
  const padding = select({ mobile: 12, default: 24 });
  const sideBySide = width >= SIDE_BY_SIDE_MIN;

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

  // Local view controls.
  const [side, setSide] = useState<Side>('mine'); // narrow-screen tab
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [myTurn, setMyTurn] = useState(true); // local: is it my turn?

  const myRole: TurnRole = myTurn ? 'active' : 'inactive';
  const oppRole: TurnRole = myTurn ? 'inactive' : 'active';

  // ---- Realtime: state sync + presence (unchanged from Phase 3) ----
  useEffect(() => {
    let cancelled = false;

    function applyRows(rows: RoomStateRow[]) {
      const next = new Map<string, boolean>();
      for (const r of rows) next.set(stateKey(r.owner_id, r.ability_key), r.used);
      if (!cancelled) setUsedMap(next);
    }

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
      setUsedMap((m) => {
        const n = new Map(m);
        n.set(stateKey(myId, key), cur);
        return n;
      });
      setSyncError(err instanceof Error ? err.message : 'Could not sync that change.');
    }
  }

  // Role-filtered, phase-filtered ability lists per column.
  const myColumn = useMemo(
    () => abilitiesForRole(myAbilities, myRole, selectedPhase),
    [myAbilities, myRole, selectedPhase]
  );
  const oppColumn = useMemo(
    () => abilitiesForRole(oppAbilities, oppRole, selectedPhase),
    [oppAbilities, oppRole, selectedPhase]
  );

  function renderColumn(
    columnAbilities: Ability[],
    ownerId: string | null,
    role: TurnRole,
    interactive: boolean,
    headerTitle: string,
    showOnlineDot: boolean
  ) {
    const sections = groupByPhase(columnAbilities);
    return (
      <View style={styles.column}>
        <View style={styles.columnHeader}>
          <View style={styles.columnTitleRow}>
            {showOnlineDot ? (
              <View
                style={[styles.dot, { backgroundColor: opponentOnline ? '#4ADE80' : '#5A6B85' }]}
              />
            ) : null}
            <Text style={styles.columnTitle} numberOfLines={1}>
              {headerTitle}
            </Text>
          </View>
          <View style={[styles.roleBadge, role === 'active' ? styles.roleActive : styles.roleInactive]}>
            <Text style={styles.roleBadgeText}>
              {role === 'active' ? 'Active turn' : 'Reacting'}
            </Text>
          </View>
        </View>

        {sections.length === 0 ? (
          <Text style={styles.empty}>
            Nothing usable {role === 'active' ? 'this turn' : 'on the opponent’s turn'}
            {selectedPhase ? ' in this phase' : ''}.
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
                      onToggleUsed={interactive ? () => toggleMine(key) : noop}
                    />
                  </View>
                );
              })}
            </View>
          ))
        )}
      </View>
    );
  }

  const oppTitle = opponentLabel ? `@${opponentLabel}` : 'Opponent';

  return (
    <View style={styles.root}>
      {/* Top bar */}
      <View style={[styles.bar, { maxWidth: contentMaxWidth, paddingHorizontal: padding }]}>
        <Text style={styles.heading}>War Room</Text>
        <TouchableOpacity onPress={onLeave} style={styles.leaveBtn} accessibilityLabel="Leave war room">
          <Text style={styles.leaveText}>Leave</Text>
        </TouchableOpacity>
      </View>

      {/* Controls: whose turn + phase selector */}
      <View style={[styles.controls, { maxWidth: contentMaxWidth, paddingHorizontal: padding }]}>
        <View style={styles.turnRow}>
          <Text style={styles.turnLabel}>Whose turn:</Text>
          <View style={styles.turnToggle}>
            <TouchableOpacity
              style={[styles.turnBtn, myTurn && styles.turnBtnActive]}
              onPress={() => setMyTurn(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.turnBtnText, myTurn && styles.turnBtnTextActive]}>Yours</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.turnBtn, !myTurn && styles.turnBtnActive]}
              onPress={() => setMyTurn(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.turnBtnText, !myTurn && styles.turnBtnTextActive]}>
                {oppTitle}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <PhaseSelector
          phases={PHASES}
          activePhase={selectedPhase}
          isPhaseSelectable={() => true}
          onPhasePress={(phase) =>
            setSelectedPhase((p) => (p === phase ? null : phase))
          }
        />

        {syncError ? <Text style={styles.errorText}>{syncError}</Text> : null}
      </View>

      {/* Narrow: You/Opponent tab. Wide: both columns side-by-side. */}
      {!sideBySide ? (
        <View style={[styles.tabsWrap, { maxWidth: contentMaxWidth, paddingHorizontal: padding }]}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, side === 'mine' && styles.tabActive]}
              onPress={() => setSide('mine')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, side === 'mine' && styles.tabTextActive]}>You</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, side === 'opponent' && styles.tabActive]}
              onPress={() => setSide('opponent')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, side === 'opponent' && styles.tabTextActive]}>
                {oppTitle}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { maxWidth: contentMaxWidth, paddingHorizontal: padding },
        ]}
      >
        {sideBySide ? (
          <View style={styles.columnsRow}>
            {renderColumn(myColumn, myId, myRole, true, 'You', false)}
            {renderColumn(oppColumn, oppId, oppRole, false, oppTitle, true)}
          </View>
        ) : side === 'mine' ? (
          renderColumn(myColumn, myId, myRole, true, 'You', false)
        ) : (
          renderColumn(oppColumn, oppId, oppRole, false, oppTitle, true)
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
  controls: {
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 8,
  },
  turnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  turnLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  turnToggle: {
    flexDirection: 'row',
    backgroundColor: '#101725',
    borderRadius: radii.md,
    padding: 3,
    flexShrink: 1,
  },
  turnBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.sm,
  },
  turnBtnActive: {
    backgroundColor: '#3F66D6',
  },
  turnBtnText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  turnBtnTextActive: {
    color: colors.textPrimary,
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
    paddingTop: 8,
  },
  columnsRow: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'flex-start',
  },
  column: {
    flex: 1,
    minWidth: 0,
  },
  columnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#22324A',
  },
  columnTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
    minWidth: 0,
  },
  columnTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  roleActive: {
    backgroundColor: 'rgba(74, 222, 128, 0.18)',
  },
  roleInactive: {
    backgroundColor: 'rgba(123, 143, 175, 0.18)',
  },
  roleBadgeText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  section: {
    marginTop: 14,
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
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 24,
  },
  errorText: {
    color: '#FF8B8B',
    fontSize: 12,
    marginTop: 6,
  },
});
