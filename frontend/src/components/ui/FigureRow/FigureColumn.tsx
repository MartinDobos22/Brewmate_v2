import type { JSX } from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { Text } from '../Text';

import { createFigureRowStyles } from './FigureRow.styles';
import {
  DEFAULT_FIGURE_GROUND,
  DEFAULT_FIGURE_SCALE,
  FIGURE_DERIVED_VARIANTS,
  FIGURE_LABEL_TONES,
  FIGURE_VALUE_TONES,
  FIGURE_VALUE_VARIANTS,
  type FigureGround,
  type FigureScale,
} from './figureRowScales';

export interface FigureColumnProps {
  readonly value: string;
  readonly label: string;
  readonly scale?: FigureScale;
  readonly ground?: FigureGround;
  /** The ratio, which is arithmetic over the two weights rather than one of them. */
  readonly derived?: boolean;
}

/**
 * One of the three numbers a recipe is made of, with its own label under it.
 *
 * The same column appears on the home screen's block, in the conversation's
 * header and on every version of a recipe in the timeline. It was written out
 * three times, and the three copies differed by exactly two type variants and
 * a colour - which is a design system's job rather than three screens'.
 */
export const FigureColumn = ({
  value,
  label,
  scale = DEFAULT_FIGURE_SCALE,
  ground = DEFAULT_FIGURE_GROUND,
  derived = false,
}: FigureColumnProps): JSX.Element => {
  const styles = useThemedStyles(createFigureRowStyles);

  return (
    <View style={styles.column}>
      <Text
        variant={derived ? FIGURE_DERIVED_VARIANTS[scale] : FIGURE_VALUE_VARIANTS[scale]}
        tone={FIGURE_VALUE_TONES[ground]}
        numeric
      >
        {value}
      </Text>
      <Text variant="eyebrow" tone={FIGURE_LABEL_TONES[ground]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};
