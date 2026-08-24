import type { BrewLog } from '@brewmate/shared';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, Card, Text } from '../../../../components/ui';
import { ROUTES, buildRecipeChatRoute } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';

import { createBrewDonePanelStyles } from './BrewDonePanel.styles';

export interface BrewDonePanelProps {
  readonly recipeId: string;
  readonly brewLog: BrewLog | null;
  readonly isQueued: boolean;
  readonly isPending: boolean;
}

/**
 * The cup is made; now the part the product actually learns from.
 *
 * The chat is offered rather than opened, and it is offered with a reason -
 * "práve z toho sa učím najviac" - because telling an app how a coffee tasted
 * is a favour the drinker does it, and a favour deserves an explanation.
 *
 * A brew that could not be sent says so plainly and still leads onwards. The
 * conversation needs a stored cup to be about, so where there is none the
 * screen offers the way home instead of a button that would fail.
 */
export const BrewDonePanel = ({
  recipeId,
  brewLog,
  isQueued,
  isPending,
}: BrewDonePanelProps): JSX.Element => {
  const styles = useThemedStyles(createBrewDonePanelStyles);
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <Text variant="headlineMedium" align="center">
        {t(TRANSLATION_KEYS.brewModeDoneTitle)}
      </Text>
      <Text variant="bodyLarge" tone="muted" align="center">
        {t(TRANSLATION_KEYS.brewModeDoneBody)}
      </Text>
      {isQueued ? (
        <Card>
          <Text variant="titleMedium">{t(TRANSLATION_KEYS.brewModeQueuedTitle)}</Text>
          <Text variant="bodySmall" tone="muted">
            {t(TRANSLATION_KEYS.brewModeQueuedBody)}
          </Text>
        </Card>
      ) : null}
      <Button
        label={t(TRANSLATION_KEYS.brewModeDoneChat)}
        fullWidth
        loading={isPending}
        onPress={(): void => {
          router.replace(buildRecipeChatRoute(recipeId, brewLog?.id));
        }}
      />
      <Button
        label={t(TRANSLATION_KEYS.brewModeDoneLater)}
        variant="tertiary"
        fullWidth
        onPress={(): void => {
          router.replace(ROUTES.home);
        }}
      />
    </View>
  );
};
