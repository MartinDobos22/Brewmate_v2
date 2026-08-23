import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, Text } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';

import { createBrewHistoryCardStyles } from './BrewHistoryCard.styles';

/**
 * What this card will hold once there is a first brew behind it.
 *
 * An empty chart is a promise nobody can read. Three lines of "toto tu bude"
 * and one sentence about why it is worth the trouble say the same thing in a
 * way somebody can act on.
 */
export const BrewHistoryPreview = (): JSX.Element => {
  const styles = useThemedStyles(createBrewHistoryCardStyles);
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.brewHistoryEmptyBody)}
      </Text>
      <View style={styles.points}>
        <Text variant="bodySmall">{t(TRANSLATION_KEYS.brewHistoryEmptyPointRecipe)}</Text>
        <Text variant="bodySmall">{t(TRANSLATION_KEYS.brewHistoryEmptyPointWords)}</Text>
        <Text variant="bodySmall">{t(TRANSLATION_KEYS.brewHistoryEmptyPointChange)}</Text>
      </View>
      <View style={styles.why}>
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.brewHistoryEmptyWhy)}
        </Text>
      </View>
      <Button
        label={t(TRANSLATION_KEYS.brewHistoryEmptyAction)}
        variant="secondary"
        fullWidth
        onPress={(): void => {
          router.push(ROUTES.quickBrew);
        }}
      />
    </>
  );
};
