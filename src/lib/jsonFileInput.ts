import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

/**
 * Web-aware roster-file input (drag-and-drop + file picker).
 *
 * The landing page lets a user load a BattleScribe roster by dragging a .json
 * file onto the input box or browsing for one — in addition to pasting. Both of
 * those are DOM features with no React Native equivalent, so this hook is the
 * one place that touches the browser directly, guarded so it's a safe no-op on
 * native (where only the paste path applies).
 *
 * Usage:
 *   const { dropRef, dragActive, openFilePicker, isWeb } =
 *     useJsonFileInput(onText, onError);
 *   <View ref={dropRef}> ...input... </View>   // drop target (web)
 *   {isWeb && <Button label="Browse file" onPress={openFilePicker} />}
 *
 * `onText` receives the file's text content; the caller decides what to do with
 * it (here: fill the box + load). RNW host refs resolve to the underlying DOM
 * node — the same refs the reorder list calls `measureInWindow` on — so
 * `dropRef.current` is a real element we can attach listeners to.
 */

const isWeb = Platform.OS === 'web' && typeof document !== 'undefined';

type OnText = (text: string) => void;
type OnError = (message: string) => void;

function readAsText(file: File, onText: OnText, onError?: OnError): void {
  const reader = new FileReader();
  reader.onload = () => onText(String(reader.result ?? ''));
  reader.onerror = () => onError?.('Could not read that file. Please try again.');
  reader.readAsText(file);
}

export interface JsonFileInput {
  /** Attach to the View that should accept dropped files (web). */
  dropRef: React.MutableRefObject<any>;
  /** True while a file is being dragged over the drop target. */
  dragActive: boolean;
  /** Open the OS file picker (web only; no-op on native). */
  openFilePicker: () => void;
  /** Whether file drag/drop + picker are available (i.e. running on web). */
  isWeb: boolean;
}

export function useJsonFileInput(onText: OnText, onError?: OnError): JsonFileInput {
  const dropRef = useRef<any>(null);
  const [dragActive, setDragActive] = useState(false);

  // Keep the latest callbacks in refs so the drag effect can stay mount-only
  // (re-subscribing listeners on every render would be wasteful and could drop
  // an in-flight drag).
  const onTextRef = useRef(onText);
  const onErrorRef = useRef(onError);
  onTextRef.current = onText;
  onErrorRef.current = onError;

  const openFilePicker = useCallback(() => {
    if (!isWeb) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json,.txt';
    input.onchange = () => {
      const file = input.files && input.files[0];
      if (file) readAsText(file, onTextRef.current, onErrorRef.current);
    };
    input.click();
  }, []);

  useEffect(() => {
    if (!isWeb) return;
    const node: HTMLElement | null = dropRef.current ?? null;
    if (!node || typeof node.addEventListener !== 'function') return;

    // dragenter/dragleave fire for every child element the pointer crosses
    // (e.g. the inner textarea), so a naive enter→true / leave→false flickers.
    // Count nesting depth and only clear the highlight when we've left for good.
    let depth = 0;

    const onDragEnter = (e: DragEvent) => {
      e.preventDefault();
      depth += 1;
      setDragActive(true);
    };
    const onDragOver = (e: DragEvent) => {
      // Required — without preventDefault the browser won't fire `drop` and
      // would instead navigate to the dropped file.
      e.preventDefault();
    };
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      depth = Math.max(0, depth - 1);
      if (depth === 0) setDragActive(false);
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      depth = 0;
      setDragActive(false);
      const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (file) readAsText(file, onTextRef.current, onErrorRef.current);
    };

    node.addEventListener('dragenter', onDragEnter);
    node.addEventListener('dragover', onDragOver);
    node.addEventListener('dragleave', onDragLeave);
    node.addEventListener('drop', onDrop);
    return () => {
      node.removeEventListener('dragenter', onDragEnter);
      node.removeEventListener('dragover', onDragOver);
      node.removeEventListener('dragleave', onDragLeave);
      node.removeEventListener('drop', onDrop);
    };
  }, []);

  return { dropRef, dragActive, openFilePicker, isWeb };
}
