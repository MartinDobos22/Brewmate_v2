import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

import type { InfoNoteTone } from './infoNoteTones';

type InfoNoteStyleMap = ViewStyles<'base' | 'body' | InfoNoteTone>;

/**
 * A line the screen says about itself, marked rather than italicised.
 *
 * `plain` has no ground at all and is a caption with a glyph - what a screen
 * says about what its own numbers are worth. The other two are marked notes on
 * their own ground, which is the difference between a remark and a condition:
 * something is missing, or something is fine that looks like it is not.
 */
export const createInfoNoteStyles = (theme: Theme): InfoNoteStyleMap =>
  StyleSheet.create({
    base: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.sm },
    plain: { paddingHorizontal: theme.spacing.xs },
    caution: {
      padding: theme.spacing.lg,
      borderRadius: theme.shape.insetBlock,
      backgroundColor: theme.colors.cautionContainer,
    },
    fresh: {
      padding: theme.spacing.lg,
      borderRadius: theme.shape.insetBlock,
      backgroundColor: theme.colors.freshContainer,
    },
    body: { flex: 1, minWidth: 0 },
  });
