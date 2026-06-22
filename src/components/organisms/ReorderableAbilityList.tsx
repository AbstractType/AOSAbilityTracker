import React, { useRef, useState } from 'react';
import {
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
  sections: PhaseSection[];
  customizations: Map<string, Customization>;
  contentMaxWidth: number;
  horizontalPadding: number;
  cardColumns: number;
  onCommitPhaseOrder: (phase: Phase, reordered: Ability[]) => void;
}

const GAP = 14;
const HOLD_TO_DRAG_MS = 160;

// ---------------------------------------------------------------------------
// CSS injected once for web.
// ---------------------------------------------------------------------------
const STYLE_ID = 'aos-reorder-styles';
function injectStylesOnce() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes aosWiggle {
      0%   { transform: rotate(-1.4deg); }
      50%  { transform: rotate(1.4deg); }
      100% { transform: rotate(-1.4deg); }
    }
    @keyframes aosDropGlow {
      0%   { box-shadow: 0 0 0 0 rgba(91,169,255,0.55); }
      60%  { box-shadow: 0 0 0 6px rgba(91,169,255,0.0); }
      100% { box-shadow: 0 0 0 0 rgba(91,169,255,0.0); }
    }
    [data-wiggle="0"] { animation: aosWiggle 0.30s ease-in-out infinite; animation-delay: 0s; }
    [data-wiggle="1"] { animation: aosWiggle 0.33s ease-in-out infinite; animation-delay: -0.11s; }
    [data-wiggle="2"] { animation: aosWiggle 0.28s ease-in-out infinite; animation-delay: -0.19s; }

    [data-drop-target="true"] {
      animation: aosDropGlow 0.9s ease-out infinite;
    }
    [data-reorder] { cursor: grab; }
    [data-reorder]:active { cursor: grabbing; }
  `;
  document.head.appendChild(style);
}

export default function ReorderableAbilityList({
  sections,
  customizations,
  contentMaxWidth,
  horizontalPadding,
  cardColumns,
  onCommitPhaseOrder,
}: ReorderableAbilityListProps) {
  injectStylesOnce();

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
// SortablePhase
// ---------------------------------------------------------------------------

interface Rect { x: number; y: number; w: number; h: number; }

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

  // RNW View instances (for measureInWindow).
  const nodeRefs = useRef<Array<View | null>>([]);
  const rectsRef = useRef<Array<Rect | null>>([]);

  // The raw DOM element of the card currently being dragged.
  // We manipulate its style directly to avoid React re-render lag.
  const activeDomRef = useRef<HTMLElement | null>(null);

  const grantPointer = useRef({ x: 0, y: 0 });
  const fromRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const snapshotRef = useRef<Ability[]>([]);

  // rAF for hit-test only — position updates happen synchronously above.
  const rafRef = useRef<number | null>(null);
  const pendingDelta = useRef({ dx: 0, dy: 0 });

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

    // Measure each card's screen rect for drop targeting.
    rectsRef.current = [];
    nodeRefs.current.forEach((node, i) => {
      if (node && typeof (node as any).measureInWindow === 'function') {
        (node as any).measureInWindow((x: number, y: number, w: number, h: number) => {
          rectsRef.current[i] = { x, y, w, h };
        });
      }
    });

    // On web: get the underlying DOM element from the RNW View instance and
    // promote it to its own compositor layer. All position updates go directly
    // to this element — bypassing React reconciliation entirely.
    if (Platform.OS === 'web') {
      const node = nodeRefs.current[from];
      if (node) {
        let domEl: HTMLElement | null = null;
        try {
          // findDOMNode is the officially supported RNW path.
          const { findDOMNode } = require('react-dom');
          domEl = findDOMNode(node) as HTMLElement;
        } catch {
          // Fallback: RNW may expose the DOM node directly via cast.
          domEl = node as unknown as HTMLElement;
        }
        if (domEl) {
          domEl.style.willChange = 'transform';
          domEl.style.zIndex = '999';
          domEl.style.filter = 'drop-shadow(0 10px 25px rgba(0,0,0,0.6))';
          domEl.style.transform = 'scale(1.05)';
          domEl.style.cursor = 'grabbing';
          activeDomRef.current = domEl;
        }
      }
    }

    setDragIndex(from);
    setTargetIndex(from);
    onDragActiveChange(true);
  };

  handlers.current.onMove = (_from, g) => {
    // Synchronous direct DOM update — runs in the same event handler as the
    // pointer event, so it paints on the very next frame with zero lag.
    if (activeDomRef.current) {
      activeDomRef.current.style.transform =
        `translate3d(${g.dx}px, ${g.dy}px, 0) scale(1.05)`;
    }

    // Throttle the hit-test (which triggers React setState) to one call per
    // animation frame — this doesn't affect drag position, only drop targeting.
    pendingDelta.current = { dx: g.dx, dy: g.dy };
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const { dx, dy } = pendingDelta.current;
      const px = grantPointer.current.x + dx;
      const py = grantPointer.current.y + dy;

      let found: number | null = null;
      for (let i = 0; i < rectsRef.current.length; i++) {
        const r = rectsRef.current[i];
        if (!r) continue;
        if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) {
          found = i;
          break;
        }
      }
      if (found !== null && found !== targetRef.current) {
        targetRef.current = found;
        setTargetIndex(found);
      }
    });
  };

  handlers.current.onRelease = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // Reset the dragged card's DOM styles before React re-renders.
    if (activeDomRef.current) {
      activeDomRef.current.style.transform = '';
      activeDomRef.current.style.willChange = '';
      activeDomRef.current.style.zIndex = '';
      activeDomRef.current.style.filter = '';
      activeDomRef.current.style.cursor = '';
      activeDomRef.current = null;
    }

    const from = fromRef.current;
    const to = targetRef.current;

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
                  setNodeRef={(node) => { nodeRefs.current[index] = node; }}
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
// DraggableCard
// ---------------------------------------------------------------------------

interface DraggableCardProps {
  index: number;
  ability: Ability;
  note?: string | null;
  hidden?: boolean;
  isActive: boolean;
  isDropTarget: boolean;
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
  setNodeRef,
  handlersRef,
}: DraggableCardProps) {
  const indexRef = useRef(index);
  indexRef.current = index;

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
        armedRef.current && (Math.abs(g.dx) > 2 || Math.abs(g.dy) > 2),
      onMoveShouldSetPanResponderCapture: (_e, g) =>
        armedRef.current && (Math.abs(g.dx) > 2 || Math.abs(g.dy) > 2),
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
      onPanResponderTerminationRequest: () => !armedRef.current,
    })
  ).current;

  return (
    // Outer View: stays in layout flow (not transformed). Used for
    // measureInWindow and PanResponder. The parent SortablePhase manipulates
    // this node's underlying DOM element directly for zero-lag dragging.
    <View
      ref={setNodeRef}
      collapsable={false}
      {...pan.panHandlers}
      style={[styles.cardOuter, { zIndex: isActive ? 999 : 1 }]}
    >
      <View
        {...({
          dataSet: {
            wiggle: isActive ? undefined : String(index % 3),
            dropTarget: isDropTarget ? 'true' : undefined,
            reorder: 'true',
          },
        } as any)}
        style={[
          { userSelect: 'none' } as any,
          isActive && styles.activePlaceholder,
          isDropTarget && styles.dropTarget,
        ]}
      >
        <AbilityCard
          ability={ability}
          onToggleUsed={noop}
          note={note}
          hidden={hidden}
        />
      </View>
    </View>
  );
}

function noop() {}

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
  activePlaceholder: {
    opacity: 0.35,
  },
  dropTarget: {
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: '#5BA9FF',
    backgroundColor: 'rgba(91, 169, 255, 0.12)',
  },
});
