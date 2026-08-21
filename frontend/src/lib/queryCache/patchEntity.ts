/** Applies a patch to a cached single entity, or leaves an empty cache empty. */
export const patchEntity = <TEntity>(
  data: TEntity | undefined,
  patch: Partial<TEntity>,
): TEntity | undefined => (data === undefined ? undefined : { ...data, ...patch });
