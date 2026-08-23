import type { TasteAxes } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Slider } from '../../../../components/ui';
import { formatDecimal } from '../../../../lib/formatters';
import { useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { TASTE_AXIS_LABEL_KEYS, TASTE_AXIS_RANGE, type TasteAxisName } from '../../constants';
import { readTasteAxes, type TasteAxisValue } from '../../services';

import { createTasteAxisSlidersStyles } from './TasteAxisSliders.styles';

export interface TasteAxisSlidersProps {
  readonly axes: TasteAxes;
  readonly onChange: (axis: TasteAxisName, value: number) => void;
}

/**
 * The five axes, editable by hand.
 *
 * The user overruling Brewmate is the one kind of evidence trusted outright,
 * so this is deliberately a direct edit rather than a nudge - what they leave
 * here is what the profile says.
 */
export const TasteAxisSliders = ({ axes, onChange }: TasteAxisSlidersProps): JSX.Element => {
  const styles = useThemedStyles(createTasteAxisSlidersStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      {readTasteAxes(axes).map(({ axis, value }: TasteAxisValue): JSX.Element => (
        <Slider
          key={axis}
          label={t(TASTE_AXIS_LABEL_KEYS[axis])}
          value={value}
          formattedValue={formatDecimal(value)}
          range={TASTE_AXIS_RANGE}
          onChange={(next: number): void => {
            onChange(axis, next);
          }}
        />
      ))}
    </View>
  );
};
