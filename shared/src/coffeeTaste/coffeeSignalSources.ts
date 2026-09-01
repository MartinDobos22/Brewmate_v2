/**
 * What a piece of evidence about a coffee came from.
 *
 * Machine names, translated by whoever prints them, exactly as the conversion
 * report and the insights already work. The app has to be able to say "this is
 * mostly the roast level talking" out loud, because an estimate built from a
 * country and nothing else and an estimate built from a full label are worth
 * very different amounts and look identical once they are five numbers.
 */
export const COFFEE_SIGNAL_SOURCES = {
  roastLevel: 'roast_level',
  process: 'process',
  origin: 'origin',
  altitude: 'altitude',
  variety: 'variety',
  tastingNotes: 'tasting_notes',
  /** What a model read off the label that the tables could not. */
  modelReading: 'model_reading',
} as const;

export type CoffeeSignalSource = (typeof COFFEE_SIGNAL_SOURCES)[keyof typeof COFFEE_SIGNAL_SOURCES];

export const COFFEE_SIGNAL_SOURCE_VALUES = [
  COFFEE_SIGNAL_SOURCES.roastLevel,
  COFFEE_SIGNAL_SOURCES.process,
  COFFEE_SIGNAL_SOURCES.origin,
  COFFEE_SIGNAL_SOURCES.altitude,
  COFFEE_SIGNAL_SOURCES.variety,
  COFFEE_SIGNAL_SOURCES.tastingNotes,
  COFFEE_SIGNAL_SOURCES.modelReading,
] as const;

/**
 * Who produced the estimate in the end.
 *
 * `label` means the tables did it alone - no model was asked, or none could be
 * reached. It is a working answer rather than a degraded one, which is why it
 * is a state rather than an error: everything in a shop happens on one bar of
 * signal, and an app that answers "skús to znova" there has answered nothing.
 */
export const COFFEE_ESTIMATE_SOURCES = {
  label: 'label',
  model: 'model',
} as const;

export type CoffeeEstimateSource =
  (typeof COFFEE_ESTIMATE_SOURCES)[keyof typeof COFFEE_ESTIMATE_SOURCES];

export const COFFEE_ESTIMATE_SOURCE_VALUES = [
  COFFEE_ESTIMATE_SOURCES.label,
  COFFEE_ESTIMATE_SOURCES.model,
] as const;
