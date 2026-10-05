/**
 * Validates that all values in the provided object are numbers.
 *
 * @example
 * assertNumbers({ temperature: 22, humidity: 65 }); // Passes
 * assertNumbers({ temperature: "22", humidity: 65 });
 * // Throws: Invalid values: temperature="22" (string)
 */
export const assertNumbers = (values: Record<string, unknown>) => {
  const errors = Object.entries(values)
    .filter(([, value]) => typeof value !== 'number')
    .map(([key, value]) => `${key}="${String(value)}" (${typeof value})`);

  if (errors.length) {
    throw new Error(`Invalid values: ${errors.join(', ')}`);
  }
};