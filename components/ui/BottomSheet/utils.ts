import { useEffect, useRef } from "react";

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Applies iOS-style rubber-band resistance when `raw` is outside [min, max].
 * Inside the range, the value passes through untouched.
 */
export const rubberband = (
  raw: number,
  min: number,
  max: number,
  factor = 0.55
): number => {
  if (raw > max) return max + (raw - max) * factor;
  if (raw < min) return min - (min - raw) * factor;
  return raw;
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const getFocusableElements = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement
  );

/**
 * Traps Tab/Shift+Tab focus cycling inside `containerRef` while `active` is true,
 * focuses the container (or first focusable child) on activation, and restores
 * the previously-focused element on deactivation.
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  active: boolean
) {
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    // Focus something inside the sheet so screen readers announce the dialog.
    // const focusables = getFocusableElements(container);
    // (focusables[0] ?? container).focus({ preventScroll: true });
    container.focus({ preventScroll: true });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const els = getFocusableElements(container);
      if (els.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }
      const first = els[0];
      const last = els[els.length - 1];
      const activeEl = document.activeElement;

      if (e.shiftKey) {
        if (activeEl === first || !container.contains(activeEl)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (activeEl === last || !container.contains(activeEl)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      // Restore focus to whatever triggered the sheet.
      previouslyFocused.current?.focus?.({ preventScroll: true });
    };
  }, [active, containerRef]);
}

/**
 * Locks background page scroll while `active` is true, without causing a
 * layout shift from the disappearing scrollbar.
 */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const { body, documentElement } = document;
    const scrollBarWidth = window.innerWidth - documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;

    body.style.overflow = "hidden";
    if (scrollBarWidth > 0) {
      body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [active]);
}