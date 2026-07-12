import { useEffect, useState } from "react";

// Maior em PTBR e maior em EN.
const dates = [new Date(2024, 1, 29), new Date(2024, 8, 29)]

/**
 * Returns the current Date, updated every second. Centralizing the
 * ticking here means only one interval exists regardless of how many
 * components need "now" (the clock display, the ambient sky background).
 */
export function useClock(): Date {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return now;
}
