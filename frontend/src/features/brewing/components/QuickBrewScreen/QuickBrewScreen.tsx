import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { StepProgress, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { QUICK_BREW_STAGES } from '../../constants/quickBrew';
import { useQuickBrew } from '../../hooks/useQuickBrew';
import { resolveQuickBrewSteps } from '../../services';

import { QuickBrewStageContent } from './QuickBrewStageContent';

/**
 * Brewing without an inventory.
 *
 * The screen exists because the alternative is an app that asks somebody to
 * fill in a database before it will help them make a cup of coffee - and the
 * cup is the reason they installed it. The recipe it ends on is stored with no
 * bag behind it, which is a perfectly ordinary state for a recipe to be in.
 */
export const QuickBrewScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const brew = useQuickBrew();
  const steps = resolveQuickBrewSteps(brew.stage);

  return (
    <Screen scrollable>
      <Text variant="headlineSmall">{t(TRANSLATION_KEYS.quickBrewTitle)}</Text>
      <StepProgress current={steps.current} total={steps.total} />
      {brew.stage === QUICK_BREW_STAGES.method ? (
        <Text variant="bodyMedium" tone="muted">
          {t(TRANSLATION_KEYS.quickBrewIntro)}
        </Text>
      ) : null}
      <QuickBrewStageContent brew={brew} />
    </Screen>
  );
};
