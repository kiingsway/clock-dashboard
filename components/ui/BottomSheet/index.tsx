import React, { forwardRef, useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { BottomSheetProps, BottomSheetRef } from "./types";
import { useBottomSheet } from "./useBottomSheet";
import { useBodyScrollLock, useFocusTrap } from "./utils";
import styles from "./BottomSheet.module.css";

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(function BottomSheet(
  {
    open,
    onClose,
    children,
    snapPoints = [0.5],
    initialSnap,
    dismissible = true,
    onSnap,
    title,
    ariaLabel,
    showHandle = true,
    showBackdrop = true,
    closeOnBackdropClick = true,
    closeOnEsc = true,
    dismissThreshold = 80,
    springConfig,
    className,
    contentClassName,
    zIndex = 1000,
    disableDrag = false,
    container,
  },
  ref
) {
  const [mounted, setMounted] = useState(open);
  const titleId = useId();

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  const resolvedInitialSnap = initialSnap ?? snapPoints.length - 1;

  const { sheetRef, contentRef, backdropRef, dragging, handlePointerDown, close, handleEsc } =
    useBottomSheet(
      {
        open,
        mounted,
        snapPoints,
        initialSnap: resolvedInitialSnap,
        dismissible,
        dismissThreshold,
        disableDrag,
        springConfig,
        onClose,
        onSnap,
        onMountedChange: setMounted,
      },
      ref
    );

  useBodyScrollLock(mounted);
  useFocusTrap(sheetRef, mounted);

  useEffect(() => {
    if (!mounted) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleEsc(closeOnEsc);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mounted, closeOnEsc, handleEsc]);

  const portalTarget = useMemo(() => {
    if (container) return container;
    return typeof document !== "undefined" ? document.body : null;
  }, [container]);

  if (!mounted || !portalTarget) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    if (closeOnBackdropClick) close();
  };

  return createPortal(
    <div className={cx(styles.root, className)} style={{ zIndex }}>
      {showBackdrop && (
        <div
          ref={backdropRef}
          className={styles.backdrop}
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}
      <div
        ref={sheetRef}
        className={cx(styles.sheet, dragging && styles.dragging)}
        role="dialog"
        aria-modal="true"
        aria-label={title ? undefined : ariaLabel}
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onPointerDown={handlePointerDown}
      >
        {showHandle && (
          <div className={styles.handleArea}>
            <div className={styles.handle} />
          </div>
        )}
        {title && (
          <div className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
          </div>
        )}
        <div ref={contentRef} className={cx(styles.content, contentClassName)}>
          {children}
        </div>
      </div>
    </div>,
    portalTarget
  );
});

BottomSheet.displayName = "BottomSheet";