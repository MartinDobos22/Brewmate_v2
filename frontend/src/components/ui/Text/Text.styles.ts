import { StyleSheet } from 'react-native';

import type { TextStyles, Theme } from '../../../theme';

import type { TextAlign, TextTone, TextVariant } from './textVariants';

type TextStyleMap = TextStyles<TextVariant | TextTone | TextAlign | 'numeric'>;

const TABULAR_NUMERALS = 'tabular-nums';

/**
 * Every entry of the type scale becomes a style, so a variant name maps
 * straight onto a token and no component ever writes a font size.
 */
export const createTextStyles = (theme: Theme): TextStyleMap =>
  StyleSheet.create({
    ...theme.typography,
    numeric: { fontVariant: [TABULAR_NUMERALS] },
    default: { color: theme.colors.onSurface },
    muted: { color: theme.colors.onSurfaceVariant },
    primary: { color: theme.colors.primary },
    onPrimary: { color: theme.colors.onPrimary },
    secondary: { color: theme.colors.secondary },
    tertiary: { color: theme.colors.tertiary },
    error: { color: theme.colors.error },
    inverse: { color: theme.colors.onInverseSurface },
    disabled: { color: theme.colors.onDisabled },
    left: { textAlign: 'left' },
    center: { textAlign: 'center' },
    right: { textAlign: 'right' },
  });
