import type { JSX, ReactNode } from 'react';
import { View } from 'react-native';

import { useTheme, useThemedStyles } from '../../../theme';

import { cardElevation, createCardStyles } from './Card.styles';
import { DEFAULT_CARD_DEPTH, type CardDepth } from './cardDepths';

export interface CardProps {
  readonly children: ReactNode;
  /** Named only where one card on the screen is meant to outrank the rest. */
  readonly depth?: CardDepth;
}

/** A grouped block of content: one surface, one radius, no border. */
export const Card = ({ children, depth = DEFAULT_CARD_DEPTH }: CardProps): JSX.Element => {
  const styles = useThemedStyles(createCardStyles);
  const theme = useTheme();

  return <View style={[styles.base, cardElevation(theme, depth)]}>{children}</View>;
};
