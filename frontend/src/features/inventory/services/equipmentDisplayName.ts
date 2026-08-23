import type { Equipment } from '@brewmate/shared';

const NAME_SEPARATOR = ' ';

/**
 * What a piece of gear is called in a list.
 *
 * Brand and model are data somebody typed or picked out of the catalogue, so
 * they are printed as they were stored. A piece with neither is not an error -
 * the caller supplies the fallback wording, because only it knows the locale.
 */
export const equipmentDisplayName = (equipment: Equipment, fallback: string): string => {
  const name = [equipment.brand, equipment.model]
    .filter((part: string | null): part is string => part !== null && part !== '')
    .join(NAME_SEPARATOR);

  return name === '' ? fallback : name;
};
