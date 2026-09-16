import type { DropdownOption } from '../../../components/ui';
import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/**
 * What the dropdown is demonstrated with.
 *
 * Three brewers rather than three abstract options, because the thing worth
 * checking on this screen is what a real answer looks like closed: a name, the
 * family under it and a glyph, all of it inside one line's worth of field.
 */
export interface PreviewDropdownOption {
  readonly id: string;
  readonly labelKey: TranslationKey;
  readonly noteKey: TranslationKey;
  readonly icon: DropdownOption['icon'];
}

export const PREVIEW_DROPDOWN_OPTIONS: readonly PreviewDropdownOption[] = [
  {
    id: 'v60',
    labelKey: TRANSLATION_KEYS.dsDropdownFirst,
    noteKey: TRANSLATION_KEYS.preBrewMethodCategoryPourOver,
    icon: 'filter-outline',
  },
  {
    id: 'aeropress',
    labelKey: TRANSLATION_KEYS.dsDropdownSecond,
    noteKey: TRANSLATION_KEYS.preBrewMethodCategoryImmersion,
    icon: 'cup-outline',
  },
  {
    id: 'espresso',
    labelKey: TRANSLATION_KEYS.dsDropdownThird,
    noteKey: TRANSLATION_KEYS.preBrewMethodCategoryEspresso,
    icon: 'coffee-maker-outline',
  },
];
