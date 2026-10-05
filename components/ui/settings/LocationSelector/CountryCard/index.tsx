import Image from "next/image";
import styles from "./CountryCard.module.css";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import axios from "axios";
import { ILocation, ICountriesDevCountryAlphaItem } from "@/types/location.types";

export interface CountryCardProps {
  location: ILocation;
}


export function CountryCard({ location }: CountryCardProps) {
  const { i18n: { language: locale } } = useTranslation();

  const { countryCode, name: city, population, timezone } = location;

  const { data: country } = useSWR<ICountriesDevCountryAlphaItem>(
    `/api/locations/countries?countryCode=${encodeURIComponent(countryCode.trim())}`,
    async (uri: string) => { return (await axios.get(uri)).data; }
  );

  const countryName = !country
    ? countryCode
    : country.translations?.[locale] ?? country.name;

  return (
    <article className={`${styles.card}`}>
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

        <small className={styles.timezone}>{timezone}</small>

        <PopulationText
          value={population ?? country?.population}
        />
      </div>
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