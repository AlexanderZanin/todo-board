import { useEffect, useState } from "react";
import type { RefObject } from "react";

const MENU_WIDTH = 176; // approx w-44 in Tailwind
const VIEWPORT_MARGIN = 8; // keep menu away from viewport edges
const DROPDOWN_OFFSET = 8; // distance between anchor and menu
const MENU_MAX_HEIGHT = 200; // estimated max height for placement calc
const MIN_SPACE_FOR_BELOW = MENU_MAX_HEIGHT + 20; // minimum space required to prefer placing below

export function useMenuPosition(
  isOpen: boolean,
  anchorRef?: RefObject<HTMLElement | null>,
) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    let raf = 0;

    if (!isOpen) {
      raf = requestAnimationFrame(() => setPos(null));
      return () => cancelAnimationFrame(raf);
    }

    const anchorEl = anchorRef?.current ?? null;
    if (!anchorEl) {
      raf = requestAnimationFrame(() => setPos(null));
      return () => cancelAnimationFrame(raf);
    }

    const rect = anchorEl.getBoundingClientRect();

    // compute horizontal position (align right edge to anchor's right)
    let left = rect.right - MENU_WIDTH;
    if (left < VIEWPORT_MARGIN) left = VIEWPORT_MARGIN;
    const maxLeft = window.innerWidth - MENU_WIDTH - VIEWPORT_MARGIN;
    if (left > maxLeft) left = maxLeft;

    // compute vertical position: prefer below when enough space, otherwise above
    const belowTop = rect.bottom + DROPDOWN_OFFSET;
    const aboveTop = rect.top - DROPDOWN_OFFSET - MENU_MAX_HEIGHT;
    const spaceBelow = window.innerHeight - rect.bottom;
    const top =
      spaceBelow > MIN_SPACE_FOR_BELOW
        ? belowTop
        : Math.max(VIEWPORT_MARGIN, aboveTop);

    raf = requestAnimationFrame(() => setPos({ top, left }));
    return () => cancelAnimationFrame(raf);
  }, [isOpen, anchorRef]);

  return pos;
}
