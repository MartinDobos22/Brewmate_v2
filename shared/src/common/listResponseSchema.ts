import { z } from 'zod';

/**
 * The envelope every list endpoint answers with.
 *
 * `hasMore` instead of a total count on purpose: the repository reads one row
 * more than the caller asked for and drops it again, so a growing table never
 * pays for a `count(*)` that costs more than the page itself.
 */
export interface ListResponse<TItem> {
  readonly items: TItem[];
  readonly limit: number;
  readonly offset: number;
  readonly hasMore: boolean;
}

export const listResponseSchema = <TItem extends z.ZodType>(
  itemSchema: TItem,
): z.ZodObject<{
  items: z.ZodArray<TItem>;
  limit: z.ZodNumber;
  offset: z.ZodNumber;
  hasMore: z.ZodBoolean;
}> =>
  z.object({
    items: z.array(itemSchema),
    limit: z.number().int(),
    offset: z.number().int(),
    hasMore: z.boolean(),
  });
