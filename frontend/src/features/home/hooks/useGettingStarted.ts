import { useBagEvaluations } from '../../bagEvaluations/hooks';
import { useBrewLogs } from '../../brewing/hooks';
import { useCoffeeBags } from '../../inventory/hooks';
import { CONFIDENCE_LEVELS } from '../../tasteProfile/constants';
import { useTasteProfile } from '../../tasteProfile/hooks';
import { resolveConfidenceLevel } from '../../tasteProfile/services';
import { useGettingStartedHidden, useHideGettingStarted } from '../../../stores';
import {
  countCompleted,
  readGettingStartedSteps,
  type GettingStartedStep,
} from '../services/readGettingStartedSteps';

const NOTHING = 0;
const FIRST_PAGE = { limit: 1 } as const;

export interface GettingStarted {
  readonly steps: readonly GettingStartedStep[];
  readonly completed: number;
  readonly total: number;
  /** False while anything is still loading, so the card cannot flash a wrong tick. */
  readonly isReady: boolean;
  readonly isVisible: boolean;
  readonly hide: () => void;
}

/**
 * How far the first three steps have got.
 *
 * Each one asks the account rather than a stored checklist, and every query is
 * a single row: the card only needs to know whether there is anything at all.
 *
 * The card disappears on its own once all three are done, and can be dismissed
 * before that. Somebody who wants to use the app their own way is not somebody
 * to keep a checklist in front of.
 */
export const useGettingStarted = (): GettingStarted => {
  const profile = useTasteProfile();
  const bags = useCoffeeBags(FIRST_PAGE);
  const evaluations = useBagEvaluations(FIRST_PAGE);
  const brews = useBrewLogs(FIRST_PAGE);
  const isHidden = useGettingStartedHidden();
  const hide = useHideGettingStarted();

  const knowsTaste =
    profile.data !== undefined &&
    resolveConfidenceLevel(profile.data.confidenceLevel) !== CONFIDENCE_LEVELS.none;
  const hasCoffee =
    (bags.data?.items.length ?? NOTHING) > NOTHING ||
    (evaluations.data?.items.length ?? NOTHING) > NOTHING;
  const hasBrewed =
    (brews.data?.items.length ?? NOTHING) > NOTHING ||
    (profile.data?.brewCount ?? NOTHING) > NOTHING;

  const steps = readGettingStartedSteps({ knowsTaste, hasCoffee, hasBrewed });
  const completed = countCompleted(steps);
  const isReady = profile.isSuccess && bags.isSuccess && evaluations.isSuccess && brews.isSuccess;

  return {
    steps,
    completed,
    hide,
    isReady,
    total: steps.length,
    isVisible: isReady && !isHidden && completed < steps.length,
  };
};
