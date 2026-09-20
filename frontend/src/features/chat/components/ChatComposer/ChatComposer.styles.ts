import { StyleSheet } from 'react-native';

import type { TextStyles, Theme, ViewStyles } from '../../../../theme';

type ChatComposerStyleMap = ViewStyles<
  'bar' | 'notices' | 'row' | 'field' | 'send' | 'sendActive' | 'pressed'
> &
  TextStyles<'input'>;

/**
 * Where somebody says how the coffee was, pinned to the bottom edge.
 *
 * It used to sit at the end of the scroll, under however many messages the
 * conversation had grown to, so answering the second question meant scrolling
 * past everything said since the first. A conversation is written from the
 * bottom; the box belongs there.
 *
 * The send button says whether there is anything to send by its colour rather
 * than by disappearing or greying its label: an empty box is the ordinary
 * state of this screen, not a mistake somebody is making.
 */
export const createChatComposerStyles = (theme: Theme): ChatComposerStyleMap =>
  StyleSheet.create({
    bar: {
      gap: theme.spacing.md,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderTopWidth: theme.borderWidth.thin,
      borderTopColor: theme.colors.dividerStrong,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.footBar,
    },
    /** Why nothing can be sent, above the bar rather than inside it. */
    notices: { gap: theme.spacing.xs, paddingHorizontal: theme.spacing.lgPlus },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lgPlus,
    },
    field: {
      flex: 1,
      minWidth: 0,
      height: theme.size.inputHeight,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.surfaceVariant,
    },
    /**
     * One line, because the pill around it is one line high.
     *
     * The padding is zeroed rather than left to the platform: Android gives a
     * bare `TextInput` its own vertical padding, which inside a field of a
     * fixed height pushes the text off the centre of the pill on one platform
     * and not the other.
     */
    input: {
      ...theme.typography.bodyLead,
      color: theme.colors.onSurface,
      padding: theme.spacing.none,
    },
    send: {
      width: theme.size.chatSendSize,
      height: theme.size.chatSendSize,
      borderRadius: theme.shape.avatar,
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 0,
      flexShrink: 0,
      backgroundColor: theme.colors.outlineFaint,
    },
    sendActive: {
      backgroundColor: theme.colors.espresso,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.buttonDark,
    },
    pressed: { opacity: theme.opacity.pressed },
  });
