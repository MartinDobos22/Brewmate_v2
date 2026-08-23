import {
  JSON_CLOSE_LENGTH,
  JSON_NOT_FOUND,
  JSON_OBJECT_CLOSE,
  JSON_OBJECT_OPEN,
} from './constants/jsonPayload.js';

/**
 * The JSON object inside whatever the model actually wrote.
 *
 * @returns the parsed value, or null when there is no object in there at all -
 * which is the signal for the one retry rather than for an exception.
 */
export const readJsonPayload = (text: string): unknown => {
  const start = text.indexOf(JSON_OBJECT_OPEN);
  const end = text.lastIndexOf(JSON_OBJECT_CLOSE);

  if (start === JSON_NOT_FOUND || end === JSON_NOT_FOUND || end < start) {
    return null;
  }

  try {
    return JSON.parse(text.slice(start, end + JSON_CLOSE_LENGTH));
  } catch {
    return null;
  }
};
