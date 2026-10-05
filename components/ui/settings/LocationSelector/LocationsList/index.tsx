import { FaRegStar, FaStar } from 'react-icons/fa';
import styles from './LocationsList.module.scss';
import { ILocation } from '@/types/location.types';
import { useFavoriteLocations } from './useFavoriteLocations';
import { JSX } from 'react';

interface Props {
  error: unknown;
  loading: boolean;
  locations: ILocation[] | undefined;
  onChange: (location: ILocation) => void;
}

export default function LocationsList({ locations, error, loading, onChange }: Props) {

  const { favorites, isFavorite, toggleFavorite } = useFavoriteLocations();

  const source = locations ?? favorites;
  const sortedLocations = [...source].sort((a, b) => {
    return Number(isFavorite(b.geonameId)) - Number(isFavorite(a.geonameId));
  });

  return (
    <div className={styles.results}>
      {Boolean(error) && (
        <div className={styles.message}>
          Failed to load locations.
        </div>
      )}

      {!loading && !error && locations?.length === 0 && (
        <div className={styles.message}>
          No locations found.
        </div>
      )}

      {sortedLocations?.map(location => (
        <LocationItem
          key={location.geonameId}
          label={`${location.name}, ${location.countryCode}`}
          isFavorite={isFavorite(location.geonameId)}
          onLocationChange={() => onChange(location)}
          onFavoriteChange={() => toggleFavorite(location)}
        />
      ))}
    </div>
  );
}

interface LocationItemProps {
  label: string;
  isFavorite: boolean;
  onLocationChange: () => void;
  onFavoriteChange: () => void;
}

const LocationItem = ({ label, isFavorite, onLocationChange, onFavoriteChange }: LocationItemProps): JSX.Element => {

  return (
    <div className={styles.location}>
      <button type="button" className={styles.locationName} onMouseDown={onLocationChange}>
        {label}
      </button>

      <button
        type="button"
        className={styles.favorite}
        onMouseDown={(e) => {
          e.stopPropagation();
          onFavoriteChange();
        }}
      >
        {isFavorite ? <FaStar size={15} /> : <FaRegStar size={15} />}
      </button>
    </div>
  );
};