import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { EmptyState, PillButton, QueryState, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { INVENTORY_EMPTY_ICONS } from '../../../inventory/constants';
import { useCoffeeBags } from '../../../inventory/hooks';
import { PreBrewBagOption } from '../PreBrewBagOption';

import { createBrewCoffeeSourceStyles } from './BrewCoffeeSourceScreen.styles';

const NOTHING = 0;
const NOT_SELECTED = false;

export interface CoffeeSourceBagListProps {
  readonly onChoose: (bag: CoffeeBag) => void;
  readonly onPhotograph: () => void;
  readonly onBack: () => void;
}

/**
 * What is in the cupboard, in the order the cupboard itself lists it.
 *
 * The same option card the brewing screen has always used, carrying how much
 * is left and whether the bag is ready - the two facts that decide which
 * coffee gets opened this morning, and the two a row of names has no room for.
 *
 * An empty cupboard is not a dead end and not an error. It is the ordinary
 * state of a new account, and the way out of it is the camera on the screen
 * they just came from.
 */
export const CoffeeSourceBagList = ({
  onChoose,
  onPhotograph,
  onBack,
}: CoffeeSourceBagListProps): JSX.Element => {
  const styles = useThemedStyles(createBrewCoffeeSourceStyles);
  const { t } = useTranslation();
  const bags = useCoffeeBags();
  const items = bags.data?.items ?? [];

  if (bags.isPending || bags.isError) {
    return (
      <QueryState
        isPending={bags.isPending}
        isError={bags.isError}
        error={bags.error}
        onRetry={(): void => {
          void bags.refetch();
        }}
      />
    );
  }

  if (items.length === NOTHING) {
    return (
      <EmptyState
        icon={INVENTORY_EMPTY_ICONS.cupboard}
        title={t(TRANSLATION_KEYS.preBrewSourceEmptyTitle)}
        description={t(TRANSLATION_KEYS.preBrewSourceEmptyBody)}
        actions={[
          {
            label: t(TRANSLATION_KEYS.preBrewSourcePhoto),
            tone: 'espresso',
            onPress: onPhotograph,
          },
          { label: t(TRANSLATION_KEYS.preBrewSourceBack), onPress: onBack },
        ]}
      />
    );
  }

  return (
    <View style={styles.options}>
      <Text variant="cardTitle">{t(TRANSLATION_KEYS.preBrewCoffeeChoose)}</Text>
      {items.map((bag: CoffeeBag): JSX.Element => (
        <PreBrewBagOption key={bag.id} bag={bag} selected={NOT_SELECTED} onChoose={onChoose} />
      ))}
      <PillButton
        tone="surface"
        label={t(TRANSLATION_KEYS.preBrewSourceBack)}
        fullWidth
        onPress={onBack}
      />
    </View>
  );
};
