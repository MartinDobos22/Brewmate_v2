import type { ParsedBagFieldName, RoastLevel } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import type { CoffeeBagFormValues } from '../../services/coffeeBagForm';

import { BagTextField } from './BagTextField';
import { CoffeeBagDetailFields } from './CoffeeBagDetailFields';
import { createCoffeeBagFormFieldsStyles } from './CoffeeBagFormFields.styles';
import { RoastDateField } from './RoastDateField';
import { RoastLevelChips } from './RoastLevelChips';

const NOTHING_UNVERIFIED: readonly ParsedBagFieldName[] = [];

export interface CoffeeBagFormFieldsProps {
  readonly values: CoffeeBagFormValues;
  readonly onChange: (patch: Partial<CoffeeBagFormValues>) => void;
  /** Fields a camera filled in but was not sure of. Empty when typed by hand. */
  readonly unverified?: readonly ParsedBagFieldName[];
  readonly disabled?: boolean;
}

/**
 * One bag, as far as anybody can be bothered to type it.
 *
 * The same fields serve the shop scanner and the manual entry in the cupboard,
 * because they are the same question asked in two places - and a coffee
 * somebody scanned should not have to be typed a second time to be kept.
 *
 * Only the name is ever needed, and even that has a fallback. What a camera
 * read badly is marked rather than corrected: the app does not know better
 * than the person holding the bag, it only knows which boxes it squinted at.
 */
export const CoffeeBagFormFields = ({
  values,
  onChange,
  unverified = NOTHING_UNVERIFIED,
  disabled = false,
}: CoffeeBagFormFieldsProps): JSX.Element => {
  const styles = useThemedStyles(createCoffeeBagFormFieldsStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <BagTextField
        field="name"
        label={t(TRANSLATION_KEYS.scanNameLabel)}
        placeholder={t(TRANSLATION_KEYS.scanNamePlaceholder)}
        value={values.name}
        unverified={unverified}
        disabled={disabled}
        onChangeText={(name: string): void => {
          onChange({ name });
        }}
      />
      <BagTextField
        field="roaster"
        label={t(TRANSLATION_KEYS.scanRoasterLabel)}
        value={values.roaster}
        unverified={unverified}
        disabled={disabled}
        onChangeText={(roaster: string): void => {
          onChange({ roaster });
        }}
      />
      <BagTextField
        field="originCountry"
        label={t(TRANSLATION_KEYS.scanOriginLabel)}
        value={values.originCountry}
        unverified={unverified}
        disabled={disabled}
        onChangeText={(originCountry: string): void => {
          onChange({ originCountry });
        }}
      />
      <BagTextField
        field="tastingNotes"
        label={t(TRANSLATION_KEYS.scanNotesLabel)}
        placeholder={t(TRANSLATION_KEYS.scanNotesPlaceholder)}
        helpText={t(TRANSLATION_KEYS.scanNotesHelp)}
        value={values.tastingNotes}
        unverified={unverified}
        disabled={disabled}
        onChangeText={(tastingNotes: string): void => {
          onChange({ tastingNotes });
        }}
      />
      <RoastLevelChips
        value={values.roastLevel}
        unverified={unverified.includes('roastLevel')}
        onChange={(roastLevel: RoastLevel | null): void => {
          onChange({ roastLevel });
        }}
      />
      <RoastDateField
        value={values.daysSinceRoast}
        unverified={unverified.includes('roastDate')}
        onChange={(daysSinceRoast: number | null): void => {
          onChange({ daysSinceRoast });
        }}
      />
      <CoffeeBagDetailFields
        values={values}
        unverified={unverified}
        disabled={disabled}
        onChange={onChange}
      />
    </View>
  );
};
