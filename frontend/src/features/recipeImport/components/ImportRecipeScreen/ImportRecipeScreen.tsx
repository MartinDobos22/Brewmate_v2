import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useRecipeImport } from '../../hooks';

import { ImportStageContent } from './ImportStageContent';

/**
 * Somebody else's recipe, on this person's equipment.
 *
 * Four stages, and the order is the order a person can answer in: what the
 * recipe says, whether that is really what it says, what they will brew it in,
 * and then the numbers. Nothing is computed until the middle question has been
 * answered, because everything after it is arithmetic over that answer.
 */
export const ImportRecipeScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const recipeImport = useRecipeImport();

  return (
    <Screen scrollable>
      <Text variant="headlineSmall">{t(TRANSLATION_KEYS.importRecipeTitle)}</Text>
      <Text variant="bodyMedium" tone="muted">
        {t(TRANSLATION_KEYS.importRecipeIntro)}
      </Text>
      <ImportStageContent recipeImport={recipeImport} />
    </Screen>
  );
};
