import type { JSX } from 'react';
import { View } from 'react-native';

import { useTheme, useThemedStyles } from '../../../theme';
import { Text } from '../Text';

import { createSliderStyles, sliderFillWidth, sliderThumbOffset } from './Slider.styles';
import { toRatio, type StepRange } from './clampToStep';
import { useSliderGesture } from './useSliderGesture';

export interface SliderProps {
  readonly label: string;
  readonly value: number;
  /** Already formatted by one of the formatters in lib/formatters. */
  readonly formattedValue: string;
  readonly range: StepRange;
  readonly onChange: (value: number) => void;
  readonly disabled?: boolean;
}

const HALF = 2;

export const Slider = ({
  label,
  value,
  formattedValue,
  range,
  onChange,
  disabled = false,
}: SliderProps): JSX.Element => {
  const styles = useThemedStyles(createSliderStyles);
  const theme = useTheme();
  const { panHandlers, onLayout, trackWidth } = useSliderGesture({ range, onChange, disabled });
  const ratio = toRatio(value, range);
  const fillWidth = trackWidth * ratio;
  const thumbOffset = fillWidth - theme.size.sliderThumbSize / HALF;

  return (
    <View style={[styles.wrapper, disabled && styles.disabled]}>
      <View style={styles.header}>
        <Text variant="labelMedium" tone="muted">
          {label}
        </Text>
        <Text variant="numericSmall" numeric>
          {formattedValue}
        </Text>
      </View>
      <View
        style={styles.touchArea}
        onLayout={onLayout}
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ min: range.min, max: range.max, now: value }}
        {...panHandlers}
      >
        <View style={styles.track}>
          <View style={[styles.fill, sliderFillWidth(fillWidth)]} />
        </View>
        <View style={[styles.thumb, sliderThumbOffset(thumbOffset)]} />
      </View>
    </View>
  );
};
