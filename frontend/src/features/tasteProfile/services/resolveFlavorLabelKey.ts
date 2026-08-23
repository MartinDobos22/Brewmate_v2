import type { TranslationKey } from '../../../i18n';
import { FLAVOR_TAGS, FLAVOR_TAG_LABEL_KEYS, type FlavorTag } from '../constants/flavorTags';

const KNOWN_TAGS: readonly string[] = Object.values(FLAVOR_TAGS);

const isKnownTag = (tag: string): tag is FlavorTag => KNOWN_TAGS.includes(tag);

/**
 * The Slovak word for a flavour tag, or `null` when there is none.
 *
 * The stored vocabulary is open, so "no translation" is a normal answer here
 * rather than a bug - the caller prints the tag as it was stored, the way it
 * prints a coffee's variety.
 */
export const resolveFlavorLabelKey = (tag: string): TranslationKey | null =>
  isKnownTag(tag) ? FLAVOR_TAG_LABEL_KEYS[tag] : null;
