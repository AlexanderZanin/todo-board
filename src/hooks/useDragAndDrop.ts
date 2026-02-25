/**
 * useDragAndDrop
 *
 * Lightweight wrappers around the Pragmatic DnD element adapter.
 * - `useDraggable` attaches drag behavior and optional custom drag previews.
 * - `useDroppable` wires an element as a drop target and forwards payloads.
 *
 * The module also exports typed drag metadata shapes used across the app.
 */
import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

export type TaskDragMeta = {
  type: "task";
  taskId: string;
  sourceColumnId: string;
  selectedIds?: string[];
};

export type ColumnDragMeta = {
  type: "column";
  columnId: string;
};

export type DragMeta = TaskDragMeta | ColumnDragMeta;

type DropPayload = DragMeta | null;

export function useDraggable(
  elementRef: RefObject<HTMLElement | null>,
  dragHandleRef: RefObject<Element | null> | null,
  meta: DragMeta | (() => DragMeta),
) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const getMeta =
      typeof meta === "function" ? (meta as () => DragMeta) : () => meta;

    const cleanup = draggable({
      element,
      dragHandle:
        dragHandleRef && dragHandleRef.current
          ? dragHandleRef.current
          : undefined,
      getInitialData: () => getMeta() as Record<string, unknown>,
    });

    // Create a custom drag preview when multiple tasks are dragged
    let previewEl: HTMLElement | null = null;

    function onDragStart(e: DragEvent) {
      try {
        const metaNow = getMeta();
        if (
          metaNow &&
          metaNow.type === "task" &&
          metaNow.selectedIds &&
          metaNow.selectedIds.length > 1
        ) {
          // remove any existing preview
          if (previewEl && previewEl.parentNode) {
            previewEl.parentNode.removeChild(previewEl);
            previewEl = null;
          }

          // build a small preview element showing a stack/count
          previewEl = document.createElement("div");
          // keep it offscreen - it's required to be in DOM for setDragImage
          previewEl.style.position = "absolute";
          previewEl.style.top = "-9999px";
          previewEl.style.left = "-9999px";
          previewEl.style.pointerEvents = "none";
          previewEl.style.zIndex = "9999";
          previewEl.className = "w-80 px-3";
          previewEl.innerHTML = `<div class="h-12 flex items-center justify-center bg-indigo-500 text-white rounded-md">${metaNow.selectedIds.length} cards</div>`;

          document.body.appendChild(previewEl);

          if (e.dataTransfer && previewEl) {
            try {
              e.dataTransfer.setDragImage(previewEl, 16, 16);
            } catch (err) {
              console.warn("Error setting drag image", err);
            }
          }

          // dim original element for clarity
          (element as HTMLElement).style.opacity = "0.6";
        }
      } catch (err) {
        console.warn("Error during drag start", err);
      }
    }

    function onDragEnd() {
      if (previewEl && previewEl.parentNode) {
        previewEl.parentNode.removeChild(previewEl);
        previewEl = null;
      }
      try {
        (element as HTMLElement).style.opacity = "";
      } catch (e) {
        console.warn("Error resetting element opacity", e);
      }
    }

    // Listen on element and document to ensure we catch end in all cases
    element.addEventListener("dragstart", onDragStart as EventListener);
    element.addEventListener("dragend", onDragEnd as EventListener);
    document.addEventListener("dragend", onDragEnd as EventListener);
    document.addEventListener("pointerup", onDragEnd as EventListener);
    document.addEventListener("pointercancel", onDragEnd as EventListener);

    return () => {
      try {
        cleanup?.();
        element.removeEventListener("dragstart", onDragStart as EventListener);
        element.removeEventListener("dragend", onDragEnd as EventListener);
        document.removeEventListener("dragend", onDragEnd as EventListener);
        document.removeEventListener("pointerup", onDragEnd as EventListener);
        document.removeEventListener(
          "pointercancel",
          onDragEnd as EventListener,
        );
      } catch (e) {
        console.warn("Error during draggable cleanup", e);
      }
    };
  }, [elementRef, dragHandleRef, meta]);
}

export function useDroppable(
  ref: RefObject<HTMLElement | null>,
  onDrop: (data: DropPayload, event?: Event) => void,
  onDragEnter?: (data?: DropPayload) => void,
  onDragLeave?: (data?: DropPayload) => void,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanup = dropTargetForElements({
      element: el,
      onDrop: (payload) => {
        // payload.source.data contains the draggable's initial data
        const data = payload?.source?.data ?? null;
        onDrop(data as DropPayload, undefined);
      },
      onDragEnter: (payload) => {
        const data = payload?.source?.data ?? null;
        onDragEnter?.(data as DropPayload);
      },
      onDragLeave: (payload) => {
        const data = payload?.source?.data ?? null;
        onDragLeave?.(data as DropPayload);
      },
    });

    return () => {
      try {
        cleanup?.();
      } catch (e) {
        console.warn("Error during droppable cleanup", e);
      }
    };
  }, [ref, onDrop, onDragEnter, onDragLeave]);
}

export function useRefWithNull<T extends HTMLElement>() {
  return useRef<T | null>(null);
}
