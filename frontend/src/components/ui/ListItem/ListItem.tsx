import type { JSX, ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { Text } from '../Text';

import { createListItemStyles } from './ListItem.styles';

export interface ListItemProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly trailing?: ReactNode;
  readonly onPress?: () => void;
  readonly showDivider?: boolean;
}

export const ListItem = ({
  title,
  subtitle,
  trailing,
  onPress,
  showDivider = false,
}: ListItemProps): JSX.Element => {
  const styles = useThemedStyles(createListItemStyles);

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.base,
    showDivider && styles.divider,
    pressed && onPress !== undefined && styles.pressed,
  ];

  return (
    <Pressable
      style={resolveStyle}
      onPress={onPress}
      disabled={onPress === undefined}
      accessibilityRole={onPress === undefined ? 'text' : 'button'}
      accessibilityLabel={title}
    >
      <View style={styles.content}>
        <Text variant="titleMedium">{title}</Text>
        {subtitle === undefined ? null : (
          <Text variant="bodySmall" tone="muted">
            {subtitle}
          </Text>
        )}
      </View>
      {trailing === undefined ? null : <View style={styles.trailing}>{trailing}</View>}
    </Pressable>
  );
};
