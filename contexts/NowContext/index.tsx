'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DateTime } from 'luxon';
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { useTranslation } from 'react-i18next';

interface NowContextValue {
  now: DateTime;
  simulatedDate: DateTime | undefined;
  setSimulatedDate: (date: DateTime | string | undefined) => void;
}

const NowContext = createContext<NowContextValue | undefined>(undefined);

interface NowProviderProps {
  children: ReactNode;
}

export function NowProvider({ children }: NowProviderProps) {
  const { i18n: { language: locale } } = useTranslation();
  const { get: { location: timezone } } = useAppSettings();

  const [simulatedDate, setSimulatedDateState] =
    useState<DateTime | undefined>();

  const getRealNow = () => {
    let now = DateTime.now();

    if (timezone) {
      const nowWithTimezone = now.setZone(timezone);
      if (nowWithTimezone.isValid) now = nowWithTimezone
    }

    if (locale) return now.setLocale(locale);

    return now;
  };

  const getNow = () => {
    if (simulatedDate) {
      let date = simulatedDate;
      if (timezone) date = date.setZone(timezone);
      if (locale) date = date.setLocale(locale);
      return date;
    }

    return getRealNow();
  };

  const [now, setNow] = useState<DateTime>(getNow);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(getNow());

    if (simulatedDate) return;

    let timeout: ReturnType<typeof setTimeout>;

    const update = () => {
      setNow(getRealNow());

      const current = DateTime.now();

      const millisecondsUntilNextMinute =
        60_000 -
        (current.second * 1_000 + current.millisecond);

      timeout = setTimeout(update, millisecondsUntilNextMinute);
    };

    const current = DateTime.now();

    const millisecondsUntilNextMinute =
      60_000 -
      (current.second * 1_000 + current.millisecond);

    timeout = setTimeout(update, millisecondsUntilNextMinute);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timezone, locale, simulatedDate]);

  const setSimulatedDate = (
    date: DateTime | string | undefined
  ) => {
    if (date === undefined) {
      setSimulatedDateState(undefined);
      return;
    }

    const parsed =
      typeof date === 'string'
        ? DateTime.fromISO(date)
        : date;

    if (!parsed.isValid) {
      console.warn('Invalid simulated date:', date);
      return;
    }

    setSimulatedDateState(parsed);
  };

  const value = useMemo(
    () => ({
      now,
      simulatedDate,
      setSimulatedDate,
    }),
    [now, simulatedDate]
  );

  return (
    <NowContext.Provider value={value}>
      {children}
    </NowContext.Provider>
  );
}

export function useNow() {
  const context = useContext(NowContext);
  if (!context) throw new Error('useNow must be used inside a NowProvider');
  return context;
}