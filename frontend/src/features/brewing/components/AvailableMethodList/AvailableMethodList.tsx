import type { BrewMethod } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, Card, LoadingState, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useAvailableBrewMethods } from '../../../inventory/hooks';
import { ONBOARDING_STEPS } from '../../../onboarding/constants';
import { useOnboardingStepLink } from '../../../onboarding/hooks';

import { createAvailableMethodListStyles } from './AvailableMethodList.styles';

const NOTHING = 0;

/**
 * The methods this user can actually brew.
 *
 * Nothing else is listed. A suggestion for equipment somebody does not own is
 * not advice, and an empty list here is an honest answer with a way to fix it
 * rather than a wall of methods they would have to buy their way into.
 */
export const AvailableMethodList = (): JSX.Element => {
  const styles = useThemedStyles(createAvailableMethodListStyles);
  const { t } = useTranslation();
  const available = useAvailableBrewMethods();
  const openStep = useOnboardingStepLink();

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.brewAvailableTitle)}</Text>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.brewAvailableBody)}
      </Text>
      {available.isLoading ? <LoadingState label={t(TRANSLATION_KEYS.stateLoading)} /> : null}
      {!available.isLoading && available.methods.length === NOTHING ? (
        <>
          <Text variant="bodyMedium" tone="muted">
            {t(TRANSLATION_KEYS.brewAvailableEmpty)}
          </Text>
          <Button
            label={t(TRANSLATION_KEYS.brewAvailableAction)}
            variant="secondary"
            fullWidth
            onPress={(): void => {
              openStep(ONBOARDING_STEPS.brewers);
            }}
          />
        </>
      ) : null}
      <View style={styles.row}>
        {available.methods.map((method: BrewMethod): JSX.Element => (
          <Text key={method.id} variant="bodyMedium">
            {method.nameSk}
          </Text>
        ))}
      </View>
    </Card>
  );
};
