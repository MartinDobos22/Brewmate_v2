import type { JSX } from 'react';
import { View } from 'react-native';

import { FlowHeader, HEADER_SCREEN_EDGES, Screen } from '../../../../components/layout';
import { StepProgress } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { QUICK_BREW_ICONS } from '../../constants';
import { useQuickBrew } from '../../hooks/useQuickBrew';
import { resolveQuickBrewSteps } from '../../services';

import { QuickBrewStageContent } from './QuickBrewStageContent';
import { createQuickBrewScreenStyles } from './QuickBrewScreen.styles';

/**
 * Brewing without an inventory.
 *
 * The screen exists because the alternative is an app that asks somebody to
 * fill in a database before it will help them make a cup of coffee - and the
 * cup is the reason they installed it. The recipe it ends on is stored with no
 * bag behind it, which is a perfectly ordinary state for a recipe to be in.
 *
 * It is led by the block the other two staged flows are, carrying the same
 * bolt as the round button on the home screen that sends people here. What it
 * promises stays on screen through all four stages, because the promise is
 * the reason somebody chose this over the brewing tab.
 */
export const QuickBrewScreen = (): JSX.Element => {
  const styles = useThemedStyles(createQuickBrewScreenStyles);
  const { t } = useTranslation();
  const brew = useQuickBrew();
  const steps = resolveQuickBrewSteps(brew.stage);

  return (
    <Screen scrollable padded={false} edges={HEADER_SCREEN_EDGES}>
      <FlowHeader
        icon={QUICK_BREW_ICONS.flow}
        title={t(TRANSLATION_KEYS.quickBrewTitle)}
        body={t(TRANSLATION_KEYS.quickBrewIntro)}
      />
      <View style={styles.content}>
        <StepProgress current={steps.current} total={steps.total} />
        <QuickBrewStageContent brew={brew} />
      </View>
    </Screen>
  );
};
