import { useEffect } from "react";

/**
 * Tenta de novo a cada `interval` enquanto houver erro.
 *
 * O SWR pausa a atualização periódica enquanto a chave tem erro e, se a requisição
 * falha com a página escondida ou offline, não agenda nova tentativa: espera a página
 * ganhar foco ou reconectar. Num painel que fica aberto sozinho por dias (tela apagada,
 * Wi-Fi que cai e volta sem ninguém tocar), isso congelaria os dados até alguém mexer.
 */
export default function useRetryOnError(error: unknown, retry: () => unknown, interval: number): void {
  useEffect(() => {
    if (!error) return;

    const id = setInterval(() => { retry(); }, interval);
    return () => clearInterval(id);
  }, [error, retry, interval]);
}
