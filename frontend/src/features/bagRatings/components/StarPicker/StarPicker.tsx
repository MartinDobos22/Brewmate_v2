import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { BAG_RATING_MARKS, BAG_RATING_STAR_VALUES } from '../../constants';

import { createStarPickerStyles } from './StarPicker.styles';

export interface StarPickerProps {
  readonly value: number | null;
  readonly onChange: (stars: number) => void;
}

/**
 * How many stars, in one tap.
 *
 * Filled up to the one chosen, in the app's own accent rather than a gold or a
 * green: this is somebody's opinion of a coffee, not the app congratulating
 * either of them on it.
 */
export const StarPicker = ({ value, onChange }: StarPickerProps): JSX.Element => {
  const styles = useThemedStyles(createStarPickerStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.star,
    pressed && styles.pressed,
  ];

  return (
    <View style={styles.row} accessibilityLabel={t(TRANSLATION_KEYS.bagRatingStarsLabel)}>
      {BAG_RATING_STAR_VALUES.map((stars: number): JSX.Element => {
        const isGiven = value !== null && stars <= value;

        return (
          <Pressable
            key={stars}
            style={resolveStyle}
            accessibilityRole="button"
            accessibilityState={{ selected: value === stars }}
            accessibilityLabel={t(TRANSLATION_KEYS.bagRatingStarSpoken, { count: stars })}
            onPress={(): void => {
              onChange(stars);
            }}
          >
            <MaterialCommunityIcons
              name={isGiven ? BAG_RATING_MARKS.starGiven : BAG_RATING_MARKS.starOpen}
              size={theme.size.ratingStar}
              color={isGiven ? theme.colors.primary : theme.colors.onSurfaceVariant}
            />
          </Pressable>
        );
      })}
    </View>
  );
};
