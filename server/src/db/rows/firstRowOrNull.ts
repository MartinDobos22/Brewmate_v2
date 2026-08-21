/** The single row a lookup was expected to produce, or null when there was none. */
export const firstRowOrNull = <TRow>(rows: readonly TRow[]): TRow | null => rows[0] ?? null;
