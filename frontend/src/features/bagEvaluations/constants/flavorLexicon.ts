import { FLAVOR_TAGS, type FlavorTag } from '../../tasteProfile/constants';

/**
 * The Slovak (and the borrowed English) words a roaster prints on a bag,
 * mapped onto the flavour vocabulary the profile keeps.
 *
 * Matched on a prefix after the accents are stripped, so "čokoláda",
 * "čokoládový" and "cokolada" are all the same word. A note the lexicon does
 * not recognise is not an error and is not thrown away - it stays on the bag
 * as it was written, and the verdict simply says nothing about it, which is
 * the honest outcome.
 */
export const FLAVOR_LEXICON: readonly (readonly [string, FlavorTag])[] = [
  ['cokolad', FLAVOR_TAGS.chocolate],
  ['kakao', FLAVOR_TAGS.chocolate],
  ['karamel', FLAVOR_TAGS.caramel],
  ['med', FLAVOR_TAGS.caramel],
  ['vanil', FLAVOR_TAGS.caramel],
  ['orech', FLAVOR_TAGS.nutty],
  ['mandl', FLAVOR_TAGS.nutty],
  ['arasid', FLAVOR_TAGS.nutty],
  ['citrus', FLAVOR_TAGS.citrus],
  ['pomaranc', FLAVOR_TAGS.citrus],
  ['citron', FLAVOR_TAGS.citrus],
  ['limet', FLAVOR_TAGS.citrus],
  ['grep', FLAVOR_TAGS.citrus],
  ['bobul', FLAVOR_TAGS.berry],
  ['jahod', FLAVOR_TAGS.berry],
  ['malin', FLAVOR_TAGS.berry],
  ['cucoried', FLAVOR_TAGS.berry],
  ['ribezl', FLAVOR_TAGS.berry],
  ['kvet', FLAVOR_TAGS.floral],
  ['jazmin', FLAVOR_TAGS.floral],
  ['ruz', FLAVOR_TAGS.floral],
  ['levandul', FLAVOR_TAGS.floral],
  ['bylin', FLAVOR_TAGS.herbal],
  ['mat', FLAVOR_TAGS.herbal],
  ['caj', FLAVOR_TAGS.teaLike],
  ['koren', FLAVOR_TAGS.spice],
  ['skoric', FLAVOR_TAGS.spice],
  ['klincek', FLAVOR_TAGS.spice],
  ['kardamom', FLAVOR_TAGS.spice],
  ['ovoc', FLAVOR_TAGS.fruity],
  ['broskyn', FLAVOR_TAGS.fruity],
  ['marhul', FLAVOR_TAGS.fruity],
  ['hrusk', FLAVOR_TAGS.fruity],
  ['jablk', FLAVOR_TAGS.fruity],
  ['mango', FLAVOR_TAGS.fruity],
  ['tropic', FLAVOR_TAGS.fruity],
];
