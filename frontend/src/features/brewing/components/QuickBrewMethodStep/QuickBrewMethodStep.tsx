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
import { BREW_METHOD_CATEGORY_ICONS, BREW_METHOD_CATEGORY_LABEL_KEYS } from '../../constants';
import type { QuickBrew } from '../../hooks/useQuickBrew';

import { createQuickBrewMethodStepStyles } from './QuickBrewMethodStep.styles';

const NOTHING = 0;

export interface QuickBrewMethodStepProps {
  readonly brew: QuickBrew;
}

/**
 * The one thing Brewmate genuinely needs to know before it can say anything.
 *
 * The same cards as the brewing tab, with the same glyph per family - this is
 * the same decision asked in a shorter flow, and asking it twice in two visual
 * languages would make them look like two different questions.
 */
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
          note={t(BREW_METHOD_CATEGORY_LABEL_KEYS[method.category])}
          icon={BREW_METHOD_CATEGORY_ICONS[method.category]}
          onPress={(): void => {
            brew.selectMethod(method);
          }}
        />
      ))}
    </View>
  );
};
