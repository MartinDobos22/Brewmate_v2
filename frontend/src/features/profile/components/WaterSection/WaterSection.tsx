import { WATER_TYPES, type WaterType } from '@brewmate/shared';
import type { JSX } from 'react';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useCurrentUser } from '../../../auth';
import { WaterTypePicker } from '../../../inventory/components';
import { useUpdateCurrentUser } from '../../hooks';

/**
 * The account-wide water.
 *
 * Edited in place rather than behind a link: it is one tap out of five, it
 * changes when somebody buys a filter jug, and burying it would mean the app
 * keeps advising against water the user no longer uses.
 */
export const WaterSection = (): JSX.Element => {
  const { t } = useTranslation();
  const { data: user } = useCurrentUser();
  const update = useUpdateCurrentUser();

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.profileWaterTitle)}</Text>
      <WaterTypePicker
        selected={user?.waterType ?? WATER_TYPES.unknown}
        disabled={update.isPending}
        onSelect={(waterType: WaterType): void => {
          update.mutate({ waterType });
        }}
      />
    </Card>
  );
};
