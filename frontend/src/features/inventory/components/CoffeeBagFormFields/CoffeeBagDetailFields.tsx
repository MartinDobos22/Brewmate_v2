import type { ParsedBagFieldName } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import type { CoffeeBagFormValues } from '../../services/coffeeBagForm';

import { BagTextField } from './BagTextField';
import { createCoffeeBagFormFieldsStyles } from './CoffeeBagFormFields.styles';

const NUMERIC = 'numeric';

export interface CoffeeBagDetailFieldsProps {
  readonly values: CoffeeBagFormValues;
  readonly onChange: (patch: Partial<CoffeeBagFormValues>) => void;
  readonly unverified: readonly ParsedBagFieldName[];
  readonly disabled: boolean;
}

/**
 * The rest of the label: where exactly it came from, and how much of it there is.
 *
 * Kept apart from the questions everybody can answer, because a form that opens
 * with twelve boxes is a form nobody finishes. A camera fills these in, and
 * somebody typing a bag by hand can ignore all of them.
 *
 * The weight is here rather than optional-in-name-only: it is what the cupboard
 * counts down from, so a bag with one arrives already knowing how full it is.
 */
export const CoffeeBagDetailFields = ({
  values,
  onChange,
  unverified,
  disabled,
}: CoffeeBagDetailFieldsProps): JSX.Element => {
  const styles = useThemedStyles(createCoffeeBagFormFieldsStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <Text variant="labelMedium" tone="muted">
        {t(TRANSLATION_KEYS.scanDetailTitle)}
      </Text>
      <BagTextField
        field="region"
        label={t(TRANSLATION_KEYS.scanRegionLabel)}
        value={values.region}
        unverified={unverified}
        disabled={disabled}
        onChangeText={(region: string): void => {
          onChange({ region });
        }}
      />
      <BagTextField
        field="farm"
        label={t(TRANSLATION_KEYS.scanFarmLabel)}
        value={values.farm}
        unverified={unverified}
        disabled={disabled}
        onChangeText={(farm: string): void => {
          onChange({ farm });
        }}
      />
      <BagTextField
        field="variety"
        label={t(TRANSLATION_KEYS.scanVarietyLabel)}
        value={values.variety}
        unverified={unverified}
        disabled={disabled}
        onChangeText={(variety: string): void => {
          onChange({ variety });
        }}
      />
      <BagTextField
        field="process"
        label={t(TRANSLATION_KEYS.scanProcessLabel)}
        value={values.process}
        placeholder={t(TRANSLATION_KEYS.scanProcessPlaceholder)}
        unverified={unverified}
        disabled={disabled}
        onChangeText={(process: string): void => {
          onChange({ process });
        }}
      />
      <BagTextField
        field="altitude"
        label={t(TRANSLATION_KEYS.scanAltitudeLabel)}
        value={values.altitude}
        keyboardType={NUMERIC}
        unverified={unverified}
        disabled={disabled}
        onChangeText={(altitude: string): void => {
          onChange({ altitude });
        }}
      />
      <BagTextField
        field="weightGrams"
        label={t(TRANSLATION_KEYS.scanWeightLabel)}
        helpText={t(TRANSLATION_KEYS.scanWeightHelp)}
        value={values.weightGrams}
        keyboardType={NUMERIC}
        unverified={unverified}
        disabled={disabled}
        onChangeText={(weightGrams: string): void => {
          onChange({ weightGrams });
        }}
      />
    </View>
  );
};
