/**
 * The two questions asked only of somebody who already has the vocabulary.
 *
 * No proxies here at all. Routing a competition barista's preferences through
 * a question about milk chocolate throws away precision they were willing to
 * give directly. There used to be a third, about which side of a correct
 * extraction they like to sit on - a good question about brewing, and so the
 * wrong one for a questionnaire whose whole job is choosing a coffee to buy.
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
} as const;
