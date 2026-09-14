type Pollutant =
  | 'ozone'
  | 'nitrogen_dioxide'
  | 'sulphur_dioxide'
  | 'carbon_monoxide';

type ConcentrationUnit = 'ppb' | 'ppm';

const PPB_FACTORS: Record<Pollutant, number> = {
  ozone: 1.96,
  nitrogen_dioxide: 1.88,
  sulphur_dioxide: 2.62,
  carbon_monoxide: 1.15,
};

const MOLECULAR_WEIGHTS: Record<Pollutant, number> = {
  ozone: 48,
  nitrogen_dioxide: 46,
  sulphur_dioxide: 64,
  carbon_monoxide: 28.01,
};

const STANDARD_PRESSURE_HPA = 1013.25;
const STANDARD_TEMPERATURE_C = 25;
const GAS_CONSTANT = 8.314462618; // J/(mol·K)

export function convertUgM3(
  value: number,
  pollutant: Pollutant,
  unit: ConcentrationUnit = 'ppb',
  temperatureC?: number,
  pressureHpa?: number,
): number {
  let ppb: number;

  if (temperatureC === undefined && pressureHpa === undefined) {
    // Fallback: fixed conversion factor
    ppb = value / PPB_FACTORS[pollutant];
  } else {
    // Use supplied values and standard values for missing ones
    const temperatureK =
      (temperatureC ?? STANDARD_TEMPERATURE_C) + 273.15;

    const pressurePa =
      (pressureHpa ?? STANDARD_PRESSURE_HPA) * 100;

    const molecularWeight = MOLECULAR_WEIGHTS[pollutant];

    // µg/m³ per ppb
    const ugM3PerPpb =
      (molecularWeight * pressurePa) /
      (GAS_CONSTANT * temperatureK) *
      0.001;

    ppb = value / ugM3PerPpb;
  }

  return unit === 'ppm' ? ppb / 1000 : ppb;
}