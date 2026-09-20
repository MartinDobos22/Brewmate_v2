import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { BrewMethod } from '@brewmate/shared';
import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { BREW_METHOD_CATEGORY_ICONS, BREW_METHOD_CATEGORY_LABEL_KEYS } from '../../constants';

import { createPreBrewMethodSectionStyles } from './PreBrewMethodSection.styles';

const CHOSEN_ICON = 'check-circle';

export interface BrewMethodCardProps {
  readonly method: BrewMethod;
  readonly selected: boolean;
  readonly onPress: () => void;
}

/**
 * One brewer, as an object rather than as a word.
 *
 * The family printed under the name is what tells somebody who has never met
 * "Origami" what kind of coffee it makes. The glyph comes from the category
 * and never from the method's key: adding V60 Switch is an insert, and a table
 * keyed by `key` would give the next seeded method a blank square.
 */
export const BrewMethodCard = ({ method, selected, onPress }: BrewMethodCardProps): JSX.Element => {
  const styles = useThemedStyles(createPreBrewMethodSectionStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  const cardStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.card,
    selected ? styles.selected : styles.unselected,
    pressed && styles.pressed,
  ];

  return (
    <Pressable
      style={cardStyle}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={method.nameSk}
    >
      <View style={styles.cardHead}>
        <MaterialCommunityIcons
          name={BREW_METHOD_CATEGORY_ICONS[method.category]}
          size={theme.size.methodGlyphSize}
          color={selected ? theme.colors.accentOnEspresso : theme.colors.onSurfaceVariant}
        />
        {selected ? (
          <MaterialCommunityIcons
            name={CHOSEN_ICON}
            size={theme.size.iconSmall}
            color={theme.colors.onEspressoPositive}
          />
        ) : null}
      </View>
      <View style={styles.cardBody}>
        <Text variant="cardTitle" tone={selected ? 'onEspresso' : 'default'}>
          {method.nameSk}
        </Text>
        <Text variant="chipLabel" tone={selected ? 'onEspressoMuted' : 'muted'}>
          {t(BREW_METHOD_CATEGORY_LABEL_KEYS[method.category])}
        </Text>
      </View>
    </Pressable>
  );
};
