import { BREW_METHOD_CATEGORIES, type BrewMethodCategory } from '@brewmate/shared';
import type { JSX } from 'react';

import { Input } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import type { BrewerDetailsErrors, BrewerDetailsValues } from '../../services';

import { DECIMAL_KEYBOARD, type BrewerDetailsChange } from './brewerDetailsFieldChange';

export interface BrewerDetailsFieldsProps {
  readonly values: BrewerDetailsValues;
  readonly errors: BrewerDetailsErrors;
  readonly category: BrewMethodCategory;
  readonly onChange: BrewerDetailsChange;
  readonly disabled: boolean;
}

/**
 * What a brewer is, in numbers. The basket only appears for espresso, because
 * that is the only place a portafilter exists to measure.
 */
export const BrewerDetailsFields = ({
  values,
  errors,
  category,
  onChange,
  disabled,
}: BrewerDetailsFieldsProps): JSX.Element => {
  const { t } = useTranslation();
  const messageFor = (key: BrewerDetailsErrors[keyof BrewerDetailsErrors]): string | undefined =>
    key === null ? undefined : t(key);

  return (
    <>
      <Input
        label={t(TRANSLATION_KEYS.setupBrewerCapacityLabel)}
        helpText={t(TRANSLATION_KEYS.setupBrewerCapacityHelp)}
        value={values.capacityMl}
        onChangeText={(capacityMl: string): void => {
          onChange({ capacityMl });
        }}
        errorText={messageFor(errors.capacityMl)}
        keyboardType={DECIMAL_KEYBOARD}
        disabled={disabled}
      />
      <Input
        label={t(TRANSLATION_KEYS.setupBrewerDoseMinLabel)}
        value={values.doseMinGrams}
        onChangeText={(doseMinGrams: string): void => {
          onChange({ doseMinGrams });
        }}
        errorText={messageFor(errors.doseMinGrams)}
        keyboardType={DECIMAL_KEYBOARD}
        disabled={disabled}
      />
      <Input
        label={t(TRANSLATION_KEYS.setupBrewerDoseMaxLabel)}
        helpText={t(TRANSLATION_KEYS.setupBrewerDoseHelp)}
        value={values.doseMaxGrams}
        onChangeText={(doseMaxGrams: string): void => {
          onChange({ doseMaxGrams });
        }}
        errorText={messageFor(errors.doseMaxGrams)}
        keyboardType={DECIMAL_KEYBOARD}
        disabled={disabled}
      />
      {category === BREW_METHOD_CATEGORIES.espresso ? (
        <Input
          label={t(TRANSLATION_KEYS.setupBrewerBasketLabel)}
          helpText={t(TRANSLATION_KEYS.setupBrewerBasketHelp)}
          value={values.basketSizeMm}
          onChangeText={(basketSizeMm: string): void => {
            onChange({ basketSizeMm });
          }}
          errorText={messageFor(errors.basketSizeMm)}
          keyboardType={DECIMAL_KEYBOARD}
          disabled={disabled}
        />
      ) : null}
    </>
  );
};
