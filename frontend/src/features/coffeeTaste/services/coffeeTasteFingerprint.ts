import type { CoffeeLabelFacts, ParsedBagData } from '@brewmate/shared';

import { fingerprint } from '../../../lib/fingerprint';

const EMPTY = '';

/**
 * What makes two questions about a coffee the same question.
 *
 * The key has to cover everything the *answer* depends on, and the answer is
 * more than the local fold. The tables read six flavour fields, but the server
 * hands the whole label to a model and comes back with a summary, a set of
 * flavour notes and a reading that all move with the roaster, the name, the
 * region and the farm. Hashing only the six meant two coffees that happen to
 * share them - two Ethiopian washed light roasts with no printed notes, one
 * from Yirgacheffe and one from Guji - collided on one entry, and the second
 * one was shown the first one's sentences. With `staleTime` at infinity and
 * the cache persisted to disk, that swap outlived the session it happened in.
 *
 * A bag's id is still deliberately absent: the same coffee asked about from a
 * shelf and from the cupboard has to land on one entry, or the two screens
 * would show one person two different answers about one bag.
 *
 * The roast date and the net weight are absent too, and for a different
 * reason. Neither says anything about how the coffee tastes - freshness is
 * argued elsewhere, on the verdict - and the roast date is rendered to the
 * model as "N days ago", so folding it in here would throw the entry away
 * every midnight to buy back a reading the server would answer from its own
 * cache regardless.
 *
 * Correcting a field on the form changes the fingerprint, which is what makes
 * the estimate follow the correction instead of going stale behind it.
 */
export const coffeeTasteFingerprint = (coffee: ParsedBagData & CoffeeLabelFacts): string =>
  fingerprint({
    roaster: coffee.roaster ?? EMPTY,
    name: coffee.name ?? EMPTY,
    originCountry: coffee.originCountry ?? EMPTY,
    region: coffee.region ?? EMPTY,
    farm: coffee.farm ?? EMPTY,
    variety: coffee.variety ?? EMPTY,
    process: coffee.process ?? EMPTY,
    roastLevel: coffee.roastLevel ?? EMPTY,
    altitude: String(coffee.altitude ?? EMPTY),
    tastingNotes: (coffee.tastingNotes ?? []).join(),
  });
