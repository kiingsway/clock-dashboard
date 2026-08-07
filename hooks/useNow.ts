import { useEffect, useState } from "react";
import { DateTime } from "luxon";

/**
 * Configuration options for the useNow hook.
 */
interface UseNowOptions {
  /**
   * Locale used by Luxon for formatting dates and times.
   * Example: "en", "pt-BR", "fr"
   */
  locale?: string;

  /**
   * Timezone used to calculate the current time.
   * Example: "America/Toronto", "Asia/Seoul"
   */
  timezone?: string;
}

/**
 * Hook that provides a live-updating DateTime instance.
 *
 * The returned DateTime updates every second and automatically
 * applies the provided timezone and locale.
 */
export default function useNow({ locale, timezone }: UseNowOptions = {}) {
  /**
   * Stores the current DateTime value.
   *
   * It starts with the system time and will be updated
   * every second inside the effect below.
   */
  const [now, setNow] = useState<DateTime>(DateTime.now());

  useEffect(() => {
    /**
     * Updates the current DateTime value.
     *
     * A new DateTime instance is created on every update because
     * Luxon's DateTime objects are immutable.
     */
    const update = () => {
      let dt: DateTime = DateTime.now();

      /**
       * Applies the requested timezone.
       *
       * setZone() does not mutate the original DateTime object;
       * it returns a new instance with the specified timezone.
       */
      if (timezone) {
        dt = dt.setZone(timezone);
      }

      /**
       * Applies the requested locale.
       *
       * setLocale() also returns a new DateTime instance.
       */
      if (locale) {
        dt = dt.setLocale(locale);
      }

      setNow(dt);
    };

    /**
     * Run immediately so the hook does not wait one second
     * before showing the first updated value.
     */
    update();

    /**
     * Keep the time synchronized by updating every second.
     */
    const id = setInterval(update, 1000);

    /**
     * Cleanup the interval when the component using this hook
     * is unmounted or when locale/timezone changes.
     */
    return () => clearInterval(id);
  }, [locale, timezone]);

  return { now };
}