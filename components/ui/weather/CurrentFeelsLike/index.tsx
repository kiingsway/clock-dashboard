import styles from './CurrentFeelsLike.module.scss';
import { useTranslation } from 'react-i18next';

interface Props {
  temp: number | undefined;
  unit?: string;
  noText?: boolean
}

export default function CurrentFeelsLike({ temp, unit, noText = false }: Props) {
  const { t } = useTranslation();

  if (!temp) return null;

  return (
    <p className={styles.feelsLike}>
      {noText ? '' : t('feelsLike')} <span>{Math.round(temp)}</span>
      {unit ? <small>{unit}</small> : 'º'}
    </p>
  )
}
