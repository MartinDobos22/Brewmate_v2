import type { BrewParams } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatDuration } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';
import { BREW_RUN_STATES } from '../../constants';
import type { BrewRun } from '../../hooks/useBrewRun';
import { resolveTargetProgress, resolveTargetRemaining } from '../../services/resolveBrewTimeline';
import { BrewPourRing } from '../BrewPourRing';
import { BrewScaleChip } from '../BrewScaleChip';
import { BrewTimerDisplay } from '../BrewTimerDisplay';

import { createBrewModeScreenStyles } from './BrewModeScreen.styles';

export interface BrewModeActiveProps {
  readonly run: BrewRun;
  readonly params: BrewParams;
  readonly hasSchedule: boolean;
}

/**
 * The pour, drawn round its own countdown.
 *
 * A method with no schedule gets the same ring against its target time, which
 * is all an espresso, a French press or a cold brew needs - and no ring at all
 * where the recipe named no target, because there is then nothing for an arc
 * to be a share of.
 */
export const BrewModeActive = ({ run, params, hasSchedule }: BrewModeActiveProps): JSX.Element => {
  const styles = useThemedStyles(createBrewModeScreenStyles);
  const { t } = useTranslation();
  const isRunning = run.state === BREW_RUN_STATES.running;
  const targetGrams = hasSchedule ? (run.current?.step.waterGrams ?? null) : null;
  const targetTime = params.totalTimeSeconds ?? null;

  return (
    <View style={styles.middle}>
      <BrewPourRing
        isRunning={isRunning}
        progress={
          hasSchedule ? run.stepProgress : resolveTargetProgress(params, run.elapsedSeconds)
        }
      >
        <BrewTimerDisplay
          elapsedSeconds={run.elapsedSeconds}
          remainingSeconds={
            hasSchedule ? run.remainingSeconds : resolveTargetRemaining(params, run.elapsedSeconds)
          }
        />
        {targetGrams === null ? null : (
          <BrewScaleChip targetGrams={targetGrams} isRunning={isRunning} />
        )}
      </BrewPourRing>
      {hasSchedule ? null : (
        <Text variant="bodyMuted" tone="onEspressoMuted" align="center">
          {targetTime === null
            ? t(TRANSLATION_KEYS.brewModeNoTargetTime)
            : t(TRANSLATION_KEYS.brewModeTargetTime, { time: formatDuration(targetTime) })}
        </Text>
      )}
    </View>
  );
};
