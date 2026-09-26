import type { BrewParams } from '@brewmate/shared';

import type { Figure } from '../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../i18n';
import { formatGrams, formatRatio } from '../../lib/formatters';

/**
 * The three numbers a recipe is made of, ready for a `FigureRow`.
 *
 * `FigureRow` unified how they are drawn; this unifies what is put into it.
 * Four screens - the home block, the conversation's header, every version on
 * the timeline and every saved recipe on a coffee's own screen - were each
 * assembling the same array out of the same three fields and the same three
 * translation keys, which is four places for the ratio to stop being marked
 * as derived.
 *
 * The ratio is `derived` because it is arithmetic over the two weights rather
 * than a third thing somebody measures, and that is a fact about a recipe
 * rather than a decision a screen gets to make.
 *
 * Null in, null out, because a screen that has no recipe yet still has to
 * call this: a hook cannot be asked for conditionally, and the alternative is
 * every caller inventing three empty figures to hold its place.
 */
export const useRecipeFigures = (params: BrewParams | null): readonly Figure[] | null => {
  const { t } = useTranslation();

  if (params === null) {
    return null;
  }

  return [
    { value: formatGrams(params.doseGrams), label: t(TRANSLATION_KEYS.figureDose) },
    { value: formatGrams(params.waterGrams), label: t(TRANSLATION_KEYS.figureWater) },
    { value: formatRatio(params.ratio), label: t(TRANSLATION_KEYS.figureRatio), derived: true },
  ];
};
