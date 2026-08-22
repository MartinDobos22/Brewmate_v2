import type { JSX } from 'react';
import { View } from 'react-native';

import { Chip, Text } from '../../../../components/ui';
import { useTranslation, type TranslationKey } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';

import { createGrinderOptionChipsStyles } from './GrinderOptionChips.styles';

export interface GrinderOptionChipsProps<TOption extends string> {
  readonly label: string;
  readonly options: readonly TOption[];
  readonly labelKeys: Record<TOption, TranslationKey>;
  readonly selected: TOption;
  readonly onSelect: (option: TOption) => void;
  readonly disabled?: boolean;
}

/** A labelled row of chips: one choice out of a closed set. */
export const GrinderOptionChips = <TOption extends string>({
  label,
  options,
  labelKeys,
  selected,
  onSelect,
  disabled = false,
}: GrinderOptionChipsProps<TOption>): JSX.Element => {
  const styles = useThemedStyles(createGrinderOptionChipsStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <Text variant="labelMedium" tone="muted">
        {label}
      </Text>
      <View style={styles.row}>
        {options.map((option: TOption): JSX.Element => (
          <Chip
            key={option}
            label={t(labelKeys[option])}
            selected={option === selected}
            disabled={disabled}
            onPress={(): void => {
              onSelect(option);
            }}
          />
        ))}
      </View>
    </View>
  );
};
