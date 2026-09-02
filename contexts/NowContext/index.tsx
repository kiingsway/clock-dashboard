'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DateTime } from 'luxon';
import useAppSettings from "@/contexts/AppSettingsContext";
import { useTranslation } from 'react-i18next';
import { setZoneOnDate } from './utils';

interface NowContextValue {
  now: DateTime;
  today: DateTime;
  simulatedDate: DateTime | undefined;
  setSimulatedDate: (date: DateTime | string | undefined) => void;
}

const NowContext = createContext<NowContextValue | undefined>(undefined);

interface NowProviderProps {
  children: ReactNode;
}

const TEST_DATE: DateTime | undefined = undefined;
// const TEST_DATE: DateTime | undefined = DateTime.now().set({ hour: 5, minute: 30 });

export function NowProvider({ children }: NowProviderProps) {
  const { i18n: { language: locale } } = useTranslation();
  const { get: { location: timezone } } = useAppSettings();

  const [simulatedDate, setSimulatedDateState] = useState<DateTime | undefined>(TEST_DATE);

  const getNow = useCallback((forceNow: boolean | undefined = false) => {
    const date = forceNow || !simulatedDate ? DateTime.now() : simulatedDate;
    return setZoneOnDate(date, timezone, locale);
  }, [locale, simulatedDate, timezone]);

  const [now, setNow] = useState<DateTime>(getNow);
  const [today, setToday] = useState<DateTime>(getNow);

  useEffect(() => {
    if (simulatedDate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNow(setZoneOnDate(simulatedDate, timezone, locale));

      const interval = setInterval(() => {
        setSimulatedDateState(previous => {
          if (!previous) return previous;

          const next = previous.plus({ minutes: 15 });

          setNow(setZoneOnDate(next, timezone, locale));

          setToday(previousToday => {
            const nextToday = next
              .setZone(timezone ?? next.zoneName)
              .startOf('day');

            return previousToday.hasSame(nextToday, 'day')
              ? previousToday
              : nextToday;
          });

          return next;
        });
      }, 1000);

      return () => clearInterval(interval);
    }

    const update = () => {
      const realNow = getNow(true);

      setNow(realNow);

      setToday(previous => {
        const next = realNow.startOf('day');

        return previous.hasSame(next, 'day')
          ? previous
          : next;
      });
    };

    update();

    const interval = setInterval(update, 60_000);

    return () => clearInterval(interval);
  }, [simulatedDate, timezone, locale, getNow]);

  const setSimulatedDate = (
    date: DateTime | string | undefined,
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
      today,
      simulatedDate,
      setSimulatedDate,
    }),
    [now, today, simulatedDate],
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