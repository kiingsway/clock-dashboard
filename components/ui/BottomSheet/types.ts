import type { ReactNode } from "react";

/** Parameters for the damped-spring solver used for all non-drag motion. */
export interface SpringConfig {
  /** Spring stiffness (higher = snappier). Default 300. */
  stiffness: number;
  /** Damping (higher = less oscillation). Default 32. */
  damping: number;
  /** Mass of the sheet. Default 1. */
  mass: number;
}

export interface BottomSheetProps {
  /** Controls mounting + open/close animation. */
  open: boolean;
  /** Called when the sheet should close (backdrop click, Esc, drag-dismiss, drag below threshold). */
  onClose: () => void;
  children: ReactNode;

  /**
   * Snap points as fractions of the viewport height, ascending or not — they're
   * sorted internally. Example: [0.25, 0.5, 0.9, 1]. Default: [0.5].
   */
  snapPoints?: number[];
  /** Index into `snapPoints` to open at. Default: last index (tallest). */
  initialSnap?: number;
  /** Whether the sheet can be dragged down past the smallest snap point to dismiss. Default: true. */
  dismissible?: boolean;
  /** Fired every time the sheet settles on a snap point (not fired on dismiss). */
  onSnap?: (index: number, snapPoint: number) => void;

  /** Optional visible header title. Wires up aria-labelledby automatically. */
  title?: ReactNode;
  /** Required if no `title` is given, for screen readers. */
  ariaLabel?: string;

  showHandle?: boolean;
  showBackdrop?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;

  /**
   * How far (in px) below the smallest snap point the sheet must be dragged
   * before release triggers a dismiss. Default: 80.
   */
  dismissThreshold?: number;

  springConfig?: Partial<SpringConfig>;

  className?: string;
  contentClassName?: string;
  /** z-index of the root overlay. Default: 1000. */
  zIndex?: number;

  /** Disable the drag gesture entirely (still supports snapTo/close/expand/collapse programmatically). */
  disableDrag?: boolean;

  /**
  * DOM node the sheet portals into. Defaults to `document.body`.
  *
  * If your design tokens (CSS custom properties) are scoped to a class
  * rather than declared on `:root` — e.g. `.root { --wc-accent: ...; }` —
  * `document.body` is *outside* that cascade, and every `var(--wc-*)` in
  * the sheet's CSS will silently fall back to its default value. Pass the
  * DOM node carrying that class (or one of its descendants) here so the
  * sheet stays inside the token cascade.
  */
  container?: HTMLElement | null;
}

export interface BottomSheetRef {
  /** Snap to the tallest snap point. */
  expand: () => void;
  /** Snap to the shortest snap point. */
  collapse: () => void;
  /** Snap to a specific snap point by index. */
  snapTo: (index: number) => void;
  /** Animate closed and call onClose. */
  close: () => void;
  /** Index of the snap point the sheet is currently resting at (-1 while dragging/animating/closed). */
  getCurrentSnapIndex: () => number;
}