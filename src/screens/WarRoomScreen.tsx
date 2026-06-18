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
import {
  initClock,
  advancePhase,
  passTurn,
  CLOCK_PHASES,
  type ClockState,
} from '../utils/warRoomClock';
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
  // Opponent presence outcomes:
  //  - opponentLeft: they tapped Leave (definitive, via a broadcast).
  //  - opponentAway: they've been presence-offline past a grace period
  //    (covers closing the tab / disconnecting, while tolerating a refresh).
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [opponentAway, setOpponentAway] = useState(false);
  // Channel handle so the Leave button can broadcast before tearing down.
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const [side, setSide] = useState<Side>('mine'); // narrow-screen tab

  // Shared game clock (stored on war_rooms, synced via Realtime). Initialized
  // from the room prop; kept current by the subscription below.
  const [clock, setClock] = useState({
    activePlayerId: room.activePlayerId,
    currentPhase: room.currentPhase as Phase | null,
    turnNumber: room.turnNumber,
    phaseStartedAt: room.phaseStartedAt,
  });
  const [advancing, setAdvancing] = useState(false);
  const [clockError, setClockError] = useState<string | null>(null);

  // Whose turn — from the shared clock. Before it's initialized, treat player1
  // (the challenger) as active so the view is sensible.
  const isMyTurn = clock.activePlayerId ? clock.activePlayerId === myId : iAmPlayer1;
  const myRole: TurnRole = isMyTurn ? 'active' : 'inactive';
  const oppRole: TurnRole = isMyTurn ? 'inactive' : 'active';

  // The phase being viewed — defaults to (and follows) the clock's current
  // phase, but you can tap a chip to browse another phase locally.
  const [viewPhase, setViewPhase] = useState<Phase | null>(
    (room.currentPhase as Phase) ?? null
  );
  useEffect(() => {
    setViewPhase((clock.currentPhase as Phase) ?? null);
  }, [clock.currentPhase]);

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
      // Shared clock changes (whose turn / current phase / turn number).
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'war_rooms',
          filter: `id=eq.${room.id}`,
        },
        (payload) => {
          const r = payload.new as any;
          if (cancelled) return;
          setClock({
            activePlayerId: r.active_player_id ?? null,
            currentPhase: (r.current_phase ?? null) as Phase | null,
            turnNumber: r.turn_number ?? 1,
            phaseStartedAt: r.phase_started_at
              ? new Date(r.phase_started_at).getTime()
              : Date.now(),
          });
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const presences = Object.values(channel.presenceState()).flat() as any[];
        setOpponentOnline(presences.some((p) => p.user_id === oppId));
      })
      // Definitive "I'm leaving" signal sent by the other player's Leave button.
      .on('broadcast', { event: 'left' }, (msg) => {
        if ((msg.payload as any)?.user_id === oppId) setOpponentLeft(true);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const rows = await getRoomState(room.id);
          applyRows(rows);
          await channel.track({ user_id: myId });
          // Initialize the clock if no one has yet (conditional — first wins).
          if (!room.activePlayerId) {
            await initClock(room.id, room.player1Id);
          }
        }
      });

    channelRef.current = channel;

    return () => {
      cancelled = true;
      channelRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [room.id, myId, oppId]);

  // Confirm an "away" opponent after a short grace period, so a quick refresh
  // (offline → online) doesn't flash a "left" message. A definitive Leave
  // (opponentLeft) supersedes this.
  useEffect(() => {
    if (opponentLeft || opponentOnline) {
      setOpponentAway(false);
      return;
    }
    const t = setTimeout(() => setOpponentAway(true), 6000);
    return () => clearTimeout(t);
  }, [opponentOnline, opponentLeft]);

  // Leave: tell the opponent first (best-effort), then exit.
  function handleLeave() {
    try {
      channelRef.current?.send({
        type: 'broadcast',
        event: 'left',
        payload: { user_id: myId },
      });
    } catch {
      /* best-effort */
    }
    onLeave();
  }

  // ---- Clock controls (either player may advance the shared clock) ----
  function currentClockState(): ClockState | null {
    if (!clock.activePlayerId || !clock.currentPhase) return null;
    return {
      roomId: room.id,
      activePlayerId: clock.activePlayerId,
      currentPhase: clock.currentPhase,
      turnNumber: clock.turnNumber,
      phaseStartedAt: clock.phaseStartedAt,
    };
  }

  async function handleNextPhase() {
    const c = currentClockState();
    if (!c || advancing) return;
    setAdvancing(true);
    setClockError(null);
    try {
      await advancePhase(c); // realtime echo updates local clock
    } catch (err) {
      setClockError(err instanceof Error ? err.message : 'Could not advance the phase.');
    } finally {
      setAdvancing(false);
    }
  }

  async function handlePassTurn() {
    const c = currentClockState();
    if (!c || !oppId || advancing) return;
    setAdvancing(true);
    setClockError(null);
    try {
      await passTurn(c, oppId);
    } catch (err) {
      setClockError(err instanceof Error ? err.message : 'Could not pass the turn.');
    } finally {
      setAdvancing(false);
    }
  }

  const atLastPhase = clock.currentPhase === CLOCK_PHASES[CLOCK_PHASES.length - 1];

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
    () => abilitiesForRole(myAbilities, myRole, viewPhase),
    [myAbilities, myRole, viewPhase]
  );
  const oppColumn = useMemo(
    () => abilitiesForRole(oppAbilities, oppRole, viewPhase),
    [oppAbilities, oppRole, viewPhase]
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
            {viewPhase ? ' in this phase' : ''}.
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
        <TouchableOpacity onPress={handleLeave} style={styles.leaveBtn} accessibilityLabel="Leave war room">
          <Text style={styles.leaveText}>Leave</Text>
        </TouchableOpacity>
      </View>

      {/* Opponent gone banner: definitive leave (red) or disconnected (amber) */}
      {opponentLeft || opponentAway ? (
        <View
          style={[
            styles.bar,
            { maxWidth: contentMaxWidth, paddingHorizontal: padding, paddingTop: 0, paddingBottom: 0 },
          ]}
        >
          <View style={[styles.goneBanner, opponentLeft ? styles.goneLeft : styles.goneAway]}>
            <Text style={styles.goneText}>
              {opponentLeft
                ? `${oppTitle} left the war room — you're on your own now.`
                : `${oppTitle} seems to have disconnected. Their marks won't update until they're back.`}
            </Text>
            {opponentLeft ? (
              <TouchableOpacity onPress={handleLeave} style={styles.goneBtn} activeOpacity={0.8}>
                <Text style={styles.goneBtnText}>Leave</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ) : null}

      {/* Shared game clock + phase selector */}
      <View style={[styles.controls, { maxWidth: contentMaxWidth, paddingHorizontal: padding }]}>
        <View style={styles.clockRow}>
          <View style={styles.clockInfo}>
            <Text style={styles.clockTurn}>Turn {clock.turnNumber}</Text>
            <Text
              style={[styles.clockWho, isMyTurn ? styles.clockWhoMine : styles.clockWhoOpp]}
              numberOfLines={1}
            >
              {isMyTurn ? 'Your turn' : `${oppTitle}'s turn`}
            </Text>
            {clock.currentPhase ? (
              <Text style={styles.clockPhase} numberOfLines={1}>
                · {clock.currentPhase}
              </Text>
            ) : null}
          </View>
          <View style={styles.clockBtns}>
            <TouchableOpacity
              style={[styles.clockBtn, (atLastPhase || advancing) && styles.clockBtnDisabled]}
              onPress={handleNextPhase}
              disabled={atLastPhase || advancing}
              activeOpacity={0.8}
              accessibilityLabel="Next phase"
            >
              <Text style={styles.clockBtnText}>Next phase →</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.clockBtn, styles.clockBtnAlt, advancing && styles.clockBtnDisabled]}
              onPress={handlePassTurn}
              disabled={advancing}
              activeOpacity={0.8}
              accessibilityLabel="Pass turn"
            >
              <Text style={styles.clockBtnText}>Pass turn ⇄</Text>
            </TouchableOpacity>
          </View>
        </View>
        {clockError ? <Text style={styles.errorText}>{clockError}</Text> : null}

        <PhaseSelector
          phases={PHASES}
          activePhase={viewPhase}
          isPhaseSelectable={() => true}
          onPhasePress={(phase) => setViewPhase((p) => (p === phase ? null : phase))}
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
  goneBanner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
  },
  goneLeft: {
    backgroundColor: '#3A1E22',
    borderColor: '#7F3D44',
  },
  goneAway: {
    backgroundColor: '#3A301E',
    borderColor: '#7F6A3D',
  },
  goneText: {
    flex: 1,
    minWidth: 0,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  goneBtn: {
    backgroundColor: '#6F384F',
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  goneBtnText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  controls: {
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 8,
  },
  clockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  clockInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    flexShrink: 1,
    minWidth: 0,
  },
  clockTurn: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  clockWho: {
    fontSize: 13,
    fontWeight: '700',
  },
  clockWhoMine: {
    color: '#4ADE80',
  },
  clockWhoOpp: {
    color: '#9DBDFF',
  },
  clockPhase: {
    color: colors.textSecondary,
    fontSize: 13,
    flexShrink: 1,
    minWidth: 0,
  },
  clockBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  clockBtn: {
    backgroundColor: '#3F66D6',
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  clockBtnAlt: {
    backgroundColor: '#4C5775',
  },
  clockBtnDisabled: {
    opacity: 0.45,
  },
  clockBtnText: {
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
