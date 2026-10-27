import { ILocation } from '@/types/location.types';
import { useState } from 'react';
import useSWR from 'swr';
import classNames from 'classnames';
import styles from './LocationSelector.module.scss';
import fieldStyles from '@/components/ui/Field/Field.module.css';
import { CountryCard } from './CountryCard';
import useAppSettings from '@/contexts/AppSettingsContext';
import LocationsList from './LocationsList';
import { useFavoriteLocations } from './LocationsList/useFavoriteLocations';
import DeviceLocationButton from './DeviceLocationButton';
import useBoolean from '@/hooks/useBoolean';
import { useTranslation } from 'react-i18next';
import { isValidLocationArray } from '@/utils/locations/isValidLocationObject';
import { TbSearch, TbX, TbFlask } from 'react-icons/tb';
import { BETA_LOCATION, isBetaLocation, SHOW_BETA_LOCATION } from '@/constants/locations';
import FlagIcon from './FlagIcon';

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

/**
 * Busca de cidade com resultados num dropdown, atalhos (favoritos e Cidade Beta)
 * e o card da cidade selecionada.
 */
export default function LocationSelector() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [searchFocused, { setTrue: searchFocus, setFalse: searchBlur }] = useBoolean();
  const [isUsingDeviceLoc, setUsingDeviceLoc] = useState(false);
  const { get: { location }, set: { location: setLocation } } = useAppSettings();
  const { favorites } = useFavoriteLocations();

  const isTyping = query.trim().length >= MIN_QUERY_CHAR;

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

  const quickPicks = [
    ...favorites,
    ...(SHOW_BETA_LOCATION ? [BETA_LOCATION] : []),
  ];

  return (
    <div className={styles.locationSelector}>

      <div className={styles.search} onFocus={searchFocus} onBlur={searchBlur}>
        <SearchInput
          loading={isLoading}
          onChange={setQuery}
          value={query}
        />

        <DeviceLocationButton
          active={isUsingDeviceLoc}
          onLocationChange={l => onLocationChange(l, true)}
        />

        {/* Os itens do dropdown usam onMouseDown, que dispara antes do blur fechar a lista */}
        {isTyping && searchFocused && (
          <LocationsList
            error={error}
            loading={isLoading}
            locations={locations}
            currentId={location?.geonameId}
            onChange={onLocationChange}
          />
        )}
      </div>

      {quickPicks.length > 0 && (
        <div className={styles.quickPicks} role="group">
          {quickPicks.map(pick => {
            const isBeta = isBetaLocation(pick);

            return (
              <button
                key={pick.geonameId}
                type="button"
                className={classNames(styles.chip, { [styles.betaChip]: isBeta })}
                aria-pressed={pick.geonameId === location?.geonameId}
                onClick={() => onLocationChange(pick)}
              >
                {isBeta ? <TbFlask aria-hidden="true" /> : <FlagIcon countryCode={pick.countryCode} width={16} />}
                {isBeta ? t('settingsTexts.general.betaCity.name') : pick.name}
              </button>
            );
          })}
        </div>
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
      <TbSearch className={styles.searchIcon} aria-hidden="true" />

      <input
        id="location"
        className={classNames(fieldStyles.input, styles.input)}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={t('settingsTexts.general.searchLocation')}
        autoComplete="off"
        onKeyDown={e => { if (e.key === 'Escape' && value) { e.stopPropagation(); onChange(''); } }}
      />

      {loading ? (
        <span className={styles.loader} aria-hidden="true" />
      ) : value && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange('')}
          aria-label={t('settingsTexts.general.clearSearch')}
        >
          <TbX />
        </button>
      )}
    </div>
  );
};
