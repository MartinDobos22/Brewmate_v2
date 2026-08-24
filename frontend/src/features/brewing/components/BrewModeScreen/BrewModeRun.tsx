import type { Recipe } from '@brewmate/shared';
import { useEffect, type JSX } from 'react';

import { BREW_RUN_STATES } from '../../constants';
import { useBrewRun } from '../../hooks/useBrewRun';
import { useSubmitBrewLog } from '../../hooks/useSubmitBrewLog';
import { buildBrewLog } from '../../services/buildBrewLog';
import { BrewDonePanel } from '../BrewDonePanel';

import { BrewModeRunning } from './BrewModeRunning';

export interface BrewModeRunProps {
  readonly recipe: Recipe;
  readonly equipmentSetId: string | null;
}

/**
 * The brew, and the record it leaves behind.
 *
 * The log is written the moment the brew finishes rather than when somebody
 * gets to the chat, because those are different moments and the second one is
 * optional. A cup that was made is a fact whether or not anybody wants to talk
 * about it, and it is the most valuable history this app has.
 */
export const BrewModeRun = ({ recipe, equipmentSetId }: BrewModeRunProps): JSX.Element => {
  const run = useBrewRun(recipe.params);
  const submission = useSubmitBrewLog();
  const isDone = run.state === BREW_RUN_STATES.done;
  const { submit } = submission;

  useEffect((): void => {
    if (!isDone) {
      return;
    }

    submit(
      buildBrewLog({
        recipeId: recipe.id,
        params: recipe.params,
        equipmentSetId,
        durationSeconds: run.elapsedSeconds,
      }),
    );
    // Written once, when the brew ends. The elapsed time is read at that
    // moment rather than watched, or every redraw would log another cup.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDone]);

  if (isDone) {
    return (
      <BrewDonePanel
        recipeId={recipe.id}
        brewLog={submission.brewLog}
        isQueued={submission.isQueued}
        isPending={submission.isPending}
      />
    );
  }

  return <BrewModeRunning run={run} params={recipe.params} />;
};
