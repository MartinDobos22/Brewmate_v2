import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { PillButton, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { PRE_BREW_COFFEE_ICONS } from '../../constants';

import { createPreBrewHeaderStyles } from './PreBrewHeader.styles';

export interface PreBrewNoCoffeeRowProps {
  readonly onPhotograph: () => void;
  readonly onSkip: () => void;
}

/**
 * The coffee slot with nothing in it, stated rather than enforced.
 *
 * The dashes say the slot is empty without the row becoming an error, and the
 * two buttons under it are an offer rather than a gate: photographing a bag is
 * the shorter road to a better recipe, and skipping still gets one. Nobody has
 * to fill in a database before they are allowed to make coffee.
 */
export const PreBrewNoCoffeeRow = ({
  onPhotograph,
  onSkip,
}: PreBrewNoCoffeeRowProps): JSX.Element => {
  const styles = useThemedStyles(createPreBrewHeaderStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <View style={[styles.row, styles.dashed]}>
        <View style={[styles.badge, styles.badgeEmpty]}>
          <MaterialCommunityIcons
            name={PRE_BREW_COFFEE_ICONS.unknown}
            size={theme.size.iconMedium}
            color={theme.colors.onEspressoVariant}
          />
        </View>
        <View style={styles.body}>
          <Text variant="cardTitle" tone="onEspresso">
            {t(TRANSLATION_KEYS.preBrewSourceEmptyTitle)}
          </Text>
          <Text variant="caption" tone="onEspressoMuted">
            {t(TRANSLATION_KEYS.preBrewSourceEmptyBody)}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <PillButton
          tone="cream"
          size="small"
          grows
          icon={PRE_BREW_COFFEE_ICONS.photo}
          label={t(TRANSLATION_KEYS.preBrewSourcePhoto)}
          onPress={onPhotograph}
        />
        <PillButton
          tone="lifted"
          size="small"
          label={t(TRANSLATION_KEYS.actionSkip)}
          onPress={onSkip}
        />
      </View>
    </>
  );
};
