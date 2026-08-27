import { BottomSheet } from '@/components/ui/BottomSheet';
import { usePortalContainer } from '@/hooks/usePortalContainer';
import { IWeather } from '@/types/weather.types';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { useNow } from '@/contexts/NowContext';
import { TFunction } from 'i18next';
import { capitalizeWords } from '@/utils/formatters/textFormatters';
import { JSX } from 'react';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import DailySheetContent from './DailySheetContent';

interface Props {
  weather: IWeather | undefined
  open: boolean;
  index: number | undefined;
  onClose: () => void;
}

export default function DailySheet({ weather, open, index, onClose }: Props): JSX.Element | null {
  const { t, i18n: { language: locale } } = useTranslation();
  const { now } = useNow();
  const portalContainer = usePortalContainer();

  if (typeof index !== 'number' || !weather) return null;

  const { daily, timezone } = weather;

  const iso = daily.time[index];

  const indexDate = DateTime.fromISO(iso, { zone: timezone });

  const title = getForecastTitle(now, indexDate, locale, t);

  return (
    <BottomSheet
      open={open && typeof index === 'number'}
      onClose={onClose}
      title={title}
      ariaLabel={t('close')}
      snapPoints={[0.7, 0.95]}
      initialSnap={0}
      dismissible
      container={portalContainer}
    >
      <ErrorBoundary>
        {Boolean(weather) && typeof index === 'number' && (
          <DailySheetContent weather={weather} index={index} />
        )}
      </ErrorBoundary>
    </BottomSheet>
  );
}

function getForecastTitle(now: DateTime, date: DateTime, locale = "en-US", t: TFunction): string {
  const diffDays = Math.floor(date.startOf('day').diff(now.startOf('day'), "days").days);

  const isYesterday = diffDays === -1;
  const isToday = diffDays === 0;
  const isTomorrow = diffDays === 1;

  const formattedDate = date.setLocale(locale).toFormat("cccc, LLLL d");

  if (isYesterday) return `${capitalizeWords(t('yesterday'))} — ${formattedDate}`;
  if (isToday) return `${capitalizeWords(t('today'))} — ${formattedDate}`;
  if (isTomorrow) return `${capitalizeWords(t('tomorrow'))} — ${formattedDate}`;

  return formattedDate;
}