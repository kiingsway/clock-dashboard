import type { JSX } from 'react'
import styles from './WeatherWidgets.module.scss'
import { DetailCard } from '../DetailCard/DetailCard'
import WeatherIcon from '../WeatherIcon'
import { IUseWeather } from '@/hooks/useWeather'

interface Props {
  data: IUseWeather['data']
}

export default function WeatherWidgets({ data }: Props): JSX.Element {
  const { moonPhase, uvIcon, visibility, windInfo } = data

  return (
    <div className={styles.main}>
      {moonPhase && (
        <>
          <DetailCard
            title="Moon"
            description={`${moonPhase.title} (${(moonPhase.phase * 100).toFixed(2)}%)`}
            icon={moonPhase && (
              <WeatherIcon
                src={moonPhase.iconSrc}
                title={moonPhase.title}
                alt={moonPhase.title}
                size={120}
              />
            )}
          />

          {moonPhase.moonrise && moonPhase.moonset && (
            <DetailCard
              title="Moonrise/Moonset"
              bigText={`${moonPhase.moonrise.toFormat('HH:mm')} - ${moonPhase.moonset.toFormat('HH:mm')}`}
            />
          )}
        </>
      )}

      {uvIcon && <DetailCard
        title="UV Index"
        description={uvIcon.desc}
        icon={(
          <WeatherIcon
            src={uvIcon.src}
            title={uvIcon.alt}
            alt={uvIcon.alt}
            size={120}
            duration={uvIcon.iconDuration}
          />
        )} />}

      {windInfo && (
        <>
          <DetailCard
            title="Wind Gusts Now"
            textColor={windInfo.hourly.gustsColor}
            bigText={`${windInfo.hourly.gusts}km/h`}
            description={`Média de ${windInfo.daily?.gusts}km/h no dia`}
          />

          <DetailCard
            title="Wind"
            description={`${windInfo.hourly.desc} Sentido ${windInfo.hourly.direction.name?.toLowerCase()}.`}
            icon={windInfo.hourly.beaufort?.src && windInfo.hourly.direction.src && (
              <>
                <WeatherIcon
                  src={windInfo.hourly.beaufort?.src}
                  title={`Vento ${windInfo.hourly.direction.name}`}
                  alt={`Vento ${windInfo.hourly.direction.name}`}
                  duration={windInfo.hourly.beaufort.duration}
                  size={80}
                />
                <WeatherIcon
                  src={windInfo.hourly.direction.src}
                  title={`Vento ${windInfo.hourly.direction.name}`}
                  alt={`Vento ${windInfo.hourly.direction.name}`}
                  duration={windInfo.hourly.beaufort.duration}
                  size={80}
                />
              </>
            )}
          />
        </>
      )}

      {visibility && <DetailCard
        title="Visibility"
        bigText={visibility.title}
        textColor={visibility.color}
        description={visibility.desc}
      />}
    </div>
  )
}
