import {
  AI_COST_SCALE,
  AI_LIMIT_KINDS,
  type AiLimitKind,
  type AiUsageWindow,
  type AiUsageWindowName,
} from '@brewmate/shared';

import type { UsageWindowBounds } from './resolveUsageWindows.js';
import type { UsageTotals } from './usageTotals.js';

export interface UsageWindowInput {
  readonly window: AiUsageWindowName;
  readonly totals: UsageTotals;
  readonly bounds: UsageWindowBounds;
  readonly callLimit: number;
  readonly costLimit: number;
}

/**
 * Which ceiling this window has already reached, if either.
 *
 * Calls are checked first because that is the failure that runs away: a screen
 * retrying in a loop hits the call ceiling long before it has spent anything,
 * and naming the cheap cause is more use than naming the expensive one.
 *
 * The cost comparison is the one place a float appears in this arithmetic. The
 * sum itself is `numeric` and exact; only the comparison against the ceiling
 * runs in double precision, and it decides whether one more call is allowed.
 * Being wrong there by a millionth of a cent changes nothing anybody can
 * observe.
 */
const resolveExhaustedBy = ({
  totals,
  callLimit,
  costLimit,
}: UsageWindowInput): AiLimitKind | null => {
  if (totals.calls >= callLimit) {
    return AI_LIMIT_KINDS.calls;
  }

  return Number(totals.costEstimate) >= costLimit ? AI_LIMIT_KINDS.cost : null;
};

/**
 * One window as the contract describes it.
 *
 * The ceiling is formatted to the same scale as the amount spent, so the
 * screen prints one number the same way as the other rather than "0,012000
 * z 1,5".
 */
export const toUsageWindow = (input: UsageWindowInput): AiUsageWindow => ({
  window: input.window,
  calls: input.totals.calls,
  callLimit: input.callLimit,
  tokensIn: input.totals.tokensIn,
  tokensOut: input.totals.tokensOut,
  costEstimate: input.totals.costEstimate,
  costLimit: input.costLimit.toFixed(AI_COST_SCALE),
  exhaustedBy: resolveExhaustedBy(input),
  resetsAt: input.bounds.resetsAt.toISOString(),
});
