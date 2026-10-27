import { getTemperatureColor, getWeatherAreaColor } from "./chartColors";
import { IWeatherDataChart } from "./types";

interface Props {
  data: IWeatherDataChart[];
  /**
   * Quantos itens de `data` formam a área desenhada; os demais são extras depois do fim
   * (ficam além de 100% para o degradê não "esticar" na ponta).
   */
  mainLength: number;
}

/** O primeiro item principal fica em 0% e o último em 100% */
const getOffset = (mainLength: number, index: number) =>
  mainLength <= 1 ? '0%' : `${(index / (mainLength - 1)) * 100}%`;

/** Área: cor da temperatura (ou da chuva, em horas de chuva), escurecida à noite */
const getAreaColor = (item: IWeatherDataChart) =>
  getWeatherAreaColor(item.temp, item.category, item.rain, item.isDay);

/** Linha da sensação térmica: sempre pela temperatura, escurecida à noite */
const getFeelsLikeColor = (item: IWeatherDataChart) =>
  getTemperatureColor(item.feelsLike, item.isDay);

export default function TempLinearGradient({ data, mainLength }: Props) {

  return (
    <>
      <linearGradient
        id="temperatureGradient"
        x1="0"
        y1="0"
        x2="100%"
        y2="0"
      >
        {data.map((item, index) => (
          <stop
            key={index}
            offset={getOffset(mainLength, index)}
            stopColor={getAreaColor(item)}
          />
        ))}
      </linearGradient>

      <linearGradient
        id="feelsLikeGradient"
        x1="0"
        y1="0"
        x2="100%"
        y2="0"
      >
        {data.map((item, index) => (
          <stop
            key={index}
            offset={getOffset(mainLength, index)}
            stopColor={getFeelsLikeColor(item)}
          />
        ))}
      </linearGradient>
    </>
  );
}
