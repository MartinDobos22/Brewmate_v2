import type { JSX, ReactNode } from 'react';
import { Animated, Modal, Pressable, View } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { Text } from '../Text';

import { createSheetStyles } from './Sheet.styles';
import { panelStyle, scrimStyle } from './sheetAnimatedStyles';
import { useSheetAnimation } from './useSheetAnimation';

export interface SheetProps {
  readonly visible: boolean;
  readonly title: string;
  readonly closeLabel: string;
  readonly onClose: () => void;
  readonly children: ReactNode;
}

const MODAL_ANIMATION = 'none';

/** A bottom sheet: radius 24 on the top corners, and the app's only overlay shadow. */
export const Sheet = ({
  visible,
  title,
  closeLabel,
  onClose,
  children,
}: SheetProps): JSX.Element => {
  const styles = useThemedStyles(createSheetStyles);
  const { scrimOpacity, translateY } = useSheetAnimation(visible);

  return (
    <Modal
      visible={visible}
      transparent
      animationType={MODAL_ANIMATION}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <Animated.View style={[styles.scrim, scrimStyle(scrimOpacity)]}>
          <Pressable
            style={styles.scrim}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={closeLabel}
          />
        </Animated.View>
        <Animated.View style={[styles.panel, panelStyle(translateY)]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text variant="titleLarge">{title}</Text>
          </View>
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};
