/**
 * A cost as a number, for the one thing a decimal string cannot do: be drawn.
 *
 * `ai_usage_logs.cost_estimate` is `numeric` and travels as a decimal string,
 * because these rows get summed over months and a float sum of fractions of a
 * cent is wrong in the way nobody notices until the invoice. That is the right
 * decision for arithmetic and no help at all to a bar, which needs a width.
 *
 * So the string is read into a number exactly here, at the edge, where the
 * only thing it feeds is geometry - and never on its way back to the server.
 * A value that is not a number at all reads as nothing spent rather than as
 * `NaN`, which lays out as an empty bar on one platform and a full one on the
 * other.
 */
const NOTHING = 0;

export const readCostAmount = (amount: string): number => {
  const parsed = Number(amount);

  return Number.isFinite(parsed) ? parsed : NOTHING;
};
