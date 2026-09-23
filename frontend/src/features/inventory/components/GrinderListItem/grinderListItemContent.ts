import type { Grinder } from '@brewmate/shared';

const NAME_SEPARATOR = ' ';

/** The catalogue is searched as "brand model", so it is read that way too. */
export const grinderDisplayName = (grinder: Grinder): string =>
  `${grinder.brand}${NAME_SEPARATOR}${grinder.model}`;
