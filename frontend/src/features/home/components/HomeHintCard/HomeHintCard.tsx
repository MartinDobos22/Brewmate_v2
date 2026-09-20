import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { HOME_HINTS } from '../../constants';
import { useHomeHint } from '../../hooks';

import { createHomeHintCardStyles } from './HomeHintCard.styles';

/**
 * One hint, chosen from the account rather than from a list of five.
 *
 * Five pieces of advice at once is five nobody reads, and the order they are
 * checked in is the whole point: an empty cupboard, then a bag going off on
 * somebody's shelf, then a fortnight without a cup - and only when there is
 * genuinely nothing to report does it teach one thing instead.
 *
 * A hint with nowhere to send anybody is not a button. A tip about grind size
 * has no destination, and a card that invented one would be sending people
 * somewhere to be disappointed.
 */
export const HomeHintCard = (): JSX.Element | null => {
  const styles = useThemedStyles(createHomeHintCardStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { hint, isReady } = useHomeHint();

  if (!isReady) {
    return null;
  }

  const presentation = HOME_HINTS[hint.id];
  const route = presentation.route;
  const title = t(presentation.titleKey, hint.values);
  const body = t(presentation.bodyKey, hint.values);

  const content = (
    <>
      <MaterialCommunityIcons
        name={presentation.icon}
        size={theme.size.iconLarge}
        color={theme.colors.onFresh}
      />
      <View style={styles.body}>
        <Text variant="cardTitle">{title}</Text>
        <Text variant="bodyMuted" tone="fresh">
          {body}
        </Text>
      </View>
    </>
  );

  if (route === null) {
    return <View style={styles.card}>{content}</View>;
  }

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.card,
    pressed && styles.pressed,
  ];

  return (
    <Pressable
      style={resolveStyle}
      onPress={(): void => {
        router.push(route);
      }}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${body}`}
    >
      {content}
    </Pressable>
  );
};
