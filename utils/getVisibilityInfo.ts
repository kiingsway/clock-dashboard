import { IHourly } from "@/types/weather.types";
import { getCurrentHourlyValue } from "./getValueFromDate";

export default function getVisibilityInfo(hourly: IHourly, timezone: string) {

  const visibility = getCurrentHourlyValue(hourly.time, hourly.visibility, timezone);

  if (!visibility) return undefined

  const desc = (() => {
    if (visibility >= 10000) return "Visibilidade excelente. Sem impactos esperados.";
    if (visibility >= 5000) return "Boa visibilidade. Pequenas reduções no horizonte.";
    if (visibility >= 2000) return "Visibilidade moderada. Atenção em estradas e áreas abertas.";
    if (visibility >= 1000) return "Visibilidade baixa. Dirija com cuidado e reduza a velocidade.";
    if (visibility >= 500) return "Névoa intensa. Possíveis atrasos e baixa visibilidade nas pistas.";
    return "Visibilidade crítica. Evite deslocamentos e tenha extremo cuidado.";
  })();

  return { value: visibility, desc }

}