import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type SectionBlockStyleMap = ViewStyles<'section' | 'body' | 'row'>;

export const createSectionBlockStyles = (theme: Theme): SectionBlockStyleMap =>
  StyleSheet.create({
    section: { gap: theme.spacing.md, paddingVertical: theme.spacing.md },
    body: { gap: theme.spacing.md },
    row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: theme.spacing.sm },
  });
