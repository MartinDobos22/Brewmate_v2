/** Who wrote a message in a recipe conversation. */
export const CHAT_ROLES = {
  user: 'user',
  assistant: 'assistant',
} as const;

export type ChatRole = (typeof CHAT_ROLES)[keyof typeof CHAT_ROLES];

/** Tuple form, required by Drizzle's `pgEnum`. */
export const CHAT_ROLE_VALUES = [CHAT_ROLES.user, CHAT_ROLES.assistant] as const;
