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

// Separado do NowContext: `now` muda a cada minuto, `today` só na virada do dia
// (ou ao trocar fuso/idioma). Quem só precisa do dia não re-renderiza a cada minuto.
const TodayContext = createContext<DateTime | undefined>(undefined);

interface NowProviderProps {
  children: ReactNode;
}

const TEST_DATE: DateTime | undefined = undefined;
// const TEST_DATE: DateTime | undefined = DateTime.now().set({ hour: 5, minute: 30 });

export function NowProvider({ children }: NowProviderProps) {
  const { i18n: { language: locale } } = useTranslation();
  const { get: { location: { timezone } } } = useAppSettings();

  const [simulatedDate, setSimulatedDateState] = useState<DateTime | undefined>(TEST_DATE);

  const getNow = useCallback((forceNow: boolean | undefined = false) => {
    const date = forceNow || !simulatedDate ? DateTime.now() : simulatedDate;
    return setZoneOnDate(date, timezone, locale);
  }, [locale, simulatedDate, timezone]);

  const [now, setNow] = useState<DateTime>(getNow);
  const [today, setToday] = useState<DateTime>(() => getNow().startOf('day'));

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
        const newDay = realNow.startOf('day');

        const sameDay = previous.hasSame(newDay, 'day');
        const sameZone = previous.zoneName === newDay.zoneName;
        const sameLocale = previous.locale === newDay.locale;

        // Mantém a mesma instância enquanto nada muda, para não re-renderizar quem depende só do dia.
        return sameDay && sameZone && sameLocale ? previous : newDay;
      });
    };

    update();

    let timeout: ReturnType<typeof setTimeout>;

    // Alinha a atualização à virada do minuto, em vez de contar 60s a partir da montagem.
    const scheduleNextMinute = () => {
      timeout = setTimeout(() => {
        update();
        scheduleNextMinute();
      }, 60_000 - (Date.now() % 60_000));
    };

    scheduleNextMinute();

    // Timers são atrasados em abas em segundo plano; atualiza ao voltar para a aba.
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;

      clearTimeout(timeout);
      update();
      scheduleNextMinute();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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
    <TodayContext.Provider value={today}>
      <NowContext.Provider value={value}>
        {children}
      </NowContext.Provider>
    </TodayContext.Provider>
  );
}

export function useNow() {
  const context = useContext(NowContext);
  if (!context) throw new Error('useNow must be used inside a NowProvider');
  return context;
}

/** Início do dia atual, no fuso e idioma da localização. Prefira a `useNow` quando a hora não importa. */
export function useToday() {
  const today = useContext(TodayContext);
  if (!today) throw new Error('useToday must be used inside a NowProvider');
  return today;
}