import type { JSX } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
import { useThemedStyles } from '../../../../theme';

import { createHomeActionsStyles } from './HomeActions.styles';

export interface HomeQuietActionProps {
  readonly label: string;
  readonly onPress: () => void;
}

/**
 * Refusing, at the same height as agreeing.
 *
 * Quieter in colour but not in size: somebody who does not want a checklist
 * on their home screen should not have to aim at a smaller target to say so.
 */
export const HomeQuietAction = ({ label, onPress }: HomeQuietActionProps): JSX.Element => {
  const styles = useThemedStyles(createHomeActionsStyles);

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.quiet,
    pressed && styles.pressed,
  ];

  return (
    <Pressable
      style={resolveStyle}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text variant="actionLabel" tone="accentSoft" numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
};
