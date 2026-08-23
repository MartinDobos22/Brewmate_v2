import {
  GETTING_STARTED_ORDER,
  GETTING_STARTED_STEPS,
  type GettingStartedStepId,
} from '../constants/gettingStarted';

export interface GettingStartedEvidence {
  /** The questionnaire was answered, whenever and however. */
  readonly knowsTaste: boolean;
  /** A bag was written down, or one was weighed up in a shop. */
  readonly hasCoffee: boolean;
  /** A cup was actually brewed and described. */
  readonly hasBrewed: boolean;
}

export interface GettingStartedStep {
  readonly id: GettingStartedStepId;
  readonly isDone: boolean;
}

const isDone = (id: GettingStartedStepId, evidence: GettingStartedEvidence): boolean => {
  if (id === GETTING_STARTED_STEPS.taste) {
    return evidence.knowsTaste;
  }

  return id === GETTING_STARTED_STEPS.coffee ? evidence.hasCoffee : evidence.hasBrewed;
};

/**
 * Which of the three are behind the user.
 *
 * Read from what the account actually contains rather than from a checklist
 * kept alongside it: somebody who answered the questionnaire from the profile
 * screen, or added a bag in a shop, has done the step whatever route they took
 * to it. A tick that can disagree with the data is worse than no tick.
 */
export const readGettingStartedSteps = (
  evidence: GettingStartedEvidence,
): readonly GettingStartedStep[] =>
  GETTING_STARTED_ORDER.map((id: GettingStartedStepId): GettingStartedStep => ({
    id,
    isDone: isDone(id, evidence),
  }));

export const countCompleted = (steps: readonly GettingStartedStep[]): number =>
  steps.filter((step: GettingStartedStep): boolean => step.isDone).length;
