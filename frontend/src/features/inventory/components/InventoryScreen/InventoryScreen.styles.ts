import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type InventoryScreenStyleMap = ViewStyles<'content'>;

/**
 * The redesign's own screen edge, which is four points wider than the app's.
 *
 * Sixteen was right around cards that carried an outline; around cards that
 * carry only a shadow it left them reading as if they had been pushed against
 * the glass. The screen sets it rather than the `Screen` component, so nothing
 * moves under a screen nobody has rebuilt yet.
 */
export const createInventoryScreenStyles = (theme: Theme): InventoryScreenStyleMap =>
  StyleSheet.create({
    content: { padding: theme.spacing.lgPlus, gap: theme.spacing.lgPlus },
  });
