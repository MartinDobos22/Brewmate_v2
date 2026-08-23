import { ROAST_LEVEL_VALUES, type RoastLevel } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Chip, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { ROAST_LEVEL_LABEL_KEYS } from '../../../tasteProfile/constants';

import { createCoffeeBagFormFieldsStyles } from './CoffeeBagFormFields.styles';

const UNKNOWN_ROAST = null;

export interface RoastLevelChipsProps {
  readonly value: RoastLevel | null;
  readonly onChange: (roastLevel: RoastLevel | null) => void;
  /** True when a camera picked this and was not sure of it. */
  readonly unverified?: boolean;
}

/** The roast on the label, with "neviem" as an answer rather than a gap. */
export const RoastLevelChips = ({
  value,
  onChange,
  unverified = false,
}: RoastLevelChipsProps): JSX.Element => {
  const styles = useThemedStyles(createCoffeeBagFormFieldsStyles);
  const { t } = useTranslation();

  return (
    <>
      <Text variant="labelMedium" tone={unverified ? 'tertiary' : 'muted'}>
        {t(unverified ? TRANSLATION_KEYS.scanRoastLabelUncertain : TRANSLATION_KEYS.scanRoastLabel)}
      </Text>
      <View style={styles.chips}>
        <Chip
          label={t(TRANSLATION_KEYS.scanRoastUnknown)}
          selected={value === UNKNOWN_ROAST}
          onPress={(): void => {
            onChange(UNKNOWN_ROAST);
          }}
        />
        {ROAST_LEVEL_VALUES.map((roastLevel: RoastLevel): JSX.Element => (
          <Chip
            key={roastLevel}
            label={t(ROAST_LEVEL_LABEL_KEYS[roastLevel])}
            selected={value === roastLevel}
            onPress={(): void => {
              onChange(roastLevel);
            }}
          />
        ))}
      </View>
    </>
  );
};
