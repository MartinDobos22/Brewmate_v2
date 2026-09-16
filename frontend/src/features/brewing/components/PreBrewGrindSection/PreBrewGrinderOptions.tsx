import type { Equipment } from '@brewmate/shared';
import type { JSX } from 'react';
import { ScrollView, View } from 'react-native';

import { OptionCard } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { equipmentDisplayName } from '../../../inventory/services';
import { GRINDER_OPTION_ICON } from '../../constants';

import { createPreBrewGrindSectionStyles } from './PreBrewGrindSection.styles';

export interface PreBrewGrinderOptionsProps {
  readonly candidates: readonly Equipment[];
  readonly chosenId: string | null;
  readonly onChoose: (equipmentId: string) => void;
  readonly onBrowseCatalogue: () => void;
}

/**
 * The grinders somebody owns, and the way to add the one they do not.
 *
 * Each option says which kind of answer it can give, because that is the real
 * difference between them: a catalogued grinder answers with a setting on its
 * own collar and what one click of it is worth, one the catalogue has never
 * met answers in words. Somebody picking between them is choosing between
 * those two answers, so the list says so rather than letting the difference
 * turn up afterwards as a number that went missing.
 *
 * The catalogue sits at the bottom of the same list rather than beside it,
 * because "ešte som ti žiadny nezapísal" is an answer to the same question.
 */
export const PreBrewGrinderOptions = ({
  candidates,
  chosenId,
  onChoose,
  onBrowseCatalogue,
}: PreBrewGrinderOptionsProps): JSX.Element => {
  const styles = useThemedStyles(createPreBrewGrindSectionStyles);
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
      <View style={styles.options}>
        {candidates.map((item: Equipment): JSX.Element => (
          <OptionCard
            key={item.id}
            label={equipmentDisplayName(item, t(TRANSLATION_KEYS.preBrewGrindUnnamed))}
            note={t(
              item.catalogGrinderId === null
                ? TRANSLATION_KEYS.preBrewGrindPickerWords
                : TRANSLATION_KEYS.preBrewGrindPickerNumber,
            )}
            icon={GRINDER_OPTION_ICON}
            selected={item.id === chosenId}
            onPress={(): void => {
              onChoose(item.id);
            }}
          />
        ))}
        <OptionCard
          label={t(TRANSLATION_KEYS.preBrewGrindPickerFromCatalogue)}
          note={t(TRANSLATION_KEYS.preBrewGrindPickerFromCatalogueNote)}
          onPress={onBrowseCatalogue}
        />
      </View>
    </ScrollView>
  );
};
