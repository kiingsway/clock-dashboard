import type { MouseEventHandler, ReactNode } from "react";
import styles from "./Badge.module.css";

export type BadgeVariant = "neutral" | "accent" | "outline" | "ghost";
export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  children: ReactNode;
  /**
   * `neutral` — surface + hairline border, the same recipe as the settings
   * sheet's select/close-button chips. Default.
   * `accent` — tinted with the live weather accent (`--wc-accent`), for
   * calling something out (e.g. "Agora", an active filter).
   * `outline` — no fill, just a hairline border; for low-emphasis tags.
   */
  variant?: BadgeVariant;
  /** `sm` is an uppercase micro-label (like the stat row's "MÁX/MÍN"); `md` is normal-case. */
  size?: BadgeSize;
  /** Optional leading icon, e.g. a small react-icons glyph. */
  icon?: ReactNode;
  /** Small glowing dot instead of/alongside an icon — same visual language as the sun-track marker. */
  dot?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

/**
 * Small pill-shaped label. Renders as a `<button>` when `onClick` is given
 * (for filter/toggle tags), otherwise a plain `<span>`.
 */
export function Badge({ children, variant = "neutral", size = "sm", icon, dot, onClick, className }: BadgeProps) {
  const classes = [styles.badge, styles[variant], styles[size], className].filter(Boolean).join(" ");

  const content = (
    <>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={`${classes} ${styles.clickable}`} onClick={onClick}>
        {content}
      </button>
    );
  }

  return <span className={classes}>{content}</span>;
}