import { internalError } from '../../errors/internalError.js';

/**
 * The row a write was supposed to return.
 *
 * An insert or update with `returning()` that produced nothing means the
 * database and this code disagree about reality, which is not a client error.
 */
export const requireRow = <TRow>(rows: readonly TRow[]): TRow => {
  const row = rows[0];

  if (row === undefined) {
    throw internalError();
  }

  return row;
};
