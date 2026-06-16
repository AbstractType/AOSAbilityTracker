import React, { useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type PanResponderGestureState,
} from 'react-native';
import type { Ability, Phase } from '../../types';
import type { Customization } from '../../types/customization';
import { keyForAbility } from '../../types/customization';
import AbilityCard from './AbilityCard';
import { colors, radii } from '../../theme/tokens';

interface PhaseSection {
  phase: Phase;
  items: Ability[];
}

interface ReorderableAbilityListProps {
  /** Phase sections (already filtered + sorted) to reorder. */
  sections: PhaseSection[];
  /** Per-ability customization map (drives note / hidden styling on cards). */
  customizations: Map<string, Customization>;
  /** Max content width (same as the normal list so layout matches). */
  contentMaxWidth: number;
  /** Horizontal padding inside the list. */
  horizontalPadding: number;
  /** Columns for the masonry grid (same as the normal list). */
  cardColumns: number;
  /**
   * Commit a phase's new order. The screen does the optimistic update +
   * Supabase persist + revert-on-error.
   */
  onCommitPhaseOrder: (phase: Phase, reordered: Ability[]) => void;
}

const GAP = 14;
// How long (ms) the user must hold a card before a move becomes a drag. Below
// this, a finger-move is treated as a scroll — so the list still scrolls
// normally and only a deliberate press-and-hold picks a card up.
const HOLD_TO_DRAG_MS = 180;

// ---------------------------------------------------------------------------
// Wiggle animation (web): a subtle looping rotation on every card so it reads
// as "draggable", like iOS home-screen edit mode. Injected once as real CSS
// (far cheaper than driving dozens of JS-driven Animated loops). Three phase
// variants keep neighbouring cards from wiggling in lockstep.
// ---------------------------------------------------------------------------
const WIGGLE_STYLE_ID = 'aos-reorder-wiggle';
function injectWiggleCssOnce() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  if (document.getElementById(WIGGLE_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = WIGGLE_STYLE_ID;
  style.textContent = `
    @keyframes aosWiggle {
      0%   { transform: rotate(-1.4deg); }
      50%  { transform: rotate(1.4deg); }
      100% { transform: rotate(-1.4deg); }
    }
    [data-wiggle="0"] { animation: aosWiggle 0.30s ease-in-out infinite; animation-delay: 0s; }
    [data-wiggle="1"] { animation: aosWiggle 0.33s ease-in-out infinite; animation-delay: -0.11s; }
    [data-wiggle="2"] { animation: aosWiggle 0.28s ease-in-out infinite; animation-delay: -0.19s; }
  `;
  document.head.appendChild(style);
}

/**
 * ReorderableAbilityList — the drag-to-reorder view shown when the tracker is
 * in Reorder mode. It renders the SAME masonry grid as the normal list, but
 * every card wiggles to signal it's draggable, and each card can be
 * press-held and dragged to a new slot within its phase.
 *
 * Each phase is an independent sortable (`SortablePhase`), which structurally
 * enforces "within-phase only": there's no shared index space across phases,
 * so a card can never land in another phase's section.
 *
 * Hand-rolled with PanResponder + Animated (no gesture/animation libraries),
 * working on touch and mouse via React Native Web. Drop targeting measures
 * each card's on-screen rect at pickup and hit-tests the pointer against them.
 */
export default function ReorderableAbilityList({
  sections,
  customizations,
  contentMaxWidth,
  horizontalPadding,
  cardColumns,
  onCommitPhaseOrder,
}: ReorderableAbilityListProps) {
  injectWiggleCssOnce();

  // While any card is mid-drag, disable ScrollView scrolling so the parent pan
  // doesn't fight the card drag on touch.
  const [dragging, setDragging] = useState(false);

  return (
    <ScrollView
      style={styles.list}
      scrollEnabled={!dragging}
      contentContainerStyle={[
        styles.content,
        { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' },
      ]}
    >
      <View style={[styles.hintBox, { marginHorizontal: horizontalPadding }]}>
        <Text style={styles.hintText}>
          Press and hold a card, then drag it to a new spot within its phase.
          Changes save automatically — tap ✓ in the header when done.
        </Text>
      </View>

      {sections.map((section) =>
        section.items.length === 0 ? null : (
          <SortablePhase
            key={section.phase}
            phase={section.phase}
            items={section.items}
            customizations={customizations}
            horizontalPadding={horizontalPadding}
            cardColumns={cardColumns}
            onDragActiveChange={setDragging}
            onCommit={(reordered) => onCommitPhaseOrder(section.phase, reordered)}
          />
        )
      )}
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// SortablePhase — one phase's independent masonry sortable
// ---------------------------------------------------------------------------

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface SortablePhaseProps {
  phase: Phase;
  items: Ability[];
  customizations: Map<string, Customization>;
  horizontalPadding: number;
  cardColumns: number;
  onDragActiveChange: (active: boolean) => void;
  onCommit: (reordered: Ability[]) => void;
}

function SortablePhase({
  phase,
  items,
  customizations,
  horizontalPadding,
  cardColumns,
  onDragActiveChange,
  onCommit,
}: SortablePhaseProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

  // Shared drag transform — only the active card reads these.
  const drag = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;

  // Per-card node refs (for measureInWindow) and their measured screen rects,
  // both keyed by linear index.
  const nodeRefs = useRef<Array<View | null>>([]);
  const rectsRef = useRef<Array<Rect | null>>([]);
  // Pointer screen position at pickup, so move-deltas map back to screen space.
  const grantPointer = useRef({ x: 0, y: 0 });
  const fromRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const snapshotRef = useRef<Ability[]>([]);

  // Latest handlers in a ref so each card's once-created PanResponder always
  // calls fresh closures (items/indices change across commits).
  const handlers = useRef({
    onGrant: (_from: number, _g: PanResponderGestureState) => {},
    onMove: (_from: number, _g: PanResponderGestureState) => {},
    onRelease: (_from: number) => {},
  });

  handlers.current.onGrant = (from, g) => {
    snapshotRef.current = [...items];
    fromRef.current = from;
    targetRef.current = from;
    grantPointer.current = { x: g.x0, y: g.y0 };

    // Snapshot every card's on-screen rect. measureInWindow is async but
    // resolves within a frame — well before the user releases.
    rectsRef.current = [];
    nodeRefs.current.forEach((node, i) => {
      if (node && typeof (node as any).measureInWindow === 'function') {
        (node as any).measureInWindow((x: number, y: number, w: number, h: number) => {
          rectsRef.current[i] = { x, y, w, h };
        });
      }
    });

    drag.setValue({ x: 0, y: 0 });
    setDragIndex(from);
    setTargetIndex(from);
    onDragActiveChange(true);
    Animated.spring(scale, {
      toValue: 1.05,
      useNativeDriver: false,
      bounciness: 6,
    }).start();
  };

  handlers.current.onMove = (_from, g) => {
    drag.setValue({ x: g.dx, y: g.dy });

    const px = grantPointer.current.x + g.dx;
    const py = grantPointer.current.y + g.dy;
    const rects = rectsRef.current;

    // Which card is the pointer currently over? That card's linear index is
    // where the dragged card will be inserted on release.
    let found: number | null = null;
    for (let i = 0; i < rects.length; i++) {
      const r = rects[i];
      if (!r) continue;
      if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) {
        found = i;
        break;
      }
    }
    // Keep the last valid target if the pointer is momentarily in a gap.
    if (found !== null && found !== targetRef.current) {
      targetRef.current = found;
      setTargetIndex(found);
    }
  };

  handlers.current.onRelease = () => {
    const from = fromRef.current;
    const to = targetRef.current;

    drag.setValue({ x: 0, y: 0 });
    scale.setValue(1);
    setDragIndex(null);
    setTargetIndex(null);
    onDragActiveChange(false);

    if (to != null && to !== from && snapshotRef.current.length) {
      const reordered = [...snapshotRef.current];
      const [moved] = reordered.splice(from, 1);
      reordered.splice(to, 0, moved);
      onCommit(reordered);
    }
  };

  // Distribute LINEAR INDICES (not items) round-robin into columns so each
  // card keeps a stable linear index for the drag math while rendering in the
  // same masonry layout as the normal list.
  const columns = distributeIntoColumns(
    items.map((_, i) => i),
    cardColumns
  );

  return (
    <View style={[styles.phaseBlock, { paddingHorizontal: horizontalPadding }]}>
      <View style={styles.phaseHeaderRow}>
        <View style={[styles.phaseDot, { backgroundColor: colors.phase[phase] }]} />
        <Text style={styles.phaseLabel}>{phase}</Text>
      </View>

      <View style={styles.masonryGrid}>
        {columns.map((colIndices, colIdx) => (
          <View key={colIdx} style={styles.masonryColumn}>
            {colIndices.map((index) => {
              const ability = items[index];
              const custom = customizations.get(keyForAbility(ability));
              return (
                <DraggableCard
                  key={ability.id}
                  index={index}
                  ability={ability}
                  note={custom?.note}
                  hidden={custom?.hidden}
                  isActive={dragIndex === index}
                  isDropTarget={
                    dragIndex !== null && targetIndex === index && dragIndex !== index
                  }
                  drag={drag}
                  scale={scale}
                  setNodeRef={(node) => {
                    nodeRefs.current[index] = node;
                  }}
                  handlersRef={handlers}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// DraggableCard — wiggling, press-hold-draggable wrapper around AbilityCard
// ---------------------------------------------------------------------------

interface DraggableCardProps {
  index: number;
  ability: Ability;
  note?: string | null;
  hidden?: boolean;
  isActive: boolean;
  isDropTarget: boolean;
  drag: Animated.ValueXY;
  scale: Animated.Value;
  setNodeRef: (node: View | null) => void;
  handlersRef: React.MutableRefObject<{
    onGrant: (from: number, g: PanResponderGestureState) => void;
    onMove: (from: number, g: PanResponderGestureState) => void;
    onRelease: (from: number) => void;
  }>;
}

function DraggableCard({
  index,
  ability,
  note,
  hidden,
  isActive,
  isDropTarget,
  drag,
  scale,
  setNodeRef,
  handlersRef,
}: DraggableCardProps) {
  // Keep the current index readable from the once-created PanResponder so it
  // stays correct after a commit shuffles indices.
  const indexRef = useRef(index);
  indexRef.current = index;

  // Press-and-hold arming: only after holding HOLD_TO_DRAG_MS does a move turn
  // into a drag. Quick swipes fall through to the ScrollView so the list still
  // scrolls normally.
  const armedRef = useRef(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearHold() {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }

  const pan = useRef(
    PanResponder.create({
      // Don't claim on touch-down — let the press-hold timer decide.
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => {
        armedRef.current = false;
        clearHold();
        holdTimer.current = setTimeout(() => {
          armedRef.current = true;
        }, HOLD_TO_DRAG_MS);
        return false;
      },
      onMoveShouldSetPanResponder: (_e, g) =>
        armedRef.current && (Math.abs(g.dx) > 3 || Math.abs(g.dy) > 3),
      onMoveShouldSetPanResponderCapture: (_e, g) =>
        armedRef.current && (Math.abs(g.dx) > 3 || Math.abs(g.dy) > 3),
      onPanResponderGrant: (_e, g) => handlersRef.current.onGrant(indexRef.current, g),
      onPanResponderMove: (_e, g) => handlersRef.current.onMove(indexRef.current, g),
      onPanResponderRelease: () => {
        clearHold();
        armedRef.current = false;
        handlersRef.current.onRelease(indexRef.current);
      },
      onPanResponderTerminate: () => {
        clearHold();
        armedRef.current = false;
        handlersRef.current.onRelease(indexRef.current);
      },
      // Let the ScrollView take over (scroll) only while we're not armed.
      onPanResponderTerminationRequest: () => !armedRef.current,
    })
  ).current;

  const activeTransform = isActive
    ? [{ translateX: drag.x }, { translateY: drag.y }, { scale }]
    : [];

  return (
    <Animated.View
      ref={setNodeRef}
      collapsable={false}
      {...pan.panHandlers}
      style={[
        styles.cardOuter,
        {
          transform: activeTransform,
          zIndex: isActive ? 999 : 1,
          elevation: isActive ? 8 : 0,
          opacity: isActive ? 0.97 : 1,
        },
      ]}
    >
      <View
        // Wiggle on every idle card; pause it on the one being dragged.
        dataSet={isActive ? undefined : { wiggle: String(index % 3) }}
        style={[
          { userSelect: 'none' } as any,
          isDropTarget && styles.dropTarget,
        ]}
      >
        <AbilityCard
          ability={ability}
          // No-op in reorder mode — tapping shouldn't toggle used while
          // rearranging.
          onToggleUsed={noop}
          note={note}
          hidden={hidden}
        />
      </View>
    </Animated.View>
  );
}

function noop() {}

/**
 * Splits an ordered list into N columns using round-robin distribution —
 * identical to the normal AbilityList masonry so the layouts match exactly.
 */
function distributeIntoColumns<T>(items: T[], columnCount: number): T[][] {
  const safeCount = Math.max(1, columnCount);
  const columns: T[][] = Array.from({ length: safeCount }, () => []);
  items.forEach((item, index) => {
    columns[index % safeCount].push(item);
  });
  return columns;
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: '100%',
  },
  content: {
    paddingBottom: 24,
    paddingTop: 8,
  },
  hintBox: {
    backgroundColor: '#1F2A4A',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#3D4F7F',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  hintText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  phaseBlock: {
    marginTop: 16,
    width: '100%',
  },
  phaseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  phaseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  phaseLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  masonryGrid: {
    flexDirection: 'row',
    gap: GAP,
    alignItems: 'flex-start',
  },
  masonryColumn: {
    flex: 1,
    minWidth: 0,
    gap: GAP,
  },
  cardOuter: {
    width: '100%',
  },
  dropTarget: {
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: '#5BA9FF',
    // Tints the slot the dragged card will drop into.
    backgroundColor: 'rgba(91, 169, 255, 0.12)',
  },
});
