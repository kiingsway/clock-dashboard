import { Tooltip } from '@/components/ui/Tooltip';
import styles from './DeviceLocationButton.module.css';
import { TbCurrentLocation, TbCurrentLocationFilled, TbCurrentLocationOff } from 'react-icons/tb';
import { ILocation } from '@/types/location.types';
import { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface Coords {
  lat: number;
  lon: number;
}

type GeoError = 'denied' | 'unavailable' | 'timeout' | 'unsupported';

type Status =
  | 'idle' // nunca usado / voltou ao estado inicial
  | 'locating' // aguardando o navegador devolver as coordenadas
  | 'loading' // coordenadas ok, aguardando a API
  | 'active' // localização do dispositivo em uso
  | 'denied' // usuário recusou a permissão
  | 'unavailable' // GPS indisponível, timeout ou sem suporte
  | 'error'; // falha na requisição à API

const GEO_ERROR_STATUS: Record<GeoError, Status> = {
  denied: 'denied',
  unavailable: 'unavailable',
  timeout: 'unavailable',
  unsupported: 'unavailable',
};

const getCurrentPosition = (): Promise<Coords> =>
  new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      reject('unsupported' as GeoError);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lon: coords.longitude }),
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject('denied' as GeoError);
            break;
          case error.TIMEOUT:
            reject('timeout' as GeoError);
            break;
          default:
            reject('unavailable' as GeoError);
        }
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 },
    );
  });

const fetchNearestCity = (url: string): Promise<ILocation[]> =>
  axios.get<ILocation[]>(url).then((res) => res.data);

interface Props {
  active: boolean;
  onLocationChange: (newLocation: ILocation) => void;
}

export default function DeviceLocationButton({ active, onLocationChange }: Props) {
  const { t } = useTranslation();
  const [coords, setCoords] = useState<Coords | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<GeoError | null>(null);
  // Incrementa a cada geolocalização bem-sucedida, para reaplicar o resultado
  // mesmo quando as coordenadas (e portanto a chave do SWR) não mudaram.
  const [attempt, setAttempt] = useState(0);

  // Chave nula = SWR não faz requisição até o usuário clicar.
  const swrKey = coords
    ? `/api/locations/near?${new URLSearchParams({ lat: String(coords.lat), lon: String(coords.lon) })}`
    : null;

  const { data, error, isLoading } = useSWR<ILocation[]>(swrKey, fetchNearestCity, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  });

  // Entrega o resultado ao pai (que limpa o campo de busca e define a localização).
  useEffect(() => {
    if (data) onLocationChange(data[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, attempt]);

  const handleClick = useCallback(async () => {
    setIsLocating(true);
    setGeoError(null);

    try {
      const position = await getCurrentPosition();
      setCoords(position);
      setAttempt(n => n + 1);
    } catch (err) {
      setCoords(null);
      setGeoError(err as GeoError);
    } finally {
      setIsLocating(false);
    }
  }, []);

  const status: Status = isLocating
    ? 'locating'
    : geoError
      ? GEO_ERROR_STATUS[geoError]
      : error
        ? 'error'
        : isLoading
          ? 'loading'
          : active
            ? 'active'
            : 'idle';

  const isBusy = status === 'locating' || status === 'loading';
  const label = t(`devLocStatusTextes.${status}`);

  const Icon =
    status === 'active'
      ? TbCurrentLocationFilled
      : status === 'denied' || status === 'unavailable' || status === 'error'
        ? TbCurrentLocationOff
        : TbCurrentLocation;

  return (
    <Tooltip content={label}>
      <button
        type="button"
        className={styles.button}
        data-status={status}
        onClick={handleClick}
        disabled={isBusy}
        aria-label={label}
        aria-busy={isBusy}
        aria-pressed={status === 'active'}
      >
        <Icon />
      </button>
    </Tooltip>
  );
}
