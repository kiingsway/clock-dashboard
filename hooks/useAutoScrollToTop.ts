import { useEffect } from "react";

const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "wheel"] as const;

export function useAutoScrollToTop(delay = 30000) {
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeout);

      if (window.scrollY === 0) return;

      timeout = setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, delay);
    };


    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    resetTimer();

    return () => {
      clearTimeout(timeout);

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [delay]);
}