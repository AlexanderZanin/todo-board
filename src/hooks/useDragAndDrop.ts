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
          previewEl.style.position = "absolute";
          previewEl.style.top = "-9999px";
          previewEl.style.left = "-9999px";
          previewEl.style.padding = "8px 12px";
          previewEl.style.background = "rgba(15,23,42,0.95)";
          previewEl.style.color = "white";
          previewEl.style.borderRadius = "8px";
          previewEl.style.boxShadow = "0 6px 18px rgba(2,6,23,0.4)";
          previewEl.style.fontSize = "13px";
          previewEl.style.fontFamily =
            "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial";
          previewEl.innerText = `${metaNow.selectedIds.length} cards`;

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
