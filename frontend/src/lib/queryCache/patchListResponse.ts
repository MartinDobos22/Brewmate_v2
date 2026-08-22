import type { ListResponse } from '@brewmate/shared';

/** Anything the API returns in a list is identified by its id. */
export interface Identified {
  readonly id: string;
}

/**
 * Applies a patch to one item inside a cached page, leaving the rest alone.
 *
 * Used by the optimistic mutations: pinning a recipe or archiving a bag should
 * show up in the list the user is looking at immediately, without refetching
 * a page they can already see.
 */
export const patchListResponse = <TItem extends Identified>(
  data: ListResponse<TItem> | undefined,
  id: string,
  patch: Partial<TItem>,
): ListResponse<TItem> | undefined => {
  if (data === undefined) {
    return undefined;
  }

  return {
    ...data,
    items: data.items.map((item: TItem): TItem => (item.id === id ? { ...item, ...patch } : item)),
  };
};
