/**
 * The three questions asked only of somebody who already has the vocabulary.
 *
 * No proxies here at all. Routing a competition barista's preferences through
 * a question about milk chocolate throws away precision they were willing to
 * give directly - and the extraction question in particular is the single most
 * useful answer in the whole questionnaire, because it describes what they
 * want done with a coffee rather than which coffee they want.
 */
export const SK_TASTE_QUESTIONS_EXPERT = {
  tqOriginPrompt: 'Po ktorom pôvode siahaš najčastejšie?',
  tqOriginHelp: 'To, čo si reálne kupuješ, nie to, čo znie najlepšie.',
  tqOriginEthiopia: 'Etiópia',
  tqOriginEthiopiaNote: 'Kvetinové, čajové, ľahké telo.',
  tqOriginKenya: 'Keňa',
  tqOriginKenyaNote: 'Ostrá ovocná kyslosť, ríbezle, plnšie telo.',
  tqOriginColombia: 'Kolumbia',
  tqOriginColombiaNote: 'Vyvážené, karamelovo-ovocné.',
  tqOriginBrazil: 'Brazília',
  tqOriginBrazilNote: 'Orechy, čokoláda, nízka kyslosť.',
  tqOriginIndonesia: 'Indonézia',
  tqOriginIndonesiaNote: 'Zemité, korenisté, husté telo.',
  tqOriginNone: 'Nemám favorita, striedam',

  tqProcessPrompt: 'Aké spracovanie ti sadne najviac?',
  tqProcessHelp: 'Tu sa rozchádzajú aj ľudia, ktorí inak pijú to isté.',
  tqProcessWashed: 'Washed',
  tqProcessWashedNote: 'Čisté, presné, kyslosť na prvom mieste.',
  tqProcessNatural: 'Natural',
  tqProcessNaturalNote: 'Sladké, ovocné, hustejšie.',
  tqProcessExperimental: 'Anaeróbne a experimentálne',
  tqProcessExperimentalNote: 'Výrazné, niekedy až divoké.',
  tqProcessNone: 'Nerozlišujem, ide mi o konkrétnu kávu',

  tqExtractionPrompt: 'Kde chceš mať extrakciu?',
  tqExtractionHelp: 'Toto mi povie najviac o tom, aké recepty ti mám dávať.',
  tqExtractionBright: 'Radšej kúsok pod',
  tqExtractionBrightNote: 'Živšie a kyslejšie, aj za cenu tenšieho tela.',
  tqExtractionBalanced: 'V strede, na sladkosti',
  tqExtractionBalancedNote: 'Maximum sladkosti, kyslosť aj horkosť pod kontrolou.',
  tqExtractionHeavy: 'Radšej kúsok nad',
  tqExtractionHeavyNote: 'Plné telo a hĺbka, drobná horkosť mi neprekáža.',
} as const;
