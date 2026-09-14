import { TFunction } from "i18next";
import { STANDARD_TEMPERATURE_C, STANDARD_PRESSURE_HPA, MOLECULAR_WEIGHTS, PPB_FACTORS, GAS_CONSTANT, POLLUTANT_META } from "./constants";

export interface IPPBPollutant {
  pollutant: "ozone" | "nitrogen_dioxide" | "sulphur_dioxide" | "carbon_monoxide";
  valueUgM3: number;
  unit?: 'ppm' | 'ppb';
}

export const numberFmt = (n: number, digits: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);

interface BuildBreakdownProps {
  pollutants: IPPBPollutant[];
  temperatureC: number;
  pressureHpa: number;
  t: TFunction;
  locale: string;
}

export function buildBreakdown({ pollutants, temperatureC, pressureHpa, t, locale }: BuildBreakdownProps) {
  const usesStandardFallback = temperatureC === undefined && pressureHpa === undefined;

  const effectiveTempC = temperatureC ?? STANDARD_TEMPERATURE_C;
  const temperatureK = effectiveTempC + 273.15;
  const effectivePressureHpa = pressureHpa ?? STANDARD_PRESSURE_HPA;
  const pressurePa = effectivePressureHpa * 100;

  const rows = pollutants.map(({ pollutant, valueUgM3, unit = 'ppb' }) => {
    const mw = MOLECULAR_WEIGHTS[pollutant];
    let ugM3PerPpb;
    let ppb;

    if (usesStandardFallback) {
      ugM3PerPpb = PPB_FACTORS[pollutant];
      ppb = valueUgM3 / ugM3PerPpb;
    } else {
      ugM3PerPpb = ((mw * pressurePa) / (GAS_CONSTANT * temperatureK)) * 0.001;
      ppb = valueUgM3 / ugM3PerPpb;
    }

    const result = unit === "ppm" ? ppb / 1000 : ppb;

    const { label, symbol } = POLLUTANT_META[pollutant];

    const [
      mwFormatted,
      valueUgM3Formatted,
      ugM3PerPpbFormatted,
      resultFormatted,
      pressurePaFormatted,
      GAS_CONSTANTFormatted,
      temperatureKFormatted,
      ppbFormatted,
    ] = [
      [mw, 2],
      [valueUgM3, 1],
      [ugM3PerPpb, 2],
      [result, 1],
      [pressurePa, 0],
      [GAS_CONSTANT, 3],
      [temperatureK, 2],
      [ppb, 3],
    ].map(([value, digits]) => numberFmt(value, digits, locale));

    return {
      key: pollutant,
      name: t(label),
      symbol,
      unit,
      formatted: {
        mw: mwFormatted,
        ugm3: valueUgM3Formatted,
        ugm3ppb: ugM3PerPpbFormatted,
        result: resultFormatted,
        pressure: pressurePaFormatted,
        gas: GAS_CONSTANTFormatted,
        kelvin: temperatureKFormatted,
        ppb: ppbFormatted,
      },
    };
  });

  return { rows, usesStandardFallback, effectiveTempC, effectivePressureHpa };
}