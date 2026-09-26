import { BAG_RATING_STAGES, type BagRatingStage, type CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, PillButton, SectionHeading, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { BAG_RATING_STAGE_LABEL_KEYS } from '../../constants';
import { useBagRatingFlow } from '../../hooks';
import { findRating } from '../../services';
import { BagRatingSheet } from '../BagRatingSheet';

import { createBagRatingCardStyles } from './BagRatingCard.styles';
import { RatedStars } from './RatedStars';

export interface BagRatingCardProps {
  readonly bag: CoffeeBag;
}

/**
 * What somebody thought of this coffee, and the way to say it or change it.
 *
 * Halfway is always offered here, weighed or not - the cupboard only asks once
 * it can tell half the bag is gone, and this is where somebody who never
 * weighs anything answers anyway. The finished line appears once the bag is
 * finished, because before then there is nothing for it to be about.
 */
export const BagRatingCard = ({ bag }: BagRatingCardProps): JSX.Element => {
  const styles = useThemedStyles(createBagRatingCardStyles);
  const { t } = useTranslation();
  const flow = useBagRatingFlow();
  const stages: readonly BagRatingStage[] = bag.isArchived
    ? [BAG_RATING_STAGES.halfway, BAG_RATING_STAGES.finished]
    : [BAG_RATING_STAGES.halfway];

  return (
    <Card>
      <SectionHeading
        placement="card"
        title={t(TRANSLATION_KEYS.bagRatingCardTitle)}
        caption={t(TRANSLATION_KEYS.bagRatingCardCaption)}
      />
      {stages.map((stage: BagRatingStage): JSX.Element => {
        const rating = findRating(flow.ratings, bag.id, stage);

        return (
          <View key={stage} style={styles.row}>
            <View style={styles.words}>
              <Text variant="rowTitle">{t(BAG_RATING_STAGE_LABEL_KEYS[stage])}</Text>
              {rating === null ? (
                <Text variant="caption" tone="muted">
                  {t(TRANSLATION_KEYS.bagRatingCardNotYet)}
                </Text>
              ) : (
                <RatedStars stars={rating.stars} />
              )}
            </View>
            <PillButton
              size="small"
              label={t(
                rating === null
                  ? TRANSLATION_KEYS.bagRatingCardRate
                  : TRANSLATION_KEYS.bagRatingCardChange,
              )}
              onPress={(): void => {
                flow.open(bag, stage);
              }}
            />
          </View>
        );
      })}
      <BagRatingSheet
        request={flow.request}
        existing={flow.existing}
        onClose={flow.close}
        onDone={flow.close}
      />
    </Card>
  );
};
