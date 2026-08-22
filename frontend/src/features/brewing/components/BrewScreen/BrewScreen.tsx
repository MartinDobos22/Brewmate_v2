import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { EmptyState } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { EquipmentSetSwitcher } from '../../../inventory/components';
import { AvailableMethodList } from '../AvailableMethodList';

/**
 * The screen before a brew.
 *
 * Two questions get answered here before anything else: where the user is
 * standing, and what they can make there. The set switch is one tap because
 * it changes every time somebody brews somewhere other than home.
 */
export const BrewScreen = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Screen scrollable>
      <EquipmentSetSwitcher />
      <AvailableMethodList />
      <EmptyState
        title={t(TRANSLATION_KEYS.brewEmptyTitle)}
        description={t(TRANSLATION_KEYS.brewEmptyBody)}
      />
    </Screen>
  );
};
