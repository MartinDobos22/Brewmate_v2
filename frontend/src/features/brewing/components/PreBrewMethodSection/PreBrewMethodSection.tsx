import type { BrewMethod } from '@brewmate/shared';
import { useMemo, type JSX } from 'react';
import { View } from 'react-native';

import { Card, Dropdown, Text, type DropdownOption } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation, type Translator } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { BREW_METHOD_CATEGORY_ICONS, BREW_METHOD_CATEGORY_LABEL_KEYS } from '../../constants';

import { createPreBrewMethodSectionStyles } from './PreBrewMethodSection.styles';

export interface PreBrewMethodSectionProps {
  readonly methods: readonly BrewMethod[];
  readonly method: BrewMethod | undefined;
  readonly onChoose: (method: BrewMethod) => void;
}

const NOTHING = 0;

const toOption = (method: BrewMethod, t: Translator['t']): DropdownOption => ({
  id: method.id,
  label: method.nameSk,
  note: t(BREW_METHOD_CATEGORY_LABEL_KEYS[method.category]),
  icon: BREW_METHOD_CATEGORY_ICONS[method.category],
});

/**
 * What this is being brewed in, as one line that opens into the catalogue.
 *
 * Every method in it, not only the ones the cupboard vouches for. Hiding the
 * rest made an unfilled inventory look like an empty one, and left somebody
 * holding a dripper with cupping as their only option.
 *
 * Eighteen of them used to be stacked here as cards, which put the dose, the
 * ratio and the grind - the three numbers this screen exists for - four
 * scrolls below the top of it. Closed, this says which brewer and what family
 * it belongs to; open, it is the same cards it always was, in a panel, with a
 * box to type into. The search matters because the list is a catalogue rather
 * than a question: somebody who owns an Origami knows its name and should not
 * have to find it by scrolling past six things they have never owned.
 *
 * The glyph comes from the category, never from the method's key: adding a
 * method is an insert, and a table keyed by `key` would give the next one a
 * blank square.
 */
export const PreBrewMethodSection = ({
  methods,
  method,
  onChoose,
}: PreBrewMethodSectionProps): JSX.Element => {
  const styles = useThemedStyles(createPreBrewMethodSectionStyles);
  const { t } = useTranslation();

  const options = useMemo(
    (): readonly DropdownOption[] =>
      methods.map((item: BrewMethod): DropdownOption => toOption(item, t)),
    [methods, t],
  );

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.preBrewMethodSection)}</Text>
      {methods.length === NOTHING ? (
        <View style={styles.empty}>
          <Text variant="bodySmall" tone="muted">
            {t(TRANSLATION_KEYS.preBrewMethodEmpty)}
          </Text>
        </View>
      ) : (
        <View style={styles.options}>
          <Dropdown
            label={t(TRANSLATION_KEYS.preBrewMethodLabel)}
            placeholder={t(TRANSLATION_KEYS.preBrewMethodPlaceholder)}
            options={options}
            selectedId={method?.id ?? null}
            sheetTitle={t(TRANSLATION_KEYS.preBrewMethodSheetTitle)}
            closeLabel={t(TRANSLATION_KEYS.actionClose)}
            search={{
              label: t(TRANSLATION_KEYS.preBrewMethodSearchLabel),
              placeholder: t(TRANSLATION_KEYS.preBrewMethodSearchPlaceholder),
              emptyLabel: t(TRANSLATION_KEYS.preBrewMethodSearchEmpty),
            }}
            onSelect={(id: string): void => {
              const chosen = methods.find((item: BrewMethod): boolean => item.id === id);

              if (chosen !== undefined) {
                onChoose(chosen);
              }
            }}
          />
          <Text variant="bodySmall" tone="muted">
            {t(TRANSLATION_KEYS.preBrewMethodHint)}
          </Text>
        </View>
      )}
    </Card>
  );
};
