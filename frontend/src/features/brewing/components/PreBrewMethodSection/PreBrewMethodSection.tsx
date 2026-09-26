import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { BrewMethod, Equipment } from '@brewmate/shared';
import { useMemo, type JSX } from 'react';
import { View } from 'react-native';

import { Dropdown, Text, type DropdownOption } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation, type Translator } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { BREW_METHOD_CATEGORY_ICONS, BREW_METHOD_CATEGORY_LABEL_KEYS } from '../../constants';
import { readOwnedMethods } from '../../services';

import { BrewMethodCard } from './BrewMethodCard';
import { createPreBrewMethodSectionStyles } from './PreBrewMethodSection.styles';

export interface PreBrewMethodSectionProps {
  readonly methods: readonly BrewMethod[];
  /**
   * What the cupboard vouches for. Absent is a working state and means no
   * cards - the import step asks the same question with no kitchen behind it.
   */
  readonly brewers?: readonly Equipment[];
  readonly method: BrewMethod | undefined;
  readonly onChoose: (method: BrewMethod) => void;
}

const NOTHING = 0;
const NO_BREWERS: readonly Equipment[] = [];
const SECTION_ICON = 'filter-variant';

const toOption = (method: BrewMethod, t: Translator['t']): DropdownOption => ({
  id: method.id,
  label: method.nameSk,
  note: t(BREW_METHOD_CATEGORY_LABEL_KEYS[method.category]),
  icon: BREW_METHOD_CATEGORY_ICONS[method.category],
});

/**
 * What this is being brewed in: the brewers somebody owns as cards, and the
 * rest of the catalogue behind a field.
 *
 * The split is the point. Choosing between two objects on a counter is a
 * different act from finding one in a list of eighteen, and the cards are what
 * make the first read like the first - a V60 and a moka pot are different
 * objects, not different words. Stacking all eighteen as cards put the dose,
 * the ratio and the grind four scrolls below the top of the screen, which is
 * what the field was introduced to fix, so the field stays for the rest.
 *
 * Every method is still reachable. Hiding the ones nothing in the cupboard
 * points at reads as helpful and behaves as a trap: an unfilled inventory is
 * indistinguishable from an empty one, and somebody standing over a dripper
 * knows they own it better than the inventory does.
 */
export const PreBrewMethodSection = ({
  methods,
  brewers = NO_BREWERS,
  method,
  onChoose,
}: PreBrewMethodSectionProps): JSX.Element => {
  const styles = useThemedStyles(createPreBrewMethodSectionStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  const owned = useMemo(
    (): readonly BrewMethod[] => readOwnedMethods(methods, brewers),
    [methods, brewers],
  );

  const options = useMemo(
    (): readonly DropdownOption[] =>
      methods.map((item: BrewMethod): DropdownOption => toOption(item, t)),
    [methods, t],
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.heading}>
        <MaterialCommunityIcons
          name={SECTION_ICON}
          size={theme.size.iconSmall}
          color={theme.colors.onSurfaceVariant}
        />
        <Text variant="sectionHeading">{t(TRANSLATION_KEYS.preBrewMethodSection)}</Text>
        {owned.length === NOTHING ? null : (
          <Text variant="captionSmall" tone="muted">
            {t(TRANSLATION_KEYS.preBrewMethodOwnedHint)}
          </Text>
        )}
      </View>
      {owned.length === NOTHING ? null : (
        <View style={styles.pair}>
          {owned.map((item: BrewMethod): JSX.Element => (
            <BrewMethodCard
              key={item.id}
              method={item}
              selected={method?.id === item.id}
              onPress={(): void => {
                onChoose(item);
              }}
            />
          ))}
        </View>
      )}
      {methods.length === NOTHING ? (
        <View style={styles.empty}>
          <Text variant="bodyMuted" tone="muted">
            {t(TRANSLATION_KEYS.preBrewMethodEmpty)}
          </Text>
        </View>
      ) : (
        <Dropdown
          label={t(
            owned.length === NOTHING
              ? TRANSLATION_KEYS.preBrewMethodLabel
              : TRANSLATION_KEYS.preBrewMethodMore,
          )}
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
      )}
    </View>
  );
};
