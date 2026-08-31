import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type AuthBrandMarkStyleMap = ViewStyles<'wrapper' | 'mark' | 'ring' | 'inner'>;

/**
 * Two rings, the same motif the home screen's tiles are decorated with.
 *
 * Whole here rather than clipped by a corner, because on this screen it is the
 * subject rather than a decoration behind one - and at full opacity, for the
 * same reason. Built from the radius and border tokens, so it is correct in
 * both colour schemes without a second asset.
 */
export const createAuthBrandMarkStyles = (theme: Theme): AuthBrandMarkStyleMap =>
  StyleSheet.create({
    wrapper: { alignItems: 'center', gap: theme.spacing.md },
    mark: {
      width: theme.size.brandMarkSize,
      height: theme.size.brandMarkSize,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ring: {
      position: 'absolute',
      width: theme.size.brandMarkSize,
      height: theme.size.brandMarkSize,
      borderRadius: theme.shape.avatar,
      borderWidth: theme.borderWidth.thick,
      borderColor: theme.colors.primary,
    },
    inner: {
      width: theme.size.brandMarkInner,
      height: theme.size.brandMarkInner,
      borderRadius: theme.shape.avatar,
      backgroundColor: theme.colors.primary,
    },
  });
