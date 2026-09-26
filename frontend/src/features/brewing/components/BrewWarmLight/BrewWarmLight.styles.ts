import { StyleSheet } from 'react-native';

import type { ViewStyles } from '../../../../theme';
import { BREW_WARM_LIGHT } from '../../constants';

type BrewWarmLightStyleMap = ViewStyles<'wrapper'>;

/**
 * Built once rather than per theme: where the glow sits and how big it is are
 * the same in both schemes, and its one colour is read off the theme at the
 * gradient stop instead.
 */
export const BREW_WARM_LIGHT_STYLES: BrewWarmLightStyleMap = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: BREW_WARM_LIGHT.top,
    left: BREW_WARM_LIGHT.left,
    width: BREW_WARM_LIGHT.size,
    height: BREW_WARM_LIGHT.size,
  },
});
