import type { JSX } from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { BackButton, BACK_BUTTON_GROUNDS, type BackButtonGround } from '../BackButton';
import { useScreenBack } from '../ScreenBack';

import { createScreenTopBarStyles } from './ScreenTopBar.styles';

export interface ScreenTopBarProps {
  readonly ground?: BackButtonGround;
}

/**
 * The way back on a screen that starts straight into content.
 *
 * A screen led by an espresso block draws the button inside the block
 * instead, because the block is what reaches the notch; this is for every
 * screen whose content starts under it. Absent where there is nowhere to go
 * back to - the home tab is the bottom of the app, and a button there would
 * be a control that does nothing.
 */
export const ScreenTopBar = ({
  ground = BACK_BUTTON_GROUNDS.surface,
}: ScreenTopBarProps): JSX.Element | null => {
  const styles = useThemedStyles(createScreenTopBarStyles);
  const back = useScreenBack();

  if (back === null) {
    return null;
  }

  return (
    <View style={styles.bar}>
      <BackButton ground={ground} onPress={back} />
    </View>
  );
};
