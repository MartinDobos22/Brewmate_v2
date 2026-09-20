import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { useTheme, useThemedStyles } from '../../../theme';
import { Text } from '../Text';
import type { TileGlyph } from '../Tile';

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
  /** A glyph beside the label, where the thing being adjusted has one. */
  readonly icon?: TileGlyph;
  /**
   * What the two ends mean, printed under them.
   *
   * A slider says how far along something is and never what along means. On a
   * ratio that is the difference between a control somebody can aim with and
   * one they have to discover by dragging.
   */
  readonly minLabel?: string;
  readonly maxLabel?: string;
}

const HALF = 2;

export const Slider = ({
  label,
  value,
  formattedValue,
  range,
  onChange,
  disabled = false,
  icon,
  minLabel,
  maxLabel,
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
        <View style={styles.label}>
          {icon === undefined ? null : (
            <MaterialCommunityIcons
              name={icon}
              size={theme.size.iconSmall}
              color={theme.colors.onSurfaceVariant}
            />
          )}
          <Text variant="eyebrow" tone="muted">
            {label}
          </Text>
        </View>
        <Text variant="numericValue" numeric>
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
      {minLabel === undefined || maxLabel === undefined ? null : (
        <View style={styles.bounds}>
          <Text variant="numericCaption" tone="muted" numeric>
            {minLabel}
          </Text>
          <Text variant="numericCaption" tone="muted" numeric>
            {maxLabel}
          </Text>
        </View>
      )}
    </View>
  );
};
