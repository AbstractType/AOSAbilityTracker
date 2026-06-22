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
// CSS injected once for web — wiggle animation, GPU-composited drag layer,
// drop-target glow, and cursor states.
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

    [data-dragging="true"] {
      will-change: transform;
      cursor: grabbing !important;
      filter: drop-shadow(0 8px 20px rgba(0,0,0,0.55));
    }
    [data-drop-target="true"] {
      animation: aosDropGlow 0.9s ease-out infinite;
      border-radius: 10px;
      outline: 2px solid #5BA9FF;
      outline-offset: 2px;
      background: rgba(91,169,255,0.10);
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

  // Animated values — only the active card reads these.
  const drag = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;

  const nodeRefs = useRef<Array<View | null>>([]);
  const rectsRef = useRef<Array<Rect | null>>([]);
  const grantPointer = useRef({ x: 0, y: 0 });
  const fromRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const snapshotRef = useRef<Ability[]>([]);

  // rAF handle — we process at most one move per animation frame so React
  // re-renders from setTargetIndex never pile up behind pointer events.
  const rafRef = useRef<number | null>(null);
  // Latest dx/dy for the pending rAF to read.
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
    // Update the dragged card position immediately — Animated.setValue is
    // synchronous and cheap; no React re-render involved.
    drag.setValue({ x: g.dx, y: g.dy });
    pendingDelta.current = { dx: g.dx, dy: g.dy };

    // Throttle the hit-test + setState to one call per animation frame so
    // we don't schedule dozens of React reconciliations per pointer event.
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const { dx, dy } = pendingDelta.current;
      const px = grantPointer.current.x + dx;
      const py = grantPointer.current.y + dy;
      const rects = rectsRef.current;

      let found: number | null = null;
      for (let i = 0; i < rects.length; i++) {
        const r = rects[i];
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
        },
      ]}
    >
      <View
        {...({
          dataSet: {
            wiggle: isActive ? undefined : String(index % 3),
            dragging: isActive ? 'true' : undefined,
            'drop-target': isDropTarget ? 'true' : undefined,
            reorder: 'true',
          },
        } as any)}
        style={{ userSelect: 'none' } as any}
      >
        <AbilityCard
          ability={ability}
          onToggleUsed={noop}
          note={note}
          hidden={hidden}
        />
      </View>
    </Animated.View>
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
});
