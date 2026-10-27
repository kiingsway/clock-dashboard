import Image from "next/image";
import styles from "./CountryCard.module.css";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import axios from "axios";
import { FaRegStar, FaStar } from "react-icons/fa";
import { TbFlask, TbWorld } from "react-icons/tb";
import { ILocation, ICountriesDevCountryAlphaItem } from "@/types/location.types";
import { BETA_TEMPERATURE_RAMP, isBetaLocation } from "@/constants/locations";
import { useFavoriteLocations } from "../LocationsList/useFavoriteLocations";

export interface CountryCardProps {
  location: ILocation;
}

/** Card da cidade selecionada: bandeira, país, fuso, população e favoritar */
export function CountryCard({ location }: CountryCardProps) {
  const { t, i18n: { language: locale } } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavoriteLocations();

  const { countryCode, name: city, population, timezone } = location;
  const isBeta = isBetaLocation(location);

  const { data: country } = useSWR<ICountriesDevCountryAlphaItem>(
    isBeta ? null : `/api/locations/countries?countryCode=${encodeURIComponent(countryCode.trim())}`,
    async (uri: string) => { return (await axios.get(uri)).data; }
  );

  if (isBeta) {
    const { FROM, TO, HOURS } = BETA_TEMPERATURE_RAMP;

    return (
      <article className={`${styles.card} ${styles.beta}`}>
        <div className={styles.media}>
          <span className={styles.placeholder} aria-hidden="true"><TbFlask /></span>
        </div>

        <div className={styles.info}>
          <div className={styles.cityCountry}>
            <h3 className={styles.city}>{t('settingsTexts.general.betaCity.name')}</h3>
            <span className={styles.badge}>BETA</span>
          </div>

          <p className={styles.description}>
            {t('settingsTexts.general.betaCity.desc', { from: FROM, to: TO, hours: HOURS })}
          </p>

          <small className={styles.timezone}><TbWorld aria-hidden="true" /> {timezone}</small>
        </div>
      </article>
    );
  }

  const countryName = !country
    ? countryCode
    : country.translations?.[locale] ?? country.name;

  const favorite = isFavorite(location.geonameId);

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {country ? (
          <Image
            src={country.flags.svg}
            alt={`${country.name} Flag`}
            fill
            sizes="96px"
            className={styles.image}
          />
        ) : (
          <span className={styles.placeholder} aria-hidden="true">
            {countryCode.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      <div className={styles.info}>

        <div className={styles.cityCountry}>
          <h3 className={styles.city}>{city}</h3>
          <p className={styles.country}>{countryName}</p>
        </div>

        <small className={styles.timezone}><TbWorld aria-hidden="true" /> {timezone}</small>

        <PopulationText
          value={population ?? country?.population}
        />
      </div>

      <button
        type="button"
        className={styles.favorite}
        data-active={favorite}
        aria-pressed={favorite}
        aria-label={t('settingsTexts.general.favoriteLocation')}
        onClick={() => toggleFavorite(location)}
      >
        {favorite ? <FaStar /> : <FaRegStar />}
      </button>
    </article>
  );
}

const PopulationText = ({ value }: { value: unknown }) => {
  const { t, i18n: { language: locale } } = useTranslation();
  const numberFormatter = new Intl.NumberFormat(locale);

  if (typeof value !== 'number' || !Number.isFinite(value)) return null;

  return (
    <p className={styles.population}>
      <span className={styles.populationLabel}>{t('population')}</span>
      <span className={styles.populationValue}>
        {numberFormatter.format(value)}
      </span>
    </p>
  );
};
