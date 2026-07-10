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
    // const intervalId = window.setInterval(() => {
    //   setIndex(prev => {
    //     const next = prev === 0 ? 1 : 0;
    //     setNow(dates[next]);
    //     console.log('next', dates[next].getDate(), dates[next].getMonth(), dates[next].getFullYear());
    //     return next;
    //   });
    // }, 3000);


    return () => window.clearInterval(intervalId);
  }, []);

  // return new Date(2024, 1, 29);
  return now;
}
