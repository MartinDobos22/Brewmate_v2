import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';
import { Pressable, View } from 'react-native';

import { Button, Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { coffeeBagSummary } from '../../services/coffeeBagSummary';

import { BagFreshnessLabel } from './BagFreshnessLabel';
import { BagRemainingLabel } from './BagRemainingLabel';
import { createCoffeeBagCardStyles } from './CoffeeBagCard.styles';

export interface CoffeeBagCardProps {
  readonly bag: CoffeeBag;
  readonly onOpen: (bag: CoffeeBag) => void;
  readonly onArchive: (bag: CoffeeBag) => void;
  readonly archiving?: boolean;
}

/**
 * One coffee on the shelf.
 *
 * A card rather than a list row because the two things somebody actually wants
 * at a glance - how much is left and whether it is ready to drink - are facts
 * about the bag, not a subtitle under its name. A finished bag is archived
 * rather than deleted: the brew logs point at it, and a bag somebody drank
 * their way through is the most valuable history this app has.
 */
export const CoffeeBagCard = ({
  bag,
  onOpen,
  onArchive,
  archiving = false,
}: CoffeeBagCardProps): JSX.Element => {
  const styles = useThemedStyles(createCoffeeBagCardStyles);
  const { t } = useTranslation();

  return (
    <Card>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={bag.name}
        onPress={(): void => {
          onOpen(bag);
        }}
      >
        <View style={styles.header}>
          <Text variant="titleMedium">{bag.name}</Text>
          <Text variant="bodySmall" tone="muted">
            {coffeeBagSummary(bag, t(TRANSLATION_KEYS.inventoryBagUnknownDetails))}
          </Text>
        </View>
        <View style={styles.meta}>
          <BagRemainingLabel bag={bag} />
          <BagFreshnessLabel bag={bag} />
        </View>
      </Pressable>
      <View style={styles.actions}>
        <Button
          label={t(TRANSLATION_KEYS.inventoryBagOpen)}
          variant="tertiary"
          onPress={(): void => {
            onOpen(bag);
          }}
        />
        <Button
          label={t(TRANSLATION_KEYS.inventoryBagArchive)}
          variant="tertiary"
          loading={archiving}
          onPress={(): void => {
            onArchive(bag);
          }}
        />
      </View>
    </Card>
  );
};
