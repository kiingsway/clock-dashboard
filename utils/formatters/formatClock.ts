import { DateTime } from 'luxon';

interface FormatClockOptions {
  date: DateTime;
  language: string;
  hour12?: boolean;
  short?: boolean;
  localizedPeriod?: boolean;
}

export function formatClock({
  date,
  language,
  hour12 = false,
  short = false,
  localizedPeriod = true,
}: FormatClockOptions): string {
  if (short) return getShortHour(date, language, hour12, localizedPeriod);

  const locale = localizedPeriod ? language : 'en-US';

  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12,
    timeZone: date.zoneName ?? undefined,
  }).format(date.toJSDate());
}

function getShortHour(
  date: DateTime,
  language: string,
  hour12: boolean,
  localizedPeriod: boolean,
): string {
  const hour24 = date.hour;
  const lang = language.split('-')[0];

  // 24-hour short format
  if (!hour12) {
    switch (lang) {
      case 'pt':
        return `${hour24}h`;

      case 'fr':
        return `${hour24} h`;

      case 'es':
        return `${hour24}:00`;

      case 'ko':
        return `${hour24}시`;

      case 'en':
      default:
        return `${hour24}:00`;
    }
  }

  // 12-hour short format
  const hour12Value = hour24 % 12 || 12;

  if (!localizedPeriod) {
    const period = hour24 < 12 ? 'AM' : 'PM';

    return `${hour12Value} ${period}`;
  }

  switch (lang) {
    case 'ko': {
      const period = hour24 < 12 ? '오전' : '오후';
      return `${period} ${hour12Value}시`;
    }

    case 'es': {
      const period = hour24 < 12 ? 'a. m.' : 'p. m.';
      return `${hour12Value} ${period}`;
    }

    case 'fr': {
      const period = hour24 < 12 ? 'AM' : 'PM';
      return `${hour12Value} h ${period}`;
    }

    case 'pt':
      return `${hour12Value}h`;

    case 'en':
    default: {
      const period = hour24 < 12 ? 'AM' : 'PM';
      return `${hour12Value} ${period}`;
    }
  }
}