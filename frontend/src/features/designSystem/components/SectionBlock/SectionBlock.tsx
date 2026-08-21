import type { JSX, ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { useThemedStyles } from '../../../../theme';

import { createSectionBlockStyles } from './SectionBlock.styles';

export interface SectionBlockProps {
  readonly title: string;
  readonly children: ReactNode;
  /** Lays the children out in a wrapping row instead of a column. */
  readonly inline?: boolean;
}

/** One titled block of the design system screen. */
export const SectionBlock = ({
  title,
  children,
  inline = false,
}: SectionBlockProps): JSX.Element => {
  const styles = useThemedStyles(createSectionBlockStyles);

  return (
    <View style={styles.section}>
      <Text variant="titleSmall" tone="muted">
        {title}
      </Text>
      <View style={inline ? styles.row : styles.body}>{children}</View>
    </View>
  );
};
