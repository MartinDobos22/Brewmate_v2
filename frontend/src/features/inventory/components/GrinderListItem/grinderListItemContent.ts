import type { Grinder } from '@brewmate/shared';

import type { TextTone } from '../../../../components/ui';
import { GRINDER_PRECISIONS, type GrinderPrecision } from '../../services';

const NAME_SEPARATOR = ' ';

/** The catalogue is searched as "brand model", so it is read that way too. */
export const grinderDisplayName = (grinder: Grinder): string =>
  `${grinder.brand}${NAME_SEPARATOR}${grinder.model}`;

/**
 * An estimate is warned about, a missing curve is merely stated, and a
 * measured one is quiet - the interface should not congratulate itself.
 */
export const precisionTone = (precision: GrinderPrecision): TextTone => {
  if (precision === GRINDER_PRECISIONS.estimated) {
    return 'tertiary';
  }

  return precision === GRINDER_PRECISIONS.missing ? 'muted' : 'secondary';
};
