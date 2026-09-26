import { FLAVOR_TAGS, type FlavorTag } from './flavorTags.js';

/**
 * The Slovak (and the borrowed English) words a roaster prints on a bag,
 * mapped onto the flavour vocabulary the profile keeps.
 *
 * Matched on the start of a word after the accents are stripped, so
 * "čokoláda", "čokoládový" and "cokolada" are all the same word - and "mat"
 * finds maté without also finding the middle of "aromatický". A note the
 * lexicon does not recognise is not an error and is not thrown away: it stays
 * on the bag as it was written, and nothing is concluded from it, which is the
 * honest outcome.
 */
export const FLAVOR_LEXICON: readonly (readonly [string, FlavorTag])[] = [
  ['cokolad', FLAVOR_TAGS.chocolate],
  ['kakao', FLAVOR_TAGS.chocolate],
  ['chocolat', FLAVOR_TAGS.chocolate],
  ['cocoa', FLAVOR_TAGS.chocolate],
  ['karamel', FLAVOR_TAGS.caramel],
  ['caramel', FLAVOR_TAGS.caramel],
  ['med', FLAVOR_TAGS.caramel],
  ['honey', FLAVOR_TAGS.caramel],
  ['vanil', FLAVOR_TAGS.caramel],
  ['orech', FLAVOR_TAGS.nutty],
  ['oriesk', FLAVOR_TAGS.nutty],
  ['mandl', FLAVOR_TAGS.nutty],
  ['arasid', FLAVOR_TAGS.nutty],
  ['nutty', FLAVOR_TAGS.nutty],
  ['hazelnut', FLAVOR_TAGS.nutty],
  ['almond', FLAVOR_TAGS.nutty],
  ['citrus', FLAVOR_TAGS.citrus],
  ['pomaranc', FLAVOR_TAGS.citrus],
  ['citron', FLAVOR_TAGS.citrus],
  ['limet', FLAVOR_TAGS.citrus],
  ['grep', FLAVOR_TAGS.citrus],
  ['orange', FLAVOR_TAGS.citrus],
  ['lemon', FLAVOR_TAGS.citrus],
  ['bobul', FLAVOR_TAGS.berry],
  ['jahod', FLAVOR_TAGS.berry],
  ['malin', FLAVOR_TAGS.berry],
  ['cucoried', FLAVOR_TAGS.berry],
  ['ribezl', FLAVOR_TAGS.berry],
  ['berr', FLAVOR_TAGS.berry],
  ['kvet', FLAVOR_TAGS.floral],
  ['jazmin', FLAVOR_TAGS.floral],
  ['ruz', FLAVOR_TAGS.floral],
  ['levandul', FLAVOR_TAGS.floral],
  ['floral', FLAVOR_TAGS.floral],
  ['jasmin', FLAVOR_TAGS.floral],
  ['bylin', FLAVOR_TAGS.herbal],
  ['mat', FLAVOR_TAGS.herbal],
  ['caj', FLAVOR_TAGS.teaLike],
  ['tea', FLAVOR_TAGS.teaLike],
  ['koren', FLAVOR_TAGS.spice],
  ['skoric', FLAVOR_TAGS.spice],
  ['klincek', FLAVOR_TAGS.spice],
  ['kardamom', FLAVOR_TAGS.spice],
  ['spic', FLAVOR_TAGS.spice],
  ['ovoc', FLAVOR_TAGS.fruity],
  ['broskyn', FLAVOR_TAGS.fruity],
  ['marhul', FLAVOR_TAGS.fruity],
  ['hrusk', FLAVOR_TAGS.fruity],
  ['jablk', FLAVOR_TAGS.fruity],
  ['mango', FLAVOR_TAGS.fruity],
  ['tropic', FLAVOR_TAGS.fruity],
  ['fruit', FLAVOR_TAGS.fruity],
  ['peach', FLAVOR_TAGS.fruity],
  ['apricot', FLAVOR_TAGS.fruity],
];
