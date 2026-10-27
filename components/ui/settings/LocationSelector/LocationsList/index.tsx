import { FaRegStar, FaStar } from 'react-icons/fa';
import { TbCheck } from 'react-icons/tb';
import styles from './LocationsList.module.scss';
import { ILocation } from '@/types/location.types';
import { useFavoriteLocations } from './useFavoriteLocations';
import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import FlagIcon from '../FlagIcon';

interface Props {
  error: unknown;
  loading: boolean;
  locations: ILocation[] | undefined;
  /** Cidade selecionada no momento, marcada na lista */
  currentId?: number;
  onChange: (location: ILocation) => void;
}

/** Dropdown com os resultados da busca; favoritos primeiro */
export default function LocationsList({ locations, error, loading, currentId, onChange }: Props) {
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavoriteLocations();

  const sortedLocations = [...(locations ?? [])].sort((a, b) => {
    return Number(isFavorite(b.geonameId)) - Number(isFavorite(a.geonameId));
  });

  return (
    <div className={styles.results} role="listbox">
      {Boolean(error) && (
        <div className={styles.message}>
          {t('settingsTexts.general.locationsError')}
        </div>
      )}

      {!loading && !error && locations?.length === 0 && (
        <div className={styles.message}>
          {t('settingsTexts.general.noLocations')}
        </div>
      )}

      {sortedLocations.map(location => (
        <LocationItem
          key={location.geonameId}
          location={location}
          isSelected={location.geonameId === currentId}
          isFavorite={isFavorite(location.geonameId)}
          onLocationChange={() => onChange(location)}
          onFavoriteChange={() => toggleFavorite(location)}
        />
      ))}
    </div>
  );
}

interface LocationItemProps {
  location: ILocation;
  isSelected: boolean;
  isFavorite: boolean;
  onLocationChange: () => void;
  onFavoriteChange: () => void;
}

const LocationItem = ({ location, isSelected, isFavorite, onLocationChange, onFavoriteChange }: LocationItemProps): JSX.Element => {
  const { countryCode, name, timezone } = location;

  return (
    <div className={styles.location} role="option" aria-selected={isSelected}>
      <button type="button" className={styles.locationName} onMouseDown={onLocationChange}>
        <FlagIcon countryCode={countryCode} width={22} />

        <span className={styles.text}>
          <span className={styles.name}>{name}</span>
          <span className={styles.meta}>{countryCode} · {timezone}</span>
        </span>

        {isSelected && <TbCheck className={styles.check} aria-hidden="true" />}
      </button>

      <button
        type="button"
        className={styles.favorite}
        data-active={isFavorite}
        aria-pressed={isFavorite}
        onMouseDown={(e) => {
          e.preventDefault(); // mantém o foco na busca (e a lista aberta)
          e.stopPropagation();
          onFavoriteChange();
        }}
      >
        {isFavorite ? <FaStar size={14} /> : <FaRegStar size={14} />}
      </button>
    </div>
  );
};
