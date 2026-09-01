/**
 * Question zero, and the three answers to it.
 *
 * Described by what somebody drinks rather than by a rank. "Začiatočník" is a
 * label a person has to accept about themselves before they are allowed past
 * this screen, and enough people would overclaim to avoid it that the question
 * would stop working - which would leave the app asking a capsule drinker
 * which processing method they prefer.
 */
export const SK_TASTE_QUESTIONS_LEVELS = {
  tqLevelPrompt: 'Ako to máš s kávou?',
  tqLevelHelp:
    'Podľa toho ti dám otázky, na ktoré sa dá odpovedať bez hádania. Nič sa tým nezamyká, kedykoľvek to môžeš vyplniť znova inak.',
  tqLevelBeginner: 'Pijem ju, ale neriešim ju',
  tqLevelBeginnerNote:
    'Káva z kapsule, z automatu alebo z kaviarne. Budem sa pýtať na veci, ktoré poznáš - čaj, čokoládu, ovocie.',
  tqLevelRegular: 'Varím si ju doma',
  tqLevelRegularNote:
    'Máš mlynček alebo aspoň dripper a vieš, kedy ti káva chutí. Pýtam sa priamo aj naokolo.',
  tqLevelExpert: 'Viem, čo je washed a natural',
  tqLevelExpertNote:
    'Vážiš, meriaš, rozlišuješ pôvody. Žiadne otázky o čokoláde - pýtam sa rovno na to, čo chceš z kávy dostať.',

  tqProgress: 'Otázka {current} z {total}',
  tqSaving: 'Ukladám odpovede...',
  tqSaveFailed:
    'Odpovede sa nepodarilo uložiť. Skús to prosím znova - nič z toho, čo si naklikal, sa nestratilo.',

  tqSavedTitle: 'Hotovo, mám to',
  tqSavedBody:
    'Odpovede sú uložené a takto ti zatiaľ rozumiem. Podľa toho ti budem radiť v obchode aj pri varení.',
  tqSavedHint:
    'Plné vrcholy sú to, čo o tebe naozaj viem. Zvyšok sa doplní, keď mi povieš, aká bola káva. Dotazník môžeš kedykoľvek vyplniť znova v profile.',
} as const;
