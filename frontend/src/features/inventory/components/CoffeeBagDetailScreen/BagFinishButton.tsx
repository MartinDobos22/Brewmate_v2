import { BAG_RATING_STAGES, type CoffeeBag } from '@brewmate/shared';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { PillButton } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { BagRatingSheet } from '../../../bagRatings/components';
import { useBagRatingFlow } from '../../../bagRatings/hooks';
import { useArchiveCoffeeBag } from '../../hooks';

import { createCoffeeBagDetailStyles } from './CoffeeBagDetailScreen.styles';

/**
 * "Dopil som ju", from the coffee's own screen.
 *
 * The same question the cupboard asks on the way out - how was the whole bag -
 * with the same way past it, and then back to the cupboard: a screen about a
 * bag that is no longer on the shelf has nothing left to say.
 */
export const BagFinishButton = ({ bag }: { readonly bag: CoffeeBag }): JSX.Element => {
  const styles = useThemedStyles(createCoffeeBagDetailStyles);
  const { t } = useTranslation();
  const router = useRouter();
  const archive = useArchiveCoffeeBag();
  const rating = useBagRatingFlow();

  return (
    <View style={styles.archive}>
      <PillButton
        tone="surface"
        label={t(TRANSLATION_KEYS.inventoryBagArchive)}
        size="small"
        isPending={archive.isPending}
        onPress={(): void => {
          rating.open(bag, BAG_RATING_STAGES.finished);
        }}
      />
      <BagRatingSheet
        request={rating.request}
        existing={rating.existing}
        onClose={rating.close}
        onDone={(): void => {
          rating.close();
          archive.mutate(bag.id, {
            onSuccess: (): void => {
              router.back();
            },
          });
        }}
      />
    </View>
  );
};
