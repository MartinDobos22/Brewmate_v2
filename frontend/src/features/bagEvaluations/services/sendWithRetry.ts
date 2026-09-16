import { ApiClientError, API_CLIENT_ERROR_CODES } from '../../../lib/apiClient';
import {
  BAG_PHOTO_RETRY_BASE_MS,
  BAG_PHOTO_RETRY_FACTOR,
  BAG_PHOTO_SEND_ATTEMPTS,
} from '../constants/bagPhoto';

const FIRST_ATTEMPT = 0;
const LAST_ATTEMPT = BAG_PHOTO_SEND_ATTEMPTS - 1;

const wait = async (ms: number): Promise<void> =>
  new Promise((resolve: () => void): void => {
    setTimeout(resolve, ms);
  });

const backoffFor = (attempt: number): number =>
  BAG_PHOTO_RETRY_BASE_MS * BAG_PHOTO_RETRY_FACTOR ** attempt;

/**
 * Whether it is worth sending the photograph again.
 *
 * Only a request that never got an answer. This is the whole rule, and it is
 * the reason this cannot be a blanket retry: the route it wraps costs money
 * and counts against a daily allowance, so sending a photograph again because
 * the API said "no model configured", "you are out of calls" or "I could not
 * read this label" would spend somebody's allowance three times over to be
 * told the same thing three times. A request that never arrived was never
 * billed and never counted, which is exactly why it can be repeated.
 */
const isWorthRepeating = (error: unknown): boolean =>
  error instanceof ApiClientError &&
  (error.code === API_CLIENT_ERROR_CODES.network || error.code === API_CLIENT_ERROR_CODES.timeout);

/**
 * Sends a scan, and walks a few steps before giving up on it.
 *
 * The failure this is built for is a signal that comes and goes rather than
 * one that is gone: inside a shop a request fails, and a few seconds later it
 * does not. The waits double so three attempts span several seconds of walking
 * rather than three tries in one dead spot - which is the same thing the
 * upload to the storage bucket used to do, moved to the request that now
 * carries the photograph itself.
 *
 * When all of them fail the error reaches the caller, which puts the label
 * form in front of the person. Somebody standing in front of a shelf must
 * never be stuck behind a photograph that will not send.
 */
export const sendWithRetry = async <TAnswer>(send: () => Promise<TAnswer>): Promise<TAnswer> => {
  let lastError: unknown = null;

  for (let attempt = FIRST_ATTEMPT; attempt < BAG_PHOTO_SEND_ATTEMPTS; attempt += 1) {
    try {
      return await send();
    } catch (error: unknown) {
      lastError = error;

      if (!isWorthRepeating(error) || attempt === LAST_ATTEMPT) {
        throw error;
      }

      await wait(backoffFor(attempt));
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
};
