import { DateTime } from "luxon";

export const setZoneOnDate = (date: DateTime, timezone: string | undefined, locale: string | undefined) => {
  let now = date;

  if (timezone) {
    const timezoneNow = now.setZone(timezone);
    if (timezoneNow.isValid) now = timezoneNow;
  }

  if (locale) {
    const localeNow = now.setLocale(locale);
    if (localeNow.isValid) now = localeNow;
  }

  return now;
};