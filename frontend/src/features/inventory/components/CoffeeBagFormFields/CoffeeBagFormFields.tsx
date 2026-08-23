import type { RoastLevel } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Input } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import type { CoffeeBagFormValues } from '../../services/coffeeBagForm';

import { createCoffeeBagFormFieldsStyles } from './CoffeeBagFormFields.styles';
import { RoastDateField } from './RoastDateField';
import { RoastLevelChips } from './RoastLevelChips';

export interface CoffeeBagFormFieldsProps {
  readonly values: CoffeeBagFormValues;
  readonly onChange: (patch: Partial<CoffeeBagFormValues>) => void;
  readonly disabled?: boolean;
}

/**
 * One bag, as far as anybody can be bothered to type it.
 *
 * The same fields serve the shop scanner and the manual entry in the cupboard,
 * because they are the same question asked in two places - and a coffee
 * somebody scanned should not have to be typed a second time to be kept.
 *
 * Only the name is ever needed, and even that has a fallback.
 */
export const CoffeeBagFormFields = ({
  values,
  onChange,
  disabled = false,
}: CoffeeBagFormFieldsProps): JSX.Element => {
  const styles = useThemedStyles(createCoffeeBagFormFieldsStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <Input
        label={t(TRANSLATION_KEYS.scanNameLabel)}
        placeholder={t(TRANSLATION_KEYS.scanNamePlaceholder)}
        value={values.name}
        disabled={disabled}
        onChangeText={(name: string): void => {
          onChange({ name });
        }}
      />
      <Input
        label={t(TRANSLATION_KEYS.scanRoasterLabel)}
        value={values.roaster}
        disabled={disabled}
        onChangeText={(roaster: string): void => {
          onChange({ roaster });
        }}
      />
      <Input
        label={t(TRANSLATION_KEYS.scanOriginLabel)}
        value={values.originCountry}
        disabled={disabled}
        onChangeText={(originCountry: string): void => {
          onChange({ originCountry });
        }}
      />
      <Input
        label={t(TRANSLATION_KEYS.scanNotesLabel)}
        placeholder={t(TRANSLATION_KEYS.scanNotesPlaceholder)}
        helpText={t(TRANSLATION_KEYS.scanNotesHelp)}
        value={values.tastingNotes}
        disabled={disabled}
        onChangeText={(tastingNotes: string): void => {
          onChange({ tastingNotes });
        }}
      />
      <RoastLevelChips
        value={values.roastLevel}
        onChange={(roastLevel: RoastLevel | null): void => {
          onChange({ roastLevel });
        }}
      />
      <RoastDateField
        value={values.daysSinceRoast}
        onChange={(daysSinceRoast: number | null): void => {
          onChange({ daysSinceRoast });
        }}
      />
    </View>
  );
};
