import { ILocation } from '@/types/location.types';

const isString = (x: unknown): x is string => typeof x === 'string';
const isNumber = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);

export default function isValidLocationObject(value: unknown): value is ILocation {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;

  return (
    isNumber(v.geonameId)
    && isString(v.name)
    && isNumber(v.latitude)
    && isNumber(v.longitude)
    && isString(v.timezone)
    && isString(v.countryCode)
  );
}

export function isValidLocationArray(value: unknown): value is ILocation[] {
  return Array.isArray(value) && value.every(isValidLocationObject);
}