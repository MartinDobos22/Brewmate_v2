import type { ListResponse } from '@brewmate/shared';

export interface PageInput<TItem> {
  /** Rows read with `limit + EXTRA_ROW_FOR_HAS_MORE`. */
  readonly rows: readonly TItem[];
  readonly limit: number;
  readonly offset: number;
}

/**
 * Turns an over-fetched result into the list envelope.
 *
 * Repositories read one row more than the caller asked for; if it came back,
 * there is another page. That answer costs nothing, whereas a `count(*)` over
 * a growing table costs more than the page it describes.
 */
export const toPage = <TItem>({ rows, limit, offset }: PageInput<TItem>): ListResponse<TItem> => ({
  items: rows.slice(0, limit),
  limit,
  offset,
  hasMore: rows.length > limit,
});
