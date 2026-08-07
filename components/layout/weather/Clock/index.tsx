import { useTranslation } from 'react-i18next';
import styles from './Clock.module.scss';
import useNow from "@/hooks/useNow";

interface Props {
  timezone: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

export default function Clock({ timezone, onClick, onDoubleClick }: Props) {
  const { i18n: { language: locale } } = useTranslation();
  const { now } = useNow({ locale, timezone });

  return (
    <p className={styles.time} aria-live="polite" onClick={onClick} onDoubleClick={onDoubleClick}>
      {now.toFormat("HH:mm") ?? "--:--"}
    </p>
  )
}
