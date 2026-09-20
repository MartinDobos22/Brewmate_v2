import type { JSX, ReactNode } from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '../../../theme';

import { createCardStyles } from './Card.styles';

export type CardVariant =
  'surface' | 'container' | 'containerHigh' | 'outlined' | 'soft' | 'softEmphasis';

const DEFAULT_CARD_VARIANT: CardVariant = 'outlined';

export interface CardProps {
  readonly children: ReactNode;
  readonly variant?: CardVariant;
}

/**
 * A grouped block of content. Radius 16 and no shadow by default; the `soft`
 * variants are the redesign's, where depth replaced the outline.
 */
export const Card = ({ children, variant = DEFAULT_CARD_VARIANT }: CardProps): JSX.Element => {
  const styles = useThemedStyles(createCardStyles);

  return <View style={[styles.base, styles[variant]]}>{children}</View>;
};
