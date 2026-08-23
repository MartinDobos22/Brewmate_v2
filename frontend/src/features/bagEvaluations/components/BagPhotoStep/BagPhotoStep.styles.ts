import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BagPhotoStepStyleMap = ViewStyles<'actions'>;

export const createBagPhotoStepStyles = (theme: Theme): BagPhotoStepStyleMap =>
  StyleSheet.create({
    actions: { gap: theme.spacing.md },
  });
