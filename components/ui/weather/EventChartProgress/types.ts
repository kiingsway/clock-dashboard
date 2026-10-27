import { DateTime } from "luxon";
import { IDaily, IHourly } from "@/types/weather.types";

export type CelestialBody = 'sun' | 'moon';

export type SunEventKind = 'sunrise' | 'sunset';
export type MoonEventKind = 'moonrise' | 'moonset';
export type EventKind = SunEventKind | MoonEventKind;

export type SunDaily = Pick<IDaily, 'time' | 'sunrise' | 'sunset'>;
export type SunHourly = Pick<IHourly, 'time' | 'weather_code' | 'is_day'>;

export interface ChartEvent {
  kind: EventKind;
  /**
   * Horário exibido no rótulo; sem ele, exibe "--:--" (evento não acontece no dia,
   * ou, no sol, Open-Meteo ainda não carregou). A posição no gráfico vem de `from`/`to`.
   */
  time?: DateTime;
  /** Ícone específico (ex.: fase da lua). Sem ele, usa o ícone da categoria `kind`. */
  iconName?: string;
  /** Exibe também a data (dd/LL), quando o evento é de outro dia. */
  showDate?: boolean;
}

/**
 * Janela exibida no gráfico.
 * - Período: nascer -> pôr (acima do horizonte) ou pôr -> nascer (abaixo),
 *   com `from`/`to` iguais aos eventos.
 * - Dia inteiro: 00:00 -> 00:00 do dia seguinte, com nascer/pôr do dia nas laterais.
 */
export interface ChartWindow {
  start: ChartEvent;
  end: ChartEvent;
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
