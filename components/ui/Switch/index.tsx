import styles from "./Switch.module.scss";

interface SwitchProps {
  id: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  /** Usado apenas para acessibilidade quando não há um <label htmlFor> visível na tela */
  ariaLabel?: string;
}

export function Switch({ id, value, onChange, disabled, ariaLabel }: SwitchProps) {
  return (
    <span className={styles.wrapper} data-disabled={disabled || undefined}>
      <input
        id={id}
        type="checkbox"
        role="switch"
        className={styles.input}
        checked={value}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.track}>
        <span className={styles.thumb} />
      </span>
    </span>
  );
}