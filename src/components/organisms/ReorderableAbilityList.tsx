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
      0%   { box-shadow: 0 0 6px 1px rgba(91,169,255,0.5); }
      50%  { box-shadow: 0 0 20px 5px rgba(91,169,255,0.95); }
      100% { box-shadow: 0 0 6px 1px rgba(91,169,255,0.5); }
    }
    [data-wiggle="0"] { animation: aosWiggle 0.30s ease-in-out infinite; animation-delay: 0s; }
    [data-wiggle="1"] { animation: aosWiggle 0.33s ease-in-out infinite; animation-delay: -0.11s; }
    [data-wiggle="2"] { animation: aosWiggle 0.28s ease-in-out infinite; animation-delay: -0.19s; }

    [data-card-drop="true"] {
      outline: 2px solid #5BA9FF !important;
      outline-offset: 3px !important;
      animation: aosDropGlow 0.9s ease-in-out infinite !important;
      z-index: 1000 !important;
      pointer-events: none !important;
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

  // RNW View instances — used to find DOM nodes on drag start.
  const nodeRefs = useRef<Array<View | null>>([]);
  // DOM elements for every card, captured once on grant for hit-testing.
  const domNodesRef = useRef<Array<HTMLElement | null>>([]);

  // A cloned ghost element appended to <body> during drag. Positioning it
  // fixed in <body> keeps it completely outside every overflow container so
  // it can travel anywhere on screen without being clipped.
  const ghostEl = useRef<HTMLElement | null>(null);

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
    onRelease: (_from: number, _g: PanResponderGestureState | null) => {},
  });

  handlers.current.onGrant = (from, g) => {
    snapshotRef.current = [...items];
    fromRef.current = from;
    targetRef.current = from;
    grantPointer.current = { x: g.x0, y: g.y0 };

    // On web: resolve every card's raw DOM element once per drag.
    if (Platform.OS === 'web') {
      try {
        const { findDOMNode } = require('react-dom');
        const nodes: (HTMLElement | null)[] = [];
        nodeRefs.current.forEach((node, i) => {
          try { nodes[i] = findDOMNode(node) as HTMLElement; }
          catch { nodes[i] = node as unknown as HTMLElement; }
        });
        domNodesRef.current = nodes;

        const activeDom = nodes[from];
        if (activeDom) {
          // Snapshot the card's current viewport rect BEFORE any React
          // re-render can change its appearance.
          const rect = activeDom.getBoundingClientRect();

          // Clone the card and mount it directly on <body> as a
          // position:fixed ghost. This places it outside every
          // overflow:hidden ancestor, so it can move anywhere on screen.
          const ghost = activeDom.cloneNode(true) as HTMLElement;
          ghost.style.position = 'fixed';
          ghost.style.left = `${rect.left}px`;
          ghost.style.top = `${rect.top}px`;
          ghost.style.width = `${rect.width}px`;
          ghost.style.height = `${rect.height}px`;
          ghost.style.margin = '0';
          ghost.style.zIndex = '9999';
          ghost.style.pointerEvents = 'none';
          ghost.style.willChange = 'transform';
          ghost.style.filter = 'drop-shadow(0 10px 25px rgba(0,0,0,0.6))';
          ghost.style.transform = 'scale(1.05)';
          ghost.style.cursor = 'grabbing';
          document.body.appendChild(ghost);
          ghostEl.current = ghost;
        }
      } catch { /* noop */ }
    }

    setDragIndex(from);
    setTargetIndex(from);
    onDragActiveChange(true);
  };

  handlers.current.onMove = (_from, g) => {
    // Move the ghost synchronously. Because it's position:fixed in <body>,
    // translate3d is in viewport space and matches g.dx/g.dy exactly.
    if (ghostEl.current) {
      ghostEl.current.style.transform =
        `translate3d(${g.dx}px, ${g.dy}px, 0) scale(1.05)`;
    }

    // Throttle the hit-test (which triggers React setState) to one call per
    // animation frame — this doesn't affect drag position, only drop targeting.
    pendingDelta.current = { dx: g.dx, dy: g.dy };
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const { dx, dy } = pendingDelta.current;
      // px/py are pageX/pageY (document-relative). Convert to clientX/clientY
      // (viewport-relative) so they match getBoundingClientRect() below.
      const px = grantPointer.current.x + dx;
      const py = grantPointer.current.y + dy;
      const clientX = px - (window.scrollX ?? 0);
      const clientY = py - (window.scrollY ?? 0);

      let found: number | null = null;
      const nodes = domNodesRef.current;
      for (let i = 0; i < nodes.length; i++) {
        if (i === fromRef.current) continue; // skip the floating active card
        const el = nodes[i];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) {
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

  handlers.current.onRelease = (_, g) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // Fast drags can release before the last rAF fires, leaving targetRef
    // stuck at wherever the previous rAF landed (often just an adjacent card).
    // Run one final synchronous hit-test at the exact release position so the
    // committed target always reflects where the user actually let go.
    if (Platform.OS === 'web' && g && domNodesRef.current.length > 0) {
      const px = g.x0 + g.dx;
      const py = g.y0 + g.dy;
      const clientX = px - (window.scrollX ?? 0);
      const clientY = py - (window.scrollY ?? 0);
      const from = fromRef.current;
      const nodes = domNodesRef.current;
      for (let i = 0; i < nodes.length; i++) {
        if (i === from) continue;
        const el = nodes[i];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) {
          targetRef.current = i;
          break;
        }
      }
    }

    // Remove the floating ghost — React handles restoring the original card
    // by re-rendering it without the isActive styles.
    if (ghostEl.current) {
      ghostEl.current.parentNode?.removeChild(ghostEl.current);
      ghostEl.current = null;
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
    onRelease: (from: number, g: PanResponderGestureState | null) => void;
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
      onPanResponderRelease: (_e, g) => {
        clearHold();
        armedRef.current = false;
        handlersRef.current.onRelease(indexRef.current, g);
      },
      onPanResponderTerminate: (_e, g) => {
        clearHold();
        armedRef.current = false;
        handlersRef.current.onRelease(indexRef.current, g ?? null);
      },
      onPanResponderTerminationRequest: () => !armedRef.current,
    })
  ).current;

  return (
    // Outer View: stays in layout flow (not transformed). Used for
    // measureInWindow and PanResponder. The parent SortablePhase manipulates
    // this node's underlying DOM element directly for zero-lag dragging.
    // data-card-drop drives the CSS highlight (z-index 1000 !important so it
    // renders above the floating active card at z-index 999).
    <View
      ref={setNodeRef}
      collapsable={false}
      {...pan.panHandlers}
      {...({ dataSet: { cardDrop: isDropTarget ? 'true' : undefined } } as any)}
      style={[styles.cardOuter, { zIndex: isActive ? 999 : 1 }]}
    >
      <View
        {...({
          dataSet: {
            wiggle: isActive ? undefined : String(index % 3),
            reorder: 'true',
          },
        } as any)}
        style={[
          { userSelect: 'none' } as any,
          isActive && styles.activePlaceholder,
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
    overflow: 'visible',
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
    overflow: 'visible',
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
    overflow: 'visible',
  },
  masonryColumn: {
    flex: 1,
    minWidth: 0,
    gap: GAP,
    overflow: 'visible',
  },
  cardOuter: {
    width: '100%',
    overflow: 'visible',
  },
  activePlaceholder: {
    opacity: 0.35,
  },
});
