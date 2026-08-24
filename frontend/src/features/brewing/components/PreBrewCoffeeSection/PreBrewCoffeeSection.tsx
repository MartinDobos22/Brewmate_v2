import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, Chip, Input, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';
import { useCoffeeBags } from '../../../inventory/hooks';

import { createPreBrewCoffeeSectionStyles } from './PreBrewCoffeeSection.styles';

export interface PreBrewCoffeeSectionProps {
  readonly bag: CoffeeBag | null;
  readonly description: string;
  readonly onChooseBag: (bag: CoffeeBag | null) => void;
  readonly onDescribe: (description: string) => void;
}

const NOTHING = 0;
const NONE: readonly CoffeeBag[] = [];

const bagLabel = (bag: CoffeeBag, remaining: string): string =>
  bag.remainingGrams === null ? bag.name : `${bag.name} · ${remaining}`;

/**
 * Which coffee, or the honest answer that it is not written down.
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
        <View style={styles.chips}>
          {bags.map((item: CoffeeBag): JSX.Element => (
            <Chip
              key={item.id}
              label={bagLabel(
                item,
                `${t(TRANSLATION_KEYS.preBrewCoffeeRemaining)} ${formatGrams(item.remainingGrams ?? NOTHING)}`,
              )}
              selected={bag?.id === item.id}
              onPress={(): void => {
                onChooseBag(item);
              }}
            />
          ))}
          <Chip
            label={t(TRANSLATION_KEYS.preBrewCoffeeNone)}
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
