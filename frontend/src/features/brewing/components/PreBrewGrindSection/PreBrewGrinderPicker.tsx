import type { Equipment } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { OptionCard, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { equipmentDisplayName } from '../../../inventory/services';
import { GRINDER_OPTION_ICON } from '../../constants';

import { createPreBrewGrindSectionStyles } from './PreBrewGrindSection.styles';

const SINGLE = 1;

export interface PreBrewGrinderPickerProps {
  readonly candidates: readonly Equipment[];
  readonly chosenId: string | null;
  readonly onChoose: (equipmentId: string) => void;
}

/**
 * Which of their grinders is turning this morning.
 *
 * Drawn only where there is genuinely something to choose between. Almost
 * every kitchen owns one grinder, and a picker with a single option is not a
 * choice - it is a row of furniture on the screen somebody opens with a kettle
 * already boiling. Where there are two, it is the most consequential answer on
 * the card: a click is ten microns on one grinder and forty on another, so the
 * number above it and the advice about which way to move are about a
 * particular machine or they are about nothing.
 *
 * Each option says which kind of answer it can give. A catalogued grinder
 * answers with a setting on its own collar and what one click of it is worth;
 * one the catalogue has never met answers in words. Somebody picking between
 * them is choosing between those two answers, so the card says so rather than
 * letting the difference appear afterwards as a number that went missing.
 */
export const PreBrewGrinderPicker = ({
  candidates,
  chosenId,
  onChoose,
}: PreBrewGrinderPickerProps): JSX.Element | null => {
  const styles = useThemedStyles(createPreBrewGrindSectionStyles);
  const { t } = useTranslation();

  if (candidates.length <= SINGLE) {
    return null;
  }

  return (
    <View style={styles.options}>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.preBrewGrindPickerHint)}
      </Text>
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
    </View>
  );
};
