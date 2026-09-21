import type { JSX } from 'react';
import { View } from 'react-native';

import { PillButton, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { HOME_TILE_ICONS } from '../../constants';
import { useOpenGettingStartedStep, type GettingStarted } from '../../hooks';
import type { GettingStartedStep } from '../../services';

import { createHomeStartBlockStyles } from './HomeStartBlock.styles';
import { StartProgress } from './StartProgress';
import { StartStepRow } from './StartStepRow';

const FIRST = 0;

export interface HomeStartBlockProps {
  readonly gettingStarted: GettingStarted;
}

/**
 * The first three things worth doing, on the home screen of an account that
 * has not done any of them.
 *
 * Only what is left is listed. The count above says how many are behind them,
 * so a row that has been done would be repeating that while taking the space
 * of one that has not - and a checklist of ticks is a screen congratulating
 * itself rather than offering anything.
 *
 * The lead action opens whichever step is next, because "Poďme na to" has to
 * mean something specific: a button that only scrolled somebody to a list
 * they can already see would be a button that does nothing.
 */
export const HomeStartBlock = ({ gettingStarted }: HomeStartBlockProps): JSX.Element => {
  const styles = useThemedStyles(createHomeStartBlockStyles);
  const { t } = useTranslation();
  const open = useOpenGettingStartedStep();

  const remaining = gettingStarted.steps.filter(
    (step: GettingStartedStep): boolean => !step.isDone,
  );
  const next = remaining[FIRST];

  return (
    <View style={styles.block}>
      <StartProgress completed={gettingStarted.completed} total={gettingStarted.total} />
      <Text variant="bodyLead" tone="onEspresso">
        {t(TRANSLATION_KEYS.homeStartBody)}
      </Text>
      <View style={styles.rows}>
        {remaining.map((step: GettingStartedStep): JSX.Element => (
          <StartStepRow key={step.id} step={step} />
        ))}
      </View>
      <View style={styles.row}>
        <PillButton
          tone="cream"
          size="large"
          grows
          raised
          icon={HOME_TILE_ICONS.go}
          label={t(TRANSLATION_KEYS.homeStartBegin)}
          onPress={(): void => {
            if (next !== undefined) {
              open(next.id);
            }
          }}
        />
        <PillButton
          tone="lifted"
          size="large"
          label={t(TRANSLATION_KEYS.homeStartHideShort)}
          onPress={gettingStarted.hide}
        />
      </View>
    </View>
  );
};
