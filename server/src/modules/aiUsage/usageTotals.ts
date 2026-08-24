/**
 * What a slice of `ai_usage_logs` adds up to.
 *
 * The cost stays a decimal string all the way from the SQL sum to the screen.
 * PostgreSQL adds `numeric` exactly; turning that into a float on the way past
 * would give back the rounding error the column exists to avoid.
 */
export interface UsageTotals {
  readonly calls: number;
  readonly tokensIn: number;
  readonly tokensOut: number;
  readonly costEstimate: string;
}

/** One feature's share of a window. */
export interface FunctionUsageTotals extends UsageTotals {
  readonly functionName: string;
}
