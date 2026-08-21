import { formatDecimal } from './formatDecimal';

/** A water temperature, without its unit. */
export const formatTemperature = (celsius: number): string => formatDecimal(celsius);
