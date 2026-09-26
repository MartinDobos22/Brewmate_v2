import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { useTheme, useThemedStyles } from '../../../theme';
import type { TileGlyph } from '../Tile';

import { createStateMarkStyles, stateMarkRing } from './StateMark.styles';
import {
  DEFAULT_STATE_GROUND,
  STATE_MARK_GLYPH_COLORS,
  STATE_MARK_RINGS,
  type StateGround,
} from './stateMarkGrounds';

const OUTER = 0;
const INNER = 1;

export interface StateMarkProps {
  /** The thing that is not there yet, drawn. */
  readonly icon: TileGlyph;
  readonly ground?: StateGround;
}

/**
 * Two dashed rings round the glyph of whatever is missing.
 *
 * The one picture an empty screen gets. It was written for the cupboard and
 * is the same object on every other empty screen in the app, so it lives here
 * rather than beside one of them - an empty history drawn differently from an
 * empty shelf would be two apps.
 */
export const StateMark = ({ icon, ground = DEFAULT_STATE_GROUND }: StateMarkProps): JSX.Element => {
  const styles = useThemedStyles(createStateMarkStyles);
  const theme = useTheme();
  const rings = STATE_MARK_RINGS[ground];

  return (
    <View style={styles.wrapper}>
      <View style={stateMarkRing(theme, theme.size.emptyMarkOuter, rings[OUTER])} />
      <View style={stateMarkRing(theme, theme.size.emptyMarkInner, rings[INNER])} />
      <MaterialCommunityIcons
        name={icon}
        size={theme.size.emptyMarkGlyph}
        color={theme.colors[STATE_MARK_GLYPH_COLORS[ground]]}
      />
    </View>
  );
};
