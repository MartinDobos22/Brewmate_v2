import type { CoffeeLabelFacts } from '@brewmate/shared';

import { fingerprint } from '../../../lib/fingerprint';

/**
 * What makes two questions about a coffee the same question.
 *
 * Every field the estimate is actually built from, and nothing else. A bag's
 * id is deliberately not part of it: the same coffee asked about from a shelf
 * and from the cupboard has to land on one cache entry, or the two screens
 * would show one person two different answers about one bag.
 *
 * Correcting a field on the form changes the fingerprint, which is what makes
 * the estimate follow the correction instead of going stale behind it.
 */
export const coffeeTasteFingerprint = (coffee: CoffeeLabelFacts): string =>
  fingerprint({
    originCountry: coffee.originCountry ?? '',
    variety: coffee.variety ?? '',
    process: coffee.process ?? '',
    roastLevel: coffee.roastLevel ?? '',
    altitude: String(coffee.altitude ?? ''),
    tastingNotes: (coffee.tastingNotes ?? []).join(),
  });
