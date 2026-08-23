import type { PartialTasteAxes } from '@brewmate/shared';

import type { TranslationKey } from '../../../i18n';

/** What the app believes it understood, shown back before anything is saved. */
export interface CalibrationReading {
  readonly id: string;
  readonly labelKey: TranslationKey;
}

export interface CalibrationEntry {
  /** Lower-case, diacritic-free stems. Matched as substrings of the description. */
  readonly terms: readonly string[];
  readonly reading: CalibrationReading;
  /** The preference the phrase implies, on the 0-10 scale. */
  readonly axes: PartialTasteAxes;
}
