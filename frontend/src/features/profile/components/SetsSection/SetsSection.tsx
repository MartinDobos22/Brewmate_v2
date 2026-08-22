import type { JSX } from 'react';

import { Button, Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { EquipmentSetList } from '../../../inventory/components';
import { ONBOARDING_STEPS } from '../../../onboarding/constants';
import { useOnboardingStepLink } from '../../../onboarding/hooks';

/** The saved combinations, and the way back to the screen that creates them. */
export const SetsSection = (): JSX.Element => {
  const { t } = useTranslation();
  const openStep = useOnboardingStepLink();

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.profileSetsTitle)}</Text>
      <EquipmentSetList />
      <Button
        label={t(TRANSLATION_KEYS.setupSetsAddAction)}
        variant="secondary"
        fullWidth
        onPress={(): void => {
          openStep(ONBOARDING_STEPS.sets);
        }}
      />
    </Card>
  );
};
