import { useEffect, useState } from "react";
import useBoolean from "./useBoolean";

const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "wheel"] as const;

interface IUseFocusMode {
  focus: boolean;
  toggleFocus: () => void;
}

interface Props {
  onFocus: number
  offFocus: number;
}

export function useFocusMode({ onFocus, offFocus }: Props): IUseFocusMode {
  const [focus, { toggle: toggleFocus }] = useBoolean()

  const delay = focus ? onFocus : offFocus;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeout);

      if (window.scrollY === 0) return;

      timeout = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
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

  return { focus, toggleFocus };
}