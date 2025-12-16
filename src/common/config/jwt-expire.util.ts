import type { StringValue } from 'ms';

export function parseExpire(
  value: string | undefined,
  fallback: StringValue | number,
): StringValue | number {
  if (!value) return fallback;

  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  if (/^\d+(ms|s|m|h|d|w|y)$/.test(value)) {
    return value as StringValue;
  }

  throw new Error(`Invalid expire format: ${value}`);
}
