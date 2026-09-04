import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import getSeasonDynamicColor from './getSeasonDynamicColor';

export interface ISeasonInfo {
  title: string;
  desc: string;
  daysProgressText: string;
  color: string;
}

type SeasonKey = 'spring' | 'summer' | 'autumn' | 'winter';

interface IEquinoxSolstice {
  key: SeasonKey;
  dateTime: DateTime;
}

/**
 * Retorna a estação astronômica atual, dias desde o início e dias para a próxima mudança.
 * 
 * @param latitude Latitude da localização (-90 a 90)
 * @param date Instância do Luxon DateTime (sem valor default)
 */
export function getAstronomicalSeasonInfo(latitude: number, date: DateTime, t: TFunction): ISeasonInfo {
  const year = date.year;
  const isNorth = latitude >= 0;

  // Datas aproximadas dos solstícios e equinócios para o ano fornecido no Hemisfério Norte
  // Março: Equinócio de Primavera (Norte) / Outono (Sul)
  // Junho: Solstício de Verão (Norte) / Inverno (Sul)
  // Setembro: Equinócio de Outono (Norte) / Primavera (Sul)
  // Dezembro: Solstício de Inverno (Norte) / Verão (Sul)
  const northEvents: IEquinoxSolstice[] = [
    { key: 'winter', dateTime: DateTime.fromObject({ year: year - 1, month: 12, day: 21 }, { zone: date.zone }) },
    { key: 'spring', dateTime: DateTime.fromObject({ year, month: 3, day: 20 }, { zone: date.zone }) },
    { key: 'summer', dateTime: DateTime.fromObject({ year, month: 6, day: 21 }, { zone: date.zone }) },
    { key: 'autumn', dateTime: DateTime.fromObject({ year, month: 9, day: 22 }, { zone: date.zone }) },
    { key: 'winter', dateTime: DateTime.fromObject({ year, month: 12, day: 21 }, { zone: date.zone }) },
    { key: 'spring', dateTime: DateTime.fromObject({ year: year + 1, month: 3, day: 20 }, { zone: date.zone }) },
  ];

  // Inverte as estações se for no Hemisfério Sul
  const southOpposites: Record<SeasonKey, SeasonKey> = {
    spring: 'autumn',
    summer: 'winter',
    autumn: 'spring',
    winter: 'summer',
  };

  const events = northEvents.map(event => ({
    key: isNorth ? event.key : southOpposites[event.key],
    dateTime: event.dateTime,
  }));

  // Encontra qual período compreende a data informada
  let currentIndex = 0;
  for (let i = 0; i < events.length - 1; i++) {
    if (date >= events[i].dateTime && date < events[i + 1].dateTime) {
      currentIndex = i;
      break;
    }
  }

  const currentEvent = events[currentIndex];
  const nextEvent = events[currentIndex + 1];

  // Cálculo dos dias decorridos e restantes usando o Luxon
  const daysSinceStart = Math.floor(date.diff(currentEvent.dateTime, 'days').days);
  const daysToNext = Math.ceil(nextEvent.dateTime.diff(date, 'days').days);

  // Duração total em dias da estação atual (do início até a transição para a próxima)
  const totalSeasonDays = Math.round(nextEvent.dateTime.diff(currentEvent.dateTime, 'days').days);

  const title = t(`seasonTextes.${currentEvent.key}`);
  const nextSeasonTitle = t(`seasonTextes.${nextEvent.key}`);

  const desc = t('seasonTextes.description', {
    currentSeason: title,
    daysSinceStart,
    daysToNext,
    nextSeason: nextSeasonTitle,
  });

  const daysProgressText = t('seasonTextes.daysProgress', {
    current: daysSinceStart,
    total: totalSeasonDays,
  });

  const color = getSeasonDynamicColor(currentEvent.key, daysSinceStart, totalSeasonDays);

  return {
    title,
    desc,
    daysProgressText,
    color,
  };
}