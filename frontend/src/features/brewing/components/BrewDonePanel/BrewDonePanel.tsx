import type { BrewLog } from '@brewmate/shared';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, PillButton, SectionHeading, Text } from '../../../../components/ui';
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
 *
 * It carries brew mode's own tones because it is drawn on brew mode's ground,
 * which is dark in both colour schemes: a heading taking its colour from the
 * active scheme would be invisible on half the phones this runs on.
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
      <Text variant="displayTitle" tone="onEspresso" align="center">
        {t(TRANSLATION_KEYS.brewModeDoneTitle)}
      </Text>
      <Text variant="bodyLead" tone="onEspressoMuted" align="center">
        {t(TRANSLATION_KEYS.brewModeDoneBody)}
      </Text>
      {isQueued ? (
        <Card>
          <SectionHeading
            title={t(TRANSLATION_KEYS.brewModeQueuedTitle)}
            caption={t(TRANSLATION_KEYS.brewModeQueuedBody)}
            placement="card"
          />
        </Card>
      ) : null}
      <PillButton
        tone="espresso"
        label={t(TRANSLATION_KEYS.brewModeDoneChat)}
        fullWidth
        isPending={isPending}
        onPress={(): void => {
          router.replace(buildRecipeChatRoute(recipeId, brewLog?.id));
        }}
      />
      <PillButton
        tone="surface"
        label={t(TRANSLATION_KEYS.brewModeDoneLater)}
        fullWidth
        onPress={(): void => {
          router.replace(ROUTES.home);
        }}
      />
    </View>
  );
};
