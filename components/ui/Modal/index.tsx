import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';
import { usePortalContainer } from '@/hooks/usePortalContainer';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  accentColor?: string;
}

export function Modal({ open, onClose, title, children, accentColor }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const portalContainer = usePortalContainer();

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    dialogRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        style={accentColor ? ({ '--wc-accent': accentColor } as React.CSSProperties) : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <header className={styles.header}>
            <div className={styles.header_info}>
              <h2 id="modal-title" className={styles.title}>
                {title}
              </h2>
              <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Fechar">
                <CloseIcon />
              </button>
            </div>
          </header>
        )}

        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    portalContainer ?? document.body, // fallback pro primeiro render / SSR
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}