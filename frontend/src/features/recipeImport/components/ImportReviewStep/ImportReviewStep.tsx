import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, PillButton, SectionHeading, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import type { RecipeImport } from '../../hooks';

import { ImportReviewFields } from './ImportReviewFields';
import { createImportReviewStepStyles } from './ImportReviewStep.styles';

export interface ImportReviewStepProps {
  readonly recipeImport: RecipeImport;
}

const NOTHING = 0;

/**
 * "Rozumiem tomu takto" - the step this feature would be dishonest without.
 *
 * A conversion multiplies its inputs into each other, so a dose read wrongly
 * at the top comes out as a grind setting at the bottom with nothing pointing
 * back at where it went wrong. Showing what was read, before anything is
 * computed from it, is the only moment somebody holding the original can
 * catch that - and the offer is only honest if the app really does show what
 * it understood, hole for hole.
 */
export const ImportReviewStep = ({ recipeImport }: ImportReviewStepProps): JSX.Element => {
  const styles = useThemedStyles(createImportReviewStepStyles);
  const { t } = useTranslation();
  const stepCount = recipeImport.parsed.steps.length;

  return (
    <Card>
      <SectionHeading
        title={t(TRANSLATION_KEYS.importReviewTitle)}
        caption={t(TRANSLATION_KEYS.importReviewIntro)}
        placement="card"
      />
      <ImportReviewFields
        values={recipeImport.form}
        disabled={recipeImport.isConverting}
        onChange={recipeImport.edit}
      />
      {recipeImport.parsed.grinderId === null ? (
        <Text variant="captionSmall" tone="tertiary">
          {t(TRANSLATION_KEYS.importReviewGrinderUnknown)}
        </Text>
      ) : null}
      <Text variant="bodyText" tone="muted">
        {stepCount === NOTHING
          ? t(TRANSLATION_KEYS.importReviewNoSteps)
          : t(TRANSLATION_KEYS.importReviewSteps, { count: stepCount })}
      </Text>
      <View style={styles.actions}>
        <PillButton
          tone="espresso"
          label={t(TRANSLATION_KEYS.actionContinue)}
          fullWidth
          onPress={recipeImport.toTarget}
        />
        <PillButton
          tone="surface"
          label={t(TRANSLATION_KEYS.actionBack)}
          fullWidth
          onPress={recipeImport.back}
        />
      </View>
    </Card>
  );
};
