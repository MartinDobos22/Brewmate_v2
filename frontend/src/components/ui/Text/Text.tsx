import type { JSX, ReactNode } from 'react';
import { Text as RNText } from 'react-native';

import { useThemedStyles } from '../../../theme';

import { createTextStyles } from './Text.styles';
import {
  DEFAULT_TEXT_ALIGN,
  DEFAULT_TEXT_TONE,
  DEFAULT_TEXT_VARIANT,
  type TextAlign,
  type TextTone,
  type TextVariant,
} from './textVariants';

export interface TextProps {
  readonly children: ReactNode;
  readonly variant?: TextVariant;
  readonly tone?: TextTone;
  readonly align?: TextAlign;
  /** Renders with tabular numerals so a changing value never shifts layout. */
  readonly numeric?: boolean;
  readonly numberOfLines?: number;
  readonly accessibilityLabel?: string;
}

/** The only way text is rendered in the app. */
export const Text = ({
  children,
  variant = DEFAULT_TEXT_VARIANT,
  tone = DEFAULT_TEXT_TONE,
  align = DEFAULT_TEXT_ALIGN,
  numeric = false,
  numberOfLines,
  accessibilityLabel,
}: TextProps): JSX.Element => {
  const styles = useThemedStyles(createTextStyles);

  return (
    <RNText
      style={[styles[variant], styles[tone], styles[align], numeric && styles.numeric]}
      numberOfLines={numberOfLines}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </RNText>
  );
};
