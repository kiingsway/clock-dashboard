import type { JSX } from 'react';
import styles from './InfoPill.module.scss';

type TInfoPill = {
  label: string;
  value: string;
  title?: string;
  onClick?: () => void;
};

export interface InfoPillProps {
  info1?: TInfoPill
  info2?: TInfoPill
}

export default function InfoPill({ info1, info2 }: InfoPillProps): JSX.Element {

  if (!info1 && !info2) return <></>;

  return (
    <dl className={styles.statRow}>
      {info1 && (
        <div className={styles.stat} title={info1.title} onClick={info1.onClick}>
          <dt>{info1.label}</dt>
          <dd>{info1.value}</dd>
        </div>
      )}
      {info1 && info2 && <div className={styles.statDivider} aria-hidden="true" />}
      {info2 && (
        <div className={styles.stat} title={info2.title} onClick={info2.onClick}>
          <dt>{info2.label}</dt>
          <dd>{info2.value}</dd>
        </div>
      )}
    </dl>
  );
}