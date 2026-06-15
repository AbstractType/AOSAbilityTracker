import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
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
  /** Max content width — passed in already clamped (~600) for the single column. */
  contentMaxWidth: number;
  /** Horizontal padding inside the list. */
  horizontalPadding: number;
  /**
   * Commit a phase's new order. The screen does the optimistic update +
   * Supabase persist + revert-on-error.
   */
  onCommitPhaseOrder: (phase: Phase, reordered: Ability[]) => void;
}

// Vertical gap between cards — matches the masonry column gap so toggling
// reorder mode on/off doesn't visibly change spacing.
const GAP = 14;
// How much the picked-up card grows, as a subtle "lifted" affordance.
const LIFT_SCALE = 1.03;

/**
 * ReorderableAbilityList — the single-column, drag-to-reorder view shown when
 * the tracker is in Reorder mode. Each phase is an independent sortable
 * (`SortablePhase`), which structurally enforces the "within-phase only"
 * rule: there is no shared index space across phases, so a card can never be
 * dragged into another phase's section.
 *
 * It deliberately uses a plain ScrollView rather than the normal masonry
 * FlatList: a FlatList virtualizes rows and would unmount the card mid-drag.
 * Phases are 5-15 cards, so a non-virtualized list is cheap here.
 *
 * Dragging is hand-rolled with PanResponder + Animated (no gesture/animation
 * libraries), which works identically on touch and mouse via React Native Web.
 */
export default function ReorderableAbilityList({
  sections,
  customizations,
  contentMaxWidth,
  horizontalPadding,
  onCommitPhaseOrder,
}: ReorderableAbilityListProps) {
  // While any phase is mid-drag, disable ScrollView scrolling so the parent
  // pan doesn't fight the card drag on touch devices.
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
          Drag the ⠿ handle to reorder cards within a phase. Changes save automatically.
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
            onDragActiveChange={setDragging}
            onCommit={(reordered) => onCommitPhaseOrder(section.phase, reordered)}
          />
        )
      )}
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// SortablePhase — one phase's independent sortable column
// ---------------------------------------------------------------------------

interface SortablePhaseProps {
  phase: Phase;
  items: Ability[];
  customizations: Map<string, Customization>;
  horizontalPadding: number;
  onDragActiveChange: (active: boolean) => void;
  onCommit: (reordered: Ability[]) => void;
}

function SortablePhase({
  phase,
  items,
  customizations,
  horizontalPadding,
  onDragActiveChange,
  onCommit,
}: SortablePhaseProps) {
  // Index of the row currently being dragged, or null when idle.
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // One shift Animated.Value per row, used to open a gap as a card is dragged
  // over a slot. Recreated only when the row count changes (never mid-drag,
  // since the array is frozen during a gesture).
  const shifts = useMemo(
    () => items.map(() => new Animated.Value(0)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.length]
  );

  // Measured row heights (index-aligned). Populated by each row's onLayout.
  const heightsRef = useRef<number[]>([]);
  // Cumulative tops captured at drag start (frozen layout during the gesture).
  const topsRef = useRef<number[]>([]);
  // Frozen snapshot of the item order at drag start.
  const snapshotRef = useRef<Ability[]>([]);
  // from = where the drag started; to = current target slot.
  const fromRef = useRef(0);
  const toRef = useRef(0);

  // translateY of the dragged row (follows the finger), and its lift scale.
  const dragY = useRef(new Animated.Value(0)).current;
  const dragScale = useRef(new Animated.Value(1)).current;

  // Latest handlers in a ref so each row's PanResponder (created once) always
  // calls fresh closures instead of stale ones.
  const handlers = useRef({
    onGrant: (_from: number) => {},
    onMove: (_from: number, _dy: number) => {},
    onRelease: (_from: number) => {},
  });

  function registerHeight(index: number, height: number) {
    heightsRef.current[index] = height;
  }

  handlers.current.onGrant = (from: number) => {
    const heights = heightsRef.current;
    // Guard: don't start a drag until every row has been measured, otherwise
    // the target-index math runs on zeros.
    if (heights.length < items.length || heights.some((h) => !h)) return;

    // Freeze layout + order for the duration of the gesture.
    const tops: number[] = [];
    let acc = 0;
    for (let i = 0; i < heights.length; i++) {
      tops[i] = acc;
      acc += heights[i] + GAP;
    }
    topsRef.current = tops;
    snapshotRef.current = [...items];
    fromRef.current = from;
    toRef.current = from;

    dragY.setValue(0);
    setDragIndex(from);
    onDragActiveChange(true);
    Animated.spring(dragScale, {
      toValue: LIFT_SCALE,
      useNativeDriver: false,
      bounciness: 6,
    }).start();
  };

  handlers.current.onMove = (from: number, dy: number) => {
    dragY.setValue(dy);

    const heights = heightsRef.current;
    const tops = topsRef.current;
    if (!tops.length) return;

    const draggedCenter = tops[from] + dy + heights[from] / 2;
    const to = computeTarget(draggedCenter, from, tops, heights);

    if (to !== toRef.current) {
      toRef.current = to;
      const lift = heights[from] + GAP;
      // Open the gap: cards between `from` and `to` slide to fill the vacated
      // slot, leaving a hole at the target index.
      for (let i = 0; i < shifts.length; i++) {
        if (i === from) continue;
        let target = 0;
        if (from < to && i > from && i <= to) target = -lift;
        else if (from > to && i < from && i >= to) target = lift;
        Animated.spring(shifts[i], {
          toValue: target,
          useNativeDriver: false,
          bounciness: 4,
          speed: 20,
        }).start();
      }
    }
  };

  handlers.current.onRelease = (from: number) => {
    const to = toRef.current;
    const snapshot = snapshotRef.current;

    // Snap everything back to its resting transform. The committed reorder (if
    // any) re-renders the list in the new order, so cards land in their new
    // slots without the transforms.
    shifts.forEach((s) => s.setValue(0));
    dragY.setValue(0);
    dragScale.setValue(1);
    setDragIndex(null);
    onDragActiveChange(false);

    if (to !== from && snapshot.length) {
      const reordered = [...snapshot];
      const [moved] = reordered.splice(from, 1);
      reordered.splice(to, 0, moved);
      onCommit(reordered);
    }
  };

  return (
    <View style={[styles.phaseBlockSpacing, { paddingHorizontal: horizontalPadding }]}>
      <View style={styles.phaseHeaderRow}>
        <View style={[styles.phaseDot, { backgroundColor: colors.phase[phase] }]} />
        <Text style={styles.phaseLabel}>{phase}</Text>
      </View>

      <View>
        {items.map((ability, index) => {
          const custom = customizations.get(keyForAbility(ability));
          const isActive = dragIndex === index;
          return (
            <SortableRow
              key={ability.id}
              index={index}
              ability={ability}
              note={custom?.note}
              hidden={custom?.hidden}
              shift={shifts[index]}
              isActive={isActive}
              dragY={dragY}
              dragScale={dragScale}
              registerHeight={registerHeight}
              handlersRef={handlers}
            />
          );
        })}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// SortableRow — a single draggable card row (drag handle + AbilityCard)
// ---------------------------------------------------------------------------

interface SortableRowProps {
  index: number;
  ability: Ability;
  note?: string | null;
  hidden?: boolean;
  shift: Animated.Value;
  isActive: boolean;
  dragY: Animated.Value;
  dragScale: Animated.Value;
  registerHeight: (index: number, height: number) => void;
  handlersRef: React.MutableRefObject<{
    onGrant: (from: number) => void;
    onMove: (from: number, dy: number) => void;
    onRelease: (from: number) => void;
  }>;
}

function SortableRow({
  index,
  ability,
  note,
  hidden,
  shift,
  isActive,
  dragY,
  dragScale,
  registerHeight,
  handlersRef,
}: SortableRowProps) {
  // Keep the row's current index readable from the (once-created) PanResponder
  // so it stays correct after a commit shuffles indices.
  const indexRef = useRef(index);
  indexRef.current = index;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // Once we've grabbed the handle, capture the gesture so the parent
      // ScrollView can't steal it mid-drag on touch.
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => handlersRef.current.onGrant(indexRef.current),
      onPanResponderMove: (_evt, g) =>
        handlersRef.current.onMove(indexRef.current, g.dy),
      onPanResponderRelease: () => handlersRef.current.onRelease(indexRef.current),
      onPanResponderTerminate: () => handlersRef.current.onRelease(indexRef.current),
    })
  ).current;

  function onLayout(e: LayoutChangeEvent) {
    registerHeight(index, e.nativeEvent.layout.height);
  }

  // Active row follows the finger (dragY) and lifts; idle rows ride their shift.
  const transform: any[] = isActive
    ? [{ translateY: dragY }, { scale: dragScale }]
    : [{ translateY: shift }];

  return (
    <Animated.View
      onLayout={onLayout}
      style={[
        styles.row,
        // Web-only: stop the browser selecting card text while dragging.
        { userSelect: 'none' } as any,
        {
          transform,
          zIndex: isActive ? 999 : 0,
          elevation: isActive ? 8 : 0,
          opacity: isActive ? 0.97 : 1,
        },
      ]}
    >
      <View style={styles.handle} {...panResponder.panHandlers}>
        <Text style={styles.handleGlyph}>⠿</Text>
      </View>
      <View style={styles.cardWrap}>
        <AbilityCard
          ability={ability}
          // No-op in reorder mode: tapping a card shouldn't toggle used while
          // the user is rearranging.
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
 * Given the dragged card's center Y (in the frozen original layout) and where
 * the drag started, find the slot index it now belongs in. Only one direction
 * loop ever advances `to`, so this resolves to a single unambiguous target.
 */
function computeTarget(
  draggedCenter: number,
  from: number,
  tops: number[],
  heights: number[]
): number {
  let to = from;
  // Dragging down: pass any lower card whose center we've moved beyond.
  for (let i = from + 1; i < heights.length; i++) {
    const center = tops[i] + heights[i] / 2;
    if (draggedCenter > center) to = i;
    else break;
  }
  // Dragging up: pass any higher card whose center we've moved above.
  for (let i = from - 1; i >= 0; i--) {
    const center = tops[i] + heights[i] / 2;
    if (draggedCenter < center) to = i;
    else break;
  }
  return to;
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
  phaseBlockSpacing: {
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
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: GAP,
  },
  handle: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22324A',
    borderRadius: radii.md,
    marginRight: 10,
    // Touch/mouse affordance — the whole strip is the grab target.
    cursor: 'grab' as any,
  },
  handleGlyph: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  cardWrap: {
    flex: 1,
    minWidth: 0,
  },
});
