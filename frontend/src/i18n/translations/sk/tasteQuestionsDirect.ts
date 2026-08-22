/**
 * The five questions that ask outright.
 *
 * They are worth more than the indirect ones - somebody saying "nechcem
 * kyslú kávu" is evidence, not inference - but on their own they only
 * describe the vocabulary a person already has.
 */
export const SK_TASTE_QUESTIONS_DIRECT = {
  tqAcidityPrompt: 'Máš rád kyslejšiu kávu?',
  tqAcidityHelp: 'Kyslosť v káve nie je chyba. Je to tá živá, ovocná iskra.',
  tqAcidityHigh: 'Áno, výrazná kyslosť ma baví',
  tqAcidityHighNote: 'Citrusy, bobule, niečo, čo zaštípe.',
  tqAcidityMild: 'Skôr jemnú',
  tqAcidityMildNote: 'Nech tam je, ale nech neprekričí zvyšok.',
  tqAcidityLow: 'Radšej bez nej',
  tqAcidityLowNote: 'Chcem hladkú kávu bez ostrých hrán.',

  tqRoastPrompt: 'Aké praženie ti zvyčajne sadne?',
  tqRoastHelp: 'Ak to nevieš odhadnúť, pokojne to nechaj na mňa.',
  tqRoastLight: 'Svetlé',
  tqRoastLightNote: 'Kyslejšie, ovocnejšie, ľahšie.',
  tqRoastMedium: 'Stredné',
  tqRoastMediumNote: 'Vyvážené, karamel a orechy.',
  tqRoastDark: 'Tmavé',
  tqRoastDarkNote: 'Sýte, horkastejšie, čokoládové.',
  tqRoastUnknown: 'Neviem posúdiť',
  tqRoastUnknownNote: 'Túto otázku vynecháme.',

  tqStrengthPrompt: 'Ako silnú kávu chceš?',
  tqStrengthHelp: 'Ide o to, aká má byť koncentrovaná, nie o množstvo kofeínu.',
  tqStrengthHigh: 'Nech ma postaví na nohy',
  tqStrengthHighNote: 'Sýta a intenzívna.',
  tqStrengthMedium: 'Stredne silnú',
  tqStrengthMediumNote: 'Aby sa dala piť aj poobede.',
  tqStrengthLow: 'Jemnú',
  tqStrengthLowNote: 'Popíjam ju dlho, ako čaj.',

  tqBodyPrompt: 'Ako má káva pôsobiť v ústach?',
  tqBodyHelp: 'Telo je hustota nápoja: od číreho čaju po smotanu.',
  tqBodyLight: 'Ľahko a čisto',
  tqBodyLightNote: 'Ako priezračný čaj.',
  tqBodyBalanced: 'Niekde medzi',
  tqBodyBalancedNote: 'Vyvážene, bez extrémov.',
  tqBodyHeavy: 'Husto a plno',
  tqBodyHeavyNote: 'Nech to obalí jazyk.',

  tqDislikePrompt: 'Čo ťa na káve odradí najrýchlejšie?',
  tqDislikeHelp: 'To, čo ti nechutí, o tebe často povie viac než to, čo máš rád.',
  tqDislikeSour: 'Keď je príliš kyslá',
  tqDislikeBitter: 'Keď je horká alebo spálená',
  tqDislikeWatery: 'Keď je vodová a slabá',
  tqDislikeNone: 'Nič, vypijem takmer všetko',
} as const;
