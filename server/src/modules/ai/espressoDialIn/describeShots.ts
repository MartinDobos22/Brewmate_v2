import {
  DIAL_IN_CHANGES,
  resolveShotTimeline,
  type ShotSource,
  type ShotTimelineEntry,
} from '@brewmate/shared';

import {
  PROMPT_BULLET,
  PROMPT_LABEL_SEPARATOR,
  PROMPT_LINE_SEPARATOR,
  PROMPT_LIST_SEPARATOR,
} from '../constants/promptFormatting.js';

const NOTHING = 0;
const EMPTY = '';
const NOT_RECORDED = 'not recorded';
const FIRST_SHOT = 'This is the first shot of this dial-in; there is nothing before it.';

const grams = (value: number | null): string =>
  value === null ? NOT_RECORDED : `${String(value)} g`;

const seconds = (value: number | null): string =>
  value === null ? NOT_RECORDED : `${String(value)} s`;

/** What moved before this shot, in the words the timeline already uses. */
const describeChange = (entry: ShotTimelineEntry): string => {
  if (entry.change === DIAL_IN_CHANGES.none) {
    return 'nothing was changed before this shot';
  }

  return `${entry.change} was moved ${entry.direction ?? EMPTY}`;
};

const describeShot = (entry: ShotTimelineEntry): string =>
  [
    PROMPT_BULLET,
    `Shot ${String(entry.shotNumber)}`,
    PROMPT_LABEL_SEPARATOR,
    [
      `${grams(entry.doseGrams)} in`,
      `${grams(entry.yieldGrams)} out`,
      seconds(entry.timeSeconds),
      entry.ratio === null ? NOT_RECORDED : `1:${String(entry.ratio)}`,
      `grind ${entry.grindSetting === null ? NOT_RECORDED : String(entry.grindSetting)}`,
      describeChange(entry),
      `relative to the target window this shot was ${entry.trend}`,
    ].join(PROMPT_LIST_SEPARATOR),
  ].join(EMPTY);

/**
 * Every shot of this dial-in, oldest first, with what changed between them.
 *
 * The run rather than the last shot, because the run is what the advice
 * actually depends on: a grind that has already gone finer twice without
 * moving the time is the case where the answer has to stop grinding and change
 * something else, and a model shown only the last shot proposes the third step
 * in a direction that is not working.
 *
 * Built through the same `resolveShotTimeline` the screen draws, so the chart
 * somebody is looking at and the history the answer reasons about cannot
 * disagree.
 */
export const describeShots = (shots: readonly ShotSource[]): string => {
  if (shots.length === NOTHING) {
    return FIRST_SHOT;
  }

  return [
    'Every shot of this dial-in so far, oldest first:',
    ...resolveShotTimeline(shots).map(describeShot),
  ].join(PROMPT_LINE_SEPARATOR);
};
