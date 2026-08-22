import type { WaterType } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { OptionCard } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { WATER_TYPE_OPTIONS, type WaterTypeOption } from '../../constants';

import { createWaterTypePickerStyles } from './WaterTypePicker.styles';

export interface WaterTypePickerProps {
  readonly selected: WaterType;
  readonly onSelect: (waterType: WaterType) => void;
  readonly disabled?: boolean;
}

/** The account-wide default water. A recipe and a brew log each record their own. */
export const WaterTypePicker = ({
  selected,
  onSelect,
  disabled = false,
}: WaterTypePickerProps): JSX.Element => {
  const styles = useThemedStyles(createWaterTypePickerStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      {WATER_TYPE_OPTIONS.map((option: WaterTypeOption): JSX.Element => (
        <OptionCard
          key={option.waterType}
          label={t(option.labelKey)}
          note={t(option.noteKey)}
          selected={option.waterType === selected}
          disabled={disabled}
          onPress={(): void => {
            onSelect(option.waterType);
          }}
        />
      ))}
    </View>
  );
};
