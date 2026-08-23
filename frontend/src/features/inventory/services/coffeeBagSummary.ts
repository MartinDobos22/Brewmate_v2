import type { CoffeeBag } from '@brewmate/shared';

const SEPARATOR = ', ';
const EMPTY = '';

/**
 * The line under a bag's name: whatever is known about where it came from.
 *
 * Nothing is invented to fill it. A bag somebody typed the name of and nothing
 * else is a perfectly good entry, and saying "bez ďalších údajov" is more
 * useful than a row of dashes.
 */
export const coffeeBagSummary = (bag: CoffeeBag, fallback: string): string => {
  const parts = [bag.roaster, bag.originCountry, bag.process].filter(
    (part: string | null): part is string => part !== null && part.trim() !== EMPTY,
  );

  return parts.length === 0 ? fallback : parts.join(SEPARATOR);
};
