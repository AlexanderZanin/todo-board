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
          // build a small preview element showing a stack/count
          previewEl = document.createElement("div");
          previewEl.className = "w-80 px-3";
          previewEl.innerHTML = `<div class="h-12 flex items-center justify-center bg-blue-500 text-white rounded-md">
            ${metaNow.selectedIds.length} cards
          </div>`;

          document.body.appendChild(previewEl);

          if (e.dataTransfer && previewEl) {
            e.dataTransfer.setDragImage(previewEl, 16, 16);
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

    element.addEventListener("dragstart", onDragStart as EventListener);
    element.addEventListener("dragend", onDragEnd as EventListener);

    return () => {
      try {
        cleanup?.();
        element.removeEventListener("dragstart", onDragStart as EventListener);
        element.removeEventListener("dragend", onDragEnd as EventListener);
      } catch (e) {
        console.warn("Error during draggable cleanup", e);
      }
    };
  }, [elementRef, dragHandleRef, meta]);
}

export function useDroppable(
  ref: RefObject<HTMLElement | null>,
  onDrop: (data: DropPayload, event?: Event) => void,
  onDragEnter?: () => void,
  onDragLeave?: () => void,
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
      onDragEnter: () => onDragEnter?.(),
      onDragLeave: () => onDragLeave?.(),
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
