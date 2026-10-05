export interface ILocation {
  geonameId: number
  name: string
  latitude: number
  longitude: number
  timezone: string
  countryCode: string
  population?: number
}

export interface ICountriesDevCitiesItem extends ILocation {
  asciiName: string
  admin1Code: string
  population: number
  featureCode: string
}

export interface ICountriesDevCountryAlphaItem {
  area: number
  cioc: string
  flag: string
  gini: number
  maps: {
    googleMaps: string
    openStreetMaps: string
  }
  name: string
  flags: {
    png: string
    svg: string
  }
  latlng: Array<number>
  region: string
  borders: Array<string>
  capital: string
  demonym: string
  languages: Array<{
    name: string
    iso639_1: string
    iso639_2: string
    nativeName: string
  }>
  subregion: string
  timezones: Array<string>
  alpha2Code: string
  alpha3Code: string
  currencies: Array<{
    code: string
    name: string
    symbol: string
  }>
  nativeName: string
  population: number
  independent: boolean
  numericCode: string
  altSpellings: Array<string>
  callingCodes: Array<string>
  translations: Record<string, string>
  regionalBlocs: Array<{
    name: string
    acronym: string
    otherNames: Array<string>
  }>
  topLevelDomain: Array<string>
  populationDensity: number
}

