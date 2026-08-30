import { QUICK_BREW_STAGES, type QuickBrewStage } from '../constants/quickBrew';

const NOT_FOUND = -1;
const NONE = 0;

export interface QuickBrewSteps {
  readonly current: number;
  readonly total: number;
}

/**
 * The three questions a quick brew asks, and which one is open.
 *
 * The recipe itself is the flow's answer rather than a step in it, and the
 * cupboard offer that follows is an aside somebody may ignore - counting
 * either would tell people they were two steps from the end when they had
 * already got what they came for.
 */
const STAGES: readonly QuickBrewStage[] = [QUICK_BREW_STAGES.method, QUICK_BREW_STAGES.coffee];

export const resolveQuickBrewSteps = (stage: QuickBrewStage): QuickBrewSteps => {
  const index = STAGES.indexOf(stage);

  return {
    current: index === NOT_FOUND ? NONE : index + 1,
    total: STAGES.length,
  };
};
