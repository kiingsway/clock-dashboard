import styles from './Clock.module.scss';
import { useNow } from '@/contexts/NowContext';

interface Props {
  onClick?: () => void;
  onDoubleClick?: () => void;
}

export default function Clock({ onClick, onDoubleClick }: Props) {
  const { now } = useNow();

  return (
    <p className={styles.time} aria-live="polite" onClick={onClick} onDoubleClick={onDoubleClick}>
      {now.toFormat("HH:mm") ?? "--:--"}
    </p>
  )
}
