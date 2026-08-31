import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { StepProgress, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useRecipeImport } from '../../hooks';
import { resolveImportSteps } from '../../services';

import { ImportStageContent } from './ImportStageContent';

/**
 * Somebody else's recipe, on this person's equipment.
 *
 * Four stages, and the order is the order a person can answer in: what the
 * recipe says, whether that is really what it says, what they will brew it in,
 * and then the numbers. Nothing is computed until the middle question has been
 * answered, because everything after it is arithmetic over that answer.
 *
 * The step strip counts three of them. The result is the flow's answer rather
 * than a step in it, and numbering it would tell somebody they were one step
 * from the end at the moment they already had what they came for - the same
 * rule the scanner and the quick brew follow.
 */
export const ImportRecipeScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const recipeImport = useRecipeImport();
  const steps = resolveImportSteps(recipeImport.stage);

  return (
    <Screen scrollable>
      <Text variant="headlineSmall">{t(TRANSLATION_KEYS.importRecipeTitle)}</Text>
      <Text variant="bodyMedium" tone="muted">
        {t(TRANSLATION_KEYS.importRecipeIntro)}
      </Text>
      <StepProgress current={steps.current} total={steps.total} />
      <ImportStageContent recipeImport={recipeImport} />
    </Screen>
  );
};
