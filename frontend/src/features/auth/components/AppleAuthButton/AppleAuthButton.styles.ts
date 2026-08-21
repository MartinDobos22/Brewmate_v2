import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type AppleAuthButtonStyleMap = ViewStyles<'button'>;

/**
 * Apple draws the button itself and forbids overriding its background and
 * radius through `style`, so the height comes from the shared size scale and
 * the radius is handed over as the `cornerRadius` prop instead.
 */
export const createAppleAuthButtonStyles = (theme: Theme): AppleAuthButtonStyleMap =>
  StyleSheet.create({
    button: { height: theme.size.buttonHeightMedium, alignSelf: 'stretch' },
  });
