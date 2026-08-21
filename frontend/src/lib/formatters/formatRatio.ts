import { formatDecimal } from './formatDecimal';

const COFFEE_PART = 1;
const RATIO_SEPARATOR = ':';

/** A coffee-to-water ratio as `1:16`. */
export const formatRatio = (waterParts: number): string =>
  `${String(COFFEE_PART)}${RATIO_SEPARATOR}${formatDecimal(waterParts)}`;
