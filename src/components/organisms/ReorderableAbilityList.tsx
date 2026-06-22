import React, { useRef, useState } from 'react';
import {
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
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

  // Ghost clone appended to <body> — position:fixed so no overflow container
  // can clip it, and it can travel anywhere on screen.
  const ghostEl = useRef<HTMLElement | null>(null);

  const fromRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const snapshotRef = useRef<Ability[]>([]);

  // Prevents double-cleanup if both native pointerup and PanResponder
  // terminate fire for the same gesture.
  const cleanedUpRef = useRef(true);
  // Stored so PanResponder terminate can run backup cleanup.
  const cleanupRef = useRef<(() => void) | null>(null);

  const handlers = useRef({
    onGrant: (_from: number, _clientX: number, _clientY: number) => {},
    onCleanup: () => {},
  });

  handlers.current.onGrant = (from, startClientX, startClientY) => {
    cleanedUpRef.current = false;
    snapshotRef.current = [...items];
    fromRef.current = from;
    targetRef.current = from;

    // Web-only: use document-level pointer events so tracking continues
    // regardless of which DOM element the pointer is over. This is the
    // key fix — PanResponder's onMove stops updating when the pointer
    // leaves the originating element, limiting cards to adjacent targets.
    if (Platform.OS === 'web') {
      try {
        const { findDOMNode } = require('react-dom');
        const nodes: (HTMLElement | null)[] = [];
        nodeRefs.current.forEach((node, i) => {
          try { nodes[i] = findDOMNode(node) as HTMLElement; }
          catch { nodes[i] = node as unknown as HTMLElement; }
        });
        domNodesRef.current = nodes;

        // Clone the card and mount as position:fixed on <body> BEFORE
        // setDragIndex triggers a re-render that dims the original.
        const activeDom = nodes[from];
        if (activeDom) {
          const rect = activeDom.getBoundingClientRect();
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

        const doHitTest = (cx: number, cy: number): number | null => {
          const fromIdx = fromRef.current;
          for (let i = 0; i < nodes.length; i++) {
            if (i === fromIdx) continue;
            const el = nodes[i];
            if (!el) continue;
            const r = el.getBoundingClientRect();
            if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) {
              return i;
            }
          }
          return null;
        };

        const finishWithTarget = (to: number | null) => {
          if (cleanedUpRef.current) return;
          cleanedUpRef.current = true;
          document.removeEventListener('pointermove', onMove);
          document.removeEventListener('pointerup', onUp);
          document.removeEventListener('pointercancel', onUp);
          if (ghostEl.current) {
            ghostEl.current.parentNode?.removeChild(ghostEl.current);
            ghostEl.current = null;
          }
          const fromIdx = fromRef.current;
          setDragIndex(null);
          setTargetIndex(null);
          onDragActiveChange(false);
          if (to != null && to !== fromIdx && snapshotRef.current.length) {
            const reordered = [...snapshotRef.current];
            const [moved] = reordered.splice(fromIdx, 1);
            reordered.splice(to, 0, moved);
            onCommit(reordered);
          }
        };

        const onMove = (e: PointerEvent) => {
          if (cleanedUpRef.current) return;
          const dx = e.clientX - startClientX;
          const dy = e.clientY - startClientY;
          if (ghostEl.current) {
            ghostEl.current.style.transform =
              `translate3d(${dx}px, ${dy}px, 0) scale(1.05)`;
          }
          const found = doHitTest(e.clientX, e.clientY);
          if (found !== targetRef.current) {
            targetRef.current = found;
            setTargetIndex(found);
          }
        };

        const onUp = (e: PointerEvent) => {
          finishWithTarget(doHitTest(e.clientX, e.clientY));
        };

        // Backup for PanResponder terminate — commits last known target.
        cleanupRef.current = () => finishWithTarget(targetRef.current);

        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
        document.addEventListener('pointercancel', onUp);
      } catch { /* noop */ }
    }

    setDragIndex(from);
    setTargetIndex(from);
    onDragActiveChange(true);
  };

  handlers.current.onCleanup = () => {
    cleanupRef.current?.();
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
    onGrant: (from: number, clientX: number, clientY: number) => void;
    onCleanup: () => void;
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
      onPanResponderGrant: (e, _g) => {
        // Extract viewport-relative coordinates from the native event.
        // These are in the same space as getBoundingClientRect(), so no
        // conversion is needed when hit-testing against card rects.
        const ne = e.nativeEvent as any;
        const clientX: number =
          ne?.clientX ?? ne?.pageX ?? ne?.touches?.[0]?.clientX ?? 0;
        const clientY: number =
          ne?.clientY ?? ne?.pageY ?? ne?.touches?.[0]?.clientY ?? 0;
        handlersRef.current.onGrant(indexRef.current, clientX, clientY);
      },
      // Kept active (not removed) so PanResponder retains gesture ownership
      // and the ScrollView cannot steal the drag. Actual tracking is done
      // by the document pointermove listeners set up in onGrant.
      onPanResponderMove: () => {},
      onPanResponderRelease: () => {
        clearHold();
        armedRef.current = false;
        handlersRef.current.onCleanup();
      },
      onPanResponderTerminate: () => {
        clearHold();
        armedRef.current = false;
        handlersRef.current.onCleanup();
      },
      onPanResponderTerminationRequest: () => !armedRef.current,
    })
  ).current;

  return (
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
