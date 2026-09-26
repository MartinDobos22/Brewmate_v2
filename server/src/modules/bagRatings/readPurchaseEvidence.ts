import { learnFromPurchase, type CoffeeBag, type TasteProfileEventPayload } from '@brewmate/shared';

import type { CoffeeTasteReadingRepository } from '../ai/coffeeTasteEstimate/coffeeTasteReadingRepository.js';

import { estimateBagTaste } from './estimateBagTaste.js';

/**
 * What writing this bag into the cupboard says about the person who did it.
 *
 * One function for the two moments a purchase is recorded - as the bag is
 * written down, and afterwards for a bag written down before purchases were
 * listened to - so a bag from last spring and a bag from this morning teach
 * exactly the same thing.
 */
export const readPurchaseEvidence = async (
  bag: CoffeeBag,
  readings: CoffeeTasteReadingRepository,
): Promise<TasteProfileEventPayload | null> =>
  learnFromPurchase(await estimateBagTaste(bag, readings), bag.tastingNotes, bag.id);
