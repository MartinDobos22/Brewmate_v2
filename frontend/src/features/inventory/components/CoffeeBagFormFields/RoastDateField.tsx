import type { JSX } from 'react';
import { View } from 'react-native';

import { Chip, NumberStepper } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { DAYS_SINCE_ROAST } from '../../constants/coffeeBagForm';

import { createCoffeeBagFormFieldsStyles } from './CoffeeBagFormFields.styles';

const UNKNOWN_DATE = null;

export interface RoastDateFieldProps {
  readonly value: number | null;
  readonly onChange: (daysSinceRoast: number | null) => void;
}

/**
 * How long ago the bag was roasted, counted in days.
 *
 * Days rather than a date, because that is the sum somebody does in their head
 * in front of a shelf - and because a date picker is a poor thing to operate
 * with one hand while holding a bag of coffee in the other.
 */
export const RoastDateField = ({ value, onChange }: RoastDateFieldProps): JSX.Element => {
  const styles = useThemedStyles(createCoffeeBagFormFieldsStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <View style={styles.chips}>
        <Chip
          label={t(TRANSLATION_KEYS.scanRoastDateUnknown)}
          selected={value === UNKNOWN_DATE}
          onPress={(): void => {
            onChange(UNKNOWN_DATE);
          }}
        />
        <Chip
          label={t(TRANSLATION_KEYS.scanRoastDateKnown)}
          selected={value !== UNKNOWN_DATE}
          onPress={(): void => {
            onChange(value ?? DAYS_SINCE_ROAST.default);
          }}
        />
      </View>
      {value === UNKNOWN_DATE ? null : (
        <NumberStepper
          label={t(TRANSLATION_KEYS.scanRoastDateLabel)}
          formattedValue={String(value)}
          unit={t(TRANSLATION_KEYS.unitDays)}
          decreaseLabel={t(TRANSLATION_KEYS.decrease)}
          increaseLabel={t(TRANSLATION_KEYS.increase)}
          canDecrease={value > DAYS_SINCE_ROAST.min}
          canIncrease={value < DAYS_SINCE_ROAST.max}
          onDecrease={(): void => {
            onChange(value - DAYS_SINCE_ROAST.step);
          }}
          onIncrease={(): void => {
            onChange(value + DAYS_SINCE_ROAST.step);
          }}
        />
      )}
    </View>
  );
};
