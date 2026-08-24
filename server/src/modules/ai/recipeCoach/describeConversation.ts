import { CHAT_ROLES, type Recipe, type RecipeChatMessage } from '@brewmate/shared';

import {
  PROMPT_BULLET,
  PROMPT_HISTORY_TEXT_MAX_LENGTH,
  PROMPT_LABEL_SEPARATOR,
  PROMPT_LINE_SEPARATOR,
} from '../constants/promptFormatting.js';
import { describeParams } from '../recipeEngine/describeBrew.js';

const NOTHING = 0;
const START = 0;
const EMPTY = '';
const NO_RATIONALE = 'no reasoning was recorded';
const THEM = 'they said';
const YOU = 'you answered';
const NOTHING_SAID = 'Nothing has been said about this recipe yet; this is the first message.';

/**
 * How this recipe came to look the way it does.
 *
 * The chain of parents rather than every recipe for the coffee: an adjustment
 * is a reply to the version before it, and the argument only makes sense read
 * in order. Being told that the grind already went finer once is what stops
 * the next answer from proposing to coarsen it back.
 */
export const describeRecipeVersions = (versions: readonly Recipe[]): string => {
  if (versions.length === NOTHING) {
    return EMPTY;
  }

  return [
    'The recipe, newest version first:',
    ...versions.map((recipe: Recipe): string =>
      [
        PROMPT_BULLET,
        describeParams(recipe.params),
        PROMPT_LABEL_SEPARATOR,
        recipe.rationale ?? NO_RATIONALE,
      ].join(EMPTY),
    ),
  ].join(PROMPT_LINE_SEPARATOR);
};

/**
 * What has already been said about it.
 *
 * Trimmed per message rather than dropped wholesale, because the shape of the
 * exchange matters more than its wording: three complaints about sourness in a
 * row is the thing worth noticing, and it survives trimming.
 *
 * @returns the section, or null when nothing has been said - an empty heading
 * invites a model to reason about an absence.
 */
export const describeConversation = (messages: readonly RecipeChatMessage[]): string | null => {
  if (messages.length === NOTHING) {
    return NOTHING_SAID;
  }

  return [
    'What has been said about this recipe so far, oldest first:',
    ...messages.map((message: RecipeChatMessage): string =>
      [
        PROMPT_BULLET,
        message.role === CHAT_ROLES.user ? THEM : YOU,
        PROMPT_LABEL_SEPARATOR,
        message.content.slice(START, PROMPT_HISTORY_TEXT_MAX_LENGTH),
      ].join(EMPTY),
    ),
  ].join(PROMPT_LINE_SEPARATOR);
};
