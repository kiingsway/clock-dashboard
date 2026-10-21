import { useState } from "react";

/**
 * Retorna true a partir da primeira vez que `value` for true, e continua true.
 * Útil para só montar (e baixar) um modal carregado sob demanda quando ele é
 * aberto pela primeira vez, mantendo-o montado depois para a animação de fechar.
 */
export default function useHasBeenTrue(value: boolean): boolean {
  const [hasBeenTrue, setHasBeenTrue] = useState(value);

  if (value && !hasBeenTrue) setHasBeenTrue(true);

  return hasBeenTrue || value;
}
