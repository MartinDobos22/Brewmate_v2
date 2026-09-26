import { BAG_RATING_STAGES, type BagRating } from '@brewmate/shared';
import type { JSX } from 'react';
import { ScrollView, View } from 'react-native';

import { PillButton, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { BAG_RATING_STAGE_BODY_KEYS } from '../../constants';
import { useBagRatingDraft, useRateBag } from '../../hooks';
import { StarPicker } from '../StarPicker';

import { BagRatingChoices } from './BagRatingChoices';
import type { BagRatingRequest } from '../../services';
import { createBagRatingSheetStyles } from './BagRatingSheet.styles';

export interface BagRatingBodyProps {
  readonly request: BagRatingRequest;
  readonly existing: BagRating | null;
  /** Called once the rating is saved - or, for a finished bag, skipped. */
  readonly onDone: () => void;
}

/**
 * The rating itself: the stars, the optional rest, and the button.
 *
 * A finished bag also gets a way past the question, because "Dopil som ju" is
 * something somebody does whether or not they feel like rating anything, and
 * a bag that could only be finished by rating it would be a bag nobody
 * finished.
 */
export const BagRatingBody = ({ request, existing, onDone }: BagRatingBodyProps): JSX.Element => {
  const styles = useThemedStyles(createBagRatingSheetStyles);
  const { t } = useTranslation();
  const draft = useBagRatingDraft(existing);
  const rate = useRateBag();
  const { stars } = draft;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
      <Text variant="bodyText" tone="muted">
        {t(BAG_RATING_STAGE_BODY_KEYS[request.stage])}
      </Text>
      <StarPicker value={stars} onChange={draft.chooseStars} />
      <BagRatingChoices draft={draft} />
      {rate.isError ? (
        <Text variant="caption" tone="error">
          {t(TRANSLATION_KEYS.bagRatingSaveError)}
        </Text>
      ) : null}
      <View style={styles.actions}>
        <PillButton
          tone="espresso"
          fullWidth
          label={t(TRANSLATION_KEYS.bagRatingSave)}
          disabled={stars === null}
          isPending={rate.isPending}
          onPress={(): void => {
            if (stars === null) {
              return;
            }

            rate.mutate(
              {
                bagId: request.bag.id,
                stage: request.stage,
                stars,
                impression: draft.impression,
                tags: [...draft.tags],
              },
              { onSuccess: onDone },
            );
          }}
        />
        {request.stage === BAG_RATING_STAGES.finished ? (
          <PillButton
            tone="surface"
            fullWidth
            label={t(TRANSLATION_KEYS.bagRatingSkipFinished)}
            disabled={rate.isPending}
            onPress={onDone}
          />
        ) : null}
      </View>
    </ScrollView>
  );
};
