import type { BrewConstraints } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { InfoNote, PillButton, SectionHeading, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useIsOnline } from '../../../../hooks';
import { useThemedStyles } from '../../../../theme';
import { BrewConstraintsSection, PreBrewMethodSection } from '../../../brewing/components';
import type { RecipeImport } from '../../hooks';

import { createImportTargetStepStyles } from './ImportTargetStep.styles';

export interface ImportTargetStepProps {
  readonly recipeImport: RecipeImport;
}

const NOT_FROM_SET = false;

/**
 * What this person is going to brew it in, and what they are missing today.
 *
 * The same two controls the pre-brew screen uses, reused rather than rebuilt:
 * a constraint means the same thing here as it does there, and a second list
 * of checkboxes would be a second place for the two to drift apart. What is
 * ticked changes the shape of the converted recipe - without temperature
 * control it gets a procedure instead of a number, and the arithmetic knows
 * that before a model is asked anything.
 */
export const ImportTargetStep = ({ recipeImport }: ImportTargetStepProps): JSX.Element => {
  const styles = useThemedStyles(createImportTargetStepStyles);
  const { t } = useTranslation();
  const isOnline = useIsOnline();

  return (
    <View style={styles.sections}>
      <SectionHeading
        title={t(TRANSLATION_KEYS.importTargetTitle)}
        caption={t(TRANSLATION_KEYS.importTargetIntro)}
        placement="card"
      />
      <PreBrewMethodSection
        methods={recipeImport.methods}
        method={recipeImport.method}
        onChoose={recipeImport.chooseMethod}
      />
      <BrewConstraintsSection
        constraints={recipeImport.constraints}
        fromSet={NOT_FROM_SET}
        onToggle={(name: keyof BrewConstraints, isSet: boolean): void => {
          recipeImport.toggleConstraint(name, isSet);
        }}
      />
      <View style={styles.actions}>
        {recipeImport.convertFailed ? (
          <Text variant="captionSmall" tone="error">
            {t(TRANSLATION_KEYS.importConvertError)}
          </Text>
        ) : null}
        {recipeImport.method === undefined ? (
          <InfoNote text={t(TRANSLATION_KEYS.importMissingMethod)} />
        ) : null}
        <PillButton
          tone="espresso"
          label={t(
            recipeImport.isConverting
              ? TRANSLATION_KEYS.importConverting
              : TRANSLATION_KEYS.importConvert,
          )}
          fullWidth
          isPending={recipeImport.isConverting}
          disabled={recipeImport.method === undefined || !isOnline}
          onPress={recipeImport.convert}
        />
        <PillButton
          tone="surface"
          label={t(TRANSLATION_KEYS.actionBack)}
          fullWidth
          disabled={recipeImport.isConverting}
          onPress={recipeImport.back}
        />
      </View>
    </View>
  );
};
