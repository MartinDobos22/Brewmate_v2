/**
 * The coffee held up against the person - the sentences that say what the two
 * shapes on one web actually mean.
 *
 * Nothing here is a number, a percentage, a grade or a colour. A score in
 * front of a shelf reads as a measurement of somebody's taste, and nobody has
 * measured that. What the app is allowed to say is which way a coffee leans
 * against what somebody reaches for, and to be honest when it cannot say even
 * that.
 *
 * Each axis gets its own pair of sentences rather than a shared "viac" and
 * "menej": Slovak declines the adjective for the noun, and a sentence
 * assembled from a shared word and an axis name is one no translator ever saw.
 */
export const SK_COFFEE_MATCH = {
  matchTitle: 'Ako to sedí s tebou',

  matchBandMatch: 'Toto vyzerá ako tvoja káva.',
  matchBandMixed: 'Niečo z nej ti sadne, niečo nie. Pozri sa, čo je čo.',
  matchBandMismatch: 'Toto je dosť iná káva, než po akej zvykneš siahať.',
  matchBandUnknown:
    'Zatiaľ to neviem porovnať. Buď o tebe viem primálo, alebo etiketa povedala primálo - alebo oboje.',

  matchLegendYou: 'Ty',
  matchLegendCoffee: 'Táto káva',

  matchAcidityAbove: 'Je kyslejšia, než po akej zvykneš siahať.',
  matchAcidityBelow: 'Má menej kyslosti, než máš rád.',
  matchAcidityAligned: 'Kyslosť sedí s tým, čo máš rád.',

  matchSweetnessAbove: 'Je sladšia, než býva tvoja káva.',
  matchSweetnessBelow: 'Je menej sladká, než býva tvoja káva.',
  matchSweetnessAligned: 'Sladkosť sedí s tým, čo máš rád.',

  matchBodyAbove: 'Má plnšie telo, než býva tvoje.',
  matchBodyBelow: 'Je ľahšia, než býva tvoja káva.',
  matchBodyAligned: 'Telo sedí s tým, čo máš rád.',

  matchBitternessAbove: 'Bude horkejšia, než ti zvykne sadnúť.',
  matchBitternessBelow: 'Bude menej horká, než ti zvykne sadnúť.',
  matchBitternessAligned: 'Horkosť sedí s tým, čo máš rád.',

  matchIntensityAbove: 'Bude výraznejšia, než býva tvoja káva.',
  matchIntensityBelow: 'Bude jemnejšia, než býva tvoja káva.',
  matchIntensityAligned: 'Intenzita sedí s tým, čo máš rád.',
} as const;
