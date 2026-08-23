import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { Button, Card, QueryState, Text } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useBrewLogs } from '../../../brewing/hooks';

import { BrewHistoryPreview } from './BrewHistoryPreview';

const NOTHING = 0;
const FIRST_PAGE = { limit: 1 } as const;

/**
 * The brewing history, or what it will be.
 *
 * Until there is a cup behind it this card describes itself instead of drawing
 * an empty chart - and it says once why the trouble is worth taking, because
 * "opíš mi kávu" is a favour the user does the app, and a favour deserves a
 * reason.
 */
export const BrewHistoryCard = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const brews = useBrewLogs(FIRST_PAGE);
  const total = brews.data?.items.length ?? NOTHING;

  return (
    <Card>
      <Text variant="titleMedium">
        {t(
          total === NOTHING
            ? TRANSLATION_KEYS.brewHistoryEmptyTitle
            : TRANSLATION_KEYS.brewHistoryTitle,
        )}
      </Text>
      <QueryState
        isPending={brews.isPending}
        isError={brews.isError}
        error={brews.error}
        onRetry={(): void => {
          void brews.refetch();
        }}
      />
      {brews.isSuccess && total === NOTHING ? <BrewHistoryPreview /> : null}
      {brews.isSuccess && total > NOTHING ? (
        <>
          <Text variant="bodySmall" tone="muted">
            {t(TRANSLATION_KEYS.brewHistoryHasBrewsBody)}
          </Text>
          <Button
            label={t(TRANSLATION_KEYS.brewHistoryOpenAction)}
            variant="secondary"
            fullWidth
            onPress={(): void => {
              router.push(ROUTES.quickBrew);
            }}
          />
        </>
      ) : null}
    </Card>
  );
};
