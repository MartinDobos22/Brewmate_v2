import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type AppleAuthButtonStyleMap = ViewStyles<'button'>;

const CORNER_HALVES = 2;

/**
 * Apple draws the button itself and forbids overriding its background through
 * `style`, so the height comes from the shared size scale and the radius is
 * handed over as the `cornerRadius` prop instead.
 */
export const createAppleAuthButtonStyles = (theme: Theme): AppleAuthButtonStyleMap =>
  StyleSheet.create({
    button: { height: theme.size.authProviderHeight, alignSelf: 'stretch' },
  });

/**
 * Half the height, which is what makes it a pill.
 *
 * Computed rather than named, because `SHAPE.pill` is a number large enough to
 * round anything and Apple's component takes an actual corner radius - handed
 * 999 it draws a rectangle.
 */
export const appleCornerRadius = (theme: Theme): number =>
  theme.size.authProviderHeight / CORNER_HALVES;
