import type { BrewParams } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatDuration } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';
import { BREW_RUN_STATES } from '../../constants';
import type { BrewRun } from '../../hooks/useBrewRun';
import { resolveTargetRemaining } from '../../services/resolveBrewTimeline';
import { BrewControls } from '../BrewControls';
import { BrewStepPanel } from '../BrewStepPanel';
import { BrewTimerDisplay } from '../BrewTimerDisplay';

import { BrewRecipeFacts } from './BrewRecipeFacts';
import { createBrewModeScreenStyles } from './BrewModeScreen.styles';

export interface BrewModeRunningProps {
  readonly run: BrewRun;
  readonly params: BrewParams;
}

const NOTHING = 0;

/**
 * The brew, in progress.
 *
 * Before it starts the screen is the setup - grind, temperature, dose - which
 * is what somebody reads while they weigh out. From the moment they press
 * start it becomes the step and the countdown, because for the next three
 * minutes nothing else on this screen is worth a glance.
 *
 * A method with no pour schedule gets the same screen without the step panel:
 * a stopwatch against a target time, which is exactly what an espresso, a
 * French press or a cold brew needs.
 */
export const BrewModeRunning = ({ run, params }: BrewModeRunningProps): JSX.Element => {
  const styles = useThemedStyles(createBrewModeScreenStyles);
  const { t } = useTranslation();
  const isReady = run.state === BREW_RUN_STATES.ready;
  const hasSchedule = run.timeline.length > NOTHING;

  return (
    <View style={styles.wrapper}>
      {isReady ? (
        <View style={styles.intro}>
          <Text variant="headlineSmall">
            {t(
              hasSchedule
                ? TRANSLATION_KEYS.brewModeReadyTitle
                : TRANSLATION_KEYS.brewModeSimpleTitle,
            )}
          </Text>
          <Text variant="bodyMedium" tone="muted">
            {t(
              hasSchedule
                ? TRANSLATION_KEYS.brewModeReadyBody
                : TRANSLATION_KEYS.brewModeSimpleBody,
            )}
          </Text>
          <BrewRecipeFacts params={params} />
        </View>
      ) : null}
      {!isReady && hasSchedule && run.current !== undefined ? (
        <BrewStepPanel
          current={run.current}
          stepNumber={run.stepNumber}
          total={run.timeline.length}
          next={run.timeline[run.stepNumber]}
        />
      ) : null}
      {isReady ? null : (
        <BrewTimerDisplay
          remainingSeconds={
            hasSchedule ? run.remainingSeconds : resolveTargetRemaining(params, run.elapsedSeconds)
          }
          elapsedSeconds={run.elapsedSeconds}
        />
      )}
      {!isReady && !hasSchedule ? (
        <Text variant="bodyMedium" tone="muted" align="center">
          {params.totalTimeSeconds === null || params.totalTimeSeconds === undefined
            ? t(TRANSLATION_KEYS.brewModeNoTargetTime)
            : t(TRANSLATION_KEYS.brewModeTargetTime, {
                time: formatDuration(params.totalTimeSeconds),
              })}
        </Text>
      ) : null}
      <BrewControls
        state={run.state}
        isLastStep={run.isLastStep}
        onStart={run.start}
        onPause={run.pause}
        onResume={run.resume}
        onSkip={run.skip}
        onRestart={run.restart}
      />
    </View>
  );
};
