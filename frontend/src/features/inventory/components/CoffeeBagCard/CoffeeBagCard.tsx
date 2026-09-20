import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';
import { Pressable, View } from 'react-native';

import { Card, Chip, Text } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { ROAST_LEVEL_LABEL_KEYS } from '../../../tasteProfile/constants';
import { bagAttributes } from '../../services/bagAttributes';

import { BagFreshnessDial } from './BagFreshnessDial';
import { BagFreshnessStatus } from './BagFreshnessStatus';
import { BagRemainingBar } from './BagRemainingBar';
import { CoffeeBagActions } from './CoffeeBagActions';
import { createCoffeeBagCardStyles } from './CoffeeBagCard.styles';

export interface CoffeeBagCardProps {
  readonly bag: CoffeeBag;
  readonly onOpen: (bag: CoffeeBag) => void;
  readonly onBrew: (bag: CoffeeBag) => void;
  readonly onArchive: (bag: CoffeeBag) => void;
  readonly archiving?: boolean;
  /** The bag this screen most wants opened, lifted a step further off the page. */
  readonly emphasised?: boolean;
}

/**
 * One coffee on the shelf.
 *
 * The dial carries what used to be a line of text: how far through its window
 * this bag is, drawn, so the shelf can be read at a glance rather than
 * sentence by sentence. Beside it the coffee itself - its name, the three
 * facts off its label as chips, and what the dial means in words.
 *
 * How much is left stays a bar, deliberately a different shape from the dial.
 * Remaining mass and remaining freshness are different quantities, and one
 * control drawn twice would invite somebody to read them as the same one.
 *
 * The card body still opens the coffee, so the two buttons under it are the
 * two things somebody does *without* opening it. A finished bag is archived
 * rather than deleted: the brew logs point at it, and a bag somebody drank
 * their way through is the most valuable history this app has.
 */
export const CoffeeBagCard = ({
  bag,
  onOpen,
  onBrew,
  onArchive,
  archiving = false,
  emphasised = false,
}: CoffeeBagCardProps): JSX.Element => {
  const styles = useThemedStyles(createCoffeeBagCardStyles);
  const { t } = useTranslation();
  const roastLabel = bag.roastLevel === null ? null : t(ROAST_LEVEL_LABEL_KEYS[bag.roastLevel]);

  return (
    <Card variant={emphasised ? 'softEmphasis' : 'soft'}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={bag.name}
        onPress={(): void => {
          onOpen(bag);
        }}
        style={styles.body}
      >
        <BagFreshnessDial bag={bag} />
        <View style={styles.facts}>
          <Text variant="itemTitle">{bag.name}</Text>
          <View style={styles.chips}>
            {bagAttributes(bag, roastLabel).map((attribute: string): JSX.Element => (
              <Chip key={attribute} label={attribute} />
            ))}
          </View>
          <BagFreshnessStatus bag={bag} />
        </View>
      </Pressable>
      <BagRemainingBar bag={bag} />
      <CoffeeBagActions
        archiving={archiving}
        onBrew={(): void => {
          onBrew(bag);
        }}
        onArchive={(): void => {
          onArchive(bag);
        }}
      />
    </Card>
  );
};
