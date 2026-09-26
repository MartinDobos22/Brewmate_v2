import type { BagRatingStage, CoffeeBag } from '@brewmate/shared';

/** Which bag the sheet is asking about, and at which moment of drinking it. */
export interface BagRatingRequest {
  readonly bag: CoffeeBag;
  readonly stage: BagRatingStage;
}
