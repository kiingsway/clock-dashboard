import { DateTime } from "luxon";
import { IDaily, IHourly } from "@/types/weather.types";

export type SunEventKind = 'sunrise' | 'sunset';

export type SunDaily = Pick<IDaily, 'time' | 'sunrise' | 'sunset'>;
export type SunHourly = Pick<IHourly, 'time' | 'weather_code' | 'is_day'>;

export interface SunEvent {
  kind: SunEventKind;
  time: DateTime;
}

/**
 * Janela exibida no gráfico.
 * - Dia/noite: sunrise -> sunset ou sunset -> sunrise (`from`/`to` iguais aos eventos).
 * - Dia inteiro: 00:00 -> 00:00 do dia seguinte, com sunrise/sunset do dia nas laterais.
 */
export interface SunWindowRange {
  start: SunEvent;
  end: SunEvent;
  from: DateTime;
  to: DateTime;
}

export interface SunPathPoint {
  time: number; // epoch ms
  elevation: number; // graus acima (+) ou abaixo (-) do horizonte
}

export interface GradientStop {
  offset: number; // 0..1
  color: string;
}
