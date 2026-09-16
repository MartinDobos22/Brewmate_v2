import { ApiClientError } from '../apiClient';

export interface ErrorReference {
  /** The machine code the API branched on, or the one the client raised itself. */
  readonly code: string;
  /** What the API called this request, where it got far enough to name one. */
  readonly requestId: string | null;
}

/**
 * The two things about a failure that are worth printing next to the sentence.
 *
 * Not for the user to understand - the Slovak sentence above it is what they
 * read - but for the one moment where it matters more than anything else on
 * the screen: somebody says "it would not write me a recipe" and there is no
 * way to find out which of nine things went wrong. A code says which, and a
 * request id finds the exact line in the server log. Without them a report is
 * a red rectangle in a photograph.
 *
 * @returns null for a failure that never reached the API, which has nothing to
 *   look up: being offline is answered by the sentence, not by a reference.
 */
export const readErrorReference = (error: unknown): ErrorReference | null =>
  error instanceof ApiClientError ? { code: error.code, requestId: error.requestId } : null;
