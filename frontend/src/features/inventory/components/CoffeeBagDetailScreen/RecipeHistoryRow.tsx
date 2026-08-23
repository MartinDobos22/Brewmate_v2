import type { Recipe } from '@brewmate/shared';
import type { JSX } from 'react';

import { ListItem } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams, formatRatio } from '../../../../lib/formatters';

const PART_SEPARATOR = ' · ';

export interface RecipeHistoryRowProps {
  readonly recipe: Recipe;
}

/**
 * One recipe, as the two numbers somebody recognises it by.
 *
 * A pinned recipe says so: it is the one this person settled on for these
 * beans in this brewer, and finding it again is the whole reason the history
 * is kept.
 */
export const RecipeHistoryRow = ({ recipe }: RecipeHistoryRowProps): JSX.Element => {
  const { t } = useTranslation();
  const grams = `${formatGrams(recipe.params.doseGrams)} ${t(TRANSLATION_KEYS.unitGrams)}`;

  return (
    <ListItem
      title={[grams, formatRatio(recipe.params.ratio)].join(PART_SEPARATOR)}
      subtitle={t(
        recipe.isPinned ? TRANSLATION_KEYS.bagRecipePinned : TRANSLATION_KEYS.bagRecipeSaved,
      )}
      showDivider
    />
  );
};
