import { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { BottomSheetRef, SpringConfig } from "./types";
import { clamp, rubberband } from "./utils";

const DEFAULT_SPRING: SpringConfig = { stiffness: 300, damping: 32, mass: 1 };

/** Minimum finger movement (px) before we decide this is a vertical drag vs a tap/horizontal swipe. */
const DIRECTION_THRESHOLD = 4;
/** How far (px) beyond the tallest snap point dragging is allowed, damped by RUBBER_BAND_FACTOR. */
const RUBBER_BAND_FACTOR = 0.55;
/** How many ms of drag history we keep for velocity estimation. */
const VELOCITY_SAMPLE_WINDOW = 100;
/** Downward fling speed (px/s) that dismisses the sheet even above the threshold line. */
const FLING_DISMISS_VELOCITY = -600;
/** How far ahead (ms) we project the release velocity to pick the target snap point. */
const PROJECTION_MS = 120;
/** Spring is considered "at rest" below these thresholds. */
const REST_POSITION_EPSILON = 0.5;
const REST_VELOCITY_EPSILON = 15; // px/s

interface Sample {
  t: number;
  y: number;
}

export interface UseBottomSheetArgs {
  open: boolean;
  mounted: boolean;
  snapPoints: number[];
  initialSnap: number;
  dismissible: boolean;
  dismissThreshold: number;
  disableDrag: boolean;
  springConfig?: Partial<SpringConfig>;
  onClose: () => void;
  onSnap?: (index: number, snapPoint: number) => void;
  onMountedChange: (mounted: boolean) => void;
}

export function useBottomSheet(args: UseBottomSheetArgs, ref: React.Ref<BottomSheetRef>) {
  const {
    open,
    mounted,
    snapPoints,
    initialSnap,
    dismissible,
    dismissThreshold,
    disableDrag,
    onClose,
    onSnap,
    onMountedChange,
  } = args;

  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const [dragging, setDragging] = useState(false);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(-1);

  // Keep latest callbacks in refs so the gesture handlers (created once) never go stale.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const onSnapRef = useRef(onSnap);
  onSnapRef.current = onSnap;

  const springConfigRef = useRef<SpringConfig>({ ...DEFAULT_SPRING, ...args.springConfig });
  springConfigRef.current = { ...DEFAULT_SPRING, ...args.springConfig };

  // --- Layout ------------------------------------------------------------
  const viewportHeightRef = useRef(0);
  const snapHeightsRef = useRef<number[]>([]); // px, ascending

  const recomputeLayout = useCallback(() => {
    const vh = window.visualViewport?.height ?? window.innerHeight;
    viewportHeightRef.current = vh;
    snapHeightsRef.current = [...snapPoints].sort((a, b) => a - b).map((p) => p * vh);
  }, [snapPoints]);

  // --- Motion state (mutable, drives direct DOM writes for 60fps) --------
  const heightRef = useRef(0); // current sheet height in px
  const velocityRef = useRef(0); // px/second, positive = expanding
  const rafRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);

  const applyTransform = useCallback((height: number) => {
    const sheetEl = sheetRef.current;
    const backdropEl = backdropRef.current;
    if (!sheetEl) return;
    const vh = viewportHeightRef.current;
    sheetEl.style.transform = `translate3d(0, ${vh - height}px, 0)`;

    if (backdropEl) {
      const maxHeight = snapHeightsRef.current[snapHeightsRef.current.length - 1] || vh;
      backdropEl.style.opacity = String(clamp(height / maxHeight, 0, 1));
    }
  }, []);

  const cancelAnimation = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastFrameTimeRef.current = null;
  }, []);

  const findSnapIndexForHeight = useCallback((height: number) => {
    const heights = snapHeightsRef.current;
    let closestIndex = 0;
    let closestDist = Infinity;
    heights.forEach((h, i) => {
      const d = Math.abs(h - height);
      if (d < closestDist) {
        closestDist = d;
        closestIndex = i;
      }
    });
    return closestIndex;
  }, []);

  /** Animate the sheet height to `target` using spring physics, starting from the current position/velocity. */
  const animateTo = useCallback(
    (target: number, isDismiss = false) => {
      cancelAnimation();

      const step = (now: number) => {
        if (lastFrameTimeRef.current == null) lastFrameTimeRef.current = now;
        const dt = Math.min((now - lastFrameTimeRef.current) / 1000, 0.032);
        lastFrameTimeRef.current = now;

        const { stiffness, damping, mass } = springConfigRef.current;
        const displacement = heightRef.current - target;
        const springForce = -stiffness * displacement;
        const dampingForce = -damping * velocityRef.current;
        const acceleration = (springForce + dampingForce) / mass;

        velocityRef.current += acceleration * dt;
        heightRef.current += velocityRef.current * dt;
        applyTransform(heightRef.current);

        const atRest =
          Math.abs(heightRef.current - target) < REST_POSITION_EPSILON &&
          Math.abs(velocityRef.current) < REST_VELOCITY_EPSILON;

        if (!atRest) {
          rafRef.current = requestAnimationFrame(step);
          return;
        }

        heightRef.current = target;
        velocityRef.current = 0;
        applyTransform(target);
        rafRef.current = null;
        lastFrameTimeRef.current = null;

        if (isDismiss || target <= 0) {
          setCurrentSnapIndex(-1);
          onMountedChange(false);
          onCloseRef.current();
        } else {
          const idx = findSnapIndexForHeight(target);
          setCurrentSnapIndex(idx);
          onSnapRef.current?.(idx, snapPoints[idx]);
        }
      };

      rafRef.current = requestAnimationFrame(step);
    },
    [applyTransform, cancelAnimation, findSnapIndexForHeight, onMountedChange, snapPoints]
  );

  const snapToIndex = useCallback(
    (index: number) => {
      const heights = snapHeightsRef.current;
      if (heights.length === 0) return;
      const clamped = clamp(index, 0, heights.length - 1);
      animateTo(heights[clamped]);
    },
    [animateTo]
  );

  const close = useCallback(() => {
    animateTo(0, true);
  }, [animateTo]);

  useImperativeHandle(
    ref,
    (): BottomSheetRef => ({
      expand: () => snapToIndex(snapHeightsRef.current.length - 1),
      collapse: () => snapToIndex(0),
      snapTo: snapToIndex,
      close,
      getCurrentSnapIndex: () => currentSnapIndex,
    }),
    [snapToIndex, close, currentSnapIndex]
  );

  // --- Open / close lifecycle ---------------------------------------------
  useEffect(() => {
    if (!mounted) return;
    recomputeLayout();
    heightRef.current = 0;
    velocityRef.current = 0;
    applyTransform(0);

    // Animate in on the next frame so the initial state (closed) actually paints first.
    const raf = requestAnimationFrame(() => {
      const idx = clamp(initialSnap, 0, snapPoints.length - 1);
      const target = snapHeightsRef.current[idx];
      animateTo(target);
    });
    return () => cancelAnimationFrame(raf);
    // Only run when the sheet transitions to mounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  useEffect(() => {
    if (mounted && !open) {
      // Externally-controlled close (e.g. parent flips `open` to false directly).
      animateTo(0, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Keep snap heights in sync with viewport resizes / orientation changes.
  useEffect(() => {
    if (!mounted) return;
    const handleResize = () => {
      const prevVh = viewportHeightRef.current || 1;
      const fraction = heightRef.current / prevVh;
      recomputeLayout();
      const newHeight = fraction * viewportHeightRef.current;
      heightRef.current = newHeight;
      applyTransform(newHeight);
    };
    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, [mounted, recomputeLayout, applyTransform]);

  useEffect(() => cancelAnimation, [cancelAnimation]);

  // --- Drag gesture --------------------------------------------------------
  const dragRef = useRef({
    pointerId: null as number | null,
    active: false, // confirmed vertical sheet-drag in progress
    startX: 0,
    startY: 0,
    startHeight: 0,
    isHorizontal: false,
    isContentScroll: false,
    startedInContent: false,
    samples: [] as Sample[],
  });

  const pushSample = (y: number) => {
    const now = performance.now();
    const samples = dragRef.current.samples;
    samples.push({ t: now, y });
    while (samples.length > 0 && now - samples[0].t > VELOCITY_SAMPLE_WINDOW) {
      samples.shift();
    }
  };

  const computeReleaseVelocity = (): number => {
    // px/second of HEIGHT change (positive = expanding). Screen Y is inverted vs height.
    const samples = dragRef.current.samples;
    if (samples.length < 2) return 0;
    const first = samples[0];
    const last = samples[samples.length - 1];
    const dt = (last.t - first.t) / 1000;
    if (dt <= 0) return 0;
    return -((last.y - first.y) / dt);
  };

  const beginDrag = useCallback((clientX: number, clientY: number, inContent: boolean) => {
    cancelAnimation();
    dragRef.current.startX = clientX;
    dragRef.current.startY = clientY;
    dragRef.current.startHeight = heightRef.current;
    dragRef.current.isHorizontal = false;
    dragRef.current.isContentScroll = false;
    dragRef.current.startedInContent = inContent;
    dragRef.current.samples = [];
    pushSample(clientY);
  }, [cancelAnimation]);

  const updateDrag = useCallback(
    (clientX: number, clientY: number) => {
      const drag = dragRef.current;
      const deltaX = clientX - drag.startX;
      const deltaY = clientY - drag.startY; // positive = finger moved down

      if (!drag.active && !drag.isHorizontal && !drag.isContentScroll) {
        if (Math.abs(deltaX) < DIRECTION_THRESHOLD && Math.abs(deltaY) < DIRECTION_THRESHOLD) {
          return { handled: false };
        }
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          drag.isHorizontal = true;
          return { handled: false };
        }

        const contentEl = contentRef.current;
        const heights = snapHeightsRef.current;
        const maxHeight = heights[heights.length - 1] ?? viewportHeightRef.current;
        // Small tolerance for the sub-pixel rest position the spring settles at.
        const atMaxSnap = heightRef.current >= maxHeight - 1;
        const contentIsScrollable = !!contentEl && contentEl.scrollHeight > contentEl.clientHeight + 1;
        const pullingDown = deltaY > 0;

        if (drag.startedInContent && atMaxSnap && contentIsScrollable) {
          const alreadyScrolledDown = contentEl!.scrollTop > 0;
          // Let the browser scroll the content natively when: there's scroll
          // position to give back (pulling down from mid-scroll), or the user
          // is pulling up (revealing more content below) — the sheet only
          // needs to take over when we're pulling down AND already at the
          // very top of the content, i.e. there's nowhere left to scroll.
          if (alreadyScrolledDown || !pullingDown) {
            drag.isContentScroll = true;
            return { handled: false };
          }
        }

        drag.active = true;
        setDragging(true);
      }

      if (drag.isContentScroll) {
        const contentEl = contentRef.current;
        if (contentEl && contentEl.scrollTop <= 0 && deltaY > 0) {
          // Content hit the top mid-gesture and the user is still pulling down: hand off to the sheet.
          drag.isContentScroll = false;
          drag.active = true;
          drag.startY = clientY;
          drag.startHeight = heightRef.current;
          setDragging(true);
        } else {
          return { handled: false };
        }
      }

      if (!drag.active) return { handled: false };

      pushSample(clientY);

      const heights = snapHeightsRef.current;
      const maxHeight = heights[heights.length - 1] ?? viewportHeightRef.current;
      const minHeight = 0;
      const raw = drag.startHeight - deltaY;
      const withRubberBand = dismissible
        ? raw > maxHeight
          ? rubberband(raw, minHeight, maxHeight, RUBBER_BAND_FACTOR)
          : raw
        : rubberband(raw, minHeight, maxHeight, RUBBER_BAND_FACTOR);

      const floor = -viewportHeightRef.current * 0.3;
      const next = Math.max(withRubberBand, floor);

      heightRef.current = next;
      applyTransform(next);
      return { handled: true };
    },
    [applyTransform, dismissible]
  );

  const endDrag = useCallback(() => {
    const drag = dragRef.current;
    const wasActive = drag.active;
    drag.active = false;
    drag.pointerId = null;
    setDragging(false);
    if (!wasActive) return;

    const velocity = computeReleaseVelocity(); // px/s, positive = expanding
    const heights = snapHeightsRef.current;
    const smallest = heights[0] ?? 0;

    velocityRef.current = velocity;

    if (dismissible) {
      const belowThreshold = heightRef.current < smallest - dismissThreshold;
      const flungDown = velocity < FLING_DISMISS_VELOCITY && heightRef.current < smallest;
      if (belowThreshold || flungDown) {
        animateTo(0, true);
        return;
      }
    }

    const projected = heightRef.current + velocity * (PROJECTION_MS / 1000);
    let target = heights[0] ?? 0;
    let minDist = Infinity;
    for (const h of heights) {
      const d = Math.abs(h - projected);
      if (d < minDist) {
        minDist = d;
        target = h;
      }
    }
    animateTo(target);
  }, [animateTo, dismissThreshold, dismissible]);

  // Pointer handlers exposed to the component. Using the Pointer Events API
  // gives us mouse + touch + pen through a single code path.
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disableDrag) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragRef.current.pointerId = e.pointerId;
      const inContent = !!contentRef.current && contentRef.current.contains(e.target as Node);
      beginDrag(e.clientX, e.clientY, inContent);
    },
    [beginDrag, disableDrag]
  );

  useEffect(() => {
    if (!mounted) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (dragRef.current.pointerId !== e.pointerId) return;
      const { handled } = updateDrag(e.clientX, e.clientY);
      if (handled) e.preventDefault();
    };
    const handlePointerUp = (e: PointerEvent) => {
      if (dragRef.current.pointerId !== e.pointerId) return;
      endDrag();
    };

    // Non-passive so we can preventDefault() and stop the page/content from
    // scrolling while an active sheet-drag is in progress.
    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [mounted, updateDrag, endDrag]);

  // Belt-and-suspenders: some mobile browsers fire touchmove with default
  // scrolling behavior even when pointermove is handled. Block it explicitly
  // while a sheet-drag is active.
  useEffect(() => {
    if (!mounted) return;
    const blockTouchScroll = (e: TouchEvent) => {
      if (dragRef.current.active) e.preventDefault();
    };
    document.addEventListener("touchmove", blockTouchScroll, { passive: false });
    return () => document.removeEventListener("touchmove", blockTouchScroll);
  }, [mounted]);

  // Esc key.
  const handleEsc = useCallback(
    (enabled: boolean) => {
      if (!enabled) return;
      close();
    },
    [close]
  );

  return {
    sheetRef,
    contentRef,
    backdropRef,
    dragging,
    currentSnapIndex,
    handlePointerDown,
    snapToIndex,
    close,
    handleEsc,
  };
}