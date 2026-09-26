import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { BAG_RATING_MARKS, BAG_RATING_STAR_VALUES } from '../../constants';

import { createBagRatingCardStyles } from './BagRatingCard.styles';

/** The stars somebody gave, drawn small and read out as a count. */
export const RatedStars = ({ stars }: { readonly stars: number }): JSX.Element => {
  const styles = useThemedStyles(createBagRatingCardStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={styles.stars}
      accessible
      accessibilityLabel={t(TRANSLATION_KEYS.bagRatingStarSpoken, { count: stars })}
    >
      {BAG_RATING_STAR_VALUES.map((value: number): JSX.Element => (
        <MaterialCommunityIcons
          key={value}
          name={value <= stars ? BAG_RATING_MARKS.starGiven : BAG_RATING_MARKS.starOpen}
          size={theme.size.iconSmall}
          color={value <= stars ? theme.colors.primary : theme.colors.onSurfaceVariant}
        />
      ))}
    </View>
  );
};
