import { ILocation } from '@/types/location.types';
import { useState } from 'react';
import useSWR from 'swr';
import styles from './LocationSelector.module.scss';
import { CountryCard } from './CountryCard';
import LocationsList from './LocationsList';
import useBoolean from '@/hooks/useBoolean';
import { useFavoriteLocations } from './LocationsList/useFavoriteLocations';
import DeviceLocationButton from './DeviceLocationButton';
import { useTranslation } from 'react-i18next';
import useAppSettings from '@/contexts/AppSettingsContext';
import { isValidLocationArray } from '@/utils/locations/isValidLocationObject';

const MIN_QUERY_CHAR = 3;

const fetcher = async (url: string): Promise<ILocation[]> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch locations');
  }

  const data: unknown = await response.json();

  if (!isValidLocationArray(data)) {
    throw new Error('Invalid locations response');
  }

  return data;
};

export default function LocationSelector() {
  const [query, setQuery] = useState('');
  const [inputFocused, { setTrue: inputFocus, setFalse: inputUnfocus }] = useBoolean();
  const [isUsingDeviceLoc, setUsingDeviceLoc] = useState(false);
  const { get: { location }, set: { location: setLocation } } = useAppSettings();
  const { favorites } = useFavoriteLocations();

  const isTyping = query.trim().length >= MIN_QUERY_CHAR;
  const isSearching = inputFocused && (isTyping || Boolean(favorites.length));

  const { data: locations, isLoading, error } = useSWR<ILocation[]>(
    isTyping
      ? `/api/locations/cities?q=${encodeURIComponent(query.trim())}`
      : null,
    fetcher
  );

  const onLocationChange = (newLocation: ILocation, isUsingDeviceLoc: boolean = false): void => {
    setQuery('');
    setLocation(newLocation);
    setUsingDeviceLoc(isUsingDeviceLoc);
  };

  return (
    <div
      className={styles.locationSelector}
      onFocus={inputFocus}
      onBlur={inputUnfocus}
    >

      <div className={styles.search}>
        <SearchInput
          loading={isLoading}
          onChange={setQuery}
          value={query}
        />

        <DeviceLocationButton
          active={isUsingDeviceLoc}
          onLocationChange={l => onLocationChange(l, true)}
        />
      </div>

      {isSearching && (
        <LocationsList
          error={error}
          loading={isLoading}
          locations={locations}
          onChange={onLocationChange}
        />
      )}

      {location && <CountryCard location={location} />}
    </div>
  );
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
}

const SearchInput = ({ value, loading, onChange }: SearchInputProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.inputWrapper}>
      <input
        id="location"
        className={styles.input}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={t('settingsTexts.general.searchLocation')}
        autoComplete="off"
      />
      {loading && <span className={styles.loader} />}
    </div>
  );
};