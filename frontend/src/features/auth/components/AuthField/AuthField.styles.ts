import { StyleSheet } from 'react-native';

import type { TextStyles, Theme, ViewStyles } from '../../../../theme';

type AuthFieldStyleMap = ViewStyles<
  'wrapper' | 'label' | 'box' | 'focused' | 'errored' | 'reveal'
> &
  TextStyles<'input'>;

/**
 * A field on the one dark form in the app.
 *
 * The box is the deep brown rather than a bordered surface: on this screen a
 * bordered white field would be a piece of some other application dropped onto
 * the brown, and an outline alone on brown is barely a box at all. The border
 * appears only on focus, in the accent, which is the one place a ring says
 * something - there is a keyboard open and this is the box it is typing into.
 *
 * The label carries a glyph because it is set small and tracked out, and two
 * of those stacked read as one block of quiet text rather than as two
 * headings.
 */
export const createAuthFieldStyles = (theme: Theme): AuthFieldStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xs },
    label: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    box: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      height: theme.size.authFieldHeight,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.shape.card,
      borderWidth: theme.borderWidth.thick,
      borderColor: theme.colors.espressoDeep,
      backgroundColor: theme.colors.espressoDeep,
    },
    focused: { borderColor: theme.colors.accentOnEspresso },
    errored: { borderColor: theme.colors.error },
    input: {
      flex: 1,
      minWidth: 0,
      ...theme.typography.bodyAnswer,
      color: theme.colors.onEspresso,
      padding: theme.spacing.none,
    },
    reveal: { padding: theme.spacing.xs },
  });
