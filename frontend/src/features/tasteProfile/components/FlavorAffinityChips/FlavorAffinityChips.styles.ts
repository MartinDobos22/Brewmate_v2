import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type FlavorAffinityChipsStyleMap = ViewStyles<'row'>;

/**
 * The flavours the profile has an opinion about, wrapped onto as many rows as
 * they need. The chips themselves are the shared pill - they were a private
 * copy of it with a height two points off, which is a difference no reader
 * can see and one the next chip would have had to guess at.
 */
export const createFlavorAffinityChipsStyles = (theme: Theme): FlavorAffinityChipsStyleMap =>
  StyleSheet.create({
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
