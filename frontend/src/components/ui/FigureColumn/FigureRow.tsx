import type { JSX } from 'react';
import { Fragment } from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '../../../theme';

import { FigureColumn } from './FigureColumn';
import { createFigureColumnStyles } from './FigureColumn.styles';
import {
  DEFAULT_FIGURE_GROUND,
  DEFAULT_FIGURE_SCALE,
  type FigureGround,
  type FigureScale,
} from './figureColumnScales';

/** One column: a number and what it is. */
export interface Figure {
  readonly value: string;
  readonly label: string;
  /** The ratio, which is arithmetic over the two weights rather than one of them. */
  readonly derived?: boolean;
}

export interface FigureRowProps {
  readonly figures: readonly Figure[];
  readonly scale?: FigureScale;
  readonly ground?: FigureGround;
  /** Off inside a card, where a rule would be the only hairline on it. */
  readonly ruled?: boolean;
}

const FIRST = 0;

/**
 * The three numbers a recipe is made of, side by side.
 *
 * Taken as data rather than as children, so the rules between the columns
 * belong to the row: a rule sits *between* two figures, and a column that drew
 * its own leading edge would print one against the card's padding.
 *
 * The same row appears on the home screen's block, in the conversation's
 * header and on every version in the timeline. It was written out three times,
 * and the three copies differed by exactly two type variants and a colour.
 */
export const FigureRow = ({
  figures,
  scale = DEFAULT_FIGURE_SCALE,
  ground = DEFAULT_FIGURE_GROUND,
  ruled = true,
}: FigureRowProps): JSX.Element => {
  const styles = useThemedStyles(createFigureColumnStyles);

  return (
    <View style={styles.row}>
      {figures.map((figure: Figure, index: number): JSX.Element => (
        <Fragment key={figure.label}>
          {ruled && index !== FIRST ? <View style={styles.rule} /> : null}
          <FigureColumn
            value={figure.value}
            label={figure.label}
            scale={scale}
            ground={ground}
            derived={figure.derived}
          />
        </Fragment>
      ))}
    </View>
  );
};
