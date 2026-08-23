import type { ParsedBagFieldName } from '@brewmate/shared';
import type { JSX } from 'react';
import type { KeyboardTypeOptions } from 'react-native';

import { Input } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';

export interface BagTextFieldProps {
  /** Which field of a label this box holds, so an uncertain reading can mark it. */
  readonly field: ParsedBagFieldName;
  readonly label: string;
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  readonly unverified: readonly ParsedBagFieldName[];
  readonly disabled: boolean;
  readonly placeholder?: string;
  readonly helpText?: string;
  readonly keyboardType?: KeyboardTypeOptions;
}

/**
 * One box of a coffee label, and whether the camera was sure of it.
 *
 * The marking is looked up here rather than passed in as a flag, so adding a
 * field to the form is one line and cannot silently arrive without it. A field
 * the app read badly and saved quietly is a coffee that misreports itself in
 * every recipe afterwards.
 */
export const BagTextField = ({
  field,
  label,
  value,
  onChangeText,
  unverified,
  disabled,
  placeholder,
  helpText,
  keyboardType,
}: BagTextFieldProps): JSX.Element => {
  const { t } = useTranslation();
  const isUnverified = unverified.includes(field);

  return (
    <Input
      label={label}
      value={value}
      placeholder={placeholder}
      helpText={isUnverified ? t(TRANSLATION_KEYS.scanFieldUncertain) : helpText}
      unverified={isUnverified}
      disabled={disabled}
      keyboardType={keyboardType}
      onChangeText={onChangeText}
    />
  );
};
