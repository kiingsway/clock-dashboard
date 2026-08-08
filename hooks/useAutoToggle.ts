import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAutoToggleOptions {
  initialValue?: boolean;
  intervalMs: number;       // Passar <= 0 desativa a alternância automática
  pauseDurationMs?: number; // Tempo de pausa após clique manual
}

export function useAutoToggle({ initialValue = false, intervalMs, pauseDurationMs = 0 }: UseAutoToggleOptions) {
  const [value, setValue] = useState<boolean>(initialValue);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Intervalo automático (só roda se intervalMs > 0 e não estiver pausado)
  useEffect(() => {
    if (isPaused || intervalMs <= 0) return;

    const interval = setInterval(() => {
      setValue((prev) => !prev);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, isPaused]);

  // Alteração manual
  const manualToggle = useCallback(
    (newValue?: boolean) => {
      setValue((prev) => (newValue !== undefined ? newValue : !prev));

      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);

      if (pauseDurationMs > 0 && intervalMs > 0) {
        setIsPaused(true);
        pauseTimerRef.current = setTimeout(() => {
          setIsPaused(false);
        }, pauseDurationMs);
      }
    },
    [pauseDurationMs, intervalMs]
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  return [value, manualToggle] as const;
}