import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { Button, Card, Text } from '../../../../components/ui';
import { APP_CONFIG } from '../../../../constants/config';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { AccountCard } from '../../../auth';
import { AppearancePicker } from '../AppearancePicker';
import { EquipmentSection } from '../EquipmentSection';
import { SetsSection } from '../SetsSection';
import { TasteProfileSection } from '../TasteProfileSection';
import { WaterSection } from '../WaterSection';

/**
 * Everything the app believes about this person, and every way to change it:
 * the taste profile and its two correction routes, the cupboard, the water,
 * the saved sets - and, at the bottom, the two ways out of the product.
 */
export const ProfileScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Screen scrollable>
      <TasteProfileSection />
      <EquipmentSection />
      <WaterSection />
      <SetsSection />
      {/*
        Two screens that are about the account rather than about a coffee: what
        its history adds up to, and what its model calls have cost. They live
        behind the profile because both are read occasionally and deliberately,
        not on the way to making a cup.
      */}
      <Card>
        <Text variant="titleMedium">{t(TRANSLATION_KEYS.insightsTitle)}</Text>
        <Button
          label={t(TRANSLATION_KEYS.insightsOpenAction)}
          variant="secondary"
          fullWidth
          onPress={(): void => {
            router.push(ROUTES.insights);
          }}
        />
        <Button
          label={t(TRANSLATION_KEYS.aiCostsOpenAction)}
          variant="tertiary"
          fullWidth
          onPress={(): void => {
            router.push(ROUTES.aiCosts);
          }}
        />
      </Card>
      <Card>
        <Text variant="titleMedium">{t(TRANSLATION_KEYS.profileAppearanceTitle)}</Text>
        <AppearancePicker />
      </Card>
      <AccountCard />
      {APP_CONFIG.designSystemScreenEnabled ? (
        <Card>
          <Text variant="titleMedium">{t(TRANSLATION_KEYS.profileDeveloperTitle)}</Text>
          <Button
            label={t(TRANSLATION_KEYS.profileOpenDesignSystem)}
            variant="tertiary"
            onPress={(): void => {
              router.push(ROUTES.designSystem);
            }}
          />
        </Card>
      ) : null}
    </Screen>
  );
};
