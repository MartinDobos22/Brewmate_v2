import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type AuthBrandMarkStyleMap = ViewStyles<'wrapper' | 'mark' | 'ring' | 'inner'>;

/**
 * A ring with a filled core, the same motif everything else in this app is
 * decorated with.
 *
 * Whole here rather than clipped by a corner, because on this screen it is the
 * subject rather than depth behind one - and in the accent rather than the
 * primary, because the screen it stands on is brown. Built from the radius and
 * border tokens, so there is no second asset to be wrong in one scheme.
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
      borderColor: theme.colors.accentOnEspresso,
    },
    inner: {
      width: theme.size.brandMarkInner,
      height: theme.size.brandMarkInner,
      borderRadius: theme.shape.avatar,
      backgroundColor: theme.colors.accentOnEspresso,
    },
  });
