import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import type { Ability, Phase } from '../types';
import type { WarRoom } from '../types/warRoom';
import type { Unit, UnitState } from '../types/unit';
import { parseAbilitiesFromJSON } from '../utils/jsonParser';
import { categorizeAbility } from '../utils/abilities';
import { unitTotalWounds } from '../utils/units';
import { keyForAbility } from '../types/customization';
import { supabase } from '../lib/supabase';
import {
  getRoomState,
  setAbilityUsed,
  stateKey,
  type RoomStateRow,
} from '../utils/warRoomState';
import {
  getUnitStates,
  upsertUnitState,
  rowToUnitState,
  unitStateKey,
  type UnitStateRow,
} from '../utils/warRoomUnitState';
import {
  advancePhase,
  passTurn,
  CLOCK_PHASES,
  type ClockState,
} from '../utils/warRoomClock';
import AbilityCard from '../components/organisms/AbilityCard';
import PhaseSelector from '../components/organisms/PhaseSelector';
import WizardSection from '../components/organisms/WizardSection';
import PriestSection from '../components/organisms/PriestSection';
import UnitSection from '../components/organisms/UnitSection';
import CombatPredictionModal from '../components/organisms/CombatPredictionModal';
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
/**
 * Like unitRelevantToPhase, but accounts for turn role: in Shooting Phase the
 * "has ranged weapons" rule only applies to the active player. The inactive
 * player can only fire if they have a specific ability (e.g. Covering Fire) in
 * that phase, which is already covered by the abilityPhases check.
 */
function unitRelevantToPhaseForRole(
  unit: Unit,
  phase: Phase,
  abilityPhases: Set<Phase> | undefined,
  role: TurnRole,
): boolean {
  if (phase === 'Combat Phase') return true;
  if (abilityPhases?.has(phase)) return true;
  if (phase === 'Shooting Phase' && role === 'active' && unit.weapons.some(w => w.kind === 'ranged')) return true;
  if (phase === 'Hero Phase' && (unit.isWizard || unit.isPriest)) return true;
  return false;
}

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

type AbilityCategory = 'spell' | 'prayer' | 'command' | 'passive_unit' | 'passive_terrain';
const categoryOrder: Record<AbilityCategory, number> = { spell: 0, prayer: 1, command: 2, passive_unit: 3, passive_terrain: 4 };
const categoryLabels: Record<AbilityCategory, string> = {
  spell: 'SPELLS', prayer: 'PRAYERS', command: 'COMMANDS',
  passive_unit: 'UNIT ABILITIES', passive_terrain: 'TERRAIN ABILITIES',
};

function groupByPhase(abilities: Ability[]) {
  return PHASES.map((phase) => {
    const items = abilities.filter((a) => a.phase === phase);
    const bucketed: Record<AbilityCategory, Ability[]> = {
      spell: [], prayer: [], command: [], passive_unit: [], passive_terrain: [],
    };
    items.forEach(a => bucketed[categorizeAbility(a)].push(a));
    const categories = (Object.entries(bucketed) as [AbilityCategory, Ability[]][])
      .filter(([, list]) => list.length > 0)
      .sort(([a], [b]) => categoryOrder[a] - categoryOrder[b])
      .map(([category, list]) => ({ category, items: list }));
    return { phase, items, categories };
  }).filter((s) => s.items.length > 0);
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

  const myParsed = useMemo(
    () => myJson ? parseAbilitiesFromJSON(myJson) : { abilities: [], wizards: [], priests: [], units: [] as Unit[] },
    [myJson]
  );
  const oppParsed = useMemo(
    () => oppJson ? parseAbilitiesFromJSON(oppJson) : { abilities: [], wizards: [], priests: [], units: [] as Unit[] },
    [oppJson]
  );

  const myAbilities = myParsed.abilities;
  const oppAbilities = oppParsed.abilities;
  const myUnits = myParsed.units;
  const myWizards = myParsed.wizards;
  const myPriests = myParsed.priests;
  const oppWizards = oppParsed.wizards;
  const oppPriests = oppParsed.priests;

  // Which phases each unit name has abilities in — used to filter units by viewPhase.
  const myAbilityPhasesBySource = useMemo(() => {
    const map = new Map<string, Set<Phase>>();
    for (const a of myAbilities) {
      if (!a.source) continue;
      const s = map.get(a.source) ?? new Set<Phase>();
      s.add(a.phase); map.set(a.source, s);
    }
    return map;
  }, [myAbilities]);

  const oppAbilityPhasesBySource = useMemo(() => {
    const map = new Map<string, Set<Phase>>();
    for (const a of oppAbilities) {
      if (!a.source) continue;
      const s = map.get(a.source) ?? new Set<Phase>();
      s.add(a.phase); map.set(a.source, s);
    }
    return map;
  }, [oppAbilities]);

  // Synced per-unit state for my units; opponent's state comes from Supabase.
  const [myUnitStates, setMyUnitStates] = useState<Map<string, UnitState>>(new Map());
  const [oppUnitStates, setOppUnitStates] = useState<Map<string, UnitState>>(new Map());
  // Combat pairing: unit I've selected to attack with (mine), and the target (opp).
  const [attackingUnitId, setAttackingUnitId] = useState<string | null>(null);
  const [targetUnitId, setTargetUnitId] = useState<string | null>(null);

  // Upsert my unit state to Supabase (best-effort, no UI revert on failure).
  const syncMyUnitState = useCallback((unitId: string, state: UnitState) => {
    if (!myId) return;
    upsertUnitState(room.id, myId, unitId, state).catch(() => {/* silent */});
  }, [room.id, myId]);

  const adjustMyUnitWounds = useCallback((unitId: string, delta: number) => {
    const unit = myUnits.find(u => u.id === unitId);
    if (!unit) return;
    const total = unitTotalWounds(unit);
    setMyUnitStates(prev => {
      const next = new Map(prev);
      const cur = next.get(unitId) ?? { wounds: 0, destroyed: false };
      const wounds = total > 0
        ? Math.max(0, Math.min(total, cur.wounds + delta))
        : Math.max(0, cur.wounds + delta);
      const updated = { ...cur, wounds, destroyed: total > 0 ? wounds >= total : cur.destroyed };
      next.set(unitId, updated);
      syncMyUnitState(unitId, updated);
      return next;
    });
  }, [myUnits, syncMyUnitState]);

  const toggleMyUnitDestroyed = useCallback((unitId: string) => {
    const unit = myUnits.find(u => u.id === unitId);
    if (!unit) return;
    const total = unitTotalWounds(unit);
    setMyUnitStates(prev => {
      const next = new Map(prev);
      const cur = next.get(unitId) ?? { wounds: 0, destroyed: false };
      const updated = cur.destroyed
        ? { ...cur, wounds: 0, destroyed: false }
        : { ...cur, wounds: total > 0 ? total : cur.wounds, destroyed: true };
      next.set(unitId, updated);
      syncMyUnitState(unitId, updated);
      return next;
    });
  }, [myUnits, syncMyUnitState]);

  const toggleMyUnitSummoned = useCallback((unitId: string) => {
    setMyUnitStates(prev => {
      const next = new Map(prev);
      const cur = next.get(unitId) ?? { wounds: 0, destroyed: false };
      const updated = { ...cur, wounds: 0, destroyed: false, summoned: !cur.summoned };
      next.set(unitId, updated);
      syncMyUnitState(unitId, updated);
      return next;
    });
  }, [syncMyUnitState]);

  const toggleMyUnitCharged = useCallback((unitId: string) => {
    setMyUnitStates(prev => {
      const next = new Map(prev);
      const cur = next.get(unitId) ?? { wounds: 0, destroyed: false };
      const updated = { ...cur, charged: !cur.charged };
      next.set(unitId, updated);
      syncMyUnitState(unitId, updated);
      return next;
    });
  }, [syncMyUnitState]);

  const adjustMyUnitHitMod = useCallback((unitId: string, delta: number) => {
    setMyUnitStates(prev => {
      const next = new Map(prev);
      const cur = next.get(unitId) ?? { wounds: 0, destroyed: false };
      const updated = { ...cur, hitModifier: Math.max(-2, Math.min(2, (cur.hitModifier ?? 0) + delta)) };
      next.set(unitId, updated);
      syncMyUnitState(unitId, updated);
      return next;
    });
  }, [syncMyUnitState]);

  const adjustMyUnitSaveMod = useCallback((unitId: string, delta: number) => {
    setMyUnitStates(prev => {
      const next = new Map(prev);
      const cur = next.get(unitId) ?? { wounds: 0, destroyed: false };
      const updated = { ...cur, saveModifier: Math.max(-2, Math.min(2, (cur.saveModifier ?? 0) + delta)) };
      next.set(unitId, updated);
      syncMyUnitState(unitId, updated);
      return next;
    });
  }, [syncMyUnitState]);

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

  // ---- Realtime: state sync + presence ----
  useEffect(() => {
    let cancelled = false;

    function applyRows(rows: RoomStateRow[]) {
      const next = new Map<string, boolean>();
      for (const r of rows) next.set(stateKey(r.owner_id, r.ability_key), r.used);
      if (!cancelled) setUsedMap(next);
    }

    function applyUnitStateRows(rows: UnitStateRow[]) {
      if (cancelled || !oppId) return;
      const next = new Map<string, UnitState>();
      for (const r of rows) {
        if (r.owner_id === oppId) {
          next.set(unitStateKey(r.owner_id, r.unit_id), rowToUnitState(r));
        } else if (r.owner_id === myId) {
          // Restore my own states if I rejoin mid-game.
          setMyUnitStates(prev => {
            const m = new Map(prev);
            if (!m.has(r.unit_id)) m.set(r.unit_id, rowToUnitState(r));
            return m;
          });
        }
      }
      setOppUnitStates(next);
    }

    getRoomState(room.id).then(applyRows);
    getUnitStates(room.id).then(applyUnitStateRows);

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
      // Opponent unit state changes (wounds, charged, modifiers).
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'war_room_unit_state',
          filter: `room_id=eq.${room.id}`,
        },
        (payload) => {
          if (cancelled) return;
          const row = (payload.eventType === 'DELETE' ? payload.old : payload.new) as any;
          if (!row?.owner_id || row.owner_id !== oppId) return;
          if (payload.eventType === 'DELETE') {
            setOppUnitStates(m => {
              const n = new Map(m);
              n.delete(unitStateKey(row.owner_id, row.unit_id));
              return n;
            });
            return;
          }
          setOppUnitStates(m => {
            const n = new Map(m);
            n.set(unitStateKey(row.owner_id, row.unit_id), rowToUnitState(row as UnitStateRow));
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
          // Clock is no longer auto-initialized here — players pick initiative first.
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

  async function handleInitiative(firstPlayerId: string) {
    if (advancing || !firstPlayerId) return;
    setAdvancing(true);
    setClockError(null);
    try {
      // .is('active_player_id', null) ensures only one player wins the race —
      // the second click is a no-op at the DB level (0 rows updated, no error).
      const { error } = await supabase
        .from('war_rooms')
        .update({
          active_player_id: firstPlayerId,
          current_phase: 'Deployment Phase',
          turn_number: 1,
          phase_started_at: new Date().toISOString(),
        })
        .eq('id', room.id)
        .is('active_player_id', null);
      if (error) throw new Error(error.message);
      // Fetch authoritative state so both players transition correctly,
      // regardless of who won the race (realtime echo may still be in flight).
      const { data: row, error: fetchErr } = await supabase
        .from('war_rooms')
        .select('active_player_id, current_phase, turn_number, phase_started_at')
        .eq('id', room.id)
        .single();
      if (fetchErr) throw new Error(fetchErr.message);
      if (row?.active_player_id) {
        setClock({
          activePlayerId: row.active_player_id,
          currentPhase: (row.current_phase as Phase) ?? 'Deployment Phase',
          turnNumber: row.turn_number ?? 1,
          phaseStartedAt: row.phase_started_at
            ? new Date(row.phase_started_at).getTime()
            : Date.now(),
        });
      }
    } catch (err) {
      setClockError(err instanceof Error ? err.message : 'Could not start the game.');
    } finally {
      setAdvancing(false);
    }
  }

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
    showOnlineDot: boolean,
    colOpts?: {
      wizards?: typeof myWizards;
      priests?: typeof myPriests;
      units?: Unit[];
      terrain?: Unit[];
      manifestations?: Unit[];
      unitStates?: Map<string, UnitState>;
      onWoundsChange?: (id: string, delta: number) => void;
      onToggleDestroyed?: (id: string) => void;
      onToggleSummoned?: (id: string) => void;
      onToggleCharged?: (id: string) => void;
      onHitModChange?: (id: string, delta: number) => void;
      onSaveModChange?: (id: string, delta: number) => void;
      onSelectForCombat?: (id: string) => void;
      attackingUnitId?: string | null;
      activePhase?: Phase | null;
      unitsTotal?: number;
    }
  ) {
    const sections = groupByPhase(columnAbilities);
    const { wizards = [], priests = [], units = [], terrain = [], manifestations = [],
      unitStates = new Map(), onWoundsChange, onToggleDestroyed, onToggleSummoned,
      onToggleCharged, onHitModChange, onSaveModChange, onSelectForCombat,
      attackingUnitId: colAttackingUnitId, activePhase: colActivePhase, unitsTotal: colUnitsTotal } = colOpts ?? {};

    const totalUnitCount = colUnitsTotal ?? units.length;
    const destroyedTotal = units.reduce(
      (n, u) => n + (unitStates.get(u.id)?.destroyed ? 1 : 0), 0
    );

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

        {/* Caster summary */}
        {(wizards.length > 0 || priests.length > 0) && (
          <View style={styles.castersRow}>
            {wizards.length > 0 && <WizardSection wizards={wizards} />}
            {priests.length > 0 && <PriestSection priests={priests} />}
          </View>
        )}

        {/* Unit section — interactive for mine, read-only for opponent */}
        {(units.length > 0 || manifestations.length > 0 || terrain.length > 0) && (
          <UnitSection
            units={units}
            terrain={terrain}
            manifestations={manifestations}
            unitsTotal={totalUnitCount}
            destroyedTotal={destroyedTotal}
            unitStates={unitStates}
            onUnitWoundsChange={onWoundsChange ?? noop}
            onToggleUnitDestroyed={onToggleDestroyed ?? noop}
            onToggleUnitSummoned={onToggleSummoned ?? noop}
            onToggleUnitCharged={onToggleCharged}
            onUnitHitModChange={onHitModChange}
            onUnitSaveModChange={onSaveModChange}
            onSelectUnitForCombat={onSelectForCombat}
            attackingUnitId={colAttackingUnitId}
            activePhase={colActivePhase}
            horizontalPadding={0}
            cardColumns={1}
          />
        )}

        {sections.length === 0 ? (
          <Text style={styles.empty}>
            Nothing usable {role === 'active' ? 'this turn' : "on the opponent's turn"}
            {viewPhase ? ' in this phase' : ''}.
          </Text>
        ) : (
          sections.map((section) => (
            <View key={section.phase} style={styles.section}>
              <Text style={styles.phaseLabel}>{section.phase}</Text>
              {section.categories.map(cat => (
                <View key={cat.category}>
                  {section.categories.length > 1 && (
                    <Text style={styles.categoryLabel}>{categoryLabels[cat.category]}</Text>
                  )}
                  {cat.items.map((ability, i) => {
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
              ))}
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

      {!clock.activePlayerId ? (
        /* ── Initiative picker ── */
        <ScrollView
          contentContainerStyle={[
            styles.initiativeContent,
            { maxWidth: Math.min(contentMaxWidth, 560), paddingHorizontal: padding },
          ]}
        >
          <Text style={styles.initiativeHeading}>Who takes the first turn?</Text>
          <Text style={styles.initiativeSub}>
            Either player can decide — choose a side or roll dice.
          </Text>

          <View style={styles.initiativeCards}>
            {/* My card */}
            <View style={styles.initiativeCard}>
              <Text style={styles.initiativeCardRole}>YOU</Text>
              <Text style={styles.initiativeCardUnits}>
                {myUnits.filter(u => !u.isTerrain && !u.isManifestation).length} units
              </Text>
              <TouchableOpacity
                style={[styles.initiativeGoBtn, advancing && styles.clockBtnDisabled]}
                onPress={() => handleInitiative(myId)}
                disabled={advancing}
                activeOpacity={0.8}
              >
                <Text style={styles.initiativeGoBtnText}>⚔ Go first</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.initiativeVsDivider}>
              <Text style={styles.initiativeVs}>vs</Text>
            </View>

            {/* Opponent card */}
            <View style={styles.initiativeCard}>
              <Text style={styles.initiativeCardRole}>
                {opponentLabel ? `@${opponentLabel}` : 'OPPONENT'}
              </Text>
              <Text style={styles.initiativeCardUnits}>
                {oppParsed.units.filter(u => !u.isTerrain && !u.isManifestation).length} units
              </Text>
              <TouchableOpacity
                style={[styles.initiativeGoBtn, (!oppId || advancing) && styles.clockBtnDisabled]}
                onPress={() => oppId && handleInitiative(oppId)}
                disabled={!oppId || advancing}
                activeOpacity={0.8}
              >
                <Text style={styles.initiativeGoBtnText}>⚔ Go first</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.initiativeRollBtn, advancing && styles.clockBtnDisabled]}
            onPress={() => {
              const winner = Math.random() < 0.5 ? myId : (oppId ?? myId);
              handleInitiative(winner);
            }}
            disabled={advancing}
            activeOpacity={0.8}
          >
            <Text style={styles.initiativeRollText}>🎲  Roll dice — let fate decide</Text>
          </TouchableOpacity>

          {clockError ? <Text style={styles.errorText}>{clockError}</Text> : null}
        </ScrollView>
      ) : (
        <>
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

          {/* Combat prediction modal */}
          {(() => {
            const attackerUnit = attackingUnitId ? myUnits.find(u => u.id === attackingUnitId) ?? null : null;
            const targetUnit   = targetUnitId   ? oppParsed.units.find(u => u.id === targetUnitId) ?? null : null;
            const attackerSt   = attackingUnitId ? (myUnitStates.get(attackingUnitId) ?? { wounds: 0, destroyed: false }) : { wounds: 0, destroyed: false };
            const targetSt     = (targetUnitId && oppId)
              ? (oppUnitStates.get(unitStateKey(oppId, targetUnitId)) ?? { wounds: 0, destroyed: false })
              : { wounds: 0, destroyed: false };
            return (
              <CombatPredictionModal
                visible={!!attackerUnit && !!targetUnit}
                attacker={attackerUnit}
                attackerState={attackerSt}
                target={targetUnit}
                targetState={targetSt}
                phase={viewPhase}
                onClose={() => { setAttackingUnitId(null); setTargetUnitId(null); }}
              />
            );
          })()}

          <ScrollView
            contentContainerStyle={[
              styles.content,
              { maxWidth: contentMaxWidth, paddingHorizontal: padding },
            ]}
          >
            {(() => {
              const myRealUnits = myUnits.filter(u => !u.isTerrain && !u.isManifestation);
              // Inactive player's ranged units only appear in Shooting Phase after they've
              // marked a Shooting Phase ability as used (e.g. Covering Fire).
              const inactiveShotActivated = viewPhase === 'Shooting Phase' && myRole === 'inactive' &&
                abilitiesForRole(myAbilities, 'inactive', 'Shooting Phase').some(a =>
                  usedMap.get(stateKey(myId, keyForAbility(a))) ?? false
                );
              const myUnitsSplit = {
                units: viewPhase
                  ? myRealUnits.filter(u => {
                      if (unitRelevantToPhaseForRole(u, viewPhase, myAbilityPhasesBySource.get(u.name), myRole)) return true;
                      return inactiveShotActivated && u.weapons.some(w => w.kind === 'ranged');
                    })
                  : myRealUnits,
                terrain: myUnits.filter(u => u.isTerrain && !u.isManifestation)
                  .filter(t => !viewPhase || !!myAbilityPhasesBySource.get(t.name)?.has(viewPhase)),
                manifestations: myUnits.filter(u => u.isManifestation),
              };
              const oppUnits = oppParsed.units;
              const oppRealUnits = oppUnits.filter(u => !u.isTerrain && !u.isManifestation);
              const oppUnitsSplit = {
                units: (viewPhase && !attackingUnitId)
                  ? oppRealUnits.filter(u => unitRelevantToPhaseForRole(u, viewPhase, oppAbilityPhasesBySource.get(u.name), oppRole))
                  : oppRealUnits,
                terrain: oppUnits.filter(u => u.isTerrain && !u.isManifestation)
                  .filter(t => !viewPhase || !!oppAbilityPhasesBySource.get(t.name)?.has(viewPhase)),
                manifestations: oppUnits.filter(u => u.isManifestation),
              };
              const oppStatesById = new Map<string, UnitState>();
              oppUnitsSplit.units.concat(oppUnitsSplit.terrain, oppUnitsSplit.manifestations)
                .forEach(u => {
                  const s = oppId ? oppUnitStates.get(unitStateKey(oppId, u.id)) : undefined;
                  if (s) oppStatesById.set(u.id, s);
                });

              const myColOpts = {
                wizards: myWizards,
                priests: myPriests,
                ...myUnitsSplit,
                unitsTotal: myRealUnits.length,
                unitStates: myUnitStates,
                onWoundsChange: adjustMyUnitWounds,
                onToggleDestroyed: toggleMyUnitDestroyed,
                onToggleSummoned: toggleMyUnitSummoned,
                onToggleCharged: toggleMyUnitCharged,
                onHitModChange: adjustMyUnitHitMod,
                onSaveModChange: adjustMyUnitSaveMod,
                onSelectForCombat: (viewPhase === 'Shooting Phase' || viewPhase === 'Combat Phase')
                  ? (id: string) => setAttackingUnitId(prev => prev === id ? null : id)
                  : undefined,
                attackingUnitId,
                activePhase: viewPhase,
              };
              const combatPhaseActive = viewPhase === 'Shooting Phase' || viewPhase === 'Combat Phase';
              const oppColOpts = {
                wizards: oppWizards,
                priests: oppPriests,
                ...oppUnitsSplit,
                unitsTotal: oppRealUnits.length,
                unitStates: oppStatesById,
                onSelectForCombat: (combatPhaseActive && attackingUnitId)
                  ? (id: string) => setTargetUnitId(prev => prev === id ? null : id)
                  : undefined,
                attackingUnitId: targetUnitId,
                activePhase: viewPhase,
              };

              return sideBySide ? (
                <View style={styles.columnsRow}>
                  {renderColumn(myColumn, myId, myRole, true, 'You', false, myColOpts)}
                  {renderColumn(oppColumn, oppId, oppRole, false, oppTitle, true, oppColOpts)}
                </View>
              ) : side === 'mine' ? (
                renderColumn(myColumn, myId, myRole, true, 'You', false, myColOpts)
              ) : (
                renderColumn(oppColumn, oppId, oppRole, false, oppTitle, true, oppColOpts)
              );
            })()}
          </ScrollView>
        </>
      )}
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
  castersRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
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
  categoryLabel: {
    color: '#9DB0CF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 10,
    marginBottom: 6,
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
  // ── Initiative picker ──
  initiativeContent: {
    alignSelf: 'center',
    width: '100%',
    paddingTop: 40,
    paddingBottom: 48,
    gap: 24,
  },
  initiativeHeading: {
    color: '#E9F0FF',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  initiativeSub: {
    color: '#7A9FBF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: -16,
  },
  initiativeCards: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  initiativeCard: {
    flex: 1,
    backgroundColor: '#0F1A2E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#22324A',
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  initiativeCardRole: {
    color: '#5BA9FF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  initiativeCardUnits: {
    color: '#7A9FBF',
    fontSize: 12,
    fontWeight: '600',
  },
  initiativeGoBtn: {
    marginTop: 4,
    backgroundColor: '#2D4E8A',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  initiativeGoBtnText: {
    color: '#E9F0FF',
    fontSize: 14,
    fontWeight: '800',
  },
  initiativeVsDivider: {
    justifyContent: 'center',
    paddingVertical: 8,
  },
  initiativeVs: {
    color: '#4C6A8C',
    fontSize: 15,
    fontWeight: '800',
  },
  initiativeRollBtn: {
    backgroundColor: '#1E2E48',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A68B4D',
    paddingVertical: 16,
    alignItems: 'center',
  },
  initiativeRollText: {
    color: '#E9D68C',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
