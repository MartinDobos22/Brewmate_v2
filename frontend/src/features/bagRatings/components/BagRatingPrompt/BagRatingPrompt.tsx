import type { JSX } from 'react';

import { ActionRow } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { BAG_RATING_MARKS } from '../../constants';

export interface BagRatingPromptProps {
  readonly onPress: () => void;
}

/**
 * "Ako ti zatiaľ chutí?" on a bag that is halfway gone.
 *
 * A row on the card rather than a notification or a dialog: it waits on the
 * shelf until somebody feels like answering, and leaves once they have. Half
 * a bag is the moment the coffee is at its best and the recipe has usually
 * settled, which is when an opinion about it is most about the coffee.
 */
export const BagRatingPrompt = ({ onPress }: BagRatingPromptProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <ActionRow
      icon={BAG_RATING_MARKS.prompt}
      title={t(TRANSLATION_KEYS.bagRatingPromptTitle)}
      caption={t(TRANSLATION_KEYS.bagRatingPromptCaption)}
      onPress={onPress}
    />
  );
};
