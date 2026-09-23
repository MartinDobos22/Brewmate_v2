import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type CoffeeTasteCardStyleMap = ViewStyles<'notes'>;

/**
 * The printed notes, wrapped onto as many rows as they need.
 *
 * The chips themselves are the shared pill. They were a private copy of one -
 * a padded box at the chip radius in the secondary container - which is the
 * third time that shape had been written out by hand in this app.
 */
export const createCoffeeTasteCardStyles = (theme: Theme): CoffeeTasteCardStyleMap =>
  StyleSheet.create({
    notes: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
  });
