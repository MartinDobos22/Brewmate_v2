import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ProfileHeaderStyleMap = ViewStyles<
  'row' | 'identity' | 'avatar' | 'names' | 'email' | 'cog' | 'pressed'
>;

/**
 * Who is signed in, above everything the screen has to say about them.
 *
 * Identity and one way out to the kit. The screen used to open on a chart,
 * which left the reader working out for several seconds whose taste they were
 * looking at, and it kept the address buried seven scrolls down beside the two
 * ways out of the product. What can be *done* to the account stays in the
 * account group at the bottom, where somebody goes deliberately.
 */
export const createProfileHeaderStyles = (theme: Theme): ProfileHeaderStyleMap =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    identity: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, minWidth: 0 },
    avatar: {
      width: theme.size.profileAvatarSize,
      height: theme.size.profileAvatarSize,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.espressoLift,
    },
    names: { minWidth: 0, gap: theme.spacing.xxs },
    email: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, minWidth: 0 },
    cog: {
      width: theme.size.headerButtonSize,
      height: theme.size.headerButtonSize,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.espressoLift,
    },
    pressed: { opacity: theme.opacity.pressed },
  });
