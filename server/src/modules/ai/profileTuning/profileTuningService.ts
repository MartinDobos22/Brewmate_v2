import type { FlavorAffinities, RoastLevel, SuggestionReason } from '@brewmate/shared';

import { AI_EFFORT_LEVELS, AI_EXPLANATION_MAX_TOKENS } from '../../../ai/constants/aiModels.js';
import type { TextCompletionClient } from '../../../ai/textCompletionClient.js';
import type { AiUsageService } from '../../aiUsage/aiUsageService.js';
import { completeBilledJson } from '../completeBilledJson.js';
import { AI_FUNCTION_NAMES } from '../constants/aiFunctionNames.js';

import { describeSuggestion } from './describeSuggestion.js';
import {
  suggestionExplanationSchema,
  type SuggestionExplanation,
} from './suggestionExplanationSchema.js';
import { TUNE_PROFILE_SYSTEM_PROMPT } from './tuneProfilePrompt.js';

export interface ExplainSuggestionInput {
  readonly userId: string;
  readonly brewCount: number;
  readonly roastPreference: RoastLevel | null;
  readonly currentRoastPreference: RoastLevel | null;
  readonly flavorAffinities: FlavorAffinities;
  readonly reasons: readonly SuggestionReason[];
}

export interface ProfileTuningService {
  /**
   * Two or three Slovak sentences about numbers that were already decided.
   *
   * Returns null rather than throwing when the model will not answer. Nothing
   * on this screen depends on the paragraph: the counts, the proposal and both
   * buttons are all arithmetic, and the app writes its own sentence from the
   * machine-named reasons when there is none. A missing explanation is a
   * plainer card, not a broken one - and a failure here must never cost
   * somebody their insights.
   */
  explain(input: ExplainSuggestionInput): Promise<string | null>;
}

export interface ProfileTuningDependencies {
  readonly completionClient: TextCompletionClient;
  readonly aiUsageService: AiUsageService;
}

export const createProfileTuningService = ({
  completionClient,
  aiUsageService,
}: ProfileTuningDependencies): ProfileTuningService => ({
  explain: async (input): Promise<string | null> => {
    const completion = await completeBilledJson<SuggestionExplanation>({
      aiUsageService,
      userId: input.userId,
      client: completionClient,
      schema: suggestionExplanationSchema,
      functionName: AI_FUNCTION_NAMES.tuneProfile,
      system: TUNE_PROFILE_SYSTEM_PROMPT,
      prompt: describeSuggestion(input),
      maxTokens: AI_EXPLANATION_MAX_TOKENS,
      /**
       * The lowest effort there is. The reasoning was done in code before this
       * call was made; what is left is putting a handful of counts into two
       * sentences, and buying more thinking for that spends an allowance on
       * nothing.
       */
      effort: AI_EFFORT_LEVELS.low,
    }).catch((): null => null);

    if (completion === null) {
      return null;
    }

    return completion.value.explanation;
  },
});
