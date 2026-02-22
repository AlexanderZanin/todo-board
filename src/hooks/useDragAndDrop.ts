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
  meta: DragMeta,
) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const cleanup = draggable({
      element,
      dragHandle: dragHandleRef ? dragHandleRef.current : undefined,
      getInitialData: () => meta as Record<string, unknown>,
    } as any);

    return () => {
      try {
        cleanup?.();
      } catch (e) {
        // ignore
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
      onDrop: (payload: any) => {
        // payload.source.data contains the draggable's initial data
        const data = payload?.source?.data ?? null;
        onDrop(data, undefined);
      },
      onDragEnter: () => onDragEnter?.(),
      onDragLeave: () => onDragLeave?.(),
    } as any);

    return () => {
      try {
        cleanup?.();
      } catch (e) {
        // ignore
      }
    };
  }, [ref, onDrop, onDragEnter, onDragLeave]);
}

export function useRefWithNull<T extends HTMLElement>() {
  return useRef<T | null>(null);
}
