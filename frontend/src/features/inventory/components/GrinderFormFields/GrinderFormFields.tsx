import type { JSX } from 'react';
import { View } from 'react-native';

import type { GrinderTypicalUse, GrinderUnitType } from '@brewmate/shared';

import { Input, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import {
  GRINDER_UNIT_LABEL_KEYS,
  GRINDER_UNIT_TYPE_ORDER,
  GRINDER_USE_LABEL_KEYS,
  GRINDER_USE_FILTER_ORDER,
} from '../../constants';
import type { GrinderFormErrors, GrinderFormValues } from '../../services';
import { GrinderOptionChips } from '../GrinderOptionChips';

import { createGrinderFormFieldsStyles } from './GrinderFormFields.styles';
import { NUMERIC_KEYBOARD, type GrinderFieldChange } from './grinderFieldChange';

export interface GrinderFormFieldsProps {
  readonly values: GrinderFormValues;
  readonly errors: GrinderFormErrors;
  readonly onChange: GrinderFieldChange;
  readonly disabled: boolean;
}

/**
 * Everything the user types about their grinder.
 *
 * A micron curve is deliberately not asked for: nobody has one to hand, and an
 * entry without one still works - the app just says its conversions are
 * rougher, which the help text promises here.
 */
export const GrinderFormFields = ({
  values,
  errors,
  onChange,
  disabled,
}: GrinderFormFieldsProps): JSX.Element => {
  const styles = useThemedStyles(createGrinderFormFieldsStyles);
  const { t } = useTranslation();
  const messageFor = (key: GrinderFormErrors[keyof GrinderFormErrors]): string | undefined =>
    key === null ? undefined : t(key);

  return (
    <View style={styles.fields}>
      <Input
        label={t(TRANSLATION_KEYS.grinderAddBrandLabel)}
        placeholder={t(TRANSLATION_KEYS.grinderAddBrandPlaceholder)}
        value={values.brand}
        onChangeText={(brand: string): void => {
          onChange({ brand });
        }}
        errorText={messageFor(errors.brand)}
        disabled={disabled}
      />
      <Input
        label={t(TRANSLATION_KEYS.grinderAddModelLabel)}
        placeholder={t(TRANSLATION_KEYS.grinderAddModelPlaceholder)}
        value={values.model}
        onChangeText={(model: string): void => {
          onChange({ model });
        }}
        errorText={messageFor(errors.model)}
        disabled={disabled}
      />
      <GrinderOptionChips
        label={t(TRANSLATION_KEYS.grinderAddUnitTypeLabel)}
        options={GRINDER_UNIT_TYPE_ORDER}
        labelKeys={GRINDER_UNIT_LABEL_KEYS}
        selected={values.unitType}
        disabled={disabled}
        onSelect={(unitType: GrinderUnitType): void => {
          onChange({ unitType });
        }}
      />
      <Input
        label={t(TRANSLATION_KEYS.grinderAddMinLabel)}
        value={values.minSetting}
        onChangeText={(minSetting: string): void => {
          onChange({ minSetting });
        }}
        errorText={messageFor(errors.minSetting)}
        keyboardType={NUMERIC_KEYBOARD}
        disabled={disabled}
      />
      <Input
        label={t(TRANSLATION_KEYS.grinderAddMaxLabel)}
        value={values.maxSetting}
        onChangeText={(maxSetting: string): void => {
          onChange({ maxSetting });
        }}
        errorText={messageFor(errors.maxSetting)}
        keyboardType={NUMERIC_KEYBOARD}
        disabled={disabled}
      />
      <Input
        label={t(TRANSLATION_KEYS.grinderAddStepLabel)}
        value={values.step}
        onChangeText={(step: string): void => {
          onChange({ step });
        }}
        errorText={messageFor(errors.step)}
        helpText={t(TRANSLATION_KEYS.grinderAddStepHelp)}
        keyboardType={NUMERIC_KEYBOARD}
        disabled={disabled}
      />
      <GrinderOptionChips
        label={t(TRANSLATION_KEYS.grinderAddUseLabel)}
        options={GRINDER_USE_FILTER_ORDER}
        labelKeys={GRINDER_USE_LABEL_KEYS}
        selected={values.typicalUse}
        disabled={disabled}
        onSelect={(typicalUse: GrinderTypicalUse): void => {
          onChange({ typicalUse });
        }}
      />
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.grinderAddCalibrationHelp)}
      </Text>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.grinderAddVisibilityHelp)}
      </Text>
    </View>
  );
};
