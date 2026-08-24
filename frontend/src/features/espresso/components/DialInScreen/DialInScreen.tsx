import type { BrewMethod } from '@brewmate/shared';
import { useLocalSearchParams } from 'expo-router';
import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { QueryState, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { BREW_MODE_PARAMS, readRouteParam } from '../../../brewing/components/BrewModeScreen';
import { useBrewMethods } from '../../../brewing/hooks';
import { useDialInSession } from '../../hooks';

import { DialInBody } from './DialInBody';

/**
 * A new coffee on a lever machine, dialled in over as few shots as possible.
 *
 * A separate mode rather than the general chat, because the shape of the
 * conversation is different: the question is always the same three numbers and
 * a taste, and the answer is always exactly one change. Everything on this
 * screen is a narrowing of the recipe chat towards converging quickly, because
 * every attempt costs a dose out of a bag somebody has just paid for.
 */
export const DialInScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const session = useDialInSession(readRouteParam(params[BREW_MODE_PARAMS.recipeId]));
  const methods = useBrewMethods();
  const method = methods.data?.items.find(
    (item: BrewMethod): boolean => item.id === session.recipe?.methodId,
  );

  return (
    <Screen scrollable>
      <Text variant="headlineSmall">{t(TRANSLATION_KEYS.dialInTitle)}</Text>
      <Text variant="bodyMedium" tone="muted">
        {t(TRANSLATION_KEYS.dialInIntro)}
      </Text>
      <QueryState
        isPending={session.isLoading}
        isError={session.isError}
        error={session.error}
        onRetry={session.retry}
      />
      <DialInBody session={session} method={method} />
    </Screen>
  );
};
