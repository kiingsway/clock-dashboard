import { DateTime } from 'luxon';

type TSolarStyle = {
  noon: {
    progress: number;
    color: string;
  };
  goldenHour: {
    progress: number;
    color: string;
  };
};

const NOON_PROGRESS = {
  MIN: 0.3,
  MAX: 1,
  APEX: '#FFE0A3',
};

const GOLDENHOUR_PROGRESS = {
  MIN: 0.3,
  MAX: 0.6,
  APEX: '#FF7043',
};

const NOON_RANGE_HOURS = 2;
const COLOR_TRANSITION_MINUTES = 10;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const getTransitionProgress = (
  now: DateTime,
  start: DateTime,
  end: DateTime,
  min: number,
  max: number,
) => {
  const fadeIn = clamp(
    now.diff(start, 'minutes').minutes / COLOR_TRANSITION_MINUTES,
  );

  const fadeOut = clamp(
    end.diff(now, 'minutes').minutes / COLOR_TRANSITION_MINUTES,
  );

  const factor = Math.min(fadeIn, fadeOut);

  return min + (max - min) * factor;
};

const getTransitionColor = (
  now: DateTime,
  start: DateTime,
  end: DateTime,
  apex: string,
  initialColor: string,
) => {
  const fadeIn = clamp(
    now.diff(start, 'minutes').minutes / COLOR_TRANSITION_MINUTES,
  );

  const fadeOut = clamp(
    end.diff(now, 'minutes').minutes / COLOR_TRANSITION_MINUTES,
  );

  const factor = Math.min(fadeIn, fadeOut);

  return `color-mix(in srgb, ${apex} ${factor * 100}%, ${initialColor})`;
};

export function getSolarStyle(
  now: DateTime,
  sunrise: DateTime,
  sunset: DateTime,
  solarNoon: DateTime,
  goldenHour: DateTime,
  goldenHourEnd: DateTime,
  initialColor: string = 'var(--wc-accent)',
): TSolarStyle {
  // ─────────────────────────────────────────────
  // NOON — PROGRESS
  // ─────────────────────────────────────────────

  const minutesFromNoon = Math.abs(
    now.diff(solarNoon, 'minutes').minutes,
  );

  const noonFactor = clamp(
    1 - minutesFromNoon / (NOON_RANGE_HOURS * 60),
  );

  const noonProgress =
    NOON_PROGRESS.MIN +
    (NOON_PROGRESS.MAX - NOON_PROGRESS.MIN) * noonFactor;


  // ─────────────────────────────────────────────
  // NOON — COLOR
  // ─────────────────────────────────────────────

  let noonColor = initialColor;

  if (now >= sunrise && now <= sunset) {
    noonColor = getTransitionColor(
      now,
      sunrise,
      sunset,
      NOON_PROGRESS.APEX,
      initialColor,
    );
  }


  // ─────────────────────────────────────────────
  // GOLDEN HOUR — PROGRESS + COLOR
  // ─────────────────────────────────────────────

  let goldenHourProgress = GOLDENHOUR_PROGRESS.MIN;
  let goldenHourColor = initialColor;

  if (now >= sunrise && now <= goldenHourEnd) {
    goldenHourProgress = getTransitionProgress(
      now,
      sunrise,
      goldenHourEnd,
      GOLDENHOUR_PROGRESS.MIN,
      GOLDENHOUR_PROGRESS.MAX,
    );

    goldenHourColor = getTransitionColor(
      now,
      sunrise,
      goldenHourEnd,
      GOLDENHOUR_PROGRESS.APEX,
      initialColor,
    );
  }

  else if (now >= goldenHour && now <= sunset) {
    goldenHourProgress = getTransitionProgress(
      now,
      goldenHour,
      sunset,
      GOLDENHOUR_PROGRESS.MIN,
      GOLDENHOUR_PROGRESS.MAX,
    );

    goldenHourColor = getTransitionColor(
      now,
      goldenHour,
      sunset,
      GOLDENHOUR_PROGRESS.APEX,
      initialColor,
    );
  }

  return {
    noon: {
      progress: noonProgress,
      color: noonColor,
    },
    goldenHour: {
      progress: goldenHourProgress,
      color: goldenHourColor,
    },
  };
}