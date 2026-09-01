import type { PartialTasteAxes } from '../../tasteProfiles/tasteAxesSchema.js';

/**
 * What a printed tasting note says about the cup, in axes.
 *
 * The roaster tasted this lot and wrote down what they found, which makes this
 * the most specific evidence on the bag - better than any generalisation about
 * a country. It is not weighted above the roast level only because it is
 * marketing as well as description, and nobody has ever printed "flat" on a
 * bag.
 *
 * Slovak and English stems both, matched against normalised text, because a
 * Slovak roaster prints either and an imported bag prints English. A note the
 * lexicon does not recognise contributes nothing rather than a guess - the
 * model reads those, and this table is what still works with no signal in a
 * shop and no allowance left.
 *
 * The axes each note claims are deliberately few. "Jahoda" is strong evidence
 * about acidity and sweetness and says nothing whatever about body, and a
 * lexicon that filled in all five for every word would drown the signals that
 * do know something.
 */
export const NOTE_SIGNALS: readonly (readonly [string, PartialTasteAxes])[] = [
  /** Sharp fruit: the clearest acidity words there are. */
  ['citrus', { acidity: 8.5, sweetness: 5.5 }],
  ['citron', { acidity: 8.5, sweetness: 4.5 }],
  ['lemon', { acidity: 8.5, sweetness: 4.5 }],
  ['limet', { acidity: 8.5, sweetness: 4.5 }],
  ['lime', { acidity: 8.5, sweetness: 4.5 }],
  ['grep', { acidity: 8.5, sweetness: 4.5, bitterness: 6 }],
  ['grapefruit', { acidity: 8.5, sweetness: 4.5, bitterness: 6 }],
  ['pomaranc', { acidity: 7.5, sweetness: 6.5 }],
  ['orange', { acidity: 7.5, sweetness: 6.5 }],
  ['mandarin', { acidity: 7, sweetness: 7 }],
  ['ribezl', { acidity: 8.5, sweetness: 6 }],
  ['currant', { acidity: 8.5, sweetness: 6 }],
  ['brusnic', { acidity: 8, sweetness: 5.5 }],
  ['cranberr', { acidity: 8, sweetness: 5.5 }],
  ['zelene jablk', { acidity: 8, sweetness: 5 }],
  ['green apple', { acidity: 8, sweetness: 5 }],
  ['rebarbor', { acidity: 8.5, sweetness: 5 }],
  ['hibisk', { acidity: 8, sweetness: 6 }],
  /** Soft fruit: acidity with real sweetness behind it. */
  ['jahod', { acidity: 7, sweetness: 7.5 }],
  ['strawberr', { acidity: 7, sweetness: 7.5 }],
  ['malin', { acidity: 7.5, sweetness: 7 }],
  ['raspberr', { acidity: 7.5, sweetness: 7 }],
  ['cucoried', { acidity: 7, sweetness: 7 }],
  ['blueberr', { acidity: 7, sweetness: 7 }],
  ['bobul', { acidity: 7.5, sweetness: 7 }],
  ['berry', { acidity: 7.5, sweetness: 7 }],
  ['visn', { acidity: 7.5, sweetness: 6.5 }],
  ['cherry', { acidity: 7.5, sweetness: 6.5 }],
  ['ceresn', { acidity: 7, sweetness: 7 }],
  ['marhul', { acidity: 6.5, sweetness: 7.5 }],
  ['apricot', { acidity: 6.5, sweetness: 7.5 }],
  ['broskyn', { acidity: 6, sweetness: 7.5 }],
  ['peach', { acidity: 6, sweetness: 7.5 }],
  ['slivk', { acidity: 6, sweetness: 7.5, body: 6.5 }],
  ['plum', { acidity: 6, sweetness: 7.5, body: 6.5 }],
  ['hrozn', { acidity: 6, sweetness: 7.5 }],
  ['grape', { acidity: 6, sweetness: 7.5 }],
  ['jablk', { acidity: 6.5, sweetness: 6.5 }],
  ['apple', { acidity: 6.5, sweetness: 6.5 }],
  /** Tropical and ripe: sweetness first, and usually a natural. */
  ['tropic', { acidity: 6.5, sweetness: 8 }],
  ['mango', { acidity: 6, sweetness: 8 }],
  ['ananas', { acidity: 7.5, sweetness: 7.5 }],
  ['pineapple', { acidity: 7.5, sweetness: 7.5 }],
  ['papaj', { acidity: 5.5, sweetness: 8 }],
  ['banan', { acidity: 4, sweetness: 8, body: 7 }],
  ['banana', { acidity: 4, sweetness: 8, body: 7 }],
  ['melon', { acidity: 5, sweetness: 7.5 }],
  ['datl', { acidity: 3.5, sweetness: 8.5, body: 7 }],
  ['date', { acidity: 3.5, sweetness: 8.5, body: 7 }],
  ['fig', { acidity: 4, sweetness: 8.5, body: 7 }],
  /** Floral and tea-like: the lightest bodies on any shelf. */
  ['jazmin', { acidity: 7.5, body: 3.5 }],
  ['jasmin', { acidity: 7.5, body: 3.5 }],
  ['kvet', { acidity: 7, body: 4 }],
  ['floral', { acidity: 7, body: 4 }],
  ['ruz', { acidity: 7, body: 4 }],
  ['rose', { acidity: 7, body: 4 }],
  ['bergam', { acidity: 7.5, body: 4 }],
  ['levandul', { acidity: 6.5, body: 4 }],
  ['caj', { acidity: 6.5, body: 3.5, intensity: 4 }],
  ['tea', { acidity: 6.5, body: 3.5, intensity: 4 }],
  ['earl grey', { acidity: 7, body: 3.5 }],
  /** Sugars and confectionery: sweetness and weight, low acidity. */
  ['karamel', { acidity: 4, sweetness: 8, body: 6.5 }],
  ['caramel', { acidity: 4, sweetness: 8, body: 6.5 }],
  ['med', { acidity: 5, sweetness: 8 }],
  ['honey', { acidity: 5, sweetness: 8 }],
  ['vanil', { acidity: 4, sweetness: 7.5 }],
  ['javorov', { acidity: 4, sweetness: 8.5, body: 6.5 }],
  ['maple', { acidity: 4, sweetness: 8.5, body: 6.5 }],
  ['toffee', { acidity: 3.5, sweetness: 8, body: 7 }],
  ['nugat', { acidity: 3.5, sweetness: 8, body: 7 }],
  ['nougat', { acidity: 3.5, sweetness: 8, body: 7 }],
  ['marcipan', { acidity: 4, sweetness: 8, body: 6.5 }],
  ['marzipan', { acidity: 4, sweetness: 8, body: 6.5 }],
  ['sirup', { acidity: 4, sweetness: 8.5, body: 7 }],
  ['cukrov', { acidity: 4, sweetness: 8.5 }],
  /** Chocolate and nuts: the heavy, low-acid half of the vocabulary. */
  ['mliecna cokolad', { acidity: 3.5, sweetness: 8, body: 7 }],
  ['milk chocolate', { acidity: 3.5, sweetness: 8, body: 7 }],
  ['horka cokolad', { acidity: 3.5, sweetness: 5, body: 7.5, bitterness: 7 }],
  ['tmava cokolad', { acidity: 3.5, sweetness: 5, body: 7.5, bitterness: 7 }],
  ['dark chocolate', { acidity: 3.5, sweetness: 5, body: 7.5, bitterness: 7 }],
  ['cokolad', { acidity: 3.5, sweetness: 6.5, body: 7 }],
  ['chocolate', { acidity: 3.5, sweetness: 6.5, body: 7 }],
  ['kakao', { acidity: 3.5, sweetness: 5.5, body: 7, bitterness: 6.5 }],
  ['cocoa', { acidity: 3.5, sweetness: 5.5, body: 7, bitterness: 6.5 }],
  ['orech', { acidity: 3.5, sweetness: 6.5, body: 6.5 }],
  ['nutty', { acidity: 3.5, sweetness: 6.5, body: 6.5 }],
  ['mandl', { acidity: 4, sweetness: 6.5, body: 6 }],
  ['almond', { acidity: 4, sweetness: 6.5, body: 6 }],
  ['lieskov', { acidity: 3.5, sweetness: 7, body: 6.5 }],
  ['hazelnut', { acidity: 3.5, sweetness: 7, body: 6.5 }],
  ['arasid', { acidity: 3.5, sweetness: 6.5, body: 7 }],
  ['peanut', { acidity: 3.5, sweetness: 6.5, body: 7 }],
  ['pekan', { acidity: 3.5, sweetness: 7, body: 6.5 }],
  /** Roast-forward and savoury: what a dark roast or a low-grown lot tastes of. */
  ['tabak', { acidity: 3, sweetness: 5, body: 7.5, bitterness: 7, intensity: 8 }],
  ['tobacco', { acidity: 3, sweetness: 5, body: 7.5, bitterness: 7, intensity: 8 }],
  ['zemit', { acidity: 2.5, sweetness: 5, body: 8, bitterness: 6.5 }],
  ['earth', { acidity: 2.5, sweetness: 5, body: 8, bitterness: 6.5 }],
  ['drev', { acidity: 3, sweetness: 5, body: 7, bitterness: 6.5 }],
  ['wood', { acidity: 3, sweetness: 5, body: 7, bitterness: 6.5 }],
  ['praz', { acidity: 3, sweetness: 5.5, body: 7.5, bitterness: 7, intensity: 8 }],
  ['roast', { acidity: 3, sweetness: 5.5, body: 7.5, bitterness: 7, intensity: 8 }],
  ['dym', { acidity: 3, sweetness: 5, body: 7.5, bitterness: 7.5, intensity: 8.5 }],
  ['smok', { acidity: 3, sweetness: 5, body: 7.5, bitterness: 7.5, intensity: 8.5 }],
  ['korenist', { acidity: 4.5, sweetness: 6, body: 7, intensity: 7 }],
  ['spic', { acidity: 4.5, sweetness: 6, body: 7, intensity: 7 }],
  ['skoric', { acidity: 4.5, sweetness: 7, body: 6.5 }],
  ['cinnamon', { acidity: 4.5, sweetness: 7, body: 6.5 }],
  ['maslov', { acidity: 3.5, sweetness: 7, body: 7.5 }],
  ['buttery', { acidity: 3.5, sweetness: 7, body: 7.5 }],
  ['kremov', { acidity: 4, sweetness: 7, body: 7.5 }],
  ['creamy', { acidity: 4, sweetness: 7, body: 7.5 }],
  /** Words about the cup itself rather than about a flavour in it. */
  ['ciste', { acidity: 6.5, body: 4.5, bitterness: 3.5 }],
  ['clean', { acidity: 6.5, body: 4.5, bitterness: 3.5 }],
  ['jemn', { acidity: 5.5, body: 4.5, intensity: 4 }],
  ['delicate', { acidity: 5.5, body: 4.5, intensity: 4 }],
  ['plne tel', { body: 8, intensity: 7.5 }],
  ['full bod', { body: 8, intensity: 7.5 }],
  ['siln', { body: 7.5, intensity: 8 }],
  ['bold', { body: 7.5, intensity: 8 }],
  ['vyvazen', { acidity: 5.5, sweetness: 6.5, body: 6, bitterness: 4.5 }],
  ['balanc', { acidity: 5.5, sweetness: 6.5, body: 6, bitterness: 4.5 }],
  ['sladk', { sweetness: 8 }],
  ['sweet', { sweetness: 8 }],
  ['kysl', { acidity: 7.5 }],
  ['acid', { acidity: 7.5 }],
  ['ziv', { acidity: 7.5, intensity: 6 }],
  ['bright', { acidity: 7.5, intensity: 6 }],
  ['ovocn', { acidity: 7, sweetness: 7 }],
  ['fruit', { acidity: 7, sweetness: 7 }],
];
