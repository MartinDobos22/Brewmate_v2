import { z } from 'zod';

/** Path parameters of every `/<resource>/:id` route. */
export const idParamSchema = z.object({ id: z.uuid() });

export type IdParam = z.infer<typeof idParamSchema>;
