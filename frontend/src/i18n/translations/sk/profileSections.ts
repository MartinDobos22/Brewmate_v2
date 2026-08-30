/**
 * How the profile screen is grouped.
 *
 * The screen answers four different questions - what the app believes about
 * you, what you brew with, what the app itself is doing, and what your account
 * is - and until they were labelled they arrived as eight cards of identical
 * weight in one column. A heading per group is what lets somebody skip three
 * of the four instead of reading every card title.
 */
export const SK_PROFILE_SECTIONS = {
  profileHeaderTitle: 'Tvoj profil',

  profileSectionTasteTitle: 'Čo o tebe viem',
  profileSectionTasteCaption: 'Chuť, ktorú som sa zatiaľ naučil - a nakoľko si ňou som istý.',
  profileSectionGearTitle: 'Tvoja výbava',
  profileSectionGearCaption: 'V čom variš, akú máš vodu a čo si kam berieš.',
  profileSectionAppTitle: 'Aplikácia',
  profileSectionAppCaption: 'Prehľady a to, ako appka vyzerá.',
  profileSectionAccountTitle: 'Účet',
  profileSectionAccountCaption: 'Prihlásenie, tvoje dáta a odchod.',

  profileTuneTitleCard: 'Nesedí ti to?',
  profileTuneCardBody:
    'Dotazník je dôkaz, posuvníky sú príkaz. Čo nastavíš ručne, to platí - hádať za teba nebudem.',

  profileTileInsightsTitle: 'Čo hovorí história',
  profileTileInsightsCaption: 'Počty z tvojich varení.',
  profileTileCostsTitle: 'Čo stáli modely',
  profileTileCostsCaption: 'Denný a mesačný limit.',
  profileTileDesignSystemTitle: 'Dizajn systém',
  profileTileDesignSystemCaption: 'Len vo vývojovom builde.',
} as const;
