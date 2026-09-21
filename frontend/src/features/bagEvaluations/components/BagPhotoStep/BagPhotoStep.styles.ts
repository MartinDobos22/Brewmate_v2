import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BagPhotoStepStyleMap = ViewStyles<
  | 'card'
  | 'heading'
  | 'title'
  | 'viewfinder'
  | 'frame'
  | 'capture'
  | 'alternatives'
  | 'alternative'
  | 'pressed'
>;

/**
 * A photograph of the label, or not.
 *
 * The camera is the loud button and the two ways round it sit under it at the
 * same size as each other: a photograph is the fast path, not the required
 * one - bad light, a matte bag, a shop that frowns at cameras and a phone on
 * one bar are all ordinary, and none is a reason somebody cannot ask about
 * their coffee. As three stacked buttons the manual route read as the thing
 * you fall back to once the two above it have failed you.
 *
 * The window above them is a picture rather than a control. It says what the
 * camera is going to do - read a label - in the space the photograph will
 * take, and the dashed frame inside it is the only dashed line in the app for
 * exactly that reason: it is a placeholder for something not there yet.
 */
export const createBagPhotoStepStyles = (theme: Theme): BagPhotoStepStyleMap =>
  StyleSheet.create({
    card: {
      gap: theme.spacing.lg,
      padding: theme.spacing.lgPlus,
      borderRadius: theme.shape.xlCard,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.cardEmphasis,
    },
    heading: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    title: { gap: theme.spacing.xs },
    viewfinder: {
      height: theme.size.scanViewfinderHeight,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      borderRadius: theme.shape.softCard,
      backgroundColor: theme.colors.surfaceVariant,
      overflow: 'hidden',
    },
    frame: {
      position: 'absolute',
      top: theme.size.scanViewfinderInset,
      right: theme.size.scanViewfinderInset,
      bottom: theme.size.scanViewfinderInset,
      left: theme.size.scanViewfinderInset,
      borderRadius: theme.shape.listItem,
      borderWidth: theme.borderWidth.thick,
      borderStyle: 'dashed',
      borderColor: theme.colors.outlineDashed,
    },
    capture: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      height: theme.size.scanCaptureHeight,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.espresso,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.buttonDark,
    },
    alternatives: { flexDirection: 'row', gap: theme.spacing.sm },
    alternative: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      height: theme.size.scanAlternativeHeight,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.surfaceVariant,
    },
    pressed: { opacity: theme.opacity.pressed },
  });
