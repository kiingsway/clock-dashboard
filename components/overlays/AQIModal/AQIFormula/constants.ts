export const PPB_FACTORS = {
  ozone: 1.96,
  nitrogen_dioxide: 1.88,
  sulphur_dioxide: 2.62,
  carbon_monoxide: 1.15,
};

export const MOLECULAR_WEIGHTS = {
  ozone: 48,
  nitrogen_dioxide: 46,
  sulphur_dioxide: 64,
  carbon_monoxide: 28.01,
};

export const STANDARD_PRESSURE_HPA = 1013.25;
export const STANDARD_TEMPERATURE_C = 25;
export const GAS_CONSTANT = 8.314462618; // J/(mol·K)

export const POLLUTANT_META = {
  ozone: { symbol: "O₃", label: "aqiTextes.pollutant.ozone" },
  nitrogen_dioxide: { symbol: "NO₂", label: "aqiTextes.pollutant.nitrogen_dioxide" },
  sulphur_dioxide: { symbol: "SO₂", label: "aqiTextes.pollutant.sulphur_dioxide" },
  carbon_monoxide: { symbol: "CO", label: "aqiTextes.pollutant.carbon_monoxide" },
};