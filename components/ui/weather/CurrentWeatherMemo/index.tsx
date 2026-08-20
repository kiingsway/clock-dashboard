import type { JSX } from 'react';
import styles from './InfoPill.module.scss';

type TInfoMemo = {
  label: string;
  value: string;
  title?: string;
  onClick?: () => void;
};

export interface CurrentWeatherMemoProps {
  info1?: TInfoMemo
  info2?: TInfoMemo
}

export default function CurrentWeatherMemo({ info1, info2 }: CurrentWeatherMemoProps): JSX.Element {

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