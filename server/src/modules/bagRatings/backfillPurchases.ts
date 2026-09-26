import { TASTE_PROFILE_SOURCES } from '@brewmate/shared';

import type { CoffeeTasteReadingRepository } from '../ai/coffeeTasteEstimate/coffeeTasteReadingRepository.js';
import { toCoffeeBag } from '../coffeeBags/coffeeBagMapper.js';
import type { TasteProfileEventRepository } from '../tasteProfiles/tasteProfileEventRepository.js';
import type { TasteProfileService } from '../tasteProfiles/tasteProfileService.js';

import type { PurchaseBackfillRepository } from './purchaseBackfillRepository.js';
import { readPurchaseEvidence } from './readPurchaseEvidence.js';

const NOTHING = 0;
const ONE = 1;

export interface PurchaseBackfillDependencies {
  readonly repository: PurchaseBackfillRepository;
  readonly eventRepository: TasteProfileEventRepository;
  readonly readings: CoffeeTasteReadingRepository;
  readonly tasteProfileService: TasteProfileService;
}

export interface PurchaseBackfillSummary {
  readonly bagsWithoutPurchase: number;
  readonly purchasesRecorded: number;
  readonly profilesRebuilt: number;
}

/**
 * Records the purchase of every bag that was written into a cupboard before
 * purchases taught the taste profile anything.
 *
 * A bag from last spring was chosen exactly as much as one from this morning,
 * and an account whose cupboard predates the change should not have to buy
 * everything again to be understood. Each event is dated to the day the bag
 * was written down rather than to today, so the trail replays as though it
 * had been listening all along - and every profile touched is folded once, at
 * the end, rather than once per bag.
 *
 * Safe to run twice: a bag already carrying a purchase is not read at all,
 * and the audit trail's unique reference would refuse a second one anyway. A
 * bag whose label says nothing is skipped, exactly as it is when it is first
 * written down, and is simply read again - and skipped again - next time.
 */
export const backfillPurchases = async ({
  repository,
  eventRepository,
  readings,
  tasteProfileService,
}: PurchaseBackfillDependencies): Promise<PurchaseBackfillSummary> => {
  const rows = await repository.listBagsWithoutPurchase();
  const touched = new Set<string>();
  let recorded = NOTHING;

  for (const row of rows) {
    const bag = toCoffeeBag(row);
    const payload = await readPurchaseEvidence(bag, readings);

    if (payload === null) {
      continue;
    }

    await eventRepository.create({
      userId: bag.userId,
      source: TASTE_PROFILE_SOURCES.purchase,
      sourceRef: bag.id,
      payload,
      createdAt: row.createdAt,
    });
    touched.add(bag.userId);
    recorded += ONE;
  }

  for (const userId of touched) {
    await tasteProfileService.recompute(userId);
  }

  return {
    bagsWithoutPurchase: rows.length,
    purchasesRecorded: recorded,
    profilesRebuilt: touched.size,
  };
};
