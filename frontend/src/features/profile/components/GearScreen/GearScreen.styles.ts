import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type GearScreenStyleMap = ViewStyles<'content'>;

export const createGearScreenStyles = (theme: Theme): GearScreenStyleMap =>
  StyleSheet.create({
    content: { padding: theme.spacing.lgPlus, gap: theme.spacing.lgPlus },
  });
