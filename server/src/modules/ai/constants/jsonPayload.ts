/**
 * How an answer that is supposed to be nothing but JSON is unwrapped.
 *
 * Models are asked for a bare object and usually give one, but a fenced code
 * block or a polite sentence in front of it is a formatting slip rather than a
 * wrong answer. Cutting from the first brace to the last costs nothing and
 * turns a retry that would have found the same content into no retry at all.
 */
export const JSON_OBJECT_OPEN = '{';
export const JSON_OBJECT_CLOSE = '}';
export const JSON_NOT_FOUND = -1;
export const JSON_CLOSE_LENGTH = 1;
