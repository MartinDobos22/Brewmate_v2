/**
 * The frame around onboarding: the welcome, the progress, the two ways out
 * and the closing screen.
 *
 * Every step can be left, and the copy says so rather than hiding it. An
 * onboarding a user cannot escape is one they abandon at the app store.
 */
export const SK_ONBOARDING = {
  onboardingWelcomeTitle: 'Vitaj v Brewmate',
  onboardingWelcomeBody:
    'Najprv sa ťa spýtam pár otázok o tom, čo ti chutí. Potom si zapíšeme, na čom varíš, aby som ti radil len to, čo naozaj vieš pripraviť.',
  onboardingWelcomeDuration: 'Trvá to asi tri minúty a kedykoľvek to môžeš prerušiť.',
  onboardingWelcomeAction: 'Poďme na to',

  onboardingSkipAll: 'Preskočiť nastavenie',
  onboardingSkipStep: 'Preskočiť tento krok',
  onboardingContinue: 'Pokračovať',
  onboardingResumeNotice: 'Pokračuješ tam, kde si minule prestal.',
  onboardingSaveError: 'Nastavenie sa nepodarilo uložiť. Skús to prosím znova.',

  onboardingStepTaste: 'Chuť',
  onboardingStepGrinder: 'Mlynček',
  onboardingStepBrewers: 'Príprava',
  onboardingStepGear: 'Váha a kanvica',
  onboardingStepWater: 'Voda',
  onboardingStepSets: 'Zostavy',
  onboardingStepCalibration: 'Prvé varenie',

  onboardingDoneTitle: 'Hotovo',
  onboardingDoneBody:
    'Toľko zatiaľ stačí. Zvyšok sa naučím z toho, ako budeš variť a čo mi o káve povieš.',
  onboardingDoneAction: 'Otvoriť Brewmate',
  onboardingDoneProfileHint: 'Všetko, čo si tu nastavil, sa dá zmeniť v profile.',
} as const;
