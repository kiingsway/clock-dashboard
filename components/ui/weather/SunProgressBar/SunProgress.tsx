import { capitalizeWords } from '@/utils/formatters/textFormatters';
import WeatherIcon from '../WeatherIcon';
import styles from './SunProgressBar.module.scss';

interface Props {
  startTime?: string;
  endTime?: string;
  startKind?: 'sunrise' | 'sunset'
  endKind?: 'sunrise' | 'sunset'
  progress?: number;
  onDoubleClick?: () => void;
}

export default function SunProgress({ startTime, endTime, startKind = 'sunrise', endKind = 'sunset', progress, onDoubleClick }: Props) {
  return (
    <div className={styles.sunArc} aria-label={`${startKind} ${startTime}, ${endKind} ${endTime}`} onDoubleClick={onDoubleClick}>
      <div className={styles.sunPoint}>
        <WeatherIcon
          size={18}
          category={{
            name: startKind,
            title: capitalizeWords(startKind)
          }}
        />
        {startTime && <span>{startTime}</span>}
      </div>

      <div
        className={styles.sunTrack}
        aria-hidden="true"
      >
        {typeof progress === 'number' ? (
          <>
            <div className={styles.sunTrackFill} style={{ width: `${progress * 100}%` }} />
            <div className={styles.sunMarker} style={{ left: `${progress * 100}%` }} />
          </>
        ) : <></>}
      </div>

      <div className={styles.sunPoint}>
        <WeatherIcon
          category={{ name: endKind, title: capitalizeWords(endKind) }}
          size={18}
        />
        {endTime && <span>{endTime}</span>}
      </div>
    </div>
  )
}
