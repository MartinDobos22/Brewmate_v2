const CAUSE_LIMIT = 5;
const NAME_SEPARATOR = ': ';

const isError = (value: unknown): value is Error => value instanceof Error;

/**
 * Every reason behind a failure, flattened into lines a log can be grepped
 * for.
 *
 * The thing this exists to stop is the commonest support conversation there
 * is: "it said the recipe could not be written" and nothing anywhere saying
 * why. The sentence a client reads is deliberately not the reason - a caller
 * must never be handed a provider's error text - so the reason only ever lives
 * in the `cause` chain, and a chain is exactly what a log viewer truncates,
 * flattens or drops depending on how it was configured that afternoon. A plain
 * array of strings survives all three.
 *
 * Bounded at five links because a chain longer than that is a bug in the code
 * that built it, and an unbounded walk over `cause` is a loop waiting for the
 * first error somebody makes its own cause.
 */
export const describeCauseChain = (error: unknown): readonly string[] => {
  const lines: string[] = [];
  let current: unknown = isError(error) ? error.cause : null;

  while (isError(current) && lines.length < CAUSE_LIMIT) {
    lines.push([current.name, current.message].join(NAME_SEPARATOR));
    current = current.cause;
  }

  return lines;
};
