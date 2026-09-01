import { COFFEE_SIGNAL_SOURCES } from './coffeeSignalSources.js';
import type { CoffeeTasteReading } from './coffeeTasteReadingSchema.js';
import type { CoffeeTasteSignal } from './coffeeTasteSignal.js';
import { MODEL_READING_WEIGHT } from './constants/readingLimits.js';

/**
 * A model's reading, turned into one more signal among the label's own.
 *
 * This is the whole of the model's authority over the estimate: it becomes a
 * single weighted observation and then has to survive the same fold as the
 * roast level and the process. It cannot overwrite them, it cannot silence
 * them, and where it disagrees with them the result is a lower confidence
 * rather than a louder claim - which is the correct outcome, because a label
 * and a model that disagree about a coffee genuinely do not know what it
 * tastes like.
 *
 * The declared confidence scales the weight rather than replacing it, so a
 * model that read almost nothing off a bag contributes almost nothing however
 * strongly it phrases it.
 */
export const toModelSignal = (reading: CoffeeTasteReading): CoffeeTasteSignal => ({
  source: COFFEE_SIGNAL_SOURCES.modelReading,
  axes: reading.axes,
  weight: MODEL_READING_WEIGHT * reading.confidence,
});
