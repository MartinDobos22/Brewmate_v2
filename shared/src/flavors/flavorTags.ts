/**
 * The flavour vocabulary Brewmate itself produces.
 *
 * The stored map accepts any tag - the vocabulary belongs to the world, not to
 * the code, and a coffee that tastes of jasmine must not need a migration.
 * These are the ones the questionnaire, a rating and a printed label can
 * write, and therefore the ones the app has a Slovak word for.
 *
 * In the contract rather than in the app, because the server writes them now
 * too: a bag bought and a bag rated teach the profile the flavours its label
 * prints, and a tag spelled one way by the phone and another by the API would
 * be two flavours that never meet.
 */
export const FLAVOR_TAGS = {
  fruity: 'fruity',
  citrus: 'citrus',
  berry: 'berry',
  floral: 'floral',
  herbal: 'herbal',
  nutty: 'nutty',
  caramel: 'caramel',
  chocolate: 'chocolate',
  spice: 'spice',
  teaLike: 'tea_like',
} as const;

export type FlavorTag = (typeof FLAVOR_TAGS)[keyof typeof FLAVOR_TAGS];
