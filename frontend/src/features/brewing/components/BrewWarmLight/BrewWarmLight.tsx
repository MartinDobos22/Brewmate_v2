import type { JSX } from 'react';
import { View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { useTheme } from '../../../../theme';
import { BREW_WARM_LIGHT } from '../../constants';

import { BREW_WARM_LIGHT_STYLES } from './BrewWarmLight.styles';

const GRADIENT_ID = 'brewWarmLight';
const CENTRE = '50%';
const EDGE = 0;

/**
 * One soft light off the top left, and the only thing on this screen that is
 * not information.
 *
 * A flat near-black rectangle reads as a screen that has failed rather than as
 * one deliberately turned down, and the glow is what puts the pour ring in a
 * room instead of on a void. Drawn rather than shipped as an image, like every
 * other graphic in this app: a transparent PNG would be one density's worth of
 * gradient and banded on everything else.
 *
 * It sits behind everything and takes no touches - a decoration that swallowed
 * a tap on this screen would swallow it from a wet finger aiming at a pause
 * button.
 */
export const BrewWarmLight = (): JSX.Element => {
  const theme = useTheme();

  return (
    <View style={BREW_WARM_LIGHT_STYLES.wrapper} pointerEvents="none">
      <Svg width={BREW_WARM_LIGHT.size} height={BREW_WARM_LIGHT.size}>
        <Defs>
          <RadialGradient id={GRADIENT_ID} cx={CENTRE} cy={CENTRE} r={CENTRE}>
            <Stop
              offset={EDGE}
              stopColor={theme.colors.accentOnEspresso}
              stopOpacity={BREW_WARM_LIGHT.centerOpacity}
            />
            <Stop
              offset={BREW_WARM_LIGHT.edgeStop}
              stopColor={theme.colors.accentOnEspresso}
              stopOpacity={BREW_WARM_LIGHT.edgeOpacity}
            />
          </RadialGradient>
        </Defs>
        <Rect
          width={BREW_WARM_LIGHT.size}
          height={BREW_WARM_LIGHT.size}
          fill={`url(#${GRADIENT_ID})`}
        />
      </Svg>
    </View>
  );
};
