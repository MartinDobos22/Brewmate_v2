import { IMPORT_STAGES, type ImportStage } from '../constants';

const NOT_FOUND = -1;
const NONE = 0;

export interface ImportSteps {
  readonly current: number;
  readonly total: number;
}

/**
 * The three questions an import asks, and which one is open.
 *
 * The result is the flow's answer rather than a step in it - a converted
 * recipe is what somebody came for, and numbering it would tell them they were
 * one step from the end at the moment they already had it.
 */
const STAGES: readonly ImportStage[] = [
  IMPORT_STAGES.source,
  IMPORT_STAGES.review,
  IMPORT_STAGES.target,
];

export const resolveImportSteps = (stage: ImportStage): ImportSteps => {
  const index = STAGES.indexOf(stage);

  return {
    current: index === NOT_FOUND ? NONE : index + 1,
    total: STAGES.length,
  };
};
