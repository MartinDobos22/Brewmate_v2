import type { MethodHabit } from '@brewmate/shared';

import {
  PROMPT_BULLET,
  PROMPT_LABEL_SEPARATOR,
  PROMPT_LINE_SEPARATOR,
} from '../constants/promptFormatting.js';

const EMPTY = '';

/**
 * What this person's own cups say about how they brew this method.
 *
 * Only the temperature, because it is the one habit the answer still has room
 * for: the dose and the water are fixed before the model is asked anything,
 * and the grind habit is already inside the starting point above, measured.
 * A temperature somebody keeps coming back to is the same kind of evidence -
 * where their kettle ends up after however many corrections - and a recipe
 * that ignored it would be proposing the number they have already moved away
 * from.
 *
 * Said as a habit rather than as a rule. The coffee in front of them may be a
 * reason to depart from it, and the rationale is where that gets said.
 *
 * @returns the section, or null when there is no habit to speak of - an empty
 * heading invites a model to reason about an absence.
 */
export const describeBrewingHabit = (habit: MethodHabit | null): string | null => {
  const temperature = habit?.waterTempC ?? null;

  if (habit === null || temperature === null) {
    return null;
  }

  return [
    `How this person actually brews with this method, read off ${String(habit.cupCount)} of their own cups:`,
    [
      PROMPT_BULLET,
      'Water temperature they settle at',
      PROMPT_LABEL_SEPARATOR,
      `${String(temperature)} °C. Where they can control the temperature today, start from it; if this coffee is a reason to depart from it, say so once in the rationale.`,
    ].join(EMPTY),
  ].join(PROMPT_LINE_SEPARATOR);
};
