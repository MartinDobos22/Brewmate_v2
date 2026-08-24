/**
 * The flows worth counting, and nothing else.
 *
 * Every name here is a step somebody either reaches or does not: the point of
 * the list is to answer "where does this app lose people", which is a question
 * about a handful of doorways, not about every tap. A screen view is not on
 * it - a product that instruments everything ends up measuring nothing.
 *
 * These strings end up in `analytics_events.name`, which is what a funnel is
 * grouped by. Renaming one splits the history in two, so they are written down
 * here rather than at the call sites.
 */
export const ANALYTICS_EVENT_NAMES = {
  onboardingStarted: 'onboarding_started',
  onboardingCompleted: 'onboarding_completed',
  onboardingLeft: 'onboarding_left',
  questionnaireCompleted: 'questionnaire_completed',
  bagScanned: 'bag_scanned',
  shopVerdictViewed: 'shop_verdict_viewed',
  coffeeBagAdded: 'coffee_bag_added',
  recipeGenerated: 'recipe_generated',
  brewStarted: 'brew_started',
  brewCompleted: 'brew_completed',
  brewChatMessageSent: 'brew_chat_message_sent',
  recipePatchApplied: 'recipe_patch_applied',
  recipeImported: 'recipe_imported',
  dialInShotLogged: 'dial_in_shot_logged',
  insightSuggestionAccepted: 'insight_suggestion_accepted',
  insightSuggestionDismissed: 'insight_suggestion_dismissed',
  aiLimitReached: 'ai_limit_reached',
  accountExported: 'account_exported',
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[keyof typeof ANALYTICS_EVENT_NAMES];

export const ANALYTICS_EVENT_NAME_VALUES = Object.values(ANALYTICS_EVENT_NAMES);
