import type { JSX } from 'react';
import { View } from 'react-native';

import { Input } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import type { SourceRecipeFormValues } from '../../services';

import { createImportReviewStepStyles } from './ImportReviewStep.styles';

/** Decimal amounts, on a keyboard that opens with the digits showing. */
const NUMERIC = 'numeric';

export interface ImportReviewFieldsProps {
  readonly values: SourceRecipeFormValues;
  readonly disabled: boolean;
  readonly onChange: (patch: Partial<SourceRecipeFormValues>) => void;
}

/**
 * The recipe as it was read, in boxes somebody can correct.
 *
 * An empty box means the source did not say, and it has to stay empty through
 * the correction as well as through the reading. Prefilling one with a typical
 * value would be the app inventing a number in the one place a person is
 * looking at the original and could have caught it.
 */
export const ImportReviewFields = ({
  values,
  disabled,
  onChange,
}: ImportReviewFieldsProps): JSX.Element => {
  const styles = useThemedStyles(createImportReviewStepStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.fields}>
      <Input
        label={t(TRANSLATION_KEYS.importReviewLabel)}
        value={values.label}
        disabled={disabled}
        onChangeText={(label: string): void => {
          onChange({ label });
        }}
      />
      <Input
        label={t(TRANSLATION_KEYS.importReviewDose)}
        value={values.doseGrams}
        keyboardType={NUMERIC}
        disabled={disabled}
        onChangeText={(doseGrams: string): void => {
          onChange({ doseGrams });
        }}
      />
      <Input
        label={t(TRANSLATION_KEYS.importReviewWater)}
        value={values.waterGrams}
        keyboardType={NUMERIC}
        disabled={disabled}
        onChangeText={(waterGrams: string): void => {
          onChange({ waterGrams });
        }}
      />
      <Input
        label={t(TRANSLATION_KEYS.importReviewGrindSetting)}
        value={values.grindSetting}
        keyboardType={NUMERIC}
        disabled={disabled}
        onChangeText={(grindSetting: string): void => {
          onChange({ grindSetting });
        }}
      />
      <Input
        label={t(TRANSLATION_KEYS.importReviewGrindLabel)}
        value={values.grindLabel}
        disabled={disabled}
        onChangeText={(grindLabel: string): void => {
          onChange({ grindLabel });
        }}
      />
      <Input
        label={t(TRANSLATION_KEYS.importReviewTemp)}
        value={values.waterTempC}
        keyboardType={NUMERIC}
        disabled={disabled}
        onChangeText={(waterTempC: string): void => {
          onChange({ waterTempC });
        }}
      />
      <Input
        label={t(TRANSLATION_KEYS.importReviewTime)}
        value={values.totalTimeSeconds}
        keyboardType={NUMERIC}
        disabled={disabled}
        onChangeText={(totalTimeSeconds: string): void => {
          onChange({ totalTimeSeconds });
        }}
      />
    </View>
  );
};
