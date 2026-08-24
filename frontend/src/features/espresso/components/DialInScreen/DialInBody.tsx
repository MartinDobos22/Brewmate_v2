import type { BrewMethod } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { RecipeSummaryCard } from '../../../brewing/components';
import type { DialInSession } from '../../hooks';
import { ShotForm } from '../ShotForm';
import { ShotTimelineCard } from '../ShotTimelineCard';

import { DialInConversation } from './DialInConversation';
import { createDialInScreenStyles } from './DialInScreen.styles';

export interface DialInBodyProps {
  readonly session: DialInSession;
  /** The method the recipe is brewed on, for the card at the top. */
  readonly method: BrewMethod | undefined;
}

const NOTHING = 0;
const NO_NOTES: readonly string[] = [];

/**
 * The dial-in, top to bottom: where the numbers stand, how the run has gone,
 * what has been said, and the box for the next shot.
 *
 * The form is last because it is what somebody comes back to between shots -
 * everything above it is what they read once and then scroll past.
 */
export const DialInBody = ({ session, method }: DialInBodyProps): JSX.Element | null => {
  const styles = useThemedStyles(createDialInScreenStyles);
  const { t } = useTranslation();
  const recipe = session.recipe;

  if (recipe === undefined || method === undefined) {
    return null;
  }

  return (
    <View style={styles.body}>
      <RecipeSummaryCard
        title={t(TRANSLATION_KEYS.dialInTitle)}
        method={method}
        params={recipe.params}
        notes={NO_NOTES}
      />
      <ShotTimelineCard timeline={session.timeline} />
      {session.messages.length === NOTHING ? (
        <Text variant="bodyMedium" tone="muted">
          {t(TRANSLATION_KEYS.dialInOpening)}
        </Text>
      ) : (
        <DialInConversation session={session} />
      )}
      <ShotForm session={session} />
      <View style={styles.finish}>
        {session.isFinished ? (
          <Text variant="bodySmall" tone="secondary">
            {t(TRANSLATION_KEYS.dialInFinished)}
          </Text>
        ) : (
          <Button
            label={t(
              session.isFinishing
                ? TRANSLATION_KEYS.dialInFinishing
                : TRANSLATION_KEYS.dialInFinish,
            )}
            variant="secondary"
            fullWidth
            loading={session.isFinishing}
            onPress={session.finish}
          />
        )}
      </View>
    </View>
  );
};
