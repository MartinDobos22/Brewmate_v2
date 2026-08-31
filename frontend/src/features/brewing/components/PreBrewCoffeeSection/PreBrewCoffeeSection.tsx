import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, Card, Input, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams } from '../../../../lib/formatters';
import { BAG_FRESHNESS_LABEL_KEYS } from '../../../inventory/constants';
import { resolveBagFreshness } from '../../../inventory/services';
import { useThemedStyles } from '../../../../theme';

import { createPreBrewCoffeeSectionStyles } from './PreBrewCoffeeSection.styles';

export interface PreBrewCoffeeSectionProps {
  readonly bag: CoffeeBag | null;
  readonly description: string;
  readonly onDescribe: (description: string) => void;
  readonly onChange: () => void;
}

/**
 * Which coffee was chosen, and the one way to choose a different one.
 *
 * It reports rather than offers. The list of bags used to live here as well as
 * on the screen before it, which meant two places set the same thing - and two
 * places that set one value are two places that eventually disagree about what
 * it is. So this card says what was answered and sends anybody who wants to
 * change it back to the question, where the camera is also waiting.
 *
 * "Nemám ju zapísanú" is still a first-class answer, and it opens one free-text
 * line rather than a form: whatever somebody can say about the beans makes the
 * recipe better, and saying nothing is still an answer.
 */
export const PreBrewCoffeeSection = ({
  bag,
  description,
  onDescribe,
  onChange,
}: PreBrewCoffeeSectionProps): JSX.Element => {
  const styles = useThemedStyles(createPreBrewCoffeeSectionStyles);
  const { t } = useTranslation();
  const freshnessKey =
    bag === null ? null : BAG_FRESHNESS_LABEL_KEYS[resolveBagFreshness(bag).freshness];

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.preBrewCoffeeSection)}</Text>
      <View style={styles.chosen}>
        <Text variant="titleSmall">
          {bag === null ? t(TRANSLATION_KEYS.preBrewCoffeeNone) : bag.name}
        </Text>
        {bag === null || freshnessKey === null ? null : (
          <Text variant="bodySmall" tone="muted">
            {[
              ...(bag.remainingGrams === null
                ? []
                : [
                    `${t(TRANSLATION_KEYS.preBrewCoffeeRemaining)} ${formatGrams(bag.remainingGrams)} ${t(TRANSLATION_KEYS.unitGrams)}`,
                  ]),
              t(freshnessKey),
            ].join(t(TRANSLATION_KEYS.listSeparator))}
          </Text>
        )}
      </View>
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
      <View style={styles.freeText}>
        <Button
          label={t(TRANSLATION_KEYS.preBrewCoffeeChange)}
          variant="tertiary"
          fullWidth
          onPress={onChange}
        />
      </View>
    </Card>
  );
};
