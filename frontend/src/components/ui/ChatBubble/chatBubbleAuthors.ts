/** Who wrote the message. The app has exactly two speakers. */
export const CHAT_AUTHORS = {
  user: 'user',
  assistant: 'assistant',
} as const;

export type ChatAuthor = (typeof CHAT_AUTHORS)[keyof typeof CHAT_AUTHORS];
