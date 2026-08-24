import {
  INSIGHT_EXPLANATION_SOURCES,
  INSIGHT_MIN_BREWS,
  TASTE_PROFILE_SOURCES,
  type AcceptTasteSuggestionResponse,
  type DismissTasteSuggestionResponse,
  type InsightsResponse,
  type TasteProfile,
  type TasteSuggestion,
} from '@brewmate/shared';

import { ERROR_MESSAGES } from '../../errors/errorMessages.js';
import { notFoundError } from '../../errors/notFoundError.js';
import type { ProfileTuningService } from '../ai/profileTuning/profileTuningService.js';
import type { AiUsageService } from '../aiUsage/aiUsageService.js';
import type { TasteProfileService } from '../tasteProfiles/tasteProfileService.js';

import { buildTasteSuggestion, type SuggestionDraft } from './buildTasteSuggestion.js';
import { foldBrewHistory, type BrewHistoryFold } from './foldBrewHistory.js';
import type { InsightsRepository } from './insightsRepository.js';

const NO_ATTRIBUTES = [] as const;
const NO_EXPLANATION = '';

export interface InsightsServiceDependencies {
  readonly repository: InsightsRepository;
  readonly tasteProfileService: TasteProfileService;
  readonly aiUsageService: AiUsageService;
  /** Null wherever no model provider is configured; the card is then plainer. */
  readonly profileTuningService: ProfileTuningService | null;
}

export interface InsightsService {
  read(userId: string): Promise<InsightsResponse>;
  accept(userId: string, ref: string): Promise<AcceptTasteSuggestionResponse>;
  dismiss(userId: string, ref: string): Promise<DismissTasteSuggestionResponse>;
}

/**
 * What a stretch of brewing adds up to, and what to do about it.
 *
 * Two things hold this together. The report is arithmetic - counts of cups and
 * bags, weighted by what each cup was worth as evidence - so it says the same
 * thing every time it is read, which is what makes a fingerprint over it
 * meaningful. And nothing it concludes is ever written anywhere until somebody
 * taps: this is a conclusion drawn from behaviour, and an app that quietly
 * rewrote a profile from behaviour would be arguing with somebody about their
 * own taste without telling them.
 *
 * Everything on the screen works with no model at all. The paragraph beside
 * the numbers is the only part a model writes, it is cached per fingerprint so
 * it is paid for once, and when it cannot be had the card says so and the app
 * writes its own sentence from the machine-named reasons.
 */
export const createInsightsService = ({
  repository,
  tasteProfileService,
  aiUsageService,
  profileTuningService,
}: InsightsServiceDependencies): InsightsService => {
  const readFold = async (userId: string): Promise<BrewHistoryFold> => {
    const [brews, pinned] = await Promise.all([
      repository.listBrewHistory(userId),
      repository.listPinnedRecipes(userId),
    ]);

    return foldBrewHistory(brews, pinned);
  };

  const readDraft = async (
    userId: string,
  ): Promise<{
    readonly fold: BrewHistoryFold;
    readonly profile: TasteProfile;
    readonly draft: SuggestionDraft | null;
  }> => {
    const [fold, profile] = await Promise.all([readFold(userId), tasteProfileService.get(userId)]);

    return { fold, profile, draft: buildTasteSuggestion(fold, profile) };
  };

  /**
   * Whether one cheap model call is affordable right now.
   *
   * Asked rather than assumed, because this paragraph is worth exactly what it
   * costs and no more. An account at its ceiling still gets the whole report -
   * the counts, the proposal and both buttons - written by the phone instead.
   * Letting a limit take the insights away would be punishing somebody for
   * having used the app.
   */
  const canSpend = async (userId: string): Promise<boolean> =>
    aiUsageService.assertWithinLimits(userId).then(
      (): boolean => true,
      (): boolean => false,
    );

  /**
   * The sentence, written once per fingerprint and remembered.
   *
   * The same bargain the label cache and the stored shop verdict strike: the
   * second reader of the same evidence pays nothing, and - the part that
   * matters more - reads the same words. Advice that comes out differently
   * every time it is asked for is advice nobody can rely on.
   */
  const resolveExplanation = async (
    userId: string,
    stored: string | null,
    fold: BrewHistoryFold,
    profile: TasteProfile,
    draft: SuggestionDraft,
  ): Promise<string | null> => {
    if (stored !== null) {
      return stored;
    }

    if (profileTuningService === null || !(await canSpend(userId))) {
      return null;
    }

    const written = await profileTuningService.explain({
      userId,
      brewCount: fold.brewCount,
      roastPreference: draft.roastPreference,
      currentRoastPreference: profile.roastPreference,
      flavorAffinities: draft.flavorAffinities,
      reasons: draft.reasons,
    });

    if (written !== null) {
      await repository.saveExplanation(userId, draft.ref, written);
    }

    return written;
  };

  const resolveSuggestion = async (
    userId: string,
    fold: BrewHistoryFold,
    profile: TasteProfile,
    draft: SuggestionDraft | null,
  ): Promise<TasteSuggestion | null> => {
    if (draft === null) {
      return null;
    }

    const row = await repository.rememberSuggestion(userId, draft.ref);

    /**
     * Answered already, one way or the other. A suggestion that came back
     * after being accepted would invite somebody to agree with it twice, and
     * one that came back after being refused would be the app not listening.
     */
    if (row.dismissedAt !== null || row.acceptedAt !== null) {
      return null;
    }

    const explanation = await resolveExplanation(userId, row.explanation, fold, profile, draft);

    return {
      ref: draft.ref,
      roastPreference: draft.roastPreference,
      flavorAffinities: draft.flavorAffinities,
      weight: draft.weight,
      reasons: [...draft.reasons],
      explanation: explanation ?? NO_EXPLANATION,
      explanationSource:
        explanation === null
          ? INSIGHT_EXPLANATION_SOURCES.rules
          : INSIGHT_EXPLANATION_SOURCES.model,
    };
  };

  return {
    read: async (userId): Promise<InsightsResponse> => {
      const { fold, profile, draft } = await readDraft(userId);

      return {
        brewCount: fold.brewCount,
        /**
         * Below the threshold the list is empty rather than a ranking of three
         * cups. "Najčastejšie Etiópia" means one thing after forty cups and
         * nothing at all after three, and the app says what would change that.
         */
        attributes: fold.brewCount < INSIGHT_MIN_BREWS ? [...NO_ATTRIBUTES] : [...fold.attributes],
        suggestion: await resolveSuggestion(userId, fold, profile, draft),
        generatedAt: new Date().toISOString(),
      };
    },

    /**
     * Accepting is checked against the evidence as it stands now, not against
     * what was on the screen.
     *
     * A ref that no longer matches means the history moved on between the
     * report and the tap - somebody brewed something in between - and writing
     * the old conclusion into the profile would be recording a claim the
     * evidence no longer supports. The app reads the insights again and asks
     * the current question.
     */
    accept: async (userId, ref): Promise<AcceptTasteSuggestionResponse> => {
      const { draft } = await readDraft(userId);

      if (draft?.ref !== ref) {
        throw notFoundError(ERROR_MESSAGES.tasteSuggestionNotFound);
      }

      const event = await tasteProfileService.addEvent(userId, {
        source: TASTE_PROFILE_SOURCES.brewHistory,
        /**
         * The evidence itself, so agreeing twice counts once - the partial
         * unique index on the audit trail enforces the same rule underneath.
         */
        sourceRef: draft.ref,
        payload: {
          axes: {},
          flavorAffinities: draft.flavorAffinities,
          roastPreference: draft.roastPreference,
          weight: draft.weight,
        },
      });

      await repository.rememberSuggestion(userId, draft.ref);
      await repository.markAccepted(userId, draft.ref, new Date());

      return { event, profile: await tasteProfileService.get(userId) };
    },

    /**
     * Refusing only needs the suggestion to have been shown.
     *
     * Unlike accepting, this writes nothing about anybody's taste - it records
     * that this evidence was put to them and they said no. Insisting the
     * fingerprint still match would mean somebody who brewed a coffee between
     * reading the card and dismissing it could not dismiss it.
     */
    dismiss: async (userId, ref): Promise<DismissTasteSuggestionResponse> => {
      if ((await repository.findSuggestion(userId, ref)) === null) {
        throw notFoundError(ERROR_MESSAGES.tasteSuggestionNotFound);
      }

      const dismissed = await repository.markDismissed(userId, ref, new Date());

      if (dismissed === null) {
        throw notFoundError(ERROR_MESSAGES.tasteSuggestionNotFound);
      }

      return { ref, dismissedAt: (dismissed.dismissedAt ?? new Date()).toISOString() };
    },
  };
};
