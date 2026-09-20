import type { BrewParams } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '../../../../theme';
import { BREW_RUN_STATES } from '../../constants';
import type { BrewRun } from '../../hooks/useBrewRun';
import { BrewControls } from '../BrewControls';
import { BrewNextStepPill } from '../BrewNextStepPill';
import { BrewStepPanel } from '../BrewStepPanel';
import { BrewStepProgress } from '../BrewStepProgress';
import { BrewWarmLight } from '../BrewWarmLight';

import { BrewModeActive } from './BrewModeActive';
import { BrewModeReady } from './BrewModeReady';
import { createBrewModeScreenStyles } from './BrewModeScreen.styles';

export interface BrewModeRunningProps {
  readonly run: BrewRun;
  readonly params: BrewParams;
}

const NOTHING = 0;

/**
 * The brew, in progress: three blocks and a ring between them.
 *
 * Where in the brew this is goes at the top, the pour goes in the middle, and
 * the controls sit against the bottom edge where a thumb already is. Nothing
 * scrolls and nothing moves between states - the middle button changes what it
 * does and never where it is, because looking at the phone to find a control
 * is exactly what this screen is designed to let somebody stop doing.
 *
 * Before it starts the screen is the setup - grind, temperature, dose - which
 * is what somebody reads while they weigh out. From the moment they press
 * start it becomes the step and the countdown, because for the next three
 * minutes nothing else on this screen is worth a glance.
 */
export const BrewModeRunning = ({ run, params }: BrewModeRunningProps): JSX.Element => {
  const styles = useThemedStyles(createBrewModeScreenStyles);
  const isReady = run.state === BREW_RUN_STATES.ready;
  const hasSchedule = run.timeline.length > NOTHING;
  const current = isReady || !hasSchedule ? undefined : run.current;
  const next = current === undefined ? undefined : run.timeline[run.stepNumber];

  return (
    <View style={styles.root}>
      <BrewWarmLight />
      <View style={styles.wrapper}>
        <View style={styles.block}>
          {current === undefined ? null : (
            <>
              <BrewStepProgress stepNumber={run.stepNumber} total={run.timeline.length} />
              <BrewStepPanel
                current={current}
                stepNumber={run.stepNumber}
                total={run.timeline.length}
              />
            </>
          )}
        </View>
        {isReady ? (
          <BrewModeReady params={params} hasSchedule={hasSchedule} />
        ) : (
          <BrewModeActive run={run} params={params} hasSchedule={hasSchedule} />
        )}
        <View style={styles.block}>
          {next === undefined ? null : <BrewNextStepPill label={next.step.label} />}
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
      </View>
    </View>
  );
};
