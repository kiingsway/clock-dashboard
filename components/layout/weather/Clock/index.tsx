import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import styles from './Clock.module.scss';

interface Props {
  timezone?: string;
  onClick?: () => void;
}

export default function Clock({ timezone, onClick }: Props) {
  const [now, setNow] = useState<DateTime>();

  const changeSecond = (): void => setNow(DateTime.now().setZone(timezone));

  useEffect(() => {
    changeSecond();

    const id = window.setInterval(changeSecond, 1000);

    return () => window.clearInterval(id);
  }, [timezone]);

  return (
    <p className={styles.time} aria-live="polite" onClick={onClick}>
      {now?.toFormat("HH:mm") ?? "--:--"}
    </p>
  )
}
