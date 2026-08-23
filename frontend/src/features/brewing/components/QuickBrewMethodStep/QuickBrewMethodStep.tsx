import type { BrewMethod } from '@brewmate/shared';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { EmptyState, OptionCard, QueryState, Text } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { ONBOARDING_STEPS } from '../../../onboarding/constants';
import { useOnboardingStepLink } from '../../../onboarding/hooks';
import type { QuickBrew } from '../../hooks/useQuickBrew';

import { createQuickBrewMethodStepStyles } from './QuickBrewMethodStep.styles';

const NOTHING = 0;

export interface QuickBrewMethodStepProps {
  readonly brew: QuickBrew;
}

/** The one thing Brewmate genuinely needs to know before it can say anything. */
export const QuickBrewMethodStep = ({ brew }: QuickBrewMethodStepProps): JSX.Element => {
  const styles = useThemedStyles(createQuickBrewMethodStepStyles);
  const { t } = useTranslation();
  const router = useRouter();
  const openStep = useOnboardingStepLink();

  if (brew.isLoading || brew.isError) {
    return (
      <QueryState
        isPending={brew.isLoading}
        isError={brew.isError}
        error={brew.error}
        onRetry={brew.retry}
      />
    );
  }

  if (brew.methods.length === NOTHING) {
    return (
      <EmptyState
        title={t(TRANSLATION_KEYS.quickBrewMethodEmptyTitle)}
        description={t(TRANSLATION_KEYS.quickBrewMethodEmptyBody)}
        actions={[
          {
            label: t(TRANSLATION_KEYS.quickBrewMethodEmptyAction),
            variant: 'primary',
            onPress: (): void => {
              openStep(ONBOARDING_STEPS.brewers);
            },
          },
          {
            label: t(TRANSLATION_KEYS.actionBack),
            onPress: (): void => {
              router.replace(ROUTES.home);
            },
          },
        ]}
      />
    );
  }

  return (
    <View style={styles.options}>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.quickBrewMethodTitle)}</Text>
      {brew.methods.map((method: BrewMethod): JSX.Element => (
        <OptionCard
          key={method.id}
          label={method.nameSk}
          onPress={(): void => {
            brew.selectMethod(method);
          }}
        />
      ))}
    </View>
  );
};
