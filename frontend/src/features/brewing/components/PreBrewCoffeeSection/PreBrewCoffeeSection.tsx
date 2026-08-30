import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, Input, OptionCard, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useCoffeeBags } from '../../../inventory/hooks';
import { PRE_BREW_COFFEE_ICONS } from '../../constants';

import { createPreBrewCoffeeSectionStyles } from './PreBrewCoffeeSection.styles';
import { PreBrewBagOption } from './PreBrewBagOption';

export interface PreBrewCoffeeSectionProps {
  readonly bag: CoffeeBag | null;
  readonly description: string;
  readonly onChooseBag: (bag: CoffeeBag | null) => void;
  readonly onDescribe: (description: string) => void;
}

const NOTHING = 0;
const NONE: readonly CoffeeBag[] = [];

/**
 * Which coffee, or the honest answer that it is not written down.
 *
 * Cards rather than chips, because choosing what to brew is a decision made on
 * two facts a chip has no room for: how much is left, and whether the bag is
 * ready. A row of names alone made the bag that had been resting three days
 * look exactly like the one at its peak.
 *
 * "Nemám ju zapísanú" sits beside the bags at the same weight, because the
 * whole promise of this app is that nobody has to fill in a database before
 * they are allowed to make coffee. Choosing it opens one free-text line rather
 * than a form: whatever somebody can say about the beans makes the recipe
 * better, and saying nothing is still an answer.
 */
export const PreBrewCoffeeSection = ({
  bag,
  description,
  onChooseBag,
  onDescribe,
}: PreBrewCoffeeSectionProps): JSX.Element => {
  const styles = useThemedStyles(createPreBrewCoffeeSectionStyles);
  const { t } = useTranslation();
  const bags = useCoffeeBags().data?.items ?? NONE;

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.preBrewCoffeeSection)}</Text>
      {bags.length === NOTHING ? (
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.preBrewCoffeeEmpty)}
        </Text>
      ) : (
        <View style={styles.options}>
          {bags.map((item: CoffeeBag): JSX.Element => (
            <PreBrewBagOption
              key={item.id}
              bag={item}
              selected={bag?.id === item.id}
              onChoose={onChooseBag}
            />
          ))}
          <OptionCard
            label={t(TRANSLATION_KEYS.preBrewCoffeeNone)}
            icon={PRE_BREW_COFFEE_ICONS.unknown}
            selected={bag === null}
            onPress={(): void => {
              onChooseBag(null);
            }}
          />
        </View>
      )}
      {bag === null ? (
        <View style={styles.freeText}>
          <Text variant="bodySmall" tone="muted">
            {t(TRANSLATION_KEYS.preBrewCoffeeNoneHint)}
          </Text>
          <Input
            label={t(TRANSLATION_KEYS.preBrewCoffeeDescriptionLabel)}
            placeholder={t(TRANSLATION_KEYS.preBrewCoffeeDescriptionPlaceholder)}
            value={description}
            onChangeText={onDescribe}
          />
        </View>
      ) : null}
    </Card>
  );
};
